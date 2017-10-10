function pageStartup() {
    addEventListenersToTabs();
}

function addEventListenersToTabs() {
    var tabs = document.getElementsByClassName("tablinks");
    var infoTabs = document.getElementsByClassName("titleDiv");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].infoTab = infoTabs[i];
        tabs[i].addEventListener("click", function() {
            changeTab(this);  
        });
    }
}

function changeTab(targetTab, infoTab) {
    var currentTab = document.getElementsByClassName("active")[0];
    currentTab.classList.remove("active");
    currentTab.infoTab.hidden = true;
    targetTab.classList.add("active");
    targetTab.infoTab.hidden = false;
}