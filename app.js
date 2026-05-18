const STORAGE_KEY = "finance-crm-state-v1";
const CONFIG_KEY = "finance-crm-config-v1";
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrfjwK6Fxh2HGbdXHa8xE0PZQ9HKXBfFzgKZBXZ48D6dQV-rWEgH_VySuLF1wHOS27/exec";
const DEFAULT_SHEET_ID = "16vMvmefYvybqD5PfO2H94mHgie4Nfq0saUwQFHuLS0E";

const defaultOptions = {
  paymentTerms: ["現結", "月結 30 天", "月結 45 天", "月結 60 天"],
  bd: ["Maggie", "Peggy", "Cobi", "Erin"],
  salesType: ["廣告受眾包", "線下查詢", "線上線下複合查詢", "發票數據受眾包"],
  industry: ["食品零售", "生技", "數據公司", "市調公司", "醫美", "金融", "電商"],
  invoiceStatus: ["未收款", "部分入款", "已收款", "作廢"],
  paymentMethod: ["匯款", "支票", "現金", "信用卡"],
  customerStatus: ["合約中", "待續約", "合約終止", "洽談中"],
  billingMode: ["月付", "季付", "半年付", "年付", "一次付清"],
};

const sampleState = {
  customers: [
    {
      id: "cus_demo_1",
      bd: "Maggie",
      name: "青禾設計有限公司",
      taxId: "24567891",
      contact: "林小姐",
      email: "lin@example.com",
      phone: "02-2345-7788",
      paymentTerms: "月結 30 天",
      address: "台北市信義區松仁路 88 號",
      notes: "固定採購品牌專案服務",
    },
    {
      id: "cus_demo_2",
      bd: "Peggy",
      name: "晨峰科技股份有限公司",
      taxId: "83214567",
      contact: "王先生",
      email: "wang@example.com",
      phone: "03-558-2210",
      paymentTerms: "月結 45 天",
      address: "新竹縣竹北市光明六路 120 號",
      notes: "需每月提供對帳明細",
    },
  ],
  orders: [
    {
      id: "ord_demo_1",
      bd: "Maggie",
      salesType: "廣告受眾包",
      industry: "食品零售",
      agency: "TenMax",
      brandCustomer: "美心月餅",
      quoteDate: "2026-05-02",
      quoteAmount: 7080,
      dataFormat: "ADID",
      dataCount: 141600,
      deliveryDate: "2026-05-08",
      invoiceIssued: "是",
      notes: "專案名稱：美心月餅_TenMax_202605\n訂單編號：PB2600386",
    },
    {
      id: "ord_demo_2",
      bd: "Peggy",
      salesType: "線下查詢",
      industry: "生技",
      agency: "",
      brandCustomer: "黑蓮生技有限公司",
      quoteDate: "2026-05-04",
      quoteAmount: 90000,
      dataFormat: "發票數據受眾包",
      dataCount: 0,
      deliveryDate: "2026-05-18",
      invoiceIssued: "否",
      notes: "訂單編號：2767124",
    },
  ],
  invoices: [
    {
      id: "inv_demo_1",
      bd: "Maggie",
      invoiceNo: "AB-202605-001",
      customerId: "cus_demo_1",
      paidDate: "",
      orderNo: "PB2600386",
      billingSchedule: "月結",
      issueDate: "2026-05-01",
      dueDate: "2026-05-31",
      company: "青禾設計有限公司",
      taxId: "24567891",
      subtotal: 86000,
      totalWithTax: 90300,
      product: "品牌顧問五月份",
      recipient: "林小姐",
      recipientAddress: "台北市信義區松仁路 88 號",
      email: "lin@example.com",
      phone: "02-2345-7788",
      status: "部分入款",
      notes: "品牌顧問五月份",
      description: "",
    },
    {
      id: "inv_demo_2",
      bd: "Peggy",
      invoiceNo: "AB-202604-014",
      customerId: "cus_demo_2",
      paidDate: "",
      orderNo: "",
      billingSchedule: "月結 45 天",
      issueDate: "2026-04-10",
      dueDate: "2026-05-10",
      company: "晨峰科技股份有限公司",
      taxId: "83214567",
      subtotal: 126000,
      totalWithTax: 132300,
      product: "系統維護季費",
      recipient: "王先生",
      recipientAddress: "新竹縣竹北市光明六路 120 號",
      email: "wang@example.com",
      phone: "03-558-2210",
      status: "未收款",
      notes: "系統維護季費",
      description: "",
    },
  ],
  payments: [
    {
      id: "pay_demo_1",
      bd: "Maggie",
      paidDate: "2026-05-05",
      customerId: "cus_demo_1",
      invoiceId: "inv_demo_1",
      amount: 40000,
      method: "匯款",
      notes: "第一筆款項",
    },
  ],
  activities: [
    {
      id: "act_demo_1",
      bd: "Peggy",
      activityDate: "2026-05-04",
      customerId: "cus_demo_2",
      type: "催款",
      content: "已寄送對帳明細，財務預計本週回覆。",
      nextFollowUp: "2026-05-08",
    },
    {
      id: "act_demo_2",
      bd: "Maggie",
      activityDate: "2026-05-03",
      customerId: "cus_demo_1",
      type: "Email",
      content: "確認五月服務項目與發票抬頭。",
      nextFollowUp: "",
    },
  ],
  contracts: [
    {
      id: "con_demo_1",
      bd: "Cobi",
      category: "數據公司",
      companyName: "Vpon",
      department: "",
      contactTitle: "",
      contactName: "Paul",
      phone: "",
      primaryContact: "Line",
      customerStatus: "合約中",
      contractType: "數據銷售(Rawdata)",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      contractPrice: 450000,
      annualValue: 450000,
      billingMode: "年付",
      notes: "",
    },
  ],
  options: structuredClone(defaultOptions),
};

