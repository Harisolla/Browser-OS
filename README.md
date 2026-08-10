# Browser OS

Browser OS is a desktop-style web application that runs entirely in the browser. It provides a familiar desktop, Start menu, taskbar, resizable windows, and a small collection of built-in apps.

## Features

- Desktop workspace with a live clock and app shortcuts
- Start menu with app search
- Draggable, focusable, minimizable, maximizable, and closable app windows
- Terminal, Notes, Paint, Calculator, Settings, and Dragon Repeller game apps
- Dark and light themes, selectable accent colors, and wallpaper presets
- Custom wallpaper support through an image upload or URL
- Settings and app data persisted in browser `localStorage`

## Built with

- HTML
- CSS
- Vanilla JavaScript
- [Font Awesome](https://fontawesome.com/) for interface icons

## Run locally

No build step or package installation is needed.

1. Clone the repository.
2. Open `index.html` in a modern web browser.

For the best local-development experience, serve the folder with any static file server and visit the address it provides.

## Project structure

```text
.
├── index.html              # Desktop and Start menu markup
├── style.css               # Application styling
└── js
    ├── app.js              # App launchers, Start menu, and clock
    ├── windowManager.js    # Desktop window behavior
    └── apps                # Individual application modules
```

## Link - https://harisolla.github.io/Browser-OS/
## License

No license has been specified for this project.
