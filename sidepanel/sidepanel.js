var add = document.getElementById("add")
var search = document.getElementById("search")
var close1 = document.getElementById("close1")
var close2 = document.getElementById("close2")
var bottom = document.getElementsByClassName("bottom")[0]
var bottombuttons = document.getElementsByClassName("bottom-buttons")[0]
var bottominputs1 = document.getElementsByClassName("bottom-inputs1")[0]
var bottominputs2 = document.getElementsByClassName("bottom-inputs2")[0]
var setscontainer = document.getElementsByClassName("sets-container")[0]
var searching = document.getElementsByTagName("input")[0]
var adding = document.getElementById("naming")

// Checking sets in local storage
chrome.storage.local.get(['userLocal'], async function (result) {
    var user = result.userLocal;
    for (let set of user.sets){
        addSet(set)
    }
});

var sets = [...document.getElementsByClassName("set")]

function switch_panels(set){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        user.set = set
        user.panel = "set"
        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

function updateSets(set){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        user.sets.push(set)
        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

function addSet(name){
    if(name != "") {
        var newbutton = document.createElement("button")
        newbutton.setAttribute("class", "set")
        newbutton.innerHTML = name
        setscontainer.appendChild(newbutton)
        adding.value = ""

        updateSets(name)

        newbutton.addEventListener("click", async () => {
            Promise.resolve().then(
                switch_panels(newbutton.innerHTML)
            ).then(
                new Promise(resolve => setTimeout(resolve, 500)),
                add.style.animationName = "fadeout",
                add.style.animationDuration = "500ms"
            ).then(
                chrome.sidePanel.setOptions({ path: `setpanel/setpanel.html` })
            )
        })

        sets.push(newbutton)
        console.log(sets)
    }
}

const levenshteinDistance = (str1 = '', str2 = '') => {
    str1 = str1.toLowerCase()
    str2 = str2.toLowerCase()
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
       track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
       track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
       for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
             track[j][i - 1] + 1, // deletion
             track[j - 1][i] + 1, // insertion
             track[j - 1][i - 1] + indicator, // substitution
          );
       }
    }
    return track[str2.length][str1.length];
};

function wordDist(wa, wb) {
    if (wa.length == 0) return wb.length;
    if (wb.length == 0) return wa.length;
    
    let arr = new Array(wb.length);
    for (let i = 0; i < wb.length; i++) {
      arr[i] = new Array(wa.length);
      for (let j = 0; j < wa.length; j++) {
        let l = (j == 0)? i+1 : arr[i][j-1];
        let u = (i == 0)? j+1 : arr[i-1][j];
        let ul = (i == 0)? j : ((j == 0)? i: arr[i-1][j-1]);
        
        let subCost = 0;
        if (wa[j] != wb[i]) subCost++;
        
        arr[i][j] = Math.min(l+1, u+1, ul+subCost);
      }
    }
    return arr[wb.length-1][wa.length-1];
}
  
function phraseDist(a, b) {
    a = a.toLowerCase().split(" ");
    b = b.toLowerCase().split(" ");
    
    let arr = new Array(b.length+1);
    arr[0] = new Array(a.length+1);
    arr[0][0] = 0;
    let c = 0;
    for (let j = 0; j < a.length; j++) {
      c+=a[j].length;
      arr[0][j+1] = c;
    }
    c = 0;
    for (let i = 0; i < b.length; i++) {
      arr[i+1] = new Array(a.length+1);
      c+=b[i].length;
      arr[i+1][0] = 0;
    }
    
    for (let i = 0; i < b.length; i++) {
      for (let j = 0; j < a.length; j++) {
        let cost = wordDist(a[j], b[i]);
        
        let l = arr[i][j+1];
        let u = arr[i+1][j]+a[j].length;
        let ul = arr[i][j]+2*cost;
        arr[i+1][j+1] = Math.min(l, u, ul);
      }
    }
    return arr[b.length][a.length];
}

add.onclick = function(){
    add.style.animationName = "grow,fadeout"
    add.style.animationDuration = "500ms"
    add.style.visibility = "hidden"

    search.style.animationName = "shrink, fadeout"
    search.style.animationDuration = "500ms"
    search.style.visibility = "hidden"

    close2.style.animationName = "shrink, fadein"
    close2.style.animationDuration = "500ms"
    close2.style.visibility = "visible"

    adding.style.animationName = "grow, fadein"
    adding.style.animationDuration = "500ms"
    adding.style.visibility = "visible"

    bottom.removeChild(bottominputs2)
    bottom.appendChild(bottominputs2)
}

close1.onclick = function(){
    add.style.animationName = "shrink,fadein"
    add.style.animationDuration = "500ms"
    add.style.visibility = "visible"

    search.style.animationName = "grow, fadein"
    search.style.animationDuration = "500ms"
    search.style.visibility = "visible"

    close1.style.animationName = "grow, fadeout"
    close1.style.animationDuration = "500ms"
    close1.style.visibility = "hidden"

    searching.style.animationName = "shrink, fadeout"
    searching.style.animationDuration = "500ms"
    searching.style.visibility = "hidden"

    bottom.removeChild(bottombuttons)
    bottom.appendChild(bottombuttons)
}

close2.onclick = function(){
    add.style.animationName = "shrink,fadein"
    add.style.animationDuration = "500ms"
    add.style.visibility = "visible"

    search.style.animationName = "grow, fadein"
    search.style.animationDuration = "500ms"
    search.style.visibility = "visible"

    close2.style.animationName = "grow, fadeout"
    close2.style.animationDuration = "500ms"
    close2.style.visibility = "hidden"

    adding.style.animationName = "shrink, fadeout"
    adding.style.animationDuration = "500ms"
    adding.style.visibility = "hidden"

    bottom.removeChild(bottombuttons)
    bottom.appendChild(bottombuttons)
}

search.onclick = function(){
    add.style.animationName = "grow,fadeout"
    add.style.animationDuration = "500ms"
    add.style.visibility = "hidden"

    search.style.animationName = "shrink, fadeout"
    search.style.animationDuration = "500ms"
    search.style.visibility = "hidden"

    close1.style.animationName = "shrink, fadein"
    close1.style.animationDuration = "500ms"
    close1.style.visibility = "visible"

    searching.style.animationName = "grow, fadein"
    searching.style.animationDuration = "500ms"
    searching.style.visibility = "visible"

    bottom.removeChild(bottominputs1)
    bottom.appendChild(bottominputs1)
}

adding.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        addSet(adding.value)
    }
})

searching.addEventListener('input', (e) => {
    query = searching.value

    let dists = sets.map((set)=>phraseDist(query, set.innerHTML));
    let minDist = Math.min(...dists);

    for (let i = 0; i < sets.length; i++){
        let set = sets[i];
        if (dists[i] <= minDist+3){
            set.style.opacity = 1
        } else {
            if (query == ""){
                set.style.opacity = 1
            } else {
                set.style.opacity = 0.2
            }
        }
    }
})