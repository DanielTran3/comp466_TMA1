var xmlData;
function pageStartup() {
    readXML("Units.xml");
}
function createUnitTabs(xr) {
    xmlData = xr.responseXML.children;
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
            addQuizButton(units[0], 0, tabInformation);    
        }
        tab.classList.add("tablinks");
        tab.innerHTML = tutorialName;
        tab.name = i;
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
    currentTab.classList.remove("active");
    targetTab.classList.add("active");
    removeTabInformation(informationDiv);
    loadTabInformation(xmlData, targetTab.name, informationDiv);
    addQuizButton(xmlData, targetTab, informationDiv);
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
            //https://stackoverflow.com/questions/30587718/remove-whitespaces-and-new-lines-from-xml-using-javascript
            paragraphText.innerHTML = tutorialData[i].textContent.replace(new RegExp("\\n", "g"),"");
            informationDiv.appendChild(paragraphText);
        }
        else if (tutorialData[i].tagName === "image") {
            var image = document.createElement("img");
            image.src = tutorialData[i].attributes[0].nodeValue;
            image.alt = tutorialData[i].textContent;
            informationDiv.appendChild(image);
            informationDiv.appendChild(document.createElement("br"));
        }
        else if (tutorialData[i].tagName === "question") {
            var question = document.createElement("h3");
            question.innerHTML = tutorialData[i].attributes[0].nodeValue;
            informationDiv.appendChild(question);
            displayInformation(tutorialData[i].children, informationDiv);
        }
        else if (tutorialData[i].tagName === "answer") {
            var answer = document.createElement("input");
            var answerText = document.createElement("label");
            answer.type = "radio";
            answer.name = tutorialData[i].attributes[0].nodeValue;
            answerText.innerHTML = tutorialData[i].textContent;
            informationDiv.appendChild(answer);
            informationDiv.appendChild(answerText);
            informationDiv.appendChild(document.createElement("br"));
        }
    }
}

function addQuizButton(informationNode, targetTab, informationDiv) {
    var quizButton = document.createElement("input");
    quizButton.type = "submit";
    // Assuming there is always only one quiz per unit. If this assumption changes
    // then modify this section
    if (targetTab.name % 2) {
        quizButton.value = "Submit Quiz";
        quizButton.addEventListener("click", function() {
            var currentTab = document.getElementsByClassName("active");
            checkQuizResults(parseInt(currentTab[0].name), informationDiv);
        });
    }
    else {
        quizButton.value = "Start Quiz";
        quizButton.addEventListener("click", function() {
            var currentTab = document.getElementsByClassName("active");
            var tablinks = document.getElementsByClassName("tablinks");
            var quizTab = tablinks[parseInt(currentTab[0].name) + 1];
            changeTab(quizTab, informationNode, informationDiv);
        });
    }
    quizButton.classList.add("whiteButton");
    quizButton.setAttribute("style", "margin:10px;");
    
    informationDiv.appendChild(document.createElement("hr"));
    informationDiv.appendChild(quizButton);
}

function checkQuizResults(tabNumber, informationDiv) {
    // Get the section of the quiz that contains the questions and answers (tutorial > quiz > section)
    var score = 0;
    var quiz = xmlData[0].children[tabNumber].children[0];
    var q1buttons = document.getElementsByName("q1");
    var radiobuttons = document.getElementsByTagName("input");
    var correctAnswer = new Object; 

    for (var i = 0; i < quiz.childElementCount; i++) {
        for (var j = 0; j < quiz.children[i].childElementCount; j++) {
            if (quiz.children[i].children[j].attributes[1].nodeValue === "*") {
                correctAnswer.name = quiz.children[i].children[j].attributes[0].nodeValue;
                correctAnswer.questionNumber = i;
                correctAnswer.answer = j;
                break;
            }
        }
        var userAnswer = document.getElementsByName(correctAnswer.name);
        if (userAnswer[correctAnswer.answer].checked) {
            score++;
        }
    }
    if (document.getElementById("score") != null) {
        informationDiv.removeChild(informationDiv.lastChild);
    }
    var finalScore = document.createElement("h3");
    finalScore.id = "score";
    finalScore.style.styleFloat = 'right';
    finalScore.style.cssFloat = 'right';
    finalScore.innerHTML = "Final Score: " + score + "/" + quiz.childElementCount;
    informationDiv.appendChild(finalScore);
}