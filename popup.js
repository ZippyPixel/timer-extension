const display = document.getElementById("display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const duration = document.getElementById("duration");
const durationLabel = document.getElementById("durationLabel");

function formatTime(t) {
  const minutes = Math.floor(t / 60);
  const seconds = t % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateDisplay(timeLeft) {
  display.textContent = formatTime(timeLeft);
}

function refreshUI(state) {
  const initial = state.initialDuration || 25 * 60;
  const timeLeft =
    typeof state.timeLeft === "number" ? state.timeLeft : initial;

  duration.value = Math.round(initial / 60);
  durationLabel.textContent = Math.round(initial / 60);
  updateDisplay(timeLeft);

  // Check if we are currently in a session (running OR paused)
  const isSessionActive =
    state.isRunning || (timeLeft < initial && timeLeft > 0);

  // Use visibility instead of display to preserve layout space
  if (isSessionActive) {
    const durationWrapper = document.getElementById("durationWrapper");
    durationWrapper.style.visibility = "hidden";
  } else {
    durationWrapper.style.visibility = "visible";
  }

  // Button Logic (Keeping display:none here is usually better so
  // the buttons swap places, but we can use visibility if you prefer)
  if (state.isRunning) {
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    pauseBtn.textContent = "Pause";
    resetBtn.style.display = "inline-block";
  } else if (timeLeft < initial && timeLeft > 0) {
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    pauseBtn.textContent = "Resume";
    resetBtn.style.display = "inline-block";
  } else {
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    resetBtn.style.display = "none";
  }
}

// Initialize popup state
chrome.storage.local.get(
  { initialDuration: 25 * 60, timeLeft: null, isRunning: false },
  (res) => {
    const initial = res.initialDuration || 25 * 60;
    const timeLeft = typeof res.timeLeft === "number" ? res.timeLeft : initial;
    chrome.storage.local.set({ initialDuration: initial, timeLeft });
    refreshUI({ initialDuration: initial, timeLeft, isRunning: res.isRunning });
  },
);

// Listen for changes from background
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(
    ["initialDuration", "timeLeft", "isRunning"],
    (res) => {
      refreshUI(res);
    },
  );
});

// Duration slider updates
duration.addEventListener("input", (e) => {
  const mins = parseInt(e.target.value, 10) || 25;
  durationLabel.textContent = mins;
  const initial = mins * 60;

  chrome.storage.local.get(["isRunning"], (res) => {
    if (!res.isRunning) {
      chrome.storage.local.set({ initialDuration: initial, timeLeft: initial });
    } else {
      chrome.storage.local.set({ initialDuration: initial });
    }
  });
});

startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["initialDuration"], (res) => {
    const initial = res.initialDuration || 25 * 60;
    chrome.storage.local.set({ timeLeft: initial, isRunning: true }, () => {
      chrome.alarms.create("focusTimer", { periodInMinutes: 1 / 60 });
    });
  });
});

pauseBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    if (res.isRunning) {
      chrome.alarms.clear("focusTimer", () => {
        chrome.storage.local.set({ isRunning: false });
      });
    } else {
      chrome.alarms.create("focusTimer", { periodInMinutes: 1 / 60 });
      chrome.storage.local.set({ isRunning: true });
    }
  });
});

resetBtn.addEventListener("click", () => {
  chrome.alarms.clear("focusTimer", () => {
    chrome.storage.local.get(["initialDuration"], (res) => {
      const initial = res.initialDuration || 25 * 60;
      chrome.storage.local.set({ timeLeft: initial, isRunning: false });
    });
  });
});