let state = loadLocalState();
let config = loadConfig();
let activeView = "dashboard";
let searchTerm = "";

const viewTitles = {
  dashboard: "營運總覽",
  customers: "客戶資料",
  orders: "委刊單追蹤",
  invoices: "發票追蹤",
  payments: "入款紀錄",
  contracts: "合約追蹤",
  activities: "互動與追蹤",
  settings: "系統設定",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindForms();
  bindModalButtons();
  bindSettings();
  hydrateSettings();
  render();
  refreshFromSheet({ silent: true });
});

function loadLocalState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return normalizeState(saved || structuredClone(sampleState));
  } catch {
    return normalizeState(structuredClone(sampleState));
  }
}

function loadConfig() {
  const defaults = {
    scriptUrl: DEFAULT_SCRIPT_URL,
    sheetId: DEFAULT_SHEET_ID,
  };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

function bindNavigation() {
  $$(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  $$("[data-open-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.openView));
  });

  $("#searchInput").addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    render();
  });

  $("#refreshBtn").addEventListener("click", () => refreshFromSheet());
}

function setView(view) {
  activeView = view;
  $$(".nav-tab").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === `${view}View`));
  $("#viewTitle").textContent = viewTitles[view];
}

function bindModalButtons() {
  $$("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      resetFormForModal(button.dataset.modal);
      $(`#${button.dataset.modal}`).showModal();
    });
  });

  $$("[data-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
}

function bindForms() {
  $("#customerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const customer = getFormData(event.target);
    customer.id ||= createId("cus");
    await persist("upsertCustomer", customer);
    closeModal(event.target);
  });

  $("#invoiceForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const invoice = getFormData(event.target);
    invoice.id ||= createId("inv");
    invoice.subtotal = Number(invoice.subtotal || 0);
    invoice.totalWithTax = calculateTaxIncluded(invoice.subtotal);
    await persist("upsertInvoice", invoice);
    closeModal(event.target);
  });

  $("#orderForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const order = getFormData(event.target);
    order.id ||= createId("ord");
    order.quoteAmount = Number(order.quoteAmount || 0);
    order.dataCount = Number(order.dataCount || 0);
    await persist("upsertOrder", order);
    closeModal(event.target);
  });

  $("#paymentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payment = getFormData(event.target);
    payment.id ||= createId("pay");
    payment.amount = Number(payment.amount || 0);
    await persist("upsertPayment", payment);
    closeModal(event.target);
  });

  $("#activityForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const activity = getFormData(event.target);
    activity.id ||= createId("act");
    await persist("upsertActivity", activity);
    closeModal(event.target);
  });

  $("#contractForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const contract = getFormData(event.target);
    contract.id ||= createId("con");
    contract.contractPrice = Number(contract.contractPrice || 0);
    contract.annualValue = Number(contract.annualValue || 0);
    await persist("upsertContract", contract);
    closeModal(event.target);
  });

  $("#paymentForm").elements.customerId.addEventListener("change", (event) => {
    fillBdFromCustomer($("#paymentForm"), event.target.value);
    fillSelects();
  });
  $("#paymentForm").elements.invoiceId.addEventListener("change", (event) => fillBdFromInvoice($("#paymentForm"), event.target.value));
  $("#activityForm").elements.customerId.addEventListener("change", (event) => fillBdFromCustomer($("#activityForm"), event.target.value));
  $("#invoiceForm").elements.customerId.addEventListener("change", (event) => fillInvoiceCustomerFields(event.target.value));
  $("#invoiceForm").elements.subtotal.addEventListener("input", updateInvoiceTotal);
}

