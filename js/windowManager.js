let topZIndex = 100;
const openWindows = new Map();

function createWindow(appId, title, contentHTML,icon = '💻') {
    if(openWindows.has(appId)){
        const existingWin = openWindows.get(appId);
       if (existingWin.classList.contains("minimized")) {
         toggleMinimize(appId);
       } else {
         focusWindow(existingWin);
       }
        return existingWin;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.id = `win-${appId}`;

    if (appId === 'calculator') {
        win.style.width = '340px';
        win.style.height = '480px';
    } else if (appId === 'rpg') {
        win.style.width = '540px';
        win.style.height = '440px';
    }else {
        win.style.width = '480px';
        win.style.height = '320px';
    }

    const cascadeOffset = (openWindows.size % 5) *24;
    win.style.top = `${80 + cascadeOffset}px`;
    win.style.left = `${120 + cascadeOffset}px`;

    win.innerHTML = `
        <div class="window-header">
      <div class="window-title"><span>${icon}</span> ${title}</div>
      <div class="window-controls">
        <button class="win-btn minimize" title="Minimize" onclick="toggleMinimize('${appId}')"></button>
        <button class="win-btn maximize" title="Maximize" onclick="toggleMaximize('${appId}')"></button>
        <button class="win-btn close" title="Close" onclick="closeWindow('${appId}')"></button>
      </div>
    </div>
    <div class="window-body">${contentHTML}</div>
    `;

    win.addEventListener('pointerdown',()=> focusWindow(win));

    makeWindowDraggable(win);

    document.getElementById('desktop').appendChild(win);
    openWindows.set(appId,win);
    
    addTaskbarBadge(appId, title, icon);

    focusWindow(win);
    return win;
}

function focusWindow(win){
    topZIndex++;
    win.style.zIndex = topZIndex;

    const appId = win.id.replace('win-', '');
    document.querySelectorAll(".app-badge").forEach((badge) => {
      badge.classList.toggle("active", badge.dataset.app === appId);
    });
}

function toggleMaximize(appId) {
  const win = openWindows.get(appId);
  if (win) {
    win.classList.toggle('maximized');

    if (!win.classList.contains('maximized')) {
      win.style.transform = '';
    }

    focusWindow(win);
  }
}

function toggleMinimize(appId) {
  const win = openWindows.get(appId);
  if (win) {
    const isMinimized = win.classList.toggle('minimized');
    const badge = document.querySelector(`.app-badge[data-app="${appId}"]`);

    if (isMinimized) {
      if (badge) badge.classList.remove('active');
    } else {
      focusWindow(win);
    }
  }
}

function closeWindow(appId){
    const win = openWindows.get(appId);
    if(win){
        win.remove();
        openWindows.delete(appId);
        removeTaskbarBadge(appId);
    }
}

function addTaskbarBadge(appId, title, icon) {
  const container = document.getElementById('running-apps');
  const badge = document.createElement('button');
  badge.className = 'app-badge active';
  badge.dataset.app = appId;
  badge.innerHTML = `<span>${icon}</span> ${title}`;

  // Clicking the taskbar badge toggles minimize / focus
  badge.addEventListener('click', () => {
    const win = openWindows.get(appId);
    if (!win) return;

    if (win.classList.contains('minimized')) {
      toggleMinimize(appId);
    } else if (parseInt(win.style.zIndex) === topZIndex) {
      // If already on top, minimize it
      toggleMinimize(appId);
    } else {
      // If behind other windows, bring to front
      focusWindow(win);
    }
  });

  container.appendChild(badge);
}

function removeTaskbarBadge(appId) {
  const badge = document.querySelector(`.app-badge[data-app="${appId}"]`);
  if (badge) badge.remove();
}

function makeWindowDraggable(win){
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let startX = 0, startY=0;
    let initialLeft=0, initialTop= 0;

    header.addEventListener('pointerdown',(e)=>{
        if (e.target.classList.contains('win-btn') || win.classList.contains('maximized')) return;

        isDragging = true;
        startX = e.clientX;
        startY= e.clientY;
        initialLeft = win.offsetLeft;
        initialTop = win.offsetTop;

        header.setPointerCapture(e.pointerId);
    });

    header.addEventListener("pointermove", (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      win.style.left = `${initialLeft + dx}px`;
      win.style.top = `${initialTop + dy}px`;
    });

    header.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      header.releasePointerCapture(e.pointerId);
    });
}