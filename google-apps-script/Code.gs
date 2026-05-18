function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

const SHEETS = {
  customers: {
    name: "Customers",
    headers: ["id", "bd", "name", "taxId", "contact", "email", "phone", "paymentTerms", "address", "notes", "updatedAt"],
  },
  orders: {
    name: "Orders",
    headers: [
      "id",
      "bd",
      "salesType",
      "industry",
      "agency",
      "brandCustomer",
      "quoteDate",
      "quoteAmount",
      "dataFormat",
      "dataCount",
      "deliveryDate",
      "invoiceIssued",
      "notes",
      "updatedAt",
    ],
  },
  invoices: {
    name: "Invoices",
    headers: [
      "id",
      "bd",
      "paidDate",
      "orderNo",
      "billingSchedule",
      "issueDate",
      "invoiceNo",
      "customerId",
      "company",
      "taxId",
      "subtotal",
      "totalWithTax",
      "product",
      "recipient",
      "recipientAddress",
      "email",
      "phone",
      "dueDate",
      "status",
      "notes",
      "description",
      "updatedAt",
    ],
  },
  payments: {
    name: "Payments",
    headers: ["id", "bd", "paidDate", "customerId", "invoiceId", "amount", "method", "notes", "updatedAt"],
  },
  activities: {
    name: "Activities",
    headers: ["id", "bd", "activityDate", "customerId", "type", "content", "nextFollowUp", "updatedAt"],
  },
  contracts: {
    name: "Contracts",
    headers: [
      "id",
      "bd",
      "category",
      "companyName",
      "department",
      "contactTitle",
      "contactName",
      "phone",
      "primaryContact",
      "customerStatus",
      "contractType",
      "startDate",
      "endDate",
      "contractPrice",
      "annualValue",
      "billingMode",
      "notes",
      "updatedAt",
    ],
  },
  options: {
    name: "Options",
    headers: ["key", "values", "updatedAt"],
  },
};

