

let debounceTimer = null;

/* ── DOM References ──────────────────────────────────────── */
const inputText    = document.getElementById('inputText');
const outputEl     = document.getElementById('outputText');
const charCount    = document.getElementById('charCount');
const translateBtn = document.getElementById('translateBtn');
const switchBtn    = document.getElementById('switchBtn');
const sourceLang   = document.getElementById('sourceLang');
const targetLang   = document.getElementById('targetLang');
const toast        = document.getElementById('toast');
const themeToggle  = document.getElementById('themeToggle');

/* ── Character Counter ───────────────────────────────────── */
function updateCount() {
  const len = inputText.value.length;
  charCount.textContent = `${len}/500`;
  charCount.classList.toggle('warn', len > 450);
}

/* ── Debounced Real-Time Translation ─────────────────────── */
function scheduleDebounce() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (inputText.value.trim()) {
      translate();
    }
  }, 700); // 700 ms debounce delay
}

/* ── Translation API ─────────────────────────────────────── */
async function translate() {
  const q = inputText.value.trim();

  // Clear output if no input
  if (!q) {
    outputEl.textContent = '';
    outputEl.classList.add('placeholder-text');
    return;
  }

  // Build langpair for MyMemory API
  const src      = sourceLang.value === 'auto' ? 'autodetect' : sourceLang.value;
  const tgt      = targetLang.value;
  const langpair = src === 'autodetect' ? `autodetect|${tgt}` : `${src}|${tgt}`;

  // Show loading state
  translateBtn.classList.add('loading');
  translateBtn.disabled = true;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(langpair)}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Network error – please check your connection.');

    const data = await response.json();

    if (data.responseStatus === 200) {
      outputEl.textContent = data.responseData.translatedText;
      outputEl.classList.remove('placeholder-text');
    } else {
      throw new Error(data.responseDetails || 'Translation failed.');
    }
  } catch (err) {
    showToast('⚠ ' + err.message, 'error');
  } finally {
    // Always restore button state
    translateBtn.classList.remove('loading');
    translateBtn.disabled = false;
  }
}

/* ── Switch Languages ────────────────────────────────────── */
function switchLanguages() {
  const sourceVal = sourceLang.value;
  const targetVal = targetLang.value;

  // Cannot switch when source is set to "Detect Language"
  if (sourceVal === 'auto') {
    showToast('Set a specific source language to switch.', '');
    return;
  }

  // Swap dropdown values
  sourceLang.value = targetVal;
  targetLang.value = sourceVal;

  // Swap textarea / output text
  const prevOutput = outputEl.textContent.trim();
  if (prevOutput && !outputEl.classList.contains('placeholder-text')) {
    inputText.value = prevOutput;
    outputEl.textContent = '';
    outputEl.classList.add('placeholder-text');
    updateCount();
  }

  // Animate the switch button
  switchBtn.classList.add('spin');
  setTimeout(() => switchBtn.classList.remove('spin'), 400);

  // Re-translate with swapped pair
  translate();
}

/* ── Text-to-Speech (TTS) ────────────────────────────────── */
function speak(text, lang) {
  if (!window.speechSynthesis) {
    showToast('Text-to-Speech is not supported in this browser.', 'error');
    return;
  }
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  const utterance  = new SpeechSynthesisUtterance(text);
  utterance.lang   = lang === 'auto' ? 'en' : lang;
  window.speechSynthesis.speak(utterance);
}

/* ── Copy to Clipboard ───────────────────────────────────── */
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    showToast('Copied!', 'success');
    setTimeout(() => btn.classList.remove('copied'), 1500);
  } catch {
    showToast('Copy failed – clipboard access denied.', 'error');
  }
}

/* ── Toast Notification ──────────────────────────────────── */
let toastTimer;
function showToast(message, type) {
  toast.textContent = message;
  toast.className   = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2500);
}

/* ── Theme Toggle (Dark / Light) ─────────────────────────── */
let isLight = false;
function toggleTheme() {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  themeToggle.textContent = isLight ? '🌙 Dark' : '☀ Light';
}

/* ── Event Listeners ─────────────────────────────────────── */

// Live character count + debounced translation
inputText.addEventListener('input', () => {
  updateCount();
  scheduleDebounce();
});

// Manual translate button
translateBtn.addEventListener('click', translate);

// Switch languages button
switchBtn.addEventListener('click', switchLanguages);

// Listen buttons
document.getElementById('listenInput').addEventListener('click', () => {
  speak(inputText.value, sourceLang.value);
});
document.getElementById('listenOutput').addEventListener('click', () => {
  const txt = outputEl.textContent.trim();
  if (txt) speak(txt, targetLang.value);
});

// Copy buttons
document.getElementById('copyInput').addEventListener('click', function () {
  copyText(inputText.value, this);
});
document.getElementById('copyOutput').addEventListener('click', function () {
  copyText(outputEl.textContent.trim(), this);
});

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

/* ── Init: translate default text on page load ───────────── */
window.addEventListener('load', () => {
  updateCount();
  translate();
});