function bindSettings() {
  $("#settingsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    config.scriptUrl = $("#scriptUrl").value.trim();
    config.sheetId = $("#sheetId").value.trim();
    saveConfig();
    await refreshFromSheet();
  });

  $("#seedBtn").addEventListener("click", async () => {
    if (!config.scriptUrl || !config.sheetId) {
      showToast("請先填入 Apps Script URL 與 Sheet ID");
      return;
    }
    await callSheet("seedDemo", { state: sampleState });
    await refreshFromSheet();
  });

  $("#optionsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    state.options = readOptionsForm();
    await persist("updateOptions", { options: state.options });
    renderOptionSettings();
  });

  $("#resetOptionsBtn").addEventListener("click", async () => {
    if (!confirm("確定要還原預設選單嗎？")) return;
    state.options = structuredClone(defaultOptions);
    await persist("updateOptions", { options: state.options });
    renderOptionSettings();
  });

  $("#exportInvoicesBtn").addEventListener("click", exportInvoices);
}

function hydrateSettings() {
  $("#scriptUrl").value = config.scriptUrl || "";
  $("#sheetId").value = config.sheetId || "";
  renderOptionSettings();
  updateSyncStatus();
}

function resetFormForModal(modalId) {
  const form = $(`#${modalId} form`);
  form.reset();
  form.querySelector("[name='id']").value = "";
  const today = new Date().toISOString().slice(0, 10);

  if (modalId === "invoiceModal") {
    form.elements.issueDate.value = today;
    form.elements.dueDate.value = addDays(today, 30);
  }
  if (modalId === "paymentModal") form.elements.paidDate.value = today;
  if (modalId === "activityModal") form.elements.activityDate.value = today;
  if (modalId === "orderModal") form.elements.quoteDate.value = today;
  if (modalId === "contractModal") form.elements.startDate.value = today;
  fillSelects();
}

function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function closeModal(form) {
  form.closest("dialog").close();
}

async function persist(action, payload) {
  applyLocalMutation(action, payload);
  saveLocalState();
  render();

  if (config.scriptUrl && config.sheetId) {
    try {
      const fresh = await callSheet(action, payload);
      state = normalizeState(fresh.state || fresh);
      saveLocalState();
      showToast("已同步到 Google Sheet");
    } catch (error) {
      showToast(`本機已儲存，Google Sheet 同步失敗：${error.message}`);
    }
  } else {
    showToast("已儲存在本機示範資料");
  }

  render();
}

function applyLocalMutation(action, payload) {
  const upsertMap = {
    upsertCustomer: "customers",
    upsertOrder: "orders",
    upsertInvoice: "invoices",
    upsertPayment: "payments",
    upsertActivity: "activities",
    upsertContract: "contracts",
  };
  const deleteMap = {
    deleteCustomer: "customers",
    deleteOrder: "orders",
    deleteInvoice: "invoices",
    deletePayment: "payments",
    deleteActivity: "activities",
    deleteContract: "contracts",
  };

  const upsertCollection = upsertMap[action];
  if (upsertCollection) {
    const index = state[upsertCollection].findIndex((item) => item.id === payload.id);
    if (index >= 0) state[upsertCollection][index] = payload;
    else state[upsertCollection].push(payload);
    return;
  }

  const deleteCollection = deleteMap[action];
  if (deleteCollection) {
    state[deleteCollection] = state[deleteCollection].filter((item) => item.id !== payload.id);
    return;
  }

  if (action === "updateOptions") {
    state.options = mergeOptions(payload.options);
  }
}

async function refreshFromSheet(options = {}) {
  if (!config.scriptUrl || !config.sheetId) {
    updateSyncStatus();
    if (!options.silent) showToast("目前使用本機示範資料");
    return;
  }

  try {
    const result = await callSheet("listAll", {});
    state = normalizeState(result.state || result);
    saveLocalState();
    updateSyncStatus(true);
    if (!options.silent) showToast("已從 Google Sheet 同步最新資料");
    render();
  } catch (error) {
    updateSyncStatus(false, error.message);
    if (!options.silent) showToast(`無法連線 Google Sheet：${error.message}`);
  }
}

