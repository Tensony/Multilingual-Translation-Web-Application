# LinguaSwap – Multilingual Translation Web App

A responsive, full-stack translation web application built for the Full Stack Development Assignment (March 2026). It allows users to translate text between languages in real time using the MyMemory API, with Text-to-Speech, copy functionality, and dark/light mode support.

---

## File Structure

```
translator/
├── index.html    # HTML structure — layout, dropdowns, panels, buttons
├── style.css     # All styles — CSS variables, dark/light mode, animations
├── script.js     # All logic — API calls, debounce, TTS, copy, theme toggle
└── README.md
```

---

## Setup Instructions

No build tools, no dependencies, no server required.

1. Clone or download the repository
2. Make sure all three files (`index.html`, `style.css`, `script.js`) are in the **same folder**
3. Open `index.html` in any modern browser

```bash
git clone <your-repo-url>
cd translator
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

> You can also just double-click `index.html` in your file explorer.

---

## Features

### Core (Required)
- **Auto-translate on load** — translates *"Hello, how are you"* from English to French automatically when the page opens
- **Custom text input** — textarea with a 500-character limit
- **Live character counter** — shows `X/500`, turns red when approaching the limit
- **Translate button** — manually triggers translation
- **Source language dropdown** — includes Detect Language, English, French, and 11 more
- **Target language dropdown** — 13 language options
- **Switch languages button** — swaps source/target languages and their text with one click
- **Text-to-Speech (TTS)** — Listen buttons on both Input and Output panels using the Web Speech API
- **Copy to clipboard** — Copy buttons on both panels using the Clipboard API

### Bonus (Optional — All Implemented)
- **Real-time translation** — debounced at 700 ms as you type (no button click needed)
- **Loading indicator** — spinner inside the Translate button during API calls
- **Error handling** — toast notifications appear for network errors or failed translations
- **Responsive design** — single-column layout on screens under 580 px
- **Dark mode (default) + Light mode** — toggle button in the top-right corner

---

## API

**MyMemory Free Translation API** — no API key required.

```
GET https://api.mymemory.translated.net/get?q={text}&langpair={src|tgt}
```

Example request used in `script.js`:

```javascript
const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(langpair)}`;
const response = await fetch(url);
const data = await response.json();
// data.responseData.translatedText contains the result
```

Supports `autodetect` as the source language when *Detect Language* is selected.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, CSS variables, animations, responsive grid |
| Vanilla JavaScript (ES6+) | API calls, DOM manipulation, all app logic |
| Google Fonts (Sora + DM Mono) | Typography |
| MyMemory API | Translation |
| Web Speech API | Text-to-Speech (Listen buttons) |
| Clipboard API | Copy to clipboard |

---

## How Each File Works

### `index.html`
Contains only the HTML structure — no inline styles or scripts. Links to `style.css` in the `<head>` and `script.js` at the bottom of `<body>`.

### `style.css`
- CSS custom properties (variables) for the full colour theme
- Dark mode default with `.light` class override for light mode
- Layout: flexbox top bar/header, CSS Grid for the two panels
- Component styles: dropdowns, switch button, panels, icon buttons, translate button, toast, spinner
- Keyframe animations: `fadeDown`, `fadeUp`, `spin`
- Media query: single-column panels on screens ≤ 580 px

### `script.js`
- **`translate()`** — builds the API URL, calls MyMemory, updates the output panel, handles errors
- **`scheduleDebounce()`** — waits 700 ms after the last keystroke before calling `translate()`
- **`updateCount()`** — updates the character counter and warns when over 450 characters
- **`switchLanguages()`** — swaps dropdown values and panel text, then re-translates
- **`speak(text, lang)`** — uses `SpeechSynthesisUtterance` to read text aloud
- **`copyText(text, btn)`** — writes text to the clipboard and shows a success toast
- **`showToast(message, type)`** — displays a temporary notification (success / error / neutral)
- **`toggleTheme()`** — toggles the `.light` class on `<body>`
- **`load` event** — runs `updateCount()` and `translate()` automatically on page load

---

## Evaluation Criteria Coverage

| Criterion | Weight | How It's Met |
|---|---|---|
| Interface implementation | 20% | Matches the design mockup; two-panel layout, language bar, translate button |
| API integration | 25% | MyMemory API via `fetch`, with `encodeURIComponent`, error handling, and autodetect support |
| Application functionality | 25% | All required features implemented; switch, TTS, copy, char limit, default translation |
| Code structure & readability | 15% | Separated into `index.html`, `style.css`, `script.js`; each function has a single responsibility with comments |
| User experience features | 15% | Debounce, loading spinner, toast notifications, dark/light mode, responsive layout |
