const gpuData = {
  "NVIDIA A100": { vendor: "NVIDIA", total: 128, used: 120, hot: 7, nodes: ["192.168.1.101", "192.168.1.103"], base: 82 },
  "NVIDIA A800": { vendor: "NVIDIA", total: 96, used: 72, hot: 4, nodes: ["192.168.2.111", "192.168.2.112"], base: 68 },
  "昇腾 910B3": { vendor: "华为", total: 64, used: 52, hot: 3, nodes: ["10.24.16.23", "10.24.16.24"], base: 74 }
};

const taskData = {
  "qwen3-32b": [
    ["知识问答助手", 158.4], ["合同审查", 112.6], ["企业知识库", 86.3], ["智能客服", 59.7],
    ["会议纪要生成", 38.2], ["数据抽取", 27.6], ["风险检测", 18.4], ["营销文案", 11.8]
  ],
  "qwen2-2.5": [
    ["内容分类", 98.6], ["文本摘要", 84.2], ["智能检索", 61.5], ["数据标注", 43.3],
    ["意图识别", 28.1], ["舆情分析", 20.8], ["实体识别", 14.6], ["工单归类", 9.2]
  ],
  "whisper-large-v3": [
    ["会议转写", 126.8], ["客服质检", 77.4], ["实时字幕", 55.6], ["媒体归档", 24.1],
    ["语音检索", 13.7], ["访谈整理", 10.9], ["播客转写", 7.8], ["语音标注", 5.3]
  ]
};

const modelRankingData = {
  cards: {
    unit: "卡",
    rows: [["qwen3-32b", 80], ["qwen2-2.5", 44], ["whisper-large-v3", 24], ["minimax-abab6.5", 16], ["bge-m3", 12], ["deepseek-r1", 8], ["text2vec-large", 6], ["reranker-v2", 4]]
  },
  calls: {
    unit: "次",
    rows: [["qwen3-32b", 128642], ["qwen2-2.5", 96210], ["whisper-large-v3", 42806], ["bge-m3", 31890], ["minimax-abab6.5", 18450], ["deepseek-r1", 12308], ["text2vec-large", 8692], ["reranker-v2", 5420]]
  }
};

const RANKING_PAGE_SIZE = 5;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let activeGpu = "NVIDIA A100";
let activeService = "在线服务";
let activeRankingMetric = "cards";
let modelRankingPage = 1;
let computeRankingPage = 1;
let toastTimer;
let ruleModalTrigger = null;
const deviceWhitelist = [];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function buildRows(name) {
  const data = gpuData[name];
  return Array.from({ length: 12 }, (_, index) => {
    const node = data.nodes[index % data.nodes.length];
    const gpu = Math.min(99, data.base + ((index * 7) % 18) - 6);
    const memory = Math.min(98, gpu + ((index * 3) % 9) - 3);
    return {
      id: `${name.includes("910") ? "910B" : name.split(" ")[1]}-SXM-${String(index + 1).padStart(3, "0")}`,
      node,
      instance: index < 9 ? `${index % 2 ? "qwen2" : "qwen3"}-prod-${String((index % 3) + 1).padStart(2, "0")}` : "--",
      gpu, memory, power: 286 + ((index * 17) % 96)
    };
  });
}

function renderGpuList() {
  const list = $("#gpuList");
  const previousScrollTop = list.scrollTop;
  list.innerHTML = Object.entries(gpuData).map(([name, data]) => `
    <button class="gpu-card${name === activeGpu ? " active" : ""}" type="button" data-gpu="${name}" aria-pressed="${name === activeGpu}">
      <span class="vendor${data.vendor === "华为" ? " huawei" : ""}"><img src="prototypes/assets/images/vendors/${data.vendor === "华为" ? "huawei" : "nvidia"}.svg" alt="${data.vendor}"></span>
      <span><strong>${name}</strong><small>${data.vendor}</small></span>
      <span class="gpu-mini-stats"><span>已用 / 总卡<b>${data.used} / ${data.total}</b></span><span>空闲卡<b>${data.total - data.used}</b></span><span>总台数<b>${data.nodes.length * 9}</b></span></span>
    </button>`).join("");
  list.scrollTop = previousScrollTop;
  requestAnimationFrame(updateGpuScrollControls);
}