async function callSheet(action, payload) {
  const response = await fetch(config.scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, sheetId: config.sheetId, payload }),
  });

  const text = await response.text();
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    const looksLikeHtml = text.trim().startsWith("<");
    if (looksLikeHtml) {
      throw new Error("收到 Google HTML 頁面，請確認貼的是部署後的 Web App URL，結尾應為 /exec，且存取權為知道連結的任何人");
    }
    throw new Error("Apps Script 回傳格式不是 JSON，請重新部署 Web App 後再試一次");
  }

  if (!result.ok) throw new Error(result.error || "未知錯誤");
  return result;
}

function normalizeState(nextState) {
  return {
    customers: (nextState.customers || []).map((item) => ({ ...item, bd: item.bd || "" })),
    orders: (nextState.orders || []).map((item) => ({
      ...item,
      bd: item.bd || "",
      quoteAmount: Number(item.quoteAmount || 0),
      dataCount: Number(item.dataCount || 0),
    })),
    invoices: (nextState.invoices || []).map((item) => ({
      ...item,
      bd: item.bd || customerBd(item.customerId, nextState.customers || []),
      subtotal: Number(item.subtotal || 0),
      totalWithTax: Number(item.totalWithTax || 0),
    })),
    payments: (nextState.payments || []).map((item) => ({
      ...item,
      bd: item.bd || customerBd(item.customerId, nextState.customers || []),
      amount: Number(item.amount || 0),
    })),
    activities: (nextState.activities || []).map((item) => ({ ...item, bd: item.bd || customerBd(item.customerId, nextState.customers || []) })),
    contracts: (nextState.contracts || []).map((item) => ({
      ...item,
      bd: item.bd || "",
      contractPrice: Number(item.contractPrice || 0),
      annualValue: Number(item.annualValue || 0),
    })),
    options: mergeOptions(nextState.options),
  };
}

function render() {
  fillSelects();
  renderOptionSettings();
  renderDashboard();
  renderCustomers();
  renderOrders();
  renderInvoices();
  renderPayments();
  renderContracts();
  renderActivities();
  updateSyncStatus();
}

function renderDashboard() {
  const totals = getInvoiceTotals();
  $("#metricCustomers").textContent = state.customers.length;
  $("#metricReceivable").textContent = money(totals.receivable);
  $("#metricMonthPaid").textContent = money(getMonthPaid());
  $("#metricOverdue").textContent = getInvoiceRows()
    .filter((invoice) => invoice.balance > 0 && isOverdue(invoice.dueDate))
    .length;

  const upcoming = getInvoiceRows()
    .filter((invoice) => invoice.balance > 0 && invoice.status !== "作廢")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  $("#upcomingInvoiceRows").innerHTML = upcoming.length
    ? upcoming
        .map(
          (invoice) => `
            <tr>
              <td>${escapeHtml(invoice.customerName)}</td>
              <td>${escapeHtml(invoice.invoiceNo)}</td>
              <td>${dateText(invoice.dueDate)}</td>
              <td>${money(invoice.balance)}</td>
              <td>${statusPill(invoice)}</td>
            </tr>
          `,
        )
        .join("")
    : emptyRow(5, "沒有待追蹤發票");

  const activities = [...state.activities]
    .sort((a, b) => b.activityDate.localeCompare(a.activityDate))
    .slice(0, 5);
  $("#recentActivities").innerHTML = activities.length
    ? activities
        .map(
          (activity) => `
            <article class="activity-item">
              <strong>${escapeHtml(customerName(activity.customerId))} · ${escapeHtml(activity.type)}</strong>
              <p>${dateText(activity.activityDate)}｜${escapeHtml(activity.content)}</p>
            </article>
          `,
        )
        .join("")
    : `<p class="empty-state">尚無互動紀錄</p>`;
}

