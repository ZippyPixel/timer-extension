# Focus Timer Extension

A minimalist, high-performance Chrome extension designed for deep work and productivity. This extension uses the Chrome Manifest V3 architecture to ensure your timer remains accurate even when the popup is closed or the browser is backgrounded.

## Features

- **Persistent Background Sessions**: Uses the `chrome.alarms` API to keep the countdown running regardless of popup state.
- **Dynamic UI**: The interface adapts to your workflow, hiding configuration settings while the timer is active to reduce distraction.
- **Customizable Duration**: Adjustable slider allows for focus sessions ranging from 1 to 60 minutes.
- **State Management**: Real-time synchronization between the background service worker and the popup interface using `chrome.storage`.
- **Manual Controls**: Quick access to Start, Pause, Resume, and Reset functions.

## Technical Overview

The project is built using standard web technologies and Chrome-specific APIs:

- **Logic**: JavaScript (ES6+)
- **Persistence**: `chrome.storage.local`
- **Timing**: `chrome.alarms` (Service Worker)
- **Manifest**: Version 3 (MV3)

## Installation

Since this extension is in development, you can load it manually into your browser:

1.  **Download** or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** using the toggle in the top-right corner.
4.  Click the **Load unpacked** button.
5.  Select the project folder containing the `manifest.json` file.

## Project Structure

```text
my-timer-extension/
├── manifest.json    # Extension configuration and permissions
├── background.js    # Service worker for background timing logic
├── popup.html       # The HTML structure of the timer
├── popup.js         # Reactive UI logic and storage listeners
└── style.css        # Minimalist styling and layout
```
