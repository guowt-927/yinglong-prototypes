const gpuData = {
  "NVIDIA A100": { vendor: "NVIDIA", total: 128, used: 120, hot: 7, nodes: ["192.168.1.101", "192.168.1.103"], base: 82 },
  "NVIDIA A800": { vendor: "NVIDIA", total: 96, used: 72, hot: 4, nodes: ["192.168.2.111", "192.168.2.112"], base: 68 },
  "昇腾 910B3": { vendor: "华为", total: 64, used: 52, hot: 3, nodes: ["10.24.16.23", "10.24.16.24"], base: 74 }
};

const taskData = {
  "qwen3-32b": [
    ["知识问答助手", 158.4, 34.8], ["合同审查", 112.6, 24.7], ["企业知识库", 86.3, 19.0], ["智能客服", 59.7, 13.1], ["会议纪要生成", 38.2, 8.4]
  ],
  "qwen2-2.5": [
    ["内容分类", 98.6, 31.2], ["文本摘要", 84.2, 26.7], ["智能检索", 61.5, 19.5], ["数据标注", 43.3, 13.7], ["意图识别", 28.1, 8.9]
  ],
  "whisper-large-v3": [
    ["会议转写", 126.8, 42.6], ["客服质检", 77.4, 26.0], ["实时字幕", 55.6, 18.7], ["媒体归档", 24.1, 8.1], ["语音检索", 13.7, 4.6]
  ]
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let activeGpu = "NVIDIA A100";
let activeService = "在线服务";
let toastTimer;

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
  $("#gpuList").innerHTML = Object.entries(gpuData).map(([name, data]) => `
    <button class="gpu-card${name === activeGpu ? " active" : ""}" type="button" data-gpu="${name}" aria-pressed="${name === activeGpu}">
      <span class="vendor${data.vendor === "华为" ? " huawei" : ""}">${data.vendor === "华为" ? "HW" : "NV"}</span>
      <span><strong>${name}</strong><small>${data.vendor}</small></span>
      <span class="gpu-mini-stats"><span>已用 / 总卡<b>${data.used} / ${data.total}</b></span><span>空闲卡<b>${data.total - data.used}</b></span><span>总台数<b>${data.nodes.length * 9}</b></span></span>
    </button>`).join("");
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
  $("#usedCount").textContent = data.used;
  $("#idleCount").textContent = data.total - data.used;
  $("#hotCount").textContent = data.hot;
  $("#gpuTableBody").innerHTML = rows.slice(0, 5).map((row, index) => `
    <tr><td>${index + 1}</td><td>${row.id}</td><td>${row.node}</td><td>${row.instance}</td>
      <td><span class="usage"><i><b style="width:${row.gpu}%"></b></i><span>${row.gpu}%</span></span></td>
      <td><span class="usage memory"><i><b style="width:${row.memory}%"></b></i><span>${row.memory}%</span></span></td><td>${row.power} W</td></tr>`).join("");
  $("#rowCount").textContent = `共 ${rows.length} 条记录 · 第 1 / ${Math.max(1, Math.ceil(rows.length / 5))} 页`;
}

function renderRanking() {
  const model = $("#modelSelect").value;
  const rows = taskData[model];
  const total = rows.reduce((sum, row) => sum + row[1], 0);
  $("#tokenTotal").textContent = total.toFixed(1);
  $("#topTask").textContent = rows[0][0];
  $("#topShare").textContent = `${rows[0][2]}%`;
  $("#taskScope").textContent = `${model} · ${activeService}`;
  $("#rankingList").innerHTML = rows.map(row => `<div class="ranking-item"><span>${row[0]}</span><span class="bar"><i style="width:${row[2] * 2.45}%"></i></span><b>${row[1].toFixed(1)} 万</b><em>${row[2]}%</em></div>`).join("");
}

function exportCsv(filename, rows) {
  const csv = `\ufeff${rows.map(row => row.join(",")).join("\n")}`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("CSV 明细已生成");
}

function exportGpu(currentOnly = true) {
  const names = currentOnly ? [activeGpu] : Object.keys(gpuData);
  const rows = [["显卡型号", "唯一 ID", "节点 IP", "运行实例", "GPU 利用率", "显存占用率", "功率"]];
  names.forEach(name => buildRows(name).forEach(row => rows.push([name, row.id, row.node, row.instance, `${row.gpu}%`, `${row.memory}%`, `${row.power}W`])));
  exportCsv(currentOnly ? `${activeGpu.replaceAll(" ", "-")}-明细.csv` : "应龙-全部显卡资源明细.csv", rows);
}

function setModal(open) {
  $("#ruleModal").hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  if (open) $("#closeModal").focus();
}

$("#gpuList").addEventListener("click", event => {
  const card = event.target.closest("[data-gpu]");
  if (!card) return;
  activeGpu = card.dataset.gpu;
  renderGpuList();
  renderGpuTable();
});

$("#nodeSelect").addEventListener("change", renderGpuTable);
$("#modelSelect").addEventListener("change", renderRanking);
$(".segmented").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  activeService = button.dataset.service;
  $$(".segmented button").forEach(item => item.classList.toggle("active", item === button));
  renderRanking();
});

$("#refreshBtn").addEventListener("click", () => {
  $$('[data-qps]').forEach((node, index) => node.textContent = (1180 + Math.floor(Math.random() * 160) + index * 17).toLocaleString("zh-CN"));
  $("#updatedAt").textContent = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  showToast("数据已刷新");
});

$("#clusterSelect").addEventListener("change", event => showToast(`已切换至${event.target.value}`));
$("#exportCurrentBtn").addEventListener("click", () => exportGpu(true));
$("#exportAllBtn").addEventListener("click", () => exportGpu(false));
$("#exportServiceBtn").addEventListener("click", () => exportCsv("应龙-模型服务态势.csv", [["服务名称", "状态", "硬件型号", "调用数量", "失败率"], ["qwen3-32b", "在线", "昇腾 910B3 × 8", "128642", "2.84%"], ["qwen2-2.5", "在线", "NVIDIA H20 × 4", "96210", "0.41%"]]));

$("#ruleBtn").addEventListener("click", () => setModal(true));
$("#closeModal").addEventListener("click", () => setModal(false));
$("#cancelModal").addEventListener("click", () => setModal(false));
$("#ruleModal").addEventListener("click", event => { if (event.target === $("#ruleModal")) setModal(false); });
$("#saveRules").addEventListener("click", () => { setModal(false); showToast("预警规则已保存"); });
document.addEventListener("keydown", event => { if (event.key === "Escape") setModal(false); });

$("#mobileMenu").addEventListener("click", () => {
  const open = $("#sidebar").classList.toggle("open");
  $("#mobileMenu").setAttribute("aria-expanded", String(open));
});

renderGpuList();
renderGpuTable();
renderRanking();