function doPost(event) {
  try {
    const request = JSON.parse(event.postData.contents || "{}");
    const sheetId = request.sheetId;
    const action = request.action;
    const payload = request.payload || {};

    if (!sheetId) throw new Error("Missing sheetId");
    ensureWorkbook(sheetId);

    if (action === "listAll") return jsonResponse({ ok: true, state: readState(sheetId) });
    if (action === "exportInvoices") return jsonResponse({ ok: true, url: exportInvoices(sheetId) });
    if (action === "seedDemo") {
      replaceState(sheetId, payload.state || {});
      return jsonResponse({ ok: true, state: readState(sheetId) });
    }
    if (action === "upsertCustomer") upsertRow(sheetId, "customers", payload);
    else if (action === "upsertOrder") upsertRow(sheetId, "orders", payload);
    else if (action === "upsertInvoice") upsertRow(sheetId, "invoices", payload);
    else if (action === "upsertPayment") upsertRow(sheetId, "payments", payload);
    else if (action === "upsertActivity") upsertRow(sheetId, "activities", payload);
    else if (action === "upsertContract") upsertRow(sheetId, "contracts", payload);
    else if (action === "deleteCustomer") deleteRow(sheetId, "customers", payload.id);
    else if (action === "deleteOrder") deleteRow(sheetId, "orders", payload.id);
    else if (action === "deleteInvoice") deleteRow(sheetId, "invoices", payload.id);
    else if (action === "deletePayment") deleteRow(sheetId, "payments", payload.id);
    else if (action === "deleteActivity") deleteRow(sheetId, "activities", payload.id);
    else if (action === "deleteContract") deleteRow(sheetId, "contracts", payload.id);
    else if (action === "updateOptions") writeOptions(sheetId, payload.options || {});
    else throw new Error("Unknown action: " + action);

    return jsonResponse({ ok: true, state: readState(sheetId) });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function doGet(event) {
  try {
    const sheetId = event.parameter.sheetId;
    if (!sheetId) throw new Error("Missing sheetId");
    ensureWorkbook(sheetId);
    return jsonResponse({ ok: true, state: readState(sheetId) });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function ensureWorkbook(sheetId) {
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  Object.keys(SHEETS).forEach((key) => {
    const config = SHEETS[key];
    let sheet = spreadsheet.getSheetByName(config.name);
    if (!sheet) sheet = spreadsheet.insertSheet(config.name);

    const currentHeaders = sheet.getRange(1, 1, 1, config.headers.length).getValues()[0];
    const needsHeaders = config.headers.some((header, index) => currentHeaders[index] !== header);
    if (needsHeaders) {
      if (key === "invoices" && currentHeaders[1] === "invoiceNo") {
        migrateOldInvoiceSheet(sheet, config.headers);
        return;
      }
      migrateSheetByHeaders(sheet, currentHeaders, config.headers);
    }
  });
}

function migrateSheetByHeaders(sheet, currentHeaders, newHeaders) {
  const lastRow = sheet.getLastRow();
  const rows = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, currentHeaders.length).getValues();
  const migratedRows = rows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const item = {};
      currentHeaders.forEach((header, index) => {
        if (header) item[header] = row[index];
      });
      return newHeaders.map((header) => item[header] === undefined ? "" : item[header]);
    });

  sheet.clearContents();
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  if (migratedRows.length) sheet.getRange(2, 1, migratedRows.length, newHeaders.length).setValues(migratedRows);
  sheet.setFrozenRows(1);
}

function migrateOldInvoiceSheet(sheet, newHeaders) {
  const oldHeaders = ["id", "invoiceNo", "customerId", "issueDate", "dueDate", "subtotal", "tax", "status", "notes", "updatedAt"];
  const lastRow = sheet.getLastRow();
  const rows = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, oldHeaders.length).getValues();
  const migratedRows = rows
    .filter((row) => row[0])
    .map((row) => {
      const oldItem = {};
      oldHeaders.forEach((header, index) => {
        oldItem[header] = row[index];
      });
      const subtotal = Number(oldItem.subtotal || 0);
      const tax = Number(oldItem.tax || 0);
      const migratedItem = {
        id: oldItem.id,
        bd: "",
        paidDate: "",
        orderNo: "",
        billingSchedule: "",
        issueDate: oldItem.issueDate,
        invoiceNo: oldItem.invoiceNo,
        customerId: oldItem.customerId,
        company: "",
        taxId: "",
        subtotal,
        totalWithTax: calculateTaxIncluded(subtotal) || subtotal + tax,
        product: "",
        recipient: "",
        recipientAddress: "",
        email: "",
        phone: "",
        dueDate: oldItem.dueDate,
        status: oldItem.status,
        notes: oldItem.notes,
        description: "",
        updatedAt: oldItem.updatedAt || new Date(),
      };
      return newHeaders.map((header) => migratedItem[header] === undefined ? "" : migratedItem[header]);
    });

  sheet.clearContents();
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  if (migratedRows.length) sheet.getRange(2, 1, migratedRows.length, newHeaders.length).setValues(migratedRows);
  sheet.setFrozenRows(1);
}

function readState(sheetId) {
  return {
    customers: readSheet(sheetId, "customers"),
    orders: readSheet(sheetId, "orders"),
    invoices: readSheet(sheetId, "invoices"),
    payments: readSheet(sheetId, "payments"),
    activities: readSheet(sheetId, "activities"),
    contracts: readSheet(sheetId, "contracts"),
    options: readOptions(sheetId),
  };
}

function readSheet(sheetId, key) {
  const config = SHEETS[key];
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(config.name);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, config.headers.length).getValues();
  return rows
    .filter((row) => row[0])
    .map((row) => {
      const item = {};
      config.headers.forEach((header, index) => {
        if (header !== "updatedAt") item[header] = normalizeCell(row[index]);
      });
      return item;
    });
}

function upsertRow(sheetId, key, payload) {
  const config = SHEETS[key];
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(config.name);
  const rowIndex = findRowIndex(sheet, payload.id);
  const row = config.headers.map((header) => {
    if (header === "updatedAt") return new Date();
    return payload[header] === undefined ? "" : payload[header];
  });

  if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
}

