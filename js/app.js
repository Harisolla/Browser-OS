document.addEventListener("DOMContentLoaded", () => {
  initClock();
  loadAppliedSettings();
  initDesktopIcons();
  initStartMenu();
});

function initDesktopIcons() {
  const icons = document.querySelectorAll(".app-icon");

  icons.forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      const appId = icon.dataset.app;
      const label = icon.querySelector(".label").textContent;
      const iconEmoji = icon.querySelector(".icon").textContent;

      if (appId === "terminal") {
        const win = createWindow(appId, label, getTerminalHTML(), iconEmoji);
        initTerminalApp(win);
      } else if (appId === "notes") {
        const win = createWindow(appId, label, getNotesHTML(), iconEmoji);
        initNotesApp(win);
      } else if (appId === "settings") {
        const win = createWindow(appId, label, getSettingsHTML(), iconEmoji);
        initSettingsApp(win);
      } else if (appId === "paint") {
        const win = createWindow(appId, label, getPaintHTML(), iconEmoji);
        initPaintApp(win);
      } else if (appId === "calculator") {
        // <-- MAKE SURE THIS BLOCK IS HERE
        const win = createWindow(appId, label, getCalculatorHTML(), iconEmoji);
        initCalculatorApp(win);
      } else if (appId === "rpg") {
        const iconHTML = icon.querySelector(".icon").innerHTML;
        const win = createWindow(appId, label, getRpgHTML(), iconHTML);
        initRpgApp(win);
      }
    });
  });
}

function initStartMenu() {
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");
  const startSearch = document.getElementById("start-search");
  const appItems = document.querySelectorAll(".start-app-item");

  if (!startBtn || !startMenu) return;

  // Toggle Start Menu
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("hidden");
    if (!startMenu.classList.contains("hidden")) {
      startSearch.focus();
    }
  });

  // Close Start Menu when clicking desktop or pressing Escape
  document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      startMenu.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      startMenu.classList.add("hidden");
    }
  });

  // Filter apps in Start Menu
  startSearch.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    appItems.forEach((item) => {
      const name = item.querySelector(".name").textContent.toLowerCase();
      item.style.display = name.includes(query) ? "flex" : "none";
    });
  });

  // Launch apps from Start Menu items
  appItems.forEach((item) => {
    item.addEventListener("click", () => {
      const appId = item.dataset.app;
      const desktopIcon = document.querySelector(
        `.app-icon[data-app="${appId}"]`,
      );
      if (desktopIcon) {
        desktopIcon.dispatchEvent(new Event("dblclick"));
      }
      startMenu.classList.add("hidden");
    });
  });
}

function initClock() {
  const timeElement = document.getElementById("clock-time");
  const dateElement = document.getElementById("clock-date");

  const widgetGreeting = document.getElementById("widget-greeting");
  const widgetHours = document.getElementById("widget-hours");
  const widgetMinutes = document.getElementById("widget-minutes");
  const widgetAmPm = document.getElementById("widget-ampm");
  const widgetDay = document.getElementById("widget-day");
  const widgetDate = document.getElementById("widget-date");
  const widgetProgressBar = document.getElementById("widget-progress-bar");

  function updateTimeandDate() {
    const now = new Date();
    const hours = now.getHours();
    const seconds = now.getSeconds();

    if (timeElement && dateElement) {
      timeElement.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();

      dateElement.textContent = `${day}-${month}-${year}`;
    }

    if (widgetHours) {
      // Dynamic Greeting
      let greeting = "Good Evening";
      if (hours < 12) greeting = "Good Morning";
      else if (hours < 17) greeting = "Good Afternoon";
      widgetGreeting.textContent = greeting;

      // Hours & Minutes
      let displayHours = hours % 12 || 12;
      widgetHours.textContent = displayHours.toString().padStart(2, "0");
      widgetMinutes.textContent = now.getMinutes().toString().padStart(2, "0");
      widgetAmPm.textContent = hours >= 12 ? "PM" : "AM";

      // Live Minute Progress Fill (0% to 100% based on current seconds)
      const progressPercent = (seconds / 60) * 100;
      widgetProgressBar.style.width = `${progressPercent}%`;

      // Date & Day
      widgetDay.textContent = now.toLocaleDateString([], { weekday: "long" });
      widgetDate.textContent = now.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  updateTimeandDate();
  setInterval(updateTimeandDate, 1000);
}