function updateGpuScrollControls() {
  const list = $("#gpuList");
  const maxScrollTop = Math.max(0, list.scrollHeight - list.clientHeight);
  $("#gpuScrollUp").disabled = list.scrollTop <= 1;
  $("#gpuScrollDown").disabled = list.scrollTop >= maxScrollTop - 1;
}

function scrollGpuList(direction) {
  const list = $("#gpuList");
  const card = list.querySelector(".gpu-card");
  const cardGap = card ? Number.parseFloat(getComputedStyle(card).marginBottom) || 0 : 0;
  const distance = card ? card.offsetHeight + cardGap : list.clientHeight * 0.8;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  list.scrollBy({ top: direction * distance, behavior: reducedMotion ? "auto" : "smooth" });
}

function renderNodeOptions(rows) {
  const select = $("#nodeSelect");
  const current = select.value;
  const nodes = [...new Set(rows.map(row => row.node))];
  select.innerHTML = `<option value="all">全部节点</option>${nodes.map(node => `<option value="${node}">${node}</option>`).join("")}`;
  if (nodes.includes(current)) select.value = current;
}

function renderGpuTable() {
  const data = gpuData[activeGpu];
  const allRows = buildRows(activeGpu);
  renderNodeOptions(allRows);
  const node = $("#nodeSelect").value;
  const rows = allRows.filter(row => node === "all" || row.node === node);
  $("#gpuTitle").textContent = activeGpu;
  $("#gpuTotal").textContent = `总计 ${data.total} 卡`;
  $("#gpuVendorIcon").src = `prototypes/assets/images/vendors/${data.vendor === "华为" ? "huawei" : "nvidia"}.svg`;
  $("#gpuVendorIcon").alt = data.vendor;
  $("#gpuVendorIcon").parentElement.classList.toggle("huawei", data.vendor === "华为");
  $("#usedCount").textContent = data.used;
  $("#idleCount").textContent = data.total - data.used;
  $("#hotCount").textContent = data.hot;
  $("#gpuTableBody").innerHTML = rows.slice(0, 5).map((row, index) => `
    <tr><td>${index + 1}</td><td>${row.id}</td><td>${row.node}</td><td>${row.instance}</td>
      <td><span class="usage"><i><b style="width:${row.gpu}%"></b></i><span>${row.gpu}%</span></span></td>
      <td><span class="usage memory"><i><b style="width:${row.memory}%"></b></i><span>${row.memory}%</span></span></td><td>${row.power} W</td></tr>`).join("");
  $("#rowCount").textContent = `共 ${rows.length} 条记录 · 第 1 / ${Math.max(1, Math.ceil(rows.length / 5))} 页`;
}

