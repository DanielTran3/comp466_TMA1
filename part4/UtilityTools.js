var group1 = 
{
    group:"group1",
    factor:"1000",
    value:0
}
var group2 = 
{
    group:"group2",
    factor:"1000",
    value:0
}

function pageStartup() {
    readXML("part4.xml");
}

function createUnitTabs(xr) {
    var tools = xr.responseXML.children;
    var tabSection = document.getElementById("aside");
    var tabInformation = document.getElementById("main-content");
    for (var i = 0; i < tools[0].childElementCount; i++) {
        var toolName = tools[0].children[i].attributes[0].nodeValue;
        var tab = document.createElement("button");
        if (i === 0) {
            tab.id = "defaultOpen";
            tab.classList.add("active");
            loadTabInformation(tools[0], 0, tabInformation);
        }
        tab.classList.add("tablinks");
        tab.innerHTML = toolName;
        tab.name = tools[0].children[i].attributes[1].nodeValue;
        tab.addEventListener("click", function() {
            changeTab(this, tools[0], tabInformation);
        });
        tabSection.appendChild(tab);
    }
}

function readXML(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            createUnitTabs(this);
        }
    }
    xhr.open("get", url, false);
    xhr.send(null);
}

function changeTab(targetTab, xmlData, informationDiv) {
    var currentTab = document.getElementsByClassName("active")[0];
    var tablinks = document.getElementsByClassName("tablinks");
    currentTab.classList.remove("active");
    targetTab.classList.add("active");
    removeTabInformation(informationDiv);
    loadTabInformation(xmlData, targetTab.name, informationDiv);
}

function removeTabInformation(informationDiv) {
    while(informationDiv.hasChildNodes()) {
        informationDiv.removeChild(informationDiv.lastChild);
    }
}

// Make recursive
function loadTabInformation(informationNode, tabNumber, informationDiv) {
    var data = informationNode.children[tabNumber];
    displayInformation(data.children, informationDiv);
}

function displayInformation(tutorialData, informationDiv) {
    for (var i = 0; i < tutorialData.length; i++) {
        for (var inst = 0; inst < tutorialData[i].attributes[1].value; inst++) {

            if (tutorialData[i].tagName === "select") {
                var dropdownMenu = document.createElement("select");
                dropdownMenu.id = tutorialData[i].id;
                dropdownMenu.classList = "group" + (inst + 1);

                for (var j = 0; j < tutorialData[i].children.length; j++) {
                    if (tutorialData[i].children[j].attributes[1].value === "Length") {
                        var dropdownOption = document.createElement("option");
                        dropdownOption.value = tutorialData[i].children[j].innerHTML;
                        dropdownOption.innerHTML = dropdownOption.value;
                        dropdownOption.metersFactor = tutorialData[i].children[j].attributes[0].value;
                        dropdownMenu.appendChild(dropdownOption);
                    }
                }
                dropdownMenu.addEventListener("change", function(e) {
                    changeUnits(e);
                });
                informationDiv.appendChild(dropdownMenu);
            }

            else if (tutorialData[i].tagName === "select2") {
                var dropdownMenu = document.createElement("select");
                dropdownMenu.id = tutorialData[i].id;
                    dropdownMenu.classList = tutorialData[i].attributes[2].value;

                for (var j = 0; j < tutorialData[i].children.length; j++) {
                    var dropdownOption = document.createElement("option");
                    dropdownOption.value = tutorialData[i].children[j].innerHTML;
                    dropdownOption.innerHTML = dropdownOption.value;
                    dropdownMenu.appendChild(dropdownOption);
                }
                dropdownMenu.addEventListener("change", function(e) {
                    changeUnitsTypes(e);
                });
                informationDiv.appendChild(dropdownMenu);
            }

            else if (tutorialData[i].tagName === "input") {
                var subsectionHeader = document.createElement("input");
                subsectionHeader.id = tutorialData[i].id;
                subsectionHeader.classList = "input" + (inst + 1);
                subsectionHeader.value = 0;
                subsectionHeader.addEventListener("input", function(e) {
                    convertValuesOnInput(e);
                });
                informationDiv.appendChild(subsectionHeader);            
            }
        }
    }
}

// https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
function changeUnits(changedUnit) {
    for (var g = 0; g < changedUnit.currentTarget.classList.length; g++) {
        var selectedFactor = changedUnit.currentTarget.options[changedUnit.currentTarget.selectedIndex].metersFactor;
        if (changedUnit.currentTarget.classList.contains(group1.group)) {
            var oldFactor = group1.factor;
            group1.factor = selectedFactor;
        }
        else if (changedUnit.currentTarget.classList.contains(group2.group)) {
            var oldFactor = group2.factor;
            group2.factor = selectedFactor;
        }
        
        // group2.value = group1.value * (group2.factor / oldFactor);
        // var group2Elem = document.getElementById("input2");
        // group2Elem.value = group2.value;
        convertValues(document.getElementById("input1"));
    }
}

function convertValuesOnInput(updatedGroup) {
    var updatedValue = updatedGroup.currentTarget;
    convertValues(updatedValue);
}

function convertValues(target) {
    if (target.classList.contains(group1.group)) {
        group1.value = target.value;
        group2.value = group1.value * (group1.factor / group2.factor);
        var input2 = document.getElementById("input2");
        input2.value = group2.value;
    }
    else if (target.classList.contains(group2.group)) {
        group2.value = target.value;
        group1.value = group2.value * (group2.factor / group1.factor);
        var input1 = document.getElementById("input1");
        input1.value = group1.value;
    }
}