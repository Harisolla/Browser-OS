const STORAGE_KEY_NOTES = 'webos_saved_notes';

function getNotesHTML() {
  const savedText = localStorage.getItem(STORAGE_KEY_NOTES) || '';

  return `
    <div class="notes-container">
      <div class="notes-toolbar">
        <button id="notes-export-btn" class="notes-btn">📥 Export as .txt</button>
        <button id="notes-clear-btn" class="notes-btn danger">🗑️ Clear</button>
        <span id="notes-save-status" class="save-status">Saved</span>
      </div>
      <textarea id="notes-textarea" class="notes-textarea" placeholder="Start typing your notes here...">${escapeHTML(savedText)}</textarea>
      <div class="notes-statusbar">
        <span id="notes-word-count">0 words</span> | 
        <span id="notes-char-count">0 characters</span>
      </div>
    </div>
  `;
}

function initNotesApp(winElement) {
  const textarea = winElement.querySelector('#notes-textarea');
  const exportBtn = winElement.querySelector('#notes-export-btn');
  const clearBtn = winElement.querySelector('#notes-clear-btn');
  const saveStatus = winElement.querySelector('#notes-save-status');
  const wordCountEl = winElement.querySelector('#notes-word-count');
  const charCountEl = winElement.querySelector('#notes-char-count');

  if (!textarea) return;

  
  updateNotesMetrics(textarea.value, wordCountEl, charCountEl);

  // Input event: Auto-save and metric updates
  textarea.addEventListener('input', () => {
    const content = textarea.value;

    // Save to LocalStorage
    localStorage.setItem(STORAGE_KEY_NOTES, content);

    // Update UI status feedback
    saveStatus.textContent = 'Saving...';
    saveStatus.classList.add('saving');

    setTimeout(() => {
      saveStatus.textContent = 'Saved';
      saveStatus.classList.remove('saving');
    }, 400);

    // Update word & character counts
    updateNotesMetrics(content, wordCountEl, charCountEl);
  });

  // Export as .txt File
  exportBtn.addEventListener('click', () => {
    const textContent = textarea.value;
    if (!textContent.trim()) {
      alert('Note is empty! Type something before exporting.');
      return;
    }

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `webos-note-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();

    // Revoke object URL after download trigger to release memory
    URL.revokeObjectURL(url);
  });

  // Clear note
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your notes?')) {
      textarea.value = '';
      localStorage.removeItem(STORAGE_KEY_NOTES);
      updateNotesMetrics('', wordCountEl, charCountEl);
      saveStatus.textContent = 'Cleared';
    }
  });
}

function updateNotesMetrics(text, wordEl, charEl) {
  const charCount = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  charEl.textContent = `${charCount} characters`;
  wordEl.textContent = `${words} words`;
}