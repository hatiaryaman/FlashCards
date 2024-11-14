//Sets
var sets = []
var currentGroup = null

//Edit set properties
var rename = document.getElementById("rename_button")

//Creating new sets
var groupButton = document.getElementById("add")
var namingInput = document.getElementById("naming")
var groups = document.getElementById("groups")

//Cursor function
function setCursorPosition(inputElem, position) {
    if (inputElem.setSelectionRange) {
        inputElem.focus();
        inputElem.setSelectionRange(position, position);
    }
}

groupButton.onclick = function(){
    var groupName = namingInput.value
    console.log(groupName)
    if (groupName != "") {
        var newGroup = document.createElement("button")
        newGroup.setAttribute("id", "set")
        newGroup.setAttribute("class", "button1")
        newGroup.innerHTML = groupName
        groups.appendChild(newGroup)
        sets.push(newGroup)

        //Editing set properties or opening set
        newGroup.onclick = function() {
            currentGroup = (currentGroup == null)? newGroup: null;
            rename.innerHTML = newGroup.innerHTML
        }
    }
}
