var currentSet = document.getElementById("current-set")
var returnButton = document.getElementById("return")

function setUp(){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var userLocal = result.userLocal;
        currentSet.innerHTML = userLocal.set

        if (userLocal.panel == "set") {
            currentSet.style.animationName = "grow1"
            currentSet.style.animationDuration = "500ms"

            returnButton.style.animationName = "grow1"
            returnButton.style.animationDuration = "500ms"
        }
    });
}

function switch_panels(){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        user.set = "none"
        user.panel = "main"
        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

returnButton.onclick = function(){
    Promise.resolve().then(
        switch_panels()
    ).then(
        new Promise(resolve => setTimeout(resolve, 500)),
        currentSet.style.animationName = "fadeout",
        currentSet.style.animationDuration = "500ms"
    ).then(
        chrome.sidePanel.setOptions({ path: `sidepanel/sidepanel.html` })
    )
}

setUp()