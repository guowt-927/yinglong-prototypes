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
    'sys_cluster_list.html': '查看集群运行状态、节点规模与资源利用率。',
    'sys_model_deploy.html': '配置模型版本、运行资源与服务访问参数。',
    'sys_node_mgmt.html': '维护集群节点、运行状态与资源分配。',
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
    chevronleft: '<path d="m15 18-6-6 6-6"/>',
    chevrondown: '<path d="m6 9 6 6 6-6"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
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
    'sys_task_detail.html': 'tasks',
    'task_config_modal.html': 'tasks',
    'sys_model_repo.html': 'repo',
    'sys_model_version_detail.html': 'repo',
    'sys_model_service.html': 'service',
    'sys_model_deploy.html': 'service',
    'sys_model_training.html': 'training',
    'sys_model_training_detail.html': 'training',
    'sys_training_records.html': 'training',
    'sys_model_monitor.html': 'monitor',
    'sys_resource_application.html': 'application',
    'sys_resource_approval.html': 'approval',
    'sys_infrastructure_mgmt.html': 'infrastructure',
    'sys_cluster_list.html': 'infrastructure',
    'sys_node_mgmt.html': 'infrastructure',
    'sys_node_detail.html': 'infrastructure',
    'sys_request_tracing.html': 'tracing'
  };

  const activeKey = activeByFile[fileName] || '';
  const pageHref = name => inPrototypes ? name : 'prototypes/' + name;
  const navGroups = [
    ['工作台', [['dashboard', 'dashboard', '系统概览', paths.dashboard]]],
    ['算力调度', [
      ['dispatch', 'sliders', '算力调度', pageHref('sys_dispatch.html')],
      ['tasks', 'list', '我的任务', pageHref('sys_task_list.html')]
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
        return '<a class="yl-v4-nav-item' + (active ? ' active' : '') + '" href="' + href + '" title="' + label + '"' + (active ? ' aria-current="page"' : '') + '>' + icon(iconName) + '<span>' + label + '</span></a>';
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
        '<button class="yl-v4-user-button" type="button" aria-haspopup="menu" aria-expanded="false">' +
          '<span class="yl-v4-avatar" aria-hidden="true">管</span>' +
          '<span class="yl-v4-user-copy"><span class="yl-v4-user-name">资源管理员</span><span class="yl-v4-user-role">System Admin</span></span>' +
          icon('chevrondown', 'yl-v4-icon-sm') +
        '</button>' +
        '<div class="yl-v4-user-menu" role="menu" hidden>' +
          '<button type="button" role="menuitem" data-v4-user-action="个人信息">' + icon('user', 'yl-v4-icon-sm') + '个人信息</button>' +
          '<button type="button" role="menuitem" data-v4-user-action="账号设置">' + icon('settings', 'yl-v4-icon-sm') + '账号设置</button>' +
          '<button type="button" role="menuitem" data-v4-user-action="退出登录">' + icon('logout', 'yl-v4-icon-sm') + '退出登录</button>' +
        '</div>' +
      '</div>';
    return aside;
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
    const userButton = sidebar.querySelector('.yl-v4-user-button');
    const userMenu = sidebar.querySelector('.yl-v4-user-menu');

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
      if (event.key === 'Escape' && !userMenu.hidden) {
        userMenu.hidden = true;
        userButton.setAttribute('aria-expanded', 'false');
        userButton.focus();
      }
    });

    replaceLegacyIcons();
    markDecisionActions();
  }

  initializeShell();
})();
