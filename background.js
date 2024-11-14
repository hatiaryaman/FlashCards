chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.storage.local.get(['userLocal'], async function (result) {
    var user = {
        set: "none",
        sets: [],
        panel: "main"
    }
    await chrome.storage.local.set({userLocal: user}, function () {});
})