function renderCustomers() {
  const customers = state.customers.filter((customer) => matchesSearch(customer, [customer.bd, customer.name, customer.taxId, customer.contact, customer.email]));
  $("#customerCards").innerHTML = customers.length
    ? customers
        .map((customer) => {
          const receivable = getInvoiceRows()
            .filter((invoice) => invoice.customerId === customer.id)
            .reduce((sum, invoice) => sum + invoice.balance, 0);
          return `
            <article class="customer-card">
              <h3>${escapeHtml(customer.name)}</h3>
              <div class="customer-meta">
                <span>BD：${escapeHtml(customer.bd || "-")}</span>
                <span>統編：${escapeHtml(customer.taxId || "-")}</span>
                <span>聯絡人：${escapeHtml(customer.contact || "-")}</span>
                <span>Email：${escapeHtml(customer.email || "-")}</span>
                <span>電話：${escapeHtml(customer.phone || "-")}</span>
                <span>付款條件：${escapeHtml(customer.paymentTerms || "-")}</span>
                <span>未收款：${money(receivable)}</span>
              </div>
              <div class="customer-actions">
                <button class="secondary-btn" data-edit-customer="${customer.id}">編輯</button>
                <button class="danger-btn" data-delete-customer="${customer.id}">刪除</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<p class="empty-state">沒有符合條件的客戶</p>`;

  $$("[data-edit-customer]").forEach((button) => {
    button.addEventListener("click", () => editRecord("customerModal", "customerForm", state.customers.find((item) => item.id === button.dataset.editCustomer)));
  });
  $$("[data-delete-customer]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord("deleteCustomer", button.dataset.deleteCustomer, "這筆客戶資料"));
  });
}

function renderOrders() {
  const orders = state.orders
    .filter((order) =>
      matchesSearch(order, [order.bd, order.salesType, order.industry, order.agency, order.brandCustomer, order.dataFormat, order.notes]),
    )
    .sort((a, b) => (b.quoteDate || "").localeCompare(a.quoteDate || ""));

  $("#orderRows").innerHTML = orders.length
    ? orders
        .map(
          (order) => `
            <tr>
              <td>${escapeHtml(order.bd || "-")}</td>
              <td>${escapeHtml(order.salesType || "-")}</td>
              <td>${escapeHtml(order.agency || "-")}</td>
              <td>${escapeHtml(order.brandCustomer)}</td>
              <td>${dateText(order.quoteDate)}</td>
              <td>${money(order.quoteAmount)}</td>
              <td>${escapeHtml(order.dataFormat || "-")}</td>
              <td>${numberText(order.dataCount)}</td>
              <td>${dateText(order.deliveryDate)}</td>
              <td>${order.invoiceIssued === "是" ? '<span class="status-pill status-paid">已開</span>' : '<span class="status-pill status-open">未開</span>'}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-btn" data-edit-order="${order.id}">編輯</button>
                  <button class="danger-btn" data-delete-order="${order.id}">刪除</button>
                </div>
              </td>
            </tr>
          `,
        )
        .join("")
    : emptyRow(11, "沒有符合條件的委刊單");

  $$("[data-edit-order]").forEach((button) => {
    button.addEventListener("click", () => editRecord("orderModal", "orderForm", state.orders.find((item) => item.id === button.dataset.editOrder)));
  });
  $$("[data-delete-order]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord("deleteOrder", button.dataset.deleteOrder, "這筆委刊單"));
  });
}

function renderInvoices() {
  const invoices = getInvoiceRows().filter((invoice) =>
    matchesSearch(invoice, [invoice.bd, invoice.invoiceNo, invoice.customerName, invoice.company, invoice.taxId, invoice.orderNo, invoice.product, invoice.status, invoice.notes]),
  );
  $("#invoiceRows").innerHTML = invoices.length
    ? invoices
        .map(
          (invoice) => `
            <tr>
              <td>${escapeHtml(invoice.bd || "-")}</td>
              <td>${dateText(invoice.paidDate)}</td>
              <td>${escapeHtml(invoice.orderNo || "-")}</td>
              <td>${escapeHtml(invoice.billingSchedule || "-")}</td>
              <td>${dateText(invoice.issueDate)}</td>
              <td>${escapeHtml(invoice.invoiceNo)}</td>
              <td>${escapeHtml(invoice.company || invoice.customerName)}</td>
              <td>${escapeHtml(invoice.taxId || "-")}</td>
              <td>${money(invoice.subtotal)}</td>
              <td>${money(invoice.total)}</td>
              <td>${escapeHtml(invoice.product || "-")}</td>
              <td>${statusPill(invoice)}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-btn" data-edit-invoice="${invoice.id}">編輯</button>
                  <button class="danger-btn" data-delete-invoice="${invoice.id}">刪除</button>
                </div>
              </td>
            </tr>
          `,
        )
        .join("")
    : emptyRow(13, "沒有符合條件的發票");

  $$("[data-edit-invoice]").forEach((button) => {
    button.addEventListener("click", () => editRecord("invoiceModal", "invoiceForm", state.invoices.find((item) => item.id === button.dataset.editInvoice)));
  });
  $$("[data-delete-invoice]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord("deleteInvoice", button.dataset.deleteInvoice, "這筆發票"));
  });
}

