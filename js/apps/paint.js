function getPaintHTML() {
  return `
    <div class="paint-container">
      <div class="paint-toolbar">
        <label class="paint-tool-label">Color:</label>
        <input type="color" id="paint-color" value="#89b4fa" class="paint-color-picker" />
        
        <label class="paint-tool-label">Size:</label>
        <input type="range" id="paint-size" min="1" max="40" value="5" class="paint-slider" />
        <span id="paint-size-val">5px</span>

        <button id="paint-tool-brush" class="notes-btn active">✏️ Brush</button>
        <button id="paint-tool-eraser" class="notes-btn">🧹 Eraser</button>
        <button id="paint-clear" class="notes-btn danger">🗑️ Clear</button>
        <button id="paint-export" class="notes-btn">💾 Save PNG</button>
      </div>

      <div class="canvas-wrapper">
        <canvas id="paint-canvas"></canvas>
      </div>
    </div>
  `;
}

function initPaintApp(winElement) {
  const canvas = winElement.querySelector('#paint-canvas');
  const container = winElement.querySelector('.canvas-wrapper');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');

  /**
   * Resizes the internal canvas resolution to match its CSS container
   * while preserving existing artwork.
   */
  function resizeCanvas() {
    if (container.clientWidth === 0 || container.clientHeight === 0) return;

    // 1. Save current drawing into memory before canvas buffer resets
    let tempCanvas = null;
    if (canvas.width > 0 && canvas.height > 0) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);
    }

    // 2. Update actual internal resolution to match container size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // 3. Re-apply essential canvas context stroke settings
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill background white
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 4. Restore preserved artwork
    if (tempCanvas) {
      ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  // Initial resize setup
  resizeCanvas();

  // Watch for window maximize, minimize, or drag-resizing
  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(container);

  let isDrawing = false;
  let currentTool = 'brush'; // 'brush' or 'eraser'
  let currentColor = '#89b4fa';
  let currentSize = 5;

  // UI Controls Elements
  const colorPicker = winElement.querySelector('#paint-color');
  const sizeSlider = winElement.querySelector('#paint-size');
  const sizeValueDisplay = winElement.querySelector('#paint-size-val');
  const btnBrush = winElement.querySelector('#paint-tool-brush');
  const btnEraser = winElement.querySelector('#paint-tool-eraser');
  const btnClear = winElement.querySelector('#paint-clear');
  const btnExport = winElement.querySelector('#paint-export');

  // Controls Event Listeners
  colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (currentTool === 'eraser') setTool('brush');
  });

  sizeSlider.addEventListener('input', (e) => {
    currentSize = e.target.value;
    sizeValueDisplay.textContent = `${currentSize}px`;
  });

  function setTool(tool) {
    currentTool = tool;
    btnBrush.classList.toggle('active', tool === 'brush');
    btnEraser.classList.toggle('active', tool === 'eraser');
  }

  btnBrush.addEventListener('click', () => setTool('brush'));
  btnEraser.addEventListener('click', () => setTool('eraser'));

  btnClear.addEventListener('click', () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  btnExport.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `webos-drawing-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  });

  // Calculate coordinates relative to actual rendered canvas bounds
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    
    // Scale factors compensate for any CSS distortion
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    const coords = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    ctx.strokeStyle = (currentTool === 'eraser') ? '#ffffff' : currentColor;
    ctx.lineWidth = currentSize;
  }

  function draw(e) {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.closePath();
  }

  canvas.addEventListener('pointerdown', startDrawing);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointerleave', stopDrawing);
}