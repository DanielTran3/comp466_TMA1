function pageStartup() {
    readXML("Units.xml");
}
function createUnitTabs(xr) {
    var units = xr.responseXML.children;
    var tabSection = document.getElementById("aside");
    var tabInformation = document.getElementById("main-content");
    for (var i = 0; i < units[0].childElementCount; i++) {
        var tutorialName = units[0].children[i].attributes[0].nodeValue;
        var tab = document.createElement("button");
        if (i === 0) {
            tab.id = "defaultOpen";
            tab.classList.add("active");
            loadTabInformation(units[0], 0, tabInformation);
        }
        tab.classList.add("tablinks");
        tab.innerHTML = tutorialName;
        tab.name = units[0].children[i].attributes[1].nodeValue;
        tab.addEventListener("click", function() {
            changeTab(this, units[0], tabInformation);
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
        if (tutorialData[i].tagName === "section") {
            var sectionHeader = document.createElement("h1");
            sectionHeader.innerHTML = tutorialData[i].attributes[0].nodeValue;
            informationDiv.appendChild(sectionHeader);
            displayInformation(tutorialData[i].children, informationDiv);
        }
        else if (tutorialData[i].tagName === "subsection") {
            var subsectionHeader = document.createElement("h2");
            subsectionHeader.innerHTML = tutorialData[i].attributes[0].nodeValue;
            informationDiv.appendChild(subsectionHeader);
            displayInformation(tutorialData[i].children, informationDiv);
        }
        else if (tutorialData[i].tagName === "paragraph") {
            var paragraphText = document.createElement("p");
            paragraphText.innerHTML = tutorialData[i].textContent;
            informationDiv.appendChild(paragraphText);
        }
    }
}