function renderPayments() {
  const payments = state.payments
    .filter((payment) => matchesSearch(payment, [payment.bd, customerName(payment.customerId), invoiceNo(payment.invoiceId), payment.method, payment.notes]))
    .sort((a, b) => b.paidDate.localeCompare(a.paidDate));

  $("#paymentRows").innerHTML = payments.length
    ? payments
        .map(
          (payment) => `
            <tr>
              <td>${dateText(payment.paidDate)}</td>
              <td>${escapeHtml(payment.bd || "-")}</td>
              <td>${escapeHtml(customerName(payment.customerId))}</td>
              <td>${escapeHtml(invoiceNo(payment.invoiceId))}</td>
              <td>${money(payment.amount)}</td>
              <td>${escapeHtml(payment.method)}</td>
              <td>${escapeHtml(payment.notes || "-")}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-btn" data-edit-payment="${payment.id}">編輯</button>
                  <button class="danger-btn" data-delete-payment="${payment.id}">刪除</button>
                </div>
              </td>
            </tr>
          `,
        )
        .join("")
    : emptyRow(8, "沒有符合條件的入款");

  $$("[data-edit-payment]").forEach((button) => {
    button.addEventListener("click", () => editRecord("paymentModal", "paymentForm", state.payments.find((item) => item.id === button.dataset.editPayment)));
  });
  $$("[data-delete-payment]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord("deletePayment", button.dataset.deletePayment, "這筆入款"));
  });
}

function renderContracts() {
  const contracts = state.contracts
    .filter((contract) =>
      matchesSearch(contract, [
        contract.category,
        contract.bd,
        contract.companyName,
        contract.contactName,
        contract.primaryContact,
        contract.customerStatus,
        contract.contractType,
        contract.billingMode,
        contract.notes,
      ]),
    )
    .sort((a, b) => (a.companyName || "").localeCompare(b.companyName || "", "zh-Hant"));

  $("#contractRows").innerHTML = contracts.length
    ? contracts
        .map(
          (contract) => `
            <tr>
              <td>${escapeHtml(contract.category || "-")}</td>
              <td>${escapeHtml(contract.bd || "-")}</td>
              <td>${escapeHtml(contract.companyName)}</td>
              <td>${escapeHtml(contract.contactName || "-")}</td>
              <td>${escapeHtml(contract.primaryContact || "-")}</td>
              <td>${contractStatusPill(contract.customerStatus)}</td>
              <td>${escapeHtml(contract.contractType || "-")}</td>
              <td>${dateText(contract.startDate)}</td>
              <td>${dateText(contract.endDate)}</td>
              <td>${money(contract.contractPrice)}</td>
              <td>${escapeHtml(contract.billingMode || "-")}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-btn" data-edit-contract="${contract.id}">編輯</button>
                  <button class="danger-btn" data-delete-contract="${contract.id}">刪除</button>
                </div>
              </td>
            </tr>
          `,
        )
        .join("")
    : emptyRow(12, "沒有符合條件的合約");

  $$("[data-edit-contract]").forEach((button) => {
    button.addEventListener("click", () =>
      editRecord("contractModal", "contractForm", state.contracts.find((item) => item.id === button.dataset.editContract)),
    );
  });
  $$("[data-delete-contract]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord("deleteContract", button.dataset.deleteContract, "這筆合約"));
  });
}

function renderActivities() {
  const activities = state.activities
    .filter((activity) => matchesSearch(activity, [activity.bd, customerName(activity.customerId), activity.type, activity.content]))
    .sort((a, b) => b.activityDate.localeCompare(a.activityDate));

  $("#activityRows").innerHTML = activities.length
    ? activities
        .map(
          (activity) => `
            <tr>
              <td>${dateText(activity.activityDate)}</td>
              <td>${escapeHtml(activity.bd || "-")}</td>
              <td>${escapeHtml(customerName(activity.customerId))}</td>
              <td>${escapeHtml(activity.type)}</td>
              <td>${escapeHtml(activity.content)}</td>
              <td>${dateText(activity.nextFollowUp)}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-btn" data-edit-activity="${activity.id}">編輯</button>
                  <button class="danger-btn" data-delete-activity="${activity.id}">刪除</button>
                </div>
              </td>
            </tr>
          `,
        )
        .join("")
    : emptyRow(7, "沒有符合條件的互動紀錄");

  $$("[data-edit-activity]").forEach((button) => {
    button.addEventListener("click", () => editRecord("activityModal", "activityForm", state.activities.find((item) => item.id === button.dataset.editActivity)));
  });
  $$("[data-delete-activity]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord("deleteActivity", button.dataset.deleteActivity, "這筆互動紀錄"));
  });
}

