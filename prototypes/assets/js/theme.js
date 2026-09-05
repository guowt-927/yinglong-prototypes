(function () {
  const STORAGE_KEY = 'yl-theme';
  const root = document.documentElement;

  function readTheme() {
    try { return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'; }
    catch (error) { return 'light'; }
  }

  function applyTheme(theme, persist) {
    const dark = theme === 'dark';
    root.classList.toggle('dark', dark);
    root.dataset.theme = dark ? 'dark' : 'light';
    root.style.colorScheme = dark ? 'dark' : 'light';
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); }
      catch (error) { /* Storage may be disabled in local previews. */ }
    }
    document.querySelectorAll('[data-yl-theme-option]').forEach(button => {
      const selected = button.dataset.ylThemeOption === (dark ? 'dark' : 'light');
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    window.dispatchEvent(new CustomEvent('yl:theme-change', { detail: { theme: dark ? 'dark' : 'light' } }));
  }

  function icon(type) {
    return type === 'light'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
  }

  function createSwitcher() {
    const group = document.createElement('div');
    group.className = 'yl-theme-switcher';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', '切换页面主题');
    group.innerHTML = ['light', 'dark'].map(theme => {
      const label = theme === 'light' ? '浅色' : '深色';
      return `<button type="button" data-yl-theme-option="${theme}" aria-label="切换为${label}模式" title="${label}模式">${icon(theme)}<span>${label}</span></button>`;
    }).join('');
    group.addEventListener('click', event => {
      const button = event.target.closest('[data-yl-theme-option]');
      if (button) applyTheme(button.dataset.ylThemeOption, true);
    });
    return group;
  }

  function mountSwitcher() {
    if (document.querySelector('.yl-theme-switcher')) return true;
    const switcher = createSwitcher();
    const header = document.querySelector('.global-header, .yl-global-topbar');
    if (header) {
      const profile = header.querySelector('.user-profile, .header-profile, .yl-global-user');
      if (profile) {
        let tools = profile.parentElement.querySelector(':scope > .yl-header-tools');
        if (!tools) {
          tools = document.createElement('div');
          tools.className = 'yl-header-tools';
          profile.before(tools);
          tools.append(profile);
        }
        tools.insertBefore(switcher, tools.firstChild);
      } else header.appendChild(switcher);
    } else {
      const legacyHeader = document.querySelector('.ops-content-shell > header, body > .flex > .flex-1 > header');
      if (legacyHeader) legacyHeader.appendChild(switcher);
      else {
        switcher.classList.add('yl-theme-switcher-floating');
        document.body.appendChild(switcher);
      }
    }
    applyTheme(readTheme(), false);
    return true;
  }

  applyTheme(readTheme(), false);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountSwitcher, { once: true });
  else mountSwitcher();

  const observer = new MutationObserver(() => {
    if (!document.querySelector('.yl-theme-switcher')) mountSwitcher();
  });
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
})();
