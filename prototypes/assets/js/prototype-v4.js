(function () {
  'use strict';

  const fileName = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const inPrototypes = /\/prototypes\//i.test(location.pathname.replaceAll('\\', '/'));
  if (fileName === 'index.html' && inPrototypes) return;

  const paths = {
    dashboard: inPrototypes ? '../index.html' : 'index.html',
    logo: inPrototypes ? '../doc/logo/icon_01.svg' : 'doc/logo/icon_01.svg'
  };

  const descriptions = {
    'sys_training_records.html': '筛选和查看模型训练历史及产出版本。',
    'sys_request_tracing.html': '按时间与请求标识定位在线和离线调用链路。'
  };

  const iconPaths = {
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    sliders: '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v8l9 5 9-5V8M12 13v8"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
    brain: '<path d="M9.5 4.5A3 3 0 0 0 4 6v1a3 3 0 0 0-1 5.5A3 3 0 0 0 4 18v.5a3 3 0 0 0 5.5 1.7M14.5 4.5A3 3 0 0 1 20 6v1a3 3 0 0 1 1 5.5A3 3 0 0 1 20 18v.5a3 3 0 0 1-5.5 1.7M12 4v16M8 9h4M12 15h4"/>',
    activity: '<path d="M3 12h4l3-9 4 18 3-9h4"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 15h6M12 12v6"/>',
    usercheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    network: '<rect width="6" height="6" x="9" y="2" rx="1"/><rect width="6" height="6" x="3" y="16" rx="1"/><rect width="6" height="6" x="15" y="16" rx="1"/><path d="M12 8v4m-6 4v-2h12v2"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h5.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    scrolltext: '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    chevronleft: '<path d="m15 18-6-6 6-6"/>',
    chevrondown: '<path d="m6 9 6 6 6-6"/>',
    logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    alert: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>',
    lock: '<rect width="16" height="12" x="4" y="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    cube: '<path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    flask: '<path d="M9 3h6m-1 0v6.5l4.8 8.1A2.3 2.3 0 0 1 16.8 21H7.2a2.3 2.3 0 0 1-2-3.4L10 9.5V3"/><path d="M7 15h10"/>',
    upload: '<path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-4.4m-6.8 7 6.8 4.4"/>',
    crown: '<path d="m2 5 4 4 6-7 6 7 4-4-2 14H4L2 5Z"/><path d="M5 19h14"/>',
    align: '<path d="M3 6h18M3 12h14M3 18h18"/>',
    arrowleft: '<path d="m12 19-7-7 7-7M19 12H5"/>',
    stream: '<path d="M4 6h16M7 12h10M10 18h4"/>'
  };

  function icon(name, extraClass) {
    return '<svg class="yl-v4-icon ' + (extraClass || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (iconPaths[name] || iconPaths.box) + '</svg>';
  }

  const activeByFile = {
    'index.html': 'dashboard',
    'sys_dispatch.html': 'dispatch',
    'sys_task_list.html': 'tasks',
    'sys_task_detail.html': 'logs',
    'sys_model_repo.html': 'repo',
    'sys_model_version_detail.html': 'repo',
    'sys_model_service.html': 'service',
    'sys_model_training.html': 'training',
    'sys_model_training_detail.html': 'training',
    'sys_training_records.html': 'training',
    'sys_model_monitor.html': 'monitor',
    'sys_resource_application.html': 'application',
    'sys_resource_approval.html': 'approval',
    'sys_infrastructure_mgmt.html': 'infrastructure',
    'sys_node_detail.html': 'infrastructure',
    'sys_request_tracing.html': 'tracing'
  };

  const activeKey = activeByFile[fileName] || '';
  const pageHref = name => inPrototypes ? name : 'prototypes/' + name;
  const v1ScopeItems = [
    '链路追踪',
    '模型训练',
    '模型仓库（模型资产）中的训练版本',
    '添加模型资产',
    '编辑模型资产',
    '模型资产卡片中的版本数量',
    '部署服务中的镜像选择',
    '任务详情中的在线测试',
    '集群管理中的加速卡容量',
    '集群管理中的 GPU 利用率',
    '算力调度中的请求数趋势',
    '任务详情中的按天 / 按小时统计'
  ];
  const platformVersions = { frontend: 'v1.0.0', backend: 'v1.0.0' };
  const v1ScopedNavKeys = new Set(['training', 'tracing']);
  const navGroups = [
    ['工作台', [['dashboard', 'dashboard', '系统概览', paths.dashboard]]],
    ['算力调度', [
      ['dispatch', 'sliders', '算力调度', pageHref('sys_dispatch.html')],
      ['tasks', 'list', '任务管理', pageHref('sys_task_list.html')],
      ['logs', 'scrolltext', '调用日志', pageHref('sys_task_detail.html')]
    ]],
    ['模型管理', [
      ['repo', 'box', '模型资产', pageHref('sys_model_repo.html')],
      ['service', 'server', '模型服务', pageHref('sys_model_service.html')],
      ['training', 'brain', '模型训练', pageHref('sys_model_training.html')],
      ['monitor', 'activity', '模型监测', pageHref('sys_model_monitor.html')]
    ]],
    ['资源与运维', [
      ['application', 'file', '资源申请', pageHref('sys_resource_application.html')],
      ['approval', 'usercheck', '授权审批', pageHref('sys_resource_approval.html')],
      ['infrastructure', 'network', '集群管理', pageHref('sys_infrastructure_mgmt.html')],
      ['tracing', 'route', '链路追踪', pageHref('sys_request_tracing.html')]
    ]]
  ];

  function createSidebar() {
    const aside = document.createElement('aside');
    aside.className = 'yl-v4-sidebar';
    aside.setAttribute('aria-label', '应龙主导航');
    const groups = navGroups.map(([title, items]) => {
      const links = items.map(([key, iconName, label, href]) => {
        const active = key === activeKey;
        const outOfScope = v1ScopedNavKeys.has(key);
        const scopeBadge = outOfScope ? '<small class="yl-v4-nav-scope">V1不含</small>' : '';
        const title = outOfScope ? label + '（V1 暂不包含，页面仅作后续版本预览）' : label;
        return '<a class="yl-v4-nav-item' + (active ? ' active' : '') + (outOfScope ? ' yl-v4-nav-item-planned' : '') + '" href="' + href + '" title="' + title + '"' + (active ? ' aria-current="page"' : '') + '>' + icon(iconName) + '<span>' + label + '</span>' + scopeBadge + '</a>';
      }).join('');
      return '<section class="yl-v4-nav-group"><h2 class="yl-v4-nav-title">' + title + '</h2>' + links + '</section>';
    }).join('');

    aside.innerHTML =
      '<div class="yl-v4-brand">' +
        '<a href="' + paths.dashboard + '" aria-label="应龙 AI算力基座首页"><img class="yl-v4-brand-logo" src="' + paths.logo + '" alt=""></a>' +
        '<a class="yl-v4-brand-copy" href="' + paths.dashboard + '"><span class="yl-v4-brand-name">应龙</span><span class="yl-v4-brand-subtitle">AI算力基座</span></a>' +
        '<button class="yl-v4-collapse" type="button" aria-label="折叠侧栏" aria-expanded="true">' + icon('chevronleft') + '</button>' +
      '</div>' +
      '<nav class="yl-v4-nav">' + groups + '</nav>' +
      '<div class="yl-v4-sidebar-footer">' +
        '<button class="yl-v4-release-button" type="button" aria-haspopup="dialog" aria-label="查看 V1.0 范围说明">' +
          icon('info', 'yl-v4-icon-sm') +
          '<span><strong>V1.0 范围说明</strong><small>' + v1ScopeItems.length + ' 项暂不包含</small></span>' +
        '</button>' +
        '<div class="yl-v4-version-card" tabindex="0" aria-label="后端版本 ' + platformVersions.backend + '；前端版本 ' + platformVersions.frontend + '">' +
          icon('server', 'yl-v4-icon-sm') +
          '<span class="yl-v4-version-summary"><span>后端版本</span><b>' + platformVersions.backend + '</b></span>' +
          '<span class="yl-v4-version-popover" id="ylV4VersionDetails" role="tooltip">' +
            '<strong>系统版本</strong>' +
            '<span><span>前端版本</span><b>' + platformVersions.frontend + '</b></span>' +
            '<span><span>后端版本</span><b>' + platformVersions.backend + '</b></span>' +
          '</span>' +
        '</div>' +
        '<button class="yl-v4-user-button" type="button" aria-haspopup="menu" aria-expanded="false">' +
          '<span class="yl-v4-avatar" aria-hidden="true">管</span>' +
          '<span class="yl-v4-user-copy"><span class="yl-v4-user-name">资源管理员</span><span class="yl-v4-user-role">System Admin</span></span>' +
          icon('chevrondown', 'yl-v4-icon-sm') +
        '</button>' +
        '<div class="yl-v4-user-menu" role="menu" hidden>' +
          '<button type="button" role="menuitem" data-v4-user-action="退出登录">' + icon('logout', 'yl-v4-icon-sm') + '退出登录</button>' +
        '</div>' +
      '</div>';
    return aside;
  }

  function createReleaseDialog() {
    const backdrop = document.createElement('div');
    backdrop.className = 'yl-v4-release-backdrop';
    backdrop.hidden = true;
    backdrop.innerHTML =
      '<section class="yl-v4-release-dialog" role="dialog" aria-modal="true" aria-labelledby="ylV4ReleaseTitle" aria-describedby="ylV4ReleaseDescription">' +
        '<header><div>' + icon('info') + '<div><span class="yl-v4-release-eyebrow">版本范围</span><h2 id="ylV4ReleaseTitle">V1.0 版本说明</h2></div></div>' +
          '<button class="yl-v4-release-close" type="button" aria-label="关闭版本说明">' + icon('x') + '</button></header>' +
        '<div class="yl-v4-release-body"><p id="ylV4ReleaseDescription">以下能力已在原型中保留为后续版本方案预览，但不属于 V1.0 的开发、交付和验收范围。</p>' +
          '<ul>' + v1ScopeItems.map(item => '<li>' + icon('check', 'yl-v4-icon-sm') + '<span>' + item + '</span><small>后续版本</small></li>').join('') + '</ul>' +
          '<p class="yl-v4-release-footnote">原型中的对应入口均已标注“V1不含”；相关页面和交互仅用于方案沟通。</p></div>' +
        '<footer><button class="yl-v4-release-confirm" type="button">我知道了</button></footer>' +
      '</section>';
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function createScopeBadge(label) {
    const badge = document.createElement('span');
    badge.className = 'yl-v4-scope-badge';
    badge.textContent = label || 'V1不含';
    return badge;
  }

  function addPageScopeNotice(title, description) {
    const main = document.querySelector('main');
    if (!main || main.querySelector('.yl-v4-scope-notice')) return;
    const notice = document.createElement('aside');
    notice.className = 'yl-v4-scope-notice';
    notice.setAttribute('role', 'note');
    const descriptionHtml = description ? '<p>' + description + '</p>' : '';
    notice.innerHTML = icon('info') + '<div><strong>' + title + '</strong>' + descriptionHtml + '</div>';
    const pageHeading = document.querySelector('h1');
    const headingHost = pageHeading && pageHeading.closest('section, header');
    if (headingHost) headingHost.insertAdjacentElement('afterend', notice);
    else main.prepend(notice);
  }

  function markScopedControl(control, label) {
    if (!control || control.querySelector('.yl-v4-scope-badge')) return;
    control.classList.add('yl-v4-scoped-control');
    control.appendChild(createScopeBadge(label));
    const currentTitle = control.getAttribute('title') || control.textContent.replace(/V1不含/g, '').trim();
    control.setAttribute('title', currentTitle + '（V1 暂不包含，仅作后续版本方案预览）');
  }

  function markScopedMetric(metric, metricName) {
    if (!metric || metric.querySelector('.yl-v4-scope-badge')) return;
    metric.classList.add('yl-v4-scoped-metric');
    metric.appendChild(createScopeBadge());
    const currentLabel = metric.getAttribute('aria-label') || metric.textContent.replace(/V1不含/g, '').trim();
    metric.setAttribute('aria-label', currentLabel + '，V1 暂不包含');
    metric.setAttribute('title', (metricName || '版本数量') + '（V1 暂不包含，仅作后续版本方案预览）');
  }

  function annotateModelAssetCard(card) {
    card.querySelectorAll('[data-action="edit"]').forEach(control => markScopedControl(control));
    card.querySelectorAll('a[href*="sys_model_version_detail.html"]').forEach(control => markScopedControl(control));
    card.querySelectorAll('.asset-version-count').forEach(markScopedMetric);
  }

  function annotateV1Scope() {
    if (fileName === 'sys_request_tracing.html') {
      addPageScopeNotice('V1版本 暂不包含链路追踪');
    }
    if (fileName === 'sys_model_training.html') {
      addPageScopeNotice('V1版本 暂不包含模型训练');
    }
    if (fileName === 'sys_model_training_detail.html' || fileName === 'sys_training_records.html') {
      addPageScopeNotice('V1 暂不包含模型训练', '训练任务、训练详情和训练记录均为后续版本方案预览，不属于 V1.0 的开发、交付和验收范围。');
    }
    if (fileName === 'sys_model_repo.html') {
      document.querySelectorAll('[data-add-model-open], #submitAddModel').forEach(control => markScopedControl(control));
      document.getElementById('addModelTitle')?.appendChild(createScopeBadge());
      document.querySelectorAll('#editModelForm button[type="submit"]').forEach(control => markScopedControl(control));
      document.getElementById('editModelTitle')?.appendChild(createScopeBadge());
      const modelGrid = document.querySelector('.model-grid');
      modelGrid?.querySelectorAll('.model-card').forEach(annotateModelAssetCard);
      if (modelGrid) {
        new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches('.model-card')) annotateModelAssetCard(node);
        }))).observe(modelGrid, { childList: true });
      }
    }
    if (fileName === 'sys_model_version_detail.html') {
      addPageScopeNotice('V1 暂不包含模型资产的训练版本', '当前版本历史、训练记录追溯及相关操作仅作后续版本方案预览，不属于 V1.0 的交付和验收范围。');
    }
    if (fileName === 'sys_task_detail.html') {
      const onlineTest = document.getElementById('openOnlineTest');
      markScopedControl(onlineTest);
      markScopedControl(document.getElementById('sendTestRequest'));
      document.getElementById('onlineTestTitle')?.appendChild(createScopeBadge());
      const statisticsModeLabel = document.getElementById('statisticsModeLabel');
      markScopedControl(statisticsModeLabel, '按天 / 按小时 V1不含');
      statisticsModeLabel?.setAttribute('title', '按天和按小时统计（V1 暂不包含，仅作后续版本方案预览）');
    }
    if (fileName === 'sys_infrastructure_mgmt.html') {
      markScopedMetric(document.getElementById('statGpu')?.closest('article'), '加速卡容量');
      markScopedMetric(document.getElementById('gpuUtilizationHeader'), 'GPU 利用率');
    }
    if (fileName === 'sys_node_detail.html') {
      markScopedMetric(document.getElementById('nodeGpuUtilization'), 'GPU 利用率');
    }
    if (fileName === 'sys_dispatch.html') {
      markScopedMetric(document.getElementById('requestTitle'), '请求数趋势');
    }
  }

  function normalizeLegacyHeader() {
    if (document.querySelector('h1')) return;
    const header = Array.from(document.querySelectorAll('header')).find(candidate =>
      !candidate.closest('.modal, .dialog, [role="dialog"]') &&
      !candidate.classList.contains('global-header') &&
      candidate.querySelector('h2')
    );
    if (!header) return;
    header.className = 'yl-v4-legacy-page-header';
    const oldTitle = header.querySelector('h2');
    const title = document.createElement('h1');
    title.innerHTML = oldTitle.innerHTML;
    title.className = oldTitle.className;
    title.removeAttribute('style');
    const titleCopy = document.createElement('div');
    titleCopy.className = 'yl-v4-title-copy';
    titleCopy.appendChild(title);
    const description = document.createElement('p');
    description.className = 'yl-v4-page-description';
    description.textContent = descriptions[fileName] || '查看并管理当前页面的业务信息。';
    titleCopy.appendChild(description);
    oldTitle.replaceWith(titleCopy);
  }

  const legacyIconMap = {
    'fa-chart-pie': 'dashboard', 'fa-sliders-h': 'sliders', 'fa-tasks': 'list',
    'fa-box': 'box', 'fa-cube': 'cube', 'fa-brain': 'brain', 'fa-server': 'server',
    'fa-chart-line': 'activity', 'fa-file-circle-plus': 'file', 'fa-user-check': 'usercheck',
    'fa-network-wired': 'network', 'fa-search': 'search', 'fa-plus': 'plus',
    'fa-download': 'download', 'fa-check-circle': 'check', 'fa-exclamation-triangle': 'alert',
    'fa-info-circle': 'info', 'fa-lock': 'lock', 'fa-layer-group': 'layers',
    'fa-flask': 'flask', 'fa-file-upload': 'upload', 'fa-save': 'save', 'fa-times': 'x',
    'fa-share-alt': 'share', 'fa-crown': 'crown', 'fa-align-left': 'align',
    'fa-arrow-left': 'arrowleft', 'fa-stream': 'stream', 'fa-chevron-right': 'chevronleft'
  };

  function replaceLegacyIcons() {
    document.querySelectorAll('i[class*="fa-"]').forEach(oldIcon => {
      const key = Object.keys(legacyIconMap).find(className => oldIcon.classList.contains(className));
      if (!key) return;
      const holder = document.createElement('span');
      holder.innerHTML = icon(legacyIconMap[key], 'yl-v4-inline-icon');
      const svg = holder.firstElementChild;
      const labelled = oldIcon.getAttribute('aria-label');
      if (labelled) svg.setAttribute('aria-label', labelled);
      oldIcon.replaceWith(svg);
    });
  }

  function markDecisionActions() {
    document.querySelectorAll('button, a').forEach(control => {
      const text = control.textContent.replace(/\s+/g, ' ').trim();
      if (/^(提交申请|立即申请|资源测算|申请资源)$/.test(text)) control.classList.add('yl-v4-decision');
    });
  }

  function showShellToast(message) {
    document.querySelector('.yl-v4-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'yl-v4-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = icon('info', 'yl-v4-icon-sm') + '<span>' + message + '</span>';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  function initializeShell() {
    if (document.body.classList.contains('modal-preview')) {
      replaceLegacyIcons();
      return;
    }

    document.body.classList.add('yl-v4-shell');
    document.querySelectorAll('aside.sidebar, aside[data-yl-sidebar]').forEach(oldSidebar => oldSidebar.remove());
    document.querySelectorAll('.global-header, .yl-global-topbar, .breadcrumb-bar, nav[aria-label="面包屑"]').forEach(node => node.remove());
    normalizeLegacyHeader();

    const sidebar = createSidebar();
    document.body.prepend(sidebar);
    const collapseButton = sidebar.querySelector('.yl-v4-collapse');
    const releaseButton = sidebar.querySelector('.yl-v4-release-button');
    const userButton = sidebar.querySelector('.yl-v4-user-button');
    const userMenu = sidebar.querySelector('.yl-v4-user-menu');
    const releaseBackdrop = createReleaseDialog();
    const releaseDialog = releaseBackdrop.querySelector('.yl-v4-release-dialog');
    const releaseClose = releaseBackdrop.querySelector('.yl-v4-release-close');
    const releaseConfirm = releaseBackdrop.querySelector('.yl-v4-release-confirm');
    let releaseTrigger = null;

    function closeReleaseDialog() {
      releaseBackdrop.hidden = true;
      document.body.classList.remove('yl-v4-modal-open');
      releaseTrigger?.focus();
    }

    releaseButton.addEventListener('click', () => {
      releaseTrigger = releaseButton;
      releaseBackdrop.hidden = false;
      document.body.classList.add('yl-v4-modal-open');
      releaseClose.focus();
    });
    releaseClose.addEventListener('click', closeReleaseDialog);
    releaseConfirm.addEventListener('click', closeReleaseDialog);
    releaseBackdrop.addEventListener('click', event => { if (event.target === releaseBackdrop) closeReleaseDialog(); });

    if (localStorage.getItem('yl-v4-sidebar-collapsed') === 'true') {
      document.body.classList.add('yl-v4-sidebar-is-collapsed');
      collapseButton.setAttribute('aria-expanded', 'false');
      collapseButton.setAttribute('aria-label', '展开侧栏');
    }

    collapseButton.addEventListener('click', () => {
      const collapsed = document.body.classList.toggle('yl-v4-sidebar-is-collapsed');
      collapseButton.setAttribute('aria-expanded', String(!collapsed));
      collapseButton.setAttribute('aria-label', collapsed ? '展开侧栏' : '折叠侧栏');
      localStorage.setItem('yl-v4-sidebar-collapsed', String(collapsed));
    });

    userButton.addEventListener('click', () => {
      const open = userMenu.hidden;
      userMenu.hidden = !open;
      userButton.setAttribute('aria-expanded', String(open));
      if (open) userMenu.querySelector('button').focus();
    });

    sidebar.querySelectorAll('[data-v4-user-action]').forEach(button => {
      button.addEventListener('click', () => {
        userMenu.hidden = true;
        userButton.setAttribute('aria-expanded', 'false');
        showShellToast(button.dataset.v4UserAction + '为原型演示入口');
      });
    });

    document.addEventListener('click', event => {
      if (!sidebar.querySelector('.yl-v4-sidebar-footer').contains(event.target)) {
        userMenu.hidden = true;
        userButton.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !releaseBackdrop.hidden) {
        closeReleaseDialog();
        return;
      }
      if (event.key === 'Escape' && !userMenu.hidden) {
        userMenu.hidden = true;
        userButton.setAttribute('aria-expanded', 'false');
        userButton.focus();
      }
    });

    replaceLegacyIcons();
    markDecisionActions();
    annotateV1Scope();
  }

  initializeShell();
})();