function fillSelects() {
  $$("select[data-option-key]").forEach((select) => {
    const current = select.value;
    const key = select.dataset.optionKey;
    setSelectOptions(select, optionList(key), "請選擇", current);
  });

  $$("select[name='customerId']").forEach((select) => {
    const current = select.value;
    select.innerHTML = `<option value="">選擇客戶</option>` + state.customers.map((customer) => `<option value="${customer.id}">${escapeHtml(customer.name)}</option>`).join("");
    select.value = current;
  });

  $$("select[name='invoiceId']").forEach((select) => {
    const current = select.value;
    const selectedCustomerId = select.closest("form")?.elements.customerId?.value;
    const invoices = getInvoiceRows().filter((invoice) => !selectedCustomerId || invoice.customerId === selectedCustomerId || invoice.id === current);
    select.innerHTML =
      `<option value="">選擇發票</option>` +
      invoices
        .map((invoice) => `<option value="${invoice.id}">${escapeHtml(invoice.invoiceNo)}｜${escapeHtml(invoice.customerName)}｜${money(invoice.balance)}</option>`)
        .join("");
    select.value = current;
  });
}

function setSelectOptions(select, options, placeholder, currentValue = "") {
  const normalizedOptions = [...new Set(options.filter(Boolean))];
  if (currentValue && !normalizedOptions.includes(currentValue)) normalizedOptions.unshift(currentValue);
  select.innerHTML =
    `<option value="">${placeholder}</option>` +
    normalizedOptions.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("");
  select.value = currentValue;
}

function optionList(key) {
  return state.options?.[key]?.length ? state.options[key] : defaultOptions[key] || [];
}

function mergeOptions(options = {}) {
  return Object.fromEntries(
    Object.entries(defaultOptions).map(([key, defaults]) => {
      const values = Array.isArray(options[key]) ? options[key] : defaults;
      const cleanValues = values.map((value) => String(value || "").trim()).filter(Boolean);
      return [key, cleanValues.length ? [...new Set(cleanValues)] : defaults];
    }),
  );
}

function renderOptionSettings() {
  const fields = optionFields();
  fields.forEach(({ id, key }) => {
    const element = $(`#${id}`);
    if (element && document.activeElement !== element) element.value = optionList(key).join("\n");
  });
}

function readOptionsForm() {
  return mergeOptions(
    Object.fromEntries(
      optionFields().map(({ id, key }) => {
        const value = $(`#${id}`).value;
        return [key, value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)];
      }),
    ),
  );
}

function optionFields() {
  return [
    { id: "optionPaymentTerms", key: "paymentTerms" },
    { id: "optionBd", key: "bd" },
    { id: "optionSalesType", key: "salesType" },
    { id: "optionIndustry", key: "industry" },
    { id: "optionInvoiceStatus", key: "invoiceStatus" },
    { id: "optionPaymentMethod", key: "paymentMethod" },
    { id: "optionCustomerStatus", key: "customerStatus" },
    { id: "optionBillingMode", key: "billingMode" },
  ];
}

function editRecord(modalId, formId, record) {
  if (!record) return;
  resetFormForModal(modalId);
  const form = $(`#${formId}`);
  Object.entries(record).forEach(([key, value]) => {
    if (form.elements[key]) setFormValue(form.elements[key], value);
  });
  $(`#${modalId}`).showModal();
}

function setFormValue(control, value) {
  if (control.tagName === "SELECT" && value && !Array.from(control.options).some((option) => option.value === String(value))) {
    control.add(new Option(value, value));
  }
  control.value = value;
}

async function deleteRecord(action, id, label) {
  if (!id) return;
  if (!confirm(`確定要刪除${label}嗎？此動作無法復原。`)) return;
  await persist(action, { id });
}

function fillInvoiceCustomerFields(customerId) {
  const form = $("#invoiceForm");
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer) return;
  if (!form.elements.bd.value) form.elements.bd.value = customer.bd || "";
  if (!form.elements.company.value) form.elements.company.value = customer.name || "";
  if (!form.elements.taxId.value) form.elements.taxId.value = customer.taxId || "";
  if (!form.elements.recipient.value) form.elements.recipient.value = customer.contact || "";
  if (!form.elements.recipientAddress.value) form.elements.recipientAddress.value = customer.address || "";
  if (!form.elements.email.value) form.elements.email.value = customer.email || "";
  if (!form.elements.phone.value) form.elements.phone.value = customer.phone || "";
  if (!form.elements.billingSchedule.value) form.elements.billingSchedule.value = customer.paymentTerms || "";
}