function renderRankingPagination(selector, totalItems, currentPage) {
  const totalPages = Math.max(1, Math.ceil(totalItems / RANKING_PAGE_SIZE));
  const start = totalItems ? (currentPage - 1) * RANKING_PAGE_SIZE + 1 : 0;
  const end = Math.min(currentPage * RANKING_PAGE_SIZE, totalItems);
  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="${page === currentPage ? "current" : ""}" type="button" data-page="${page}"${page === currentPage ? ' aria-current="page"' : ""}>${page}</button>`;
  }).join("");
  $(selector).innerHTML = `<span>${start}–${end} / ${totalItems}</span><button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>上一页</button>${pageButtons}<button type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>`;
}

function renderRanking() {
  const model = $("#modelSelect").value;
  const rows = taskData[model];
  const factor = activeService === "离线服务" ? 0.68 : 1;
  const total = rows.reduce((sum, row) => sum + row[1], 0);
  const maxValue = Math.max(...rows.map(row => row[1]));
  const totalPages = Math.ceil(rows.length / RANKING_PAGE_SIZE);
  computeRankingPage = Math.min(computeRankingPage, totalPages);
  const start = (computeRankingPage - 1) * RANKING_PAGE_SIZE;
  const pageRows = rows.slice(start, start + RANKING_PAGE_SIZE);
  $("#rankingList").innerHTML = pageRows.map(row => {
    const share = row[1] / total * 100;
    return `<div class="ranking-item"><span>${row[0]}</span><span class="bar"><i style="width:${Math.max(8, row[1] / maxValue * 100)}%"></i></span><b>${(row[1] * factor).toFixed(1)} 万</b><em>${share.toFixed(1)}%</em></div>`;
  }).join("");
  renderRankingPagination("#computeRankingPagination", rows.length, computeRankingPage);
}

function renderModelRanking() {
  const ranking = modelRankingData[activeRankingMetric];
  const maxValue = Math.max(...ranking.rows.map(row => row[1]));
  const totalPages = Math.ceil(ranking.rows.length / RANKING_PAGE_SIZE);
  modelRankingPage = Math.min(modelRankingPage, totalPages);
  const start = (modelRankingPage - 1) * RANKING_PAGE_SIZE;
  const pageRows = ranking.rows.slice(start, start + RANKING_PAGE_SIZE);
  $("#modelRankingList").innerHTML = pageRows.map((row, index) => `
    <div class="model-ranking-item${start + index < 3 ? " top-ranked" : ""}">
      <span class="rank-index">${start + index + 1}</span>
      <span class="model-name">${row[0]}</span>
      <span class="bar"><i style="width:${Math.max(8, row[1] / maxValue * 100)}%"></i></span>
      <strong class="model-ranking-value">${row[1].toLocaleString("zh-CN")} ${ranking.unit}</strong>
    </div>`).join("");
  renderRankingPagination("#modelRankingPagination", ranking.rows.length, modelRankingPage);
}

function setModal(open) {
  $("#ruleModal").hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    ruleModalTrigger = document.activeElement;
    $("#alertRuleError").hidden = true;
    $("#deviceWhitelistError").textContent = "";
    renderDeviceWhitelist();
    $("#closeModal").focus();
  } else if (ruleModalTrigger) {
    ruleModalTrigger.focus();
  }
}

function renderDeviceWhitelist() {
  const container = $("#deviceWhitelist");
  container.replaceChildren();
  if (!deviceWhitelist.length) {
    const empty = document.createElement("span");
    empty.className = "device-whitelist-empty";
    empty.textContent = "暂无白名单 IP";
    container.appendChild(empty);
    return;
  }
  deviceWhitelist.forEach(device => {
    const item = document.createElement("span");
    item.className = "device-whitelist-item";
    item.setAttribute("role", "listitem");
    const name = document.createElement("span");
    name.textContent = device;
    const remove = document.createElement("button");
    remove.className = "device-whitelist-remove";
    remove.type = "button";
    remove.dataset.whitelistDevice = device;
    remove.textContent = "移除";
    remove.setAttribute("aria-label", `从节点 IP 白名单中移除 ${device}`);
    remove.disabled = !$("#deviceLossRuleEnabled").checked;
    item.append(name, remove);
    container.appendChild(item);
  });
}

function addDeviceToWhitelist() {
  const input = $("#deviceWhitelistInput");
  const error = $("#deviceWhitelistError");
  const device = input.value.trim();
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(device) && device.split(".").every(part => Number(part) <= 255);
  if (!device) {
    error.textContent = "请输入节点 IP。";
  } else if (!isIpv4) {
    error.textContent = "请输入有效的 IPv4 地址，例如 10.24.16.30。";
  } else if (deviceWhitelist.some(item => item.toLowerCase() === device.toLowerCase())) {
    error.textContent = "该设备已在白名单中。";
  }
  if (error.textContent) {
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  deviceWhitelist.push(device);
  input.value = "";
  renderDeviceWhitelist();
  input.focus();
}

function updateRuleCard(toggleId, cardId) {
  const enabled = $(`#${toggleId}`).checked;
  const card = $(`#${cardId}`);
  card.classList.toggle("is-disabled", !enabled);
  card.querySelector(".rule-toggle-text").textContent = enabled ? "启用" : "停用";
  card.querySelectorAll(".rule-fields input, .rule-fields select, .rule-fields button").forEach(control => {
    control.disabled = !enabled;
  });
}

