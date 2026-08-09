// ==========================================================================
// APP 3 — SYSTEM SETTINGS & WALLPAPERS
// ==========================================================================

const STORAGE_KEY_SETTINGS = 'webos_settings';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  accent: '#89b4fa',
  accentHover: '#b4befe',
  wallpaper: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
};

/**
 * Loads and applies saved settings on OS startup.
 */
function loadAppliedSettings() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS)) || DEFAULT_SETTINGS;
  applySettings(saved);
  return saved;
}

/**
 * Updates DOM root variables with settings values.
 */
function applySettings(settings) {
  // Theme Mode
  if (settings.theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Accent Colors
  document.documentElement.style.setProperty('--accent-color', settings.accent);
  document.documentElement.style.setProperty('--accent-hover', settings.accentHover);

  // Desktop Wallpaper
  const desktop = document.getElementById('desktop');
  if (desktop) {
    desktop.style.background = settings.wallpaper;
    desktop.style.backgroundSize = 'cover';
    desktop.style.backgroundPosition = 'center';
  }
}

/**
 * Returns the HTML structure for the Settings window body.
 */
function getSettingsHTML() {
  const settings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS)) || DEFAULT_SETTINGS;

  return `
    <div class="settings-container">
      <h3>⚙️ Personalization</h3>
      
      <!-- Theme Selection -->
      <div class="settings-section">
        <label class="settings-label">Color Mode</label>
        <div class="settings-options">
          <button class="settings-option-btn ${settings.theme === 'dark' ? 'active' : ''}" id="set-theme-dark">🌙 Dark Mode</button>
          <button class="settings-option-btn ${settings.theme === 'light' ? 'active' : ''}" id="set-theme-light">☀️ Light Mode</button>
        </div>
      </div>

      <!-- Accent Color Selection -->
      <div class="settings-section">
        <label class="settings-label">Accent Color</label>
        <div class="color-swatches">
          <div class="swatch ${settings.accent === '#89b4fa' ? 'selected' : ''}" data-accent="#89b4fa" data-hover="#b4befe" style="background:#89b4fa;" title="Blue"></div>
          <div class="swatch ${settings.accent === '#a6e3a1' ? 'selected' : ''}" data-accent="#a6e3a1" data-hover="#94e2d5" style="background:#a6e3a1;" title="Emerald"></div>
          <div class="swatch ${settings.accent === '#f9e2af' ? 'selected' : ''}" data-accent="#f9e2af" data-hover="#f5e0dc" style="background:#f9e2af;" title="Gold"></div>
          <div class="swatch ${settings.accent === '#cba6f7' ? 'selected' : ''}" data-accent="#cba6f7" data-hover="#f5c2e7" style="background:#cba6f7;" title="Violet"></div>
          <div class="swatch ${settings.accent === '#f38ba8' ? 'selected' : ''}" data-accent="#f38ba8" data-hover="#f2cdcd" style="background:#f38ba8;" title="Coral"></div>
        </div>
      </div>

      <!-- Wallpaper Selection & Local Upload -->
      <div class="settings-section">
        <label class="settings-label">Desktop Wallpaper</label>
        
        <!-- Local Computer File Upload -->
        <div class="upload-wp-box">
          <label for="local-wp-file" class="notes-btn upload-label">📁 Upload Image from PC</label>
          <input type="file" id="local-wp-file" accept="image/*" style="display: none;" />
          <span id="wp-file-name" class="save-status">No file chosen</span>
        </div>

        <div class="wallpaper-presets">
          <div class="wp-card" data-wp="linear-gradient(135deg, #0f0c29, #302b63, #24243e)" style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);">Cosmic</div>
          <div class="wp-card" data-wp="linear-gradient(135deg, #232526, #414345)" style="background: linear-gradient(135deg, #232526, #414345);">Charcoal</div>
          <div class="wp-card" data-wp="linear-gradient(135deg, #11998e, #38ef7d)" style="background: linear-gradient(135deg, #11998e, #38ef7d);">Aurora</div>
          <div class="wp-card" data-wp="linear-gradient(135deg, #8a2387, #e94057, #f27121)" style="background: linear-gradient(135deg, #8a2387, #e94057, #f27121);">Sunset</div>
        </div>

        <div class="custom-wp-row">
          <input type="text" id="custom-wp-input" class="settings-input" placeholder="Or paste image URL (e.g. https://...)" />
          <button id="apply-custom-wp" class="notes-btn">Apply URL</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initializes event handlers for Settings UI interactions.
 */
function initSettingsApp(winElement) {
  let currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS)) || DEFAULT_SETTINGS;

  const saveAndUpdate = (newSettings) => {
    currentSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
    applySettings(currentSettings);
  };

  // Theme Toggles
  const btnDark = winElement.querySelector('#set-theme-dark');
  const btnLight = winElement.querySelector('#set-theme-light');

  btnDark.addEventListener('click', () => {
    btnDark.classList.add('active');
    btnLight.classList.remove('active');
    saveAndUpdate({ theme: 'dark' });
  });

  btnLight.addEventListener('click', () => {
    btnLight.classList.add('active');
    btnDark.classList.remove('active');
    saveAndUpdate({ theme: 'light' });
  });

  // Accent Swatches
  winElement.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      winElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      saveAndUpdate({
        accent: swatch.dataset.accent,
        accentHover: swatch.dataset.hover
      });
    });
  });

  const fileInput = winElement.querySelector('#local-wp-file');
  const fileNameDisplay = winElement.querySelector('#wp-file-name');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileNameDisplay.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(event) {
      const base64Image = event.target.result;
      saveAndUpdate({ wallpaper: `url("${base64Image}")` });
    };

    reader.readAsDataURL(file); // Converts image file to base64 Data URL
  });
  
  // Wallpaper Presets
  winElement.querySelectorAll('.wp-card').forEach(card => {
    card.addEventListener('click', () => {
      saveAndUpdate({ wallpaper: card.dataset.wp });
    });
  });

  // Custom Image URL Wallpaper
  const customInput = winElement.querySelector('#custom-wp-input');
  const applyBtn = winElement.querySelector('#apply-custom-wp');

  applyBtn.addEventListener('click', () => {
    const url = customInput.value.trim();
    if (url) {
      saveAndUpdate({ wallpaper: `url("${url}")` });
    }
  });
}