function fillBdFromCustomer(form, customerId) {
  const bd = customerBd(customerId);
  if (form?.elements?.bd && bd && !form.elements.bd.value) form.elements.bd.value = bd;
}

function fillBdFromInvoice(form, invoiceId) {
  const invoice = getInvoiceRows().find((item) => item.id === invoiceId);
  const bd = invoice?.bd || customerBd(invoice?.customerId);
  if (form?.elements?.bd && bd && !form.elements.bd.value) form.elements.bd.value = bd;
}

function updateInvoiceTotal() {
  const form = $("#invoiceForm");
  const subtotal = Number(form.elements.subtotal.value || 0);
  form.elements.totalWithTax.value = subtotal ? calculateTaxIncluded(subtotal) : "";
}

function calculateTaxIncluded(subtotal) {
  return Math.round(Number(subtotal || 0) * 1.05);
}

async function exportInvoices() {
  if (!config.scriptUrl || !config.sheetId) {
    showToast("請先完成 Google Sheet 串接，再匯出發票資料");
    return;
  }

  try {
    const result = await callSheet("exportInvoices", {});
    if (result.url) window.open(result.url, "_blank");
    showToast("已建立發票 Google Sheet 匯出檔");
  } catch (error) {
    showToast(`匯出失敗：${error.message}`);
  }
}

function getInvoiceRows() {
  return state.invoices.map((invoice) => {
    const total = Number(invoice.totalWithTax || 0) || calculateTaxIncluded(invoice.subtotal);
    const paid = state.payments
      .filter((payment) => payment.invoiceId === invoice.id)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const balance = Math.max(total - paid, 0);
    return {
      ...invoice,
      bd: invoice.bd || customerBd(invoice.customerId),
      customerName: customerName(invoice.customerId),
      company: invoice.company || customerName(invoice.customerId),
      total,
      paid,
      balance,
    };
  });
}

function getInvoiceTotals() {
  return getInvoiceRows().reduce(
    (totals, invoice) => {
      if (invoice.status !== "作廢") {
        totals.total += invoice.total;
        totals.paid += invoice.paid;
        totals.receivable += invoice.balance;
      }
      return totals;
    },
    { total: 0, paid: 0, receivable: 0 },
  );
}

function getMonthPaid() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return state.payments
    .filter((payment) => payment.paidDate?.startsWith(currentMonth))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function customerName(id) {
  return state.customers.find((customer) => customer.id === id)?.name || "未指定客戶";
}

function customerBd(id, customers = state.customers) {
  return customers.find((customer) => customer.id === id)?.bd || "";
}

function invoiceNo(id) {
  return state.invoices.find((invoice) => invoice.id === id)?.invoiceNo || "未指定發票";
}

function matchesSearch(record, fields) {
  if (!searchTerm) return true;
  return fields.some((field) => String(field || "").toLowerCase().includes(searchTerm));
}

function statusPill(invoice) {
  if (invoice.status === "作廢") return `<span class="status-pill status-open">作廢</span>`;
  if (invoice.balance <= 0 || invoice.status === "已收款") return `<span class="status-pill status-paid">已收款</span>`;
  if (isOverdue(invoice.dueDate)) return `<span class="status-pill status-overdue">逾期</span>`;
  return `<span class="status-pill status-open">${escapeHtml(invoice.status || "未收款")}</span>`;
}

function contractStatusPill(status) {
  if (status === "合約中") return `<span class="status-pill status-paid">合約中</span>`;
  if (status === "合約終止") return `<span class="status-pill status-overdue">合約終止</span>`;
  return `<span class="status-pill status-open">${escapeHtml(status || "未設定")}</span>`;
}

function isOverdue(dateValue) {
  if (!dateValue) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateValue) < today;
}

function money(value) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function numberText(value) {
  return Number(value || 0).toLocaleString("zh-TW");
}

function dateText(dateValue) {
  return dateValue || "-";
}

function addDays(dateValue, days) {
  const date = new Date(dateValue);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function emptyRow(colspan, message) {
  return `<tr><td class="empty-row" colspan="${colspan}">${message}</td></tr>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateSyncStatus(connected = Boolean(config.scriptUrl && config.sheetId), detail = "") {
  $("#statusDot").classList.toggle("connected", connected);
  $("#syncStatus").textContent = connected ? "Google Sheet 已設定" : "示範資料模式";
  $("#syncHint").textContent = connected ? detail || "資料會同步到你的試算表。" : "貼上 Apps Script 網址即可串接 Google Sheet。";
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}
