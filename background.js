chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusTimer") {
    chrome.storage.local.get(["timeLeft"], (res) => {
      const current = typeof res.timeLeft === "number" ? res.timeLeft : 0;
      const time = current > 0 ? current - 1 : 0;

      chrome.storage.local.set({ timeLeft: time }, () => {
        if (time <= 0) {
          chrome.alarms.clear("focusTimer");
          chrome.storage.local.set({ isRunning: false });
          // Notify user if notifications are available
          if (chrome.notifications) {
            chrome.notifications.create({
              type: "basic",
              iconUrl: "images/icon-128.png",
              title: "Focus Timer Complete",
              message: "Your focus session has ended!",
            });
          }
        }
      });
    });
  }
});

// If the service worker starts and a session was running, recreate the alarm
function ensureAlarmIfRunning() {
  chrome.storage.local.get(["isRunning"], (res) => {
    if (res.isRunning) {
      chrome.alarms.create("focusTimer", { periodInMinutes: 1 / 60 });
    }
  });
}

ensureAlarmIfRunning();

chrome.runtime.onInstalled.addListener(ensureAlarmIfRunning);
chrome.runtime.onStartup.addListener(ensureAlarmIfRunning);