function deleteRow(sheetId, key, id) {
  if (!id) throw new Error("Missing id");
  const config = SHEETS[key];
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(config.name);
  const rowIndex = findRowIndex(sheet, id);
  if (rowIndex > 0) sheet.deleteRow(rowIndex);
}

function readOptions(sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(SHEETS.options.name);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return {};

  const rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  return rows.reduce((options, row) => {
    const key = row[0];
    if (!key) return options;
    options[key] = String(row[1] || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    return options;
  }, {});
}

function writeOptions(sheetId, options) {
  const config = SHEETS.options;
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(config.name);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
  const rows = Object.keys(options).map((key) => [key, (options[key] || []).join("\n"), new Date()]);
  if (rows.length) sheet.getRange(2, 1, rows.length, config.headers.length).setValues(rows);
}

function exportInvoices(sheetId) {
  const state = readState(sheetId);
  const customersById = state.customers.reduce((map, customer) => {
    map[customer.id] = customer;
    return map;
  }, {});
  const paymentsByInvoice = state.payments.reduce((map, payment) => {
    if (!payment.invoiceId) return map;
    if (!map[payment.invoiceId]) map[payment.invoiceId] = [];
    map[payment.invoiceId].push(payment);
    return map;
  }, {});

  const headers = [
    "BD",
    "已收款",
    "訂單編號",
    "請款時程",
    "發票開立",
    "發票號碼",
    "公司",
    "統編",
    "金額 (未稅)",
    "金額(含稅)",
    "購買商品",
    "收件人",
    "收件地址",
    "email",
    "電話",
    "備註",
    "說明",
  ];

  const rows = state.invoices.map((invoice) => {
    const customer = customersById[invoice.customerId] || {};
    const payments = paymentsByInvoice[invoice.id] || [];
    const paidDate = invoice.paidDate || payments.map((payment) => normalizeCell(payment.paidDate)).filter(Boolean).join("\n");
    const subtotal = Number(invoice.subtotal || 0);
    const totalWithTax = Number(invoice.totalWithTax || 0) || calculateTaxIncluded(subtotal);
    return [
      invoice.bd || customer.bd || "",
      paidDate,
      invoice.orderNo || "",
      invoice.billingSchedule || "",
      invoice.issueDate || "",
      invoice.invoiceNo || "",
      invoice.company || customer.name || "",
      invoice.taxId || customer.taxId || "",
      subtotal || "",
      totalWithTax || "",
      invoice.product || "",
      invoice.recipient || customer.contact || "",
      invoice.recipientAddress || customer.address || "",
      invoice.email || customer.email || "",
      invoice.phone || customer.phone || "",
      invoice.notes || "",
      invoice.description || "",
    ];
  });

  const exportFile = SpreadsheetApp.create("CRM 發票資料匯出 " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmm"));
  const sheet = exportFile.getSheets()[0];
  sheet.setName("發票資料");
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f6d85f");
  sheet.autoResizeColumns(1, headers.length);
  return exportFile.getUrl();
}

function replaceState(sheetId, state) {
  Object.keys(SHEETS).forEach((key) => {
    const config = SHEETS[key];
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(config.name);
    sheet.clearContents();
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    if (key === "options") {
      writeOptions(sheetId, state.options || {});
      return;
    }
    const rows = (state[key] || []).map((item) =>
      config.headers.map((header) => {
        if (header === "updatedAt") return new Date();
        return item[header] === undefined ? "" : item[header];
      }),
    );
    if (rows.length) sheet.getRange(2, 1, rows.length, config.headers.length).setValues(rows);
  });
}

function findRowIndex(sheet, id) {
  if (!id || sheet.getLastRow() < 2) return -1;
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat();
  const index = ids.findIndex((value) => value === id);
  return index === -1 ? -1 : index + 2;
}

function normalizeCell(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return value;
}

function calculateTaxIncluded(subtotal) {
  return Math.round(Number(subtotal || 0) * 1.05);
}

// END OF CRM GOOGLE SHEET BACKEND