function saveAlertRules() {
  const rules = [
    { enabled: "#nodeRuleEnabled", warning: "#nodeWarningThreshold", name: "节点心跳规则" },
    { enabled: "#taskRuleEnabled", warning: "#taskWarningThreshold", name: "任务失败率" },
    { enabled: "#modelRuleEnabled", warning: "#modelWarningThreshold", name: "模型请求失败率" }
  ];
  $$(".rule-control[aria-invalid='true']").forEach(control => control.removeAttribute("aria-invalid"));
  const invalidRule = rules.find(rule => {
    if (!$(rule.enabled).checked) return false;
    const warning = Number($(rule.warning).value);
    const invalid = !Number.isFinite(warning) || warning <= 0;
    if (invalid) {
      $(rule.warning).setAttribute("aria-invalid", "true");
    }
    return invalid;
  });
  if (invalidRule) {
    $("#alertRuleError").textContent = `${invalidRule.name}的警告阈值必须大于 0。`;
    $("#alertRuleError").hidden = false;
    $(invalidRule.warning).focus();
    return;
  }
  setModal(false);
  showToast(`预警规则已保存：2 项节点异常、2 项 SLA预警`);
}

$("#gpuList").addEventListener("click", event => {
  const card = event.target.closest("[data-gpu]");
  if (!card) return;
  activeGpu = card.dataset.gpu;
  renderGpuList();
  renderGpuTable();
});
$("#gpuList").addEventListener("scroll", updateGpuScrollControls, { passive: true });
$("#gpuScrollUp").addEventListener("click", () => scrollGpuList(-1));
$("#gpuScrollDown").addEventListener("click", () => scrollGpuList(1));
window.addEventListener("resize", updateGpuScrollControls);

$("#nodeSelect").addEventListener("change", renderGpuTable);
$("#modelSelect").addEventListener("change", () => {
  computeRankingPage = 1;
  renderRanking();
});
$(".service-switch").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  activeService = button.dataset.service;
  computeRankingPage = 1;
  $$(".service-switch button").forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderRanking();
});

$("#modelRankingSwitch").addEventListener("click", event => {
  const button = event.target.closest("button[data-ranking-metric]");
  if (!button) return;
  activeRankingMetric = button.dataset.rankingMetric;
  modelRankingPage = 1;
  $$("#modelRankingSwitch button").forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderModelRanking();
});

$("#modelRankingPagination").addEventListener("click", event => {
  const button = event.target.closest("button[data-page]");
  if (!button || button.disabled) return;
  modelRankingPage = Number(button.dataset.page);
  renderModelRanking();
});

$("#computeRankingPagination").addEventListener("click", event => {
  const button = event.target.closest("button[data-page]");
  if (!button || button.disabled) return;
  computeRankingPage = Number(button.dataset.page);
  renderRanking();
});

$("#clusterSelect").addEventListener("change", event => showToast(`已切换至${event.target.value}`));

$("#ruleBtn").addEventListener("click", () => setModal(true));
$("#closeModal").addEventListener("click", () => setModal(false));
$("#cancelModal").addEventListener("click", () => setModal(false));
$("#ruleModal").addEventListener("click", event => { if (event.target === $("#ruleModal")) setModal(false); });
$("#saveRules").addEventListener("click", saveAlertRules);
$("#nodeRuleEnabled").addEventListener("change", () => updateRuleCard("nodeRuleEnabled", "nodeRuleCard"));
$("#deviceLossRuleEnabled").addEventListener("change", () => {
  updateRuleCard("deviceLossRuleEnabled", "deviceLossRuleCard");
  renderDeviceWhitelist();
});
$("#taskRuleEnabled").addEventListener("change", () => updateRuleCard("taskRuleEnabled", "taskRuleCard"));
$("#modelRuleEnabled").addEventListener("change", () => updateRuleCard("modelRuleEnabled", "modelRuleCard"));
$("#addDeviceWhitelist").addEventListener("click", addDeviceToWhitelist);
$("#deviceWhitelistInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    addDeviceToWhitelist();
  }
});
$("#deviceWhitelist").addEventListener("click", event => {
  const button = event.target.closest("[data-whitelist-device]");
  if (!button) return;
  const index = deviceWhitelist.indexOf(button.dataset.whitelistDevice);
  if (index >= 0) deviceWhitelist.splice(index, 1);
  renderDeviceWhitelist();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !$("#ruleModal").hidden) setModal(false);
});

renderGpuList();
renderGpuTable();
renderModelRanking();
renderRanking();
renderDeviceWhitelist();
