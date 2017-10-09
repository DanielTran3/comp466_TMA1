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
    initXML("part4.xml");
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

function initXML(url) {
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
    if (targetTab.name === "0") {
        loadTabInformation(xmlData, targetTab.name, informationDiv);
    }
    else if (targetTab.name === "1") {
        createMortgageCalculatorInformation(informationDiv);
    }
}

function removeTabInformation(informationDiv) {
    while(informationDiv.hasChildNodes()) {
        informationDiv.removeChild(informationDiv.lastChild);
    }
}

// Make recursive
function loadTabInformation(informationNode, tabNumber, informationDiv) {
    var data = informationNode.children[tabNumber];
    displayInformation(data.children, informationDiv, "Length");
}

function displayInformation(conversionData, informationDiv, conversionType) {
    var title = document.createTextNode("Unit Converter");
    var titleHeader = document.createElement("h1");
    titleHeader.className += "title1";
    titleHeader.appendChild(title);
    informationDiv.appendChild(titleHeader);

    for (var i = 0; i < conversionData.length; i++) {
        for (var inst = 0; inst < conversionData[i].attributes[1].value; inst++) {

            if (conversionData[i].tagName === "select") {
                var dropdownMenu = document.createElement("select");
                dropdownMenu.id = conversionData[i].id + (inst + 1);
                dropdownMenu.className += "group" + (inst + 1);

                populateDropdownList(dropdownMenu, conversionData[i], conversionType);
                
                dropdownMenu.addEventListener("change", function(e) {
                    changeUnits(e);
                });

                informationDiv.appendChild(dropdownMenu);
            }

            else if (conversionData[i].tagName === "select2") {
                var dropdownMenu = document.createElement("select");
                dropdownMenu.id = conversionData[i].id;
                dropdownMenu.className += conversionData[i].attributes[2].value;

                populateDropdownList(dropdownMenu, conversionData[i], conversionType);
                dropdownMenu.addEventListener("change", function(e) {
                    populateDropdownXML("part4.xml", e);
                });
                informationDiv.appendChild(dropdownMenu);
            }

            else if (conversionData[i].tagName === "input") {
                var inputElement = document.createElement("input");
                inputElement.id = conversionData[i].id + (inst + 1);
                inputElement.className += "group" + (inst + 1);
                inputElement.className += " inputMovedDown";
                inputElement.value = 0;
                inputElement.addEventListener("input", function(e) {
                    convertValuesOnInput(e);
                });
                informationDiv.appendChild(inputElement);            
            }
        }
    }
}

function populateDropdownList(dropdownMenu, dropdownListElement, conversionType) {
    var firstAccessFlag = true;
    for (var j = 0; j < dropdownListElement.children.length; j++) {
        
        if (dropdownListElement.children[j].attributes.length === 0) {
            var dropdownOption = document.createElement("option");
            dropdownOption.value = dropdownListElement.children[j].innerHTML;
            dropdownOption.innerHTML = dropdownOption.value;
            dropdownMenu.appendChild(dropdownOption);            
        }

        else if (dropdownListElement.children[j].attributes[1].value === conversionType) {
            var dropdownOption = document.createElement("option");
            dropdownOption.value = dropdownListElement.children[j].innerHTML;
            dropdownOption.innerHTML = dropdownOption.value;
            dropdownOption.metersFactor = dropdownListElement.children[j].attributes[0].value;
            // Set the factor to the first element on the list
            if (firstAccessFlag) {
                group1.factor = dropdownOption.metersFactor;
                group2.factor = dropdownOption.metersFactor;
                document.getElementById("input2").value = document.getElementById("input1").value;
                firstAccessFlag = false;
            }
            dropdownMenu.appendChild(dropdownOption);
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

function changeUnitsTypes(dropdownListElement, selectedConversionType) {
    var conversion = selectedConversionType.currentTarget.options[selectedConversionType.currentTarget.selectedIndex].value;
    for (var i = 0; i < selectedConversionType.currentTarget.classList.length; i++) {
        var units = document.getElementById("units" + (i + 1));
        clearDropdownList(units);
        populateDropdownList(units, dropdownListElement, conversion);
    }
}

function clearDropdownList(dropdownList) {
    while(dropdownList.hasChildNodes()) {
        dropdownList.removeChild(dropdownList.children[0]);
    }
}

function populateDropdownXML(url, selectedConversionType) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            getListOfUnits(this.responseXML.children, selectedConversionType);
        }
    }
    xhr.open("get", url, false);
    xhr.send(null);
}

function getListOfUnits(xr, selectedConversionType) {
    var unitConversionChildren = xr[0].children[0].children;
    for (var i = 0; i < unitConversionChildren.length; i++) {
        if (unitConversionChildren[i].id === "units") {
            changeUnitsTypes(unitConversionChildren[i], selectedConversionType);
        }
    }
}


function createMortgageCalculatorInformation(informationDiv) {
    var mortgageCalculatorHeader = document.createElement("h1");
    mortgageCalculatorHeader.innerHTML = "Mortgage Calculator";
    mortgageCalculatorHeader.className += "title1"; 
    
    var monthlyPaymentInputLabel = document.createElement("label");
    monthlyPaymentInputLabel.innerHTML = "Monthly Payment";
    var monthlyPaymentInput = document.createElement("input");
    monthlyPaymentInput.id = "monthlyPayment";
    monthlyPaymentInput.type = "number";
    monthlyPaymentInput.step = "any";
    
    var principalInputLabel = document.createElement("label");
    principalInputLabel.innerHTML = "Principal\t";
    var principalInput = document.createElement("input");
    principalInput.id = "principal";
    principalInput.type = "number";
    principalInput.step = "any";

    var monthlyInterestRateInputLabel = document.createElement("label");
    monthlyInterestRateInputLabel.innerHTML = "Monthly Interest Rate";
    var monthlyInterestRateInput = document.createElement("input");
    monthlyInterestRateInput.id = "monthlyInterestRate";
    monthlyInterestRateInput.type = "number";
    monthlyInterestRateInput.step = "any";

    var numberOfPaymentsInputLabel = document.createElement("label");
    numberOfPaymentsInputLabel.innerHTML = "Number of Payments ";
    var numberOfPaymentsInput = document.createElement("input");
    numberOfPaymentsInput.id = "numberOfPayments";
    numberOfPaymentsInput.type = "number";
    numberOfPaymentsInput.step = "any";

    monthlyPaymentInput.addEventListener("input", function() {
        calculateMortgage(informationDiv, monthlyPaymentInput, principalInput, monthlyInterestRateInput, numberOfPaymentsInput);
    });
    principalInput.addEventListener("input", function() {
        calculateMortgage(informationDiv, monthlyPaymentInput, principalInput, monthlyInterestRateInput, numberOfPaymentsInput);
    });
    monthlyInterestRateInput.addEventListener("input", function() {
        calculateMortgage(informationDiv, monthlyPaymentInput, principalInput, monthlyInterestRateInput, numberOfPaymentsInput);
    });
    numberOfPaymentsInput.addEventListener("input", function() {
        calculateMortgage(informationDiv, monthlyPaymentInput, principalInput, monthlyInterestRateInput, numberOfPaymentsInput);
    });

    informationDiv.appendChild(mortgageCalculatorHeader);
    informationDiv.appendChild(document.createElement("br"));

    informationDiv.appendChild(monthlyPaymentInputLabel);
    informationDiv.appendChild(monthlyPaymentInput);
    informationDiv.appendChild(document.createElement("br"));

    informationDiv.appendChild(principalInputLabel);
    informationDiv.appendChild(principalInput);
    informationDiv.appendChild(document.createElement("br"));

    informationDiv.appendChild(monthlyInterestRateInputLabel);
    informationDiv.appendChild(monthlyInterestRateInput);
    informationDiv.appendChild(document.createElement("br"));

    informationDiv.appendChild(numberOfPaymentsInputLabel);
    informationDiv.appendChild(numberOfPaymentsInput);
    informationDiv.appendChild(document.createElement("br"));
    
    var mortgageLabel = document.createElement("label");
    mortgageLabel.id = "mortgageLabel";
    mortgageLabel.innerHTML = "Awaiting Inputs"
    informationDiv.appendChild(mortgageLabel);
}

function calculateMortgage() {
    var mortgageLabel = document.getElementById("mortgageLabel");
    for (var i = 1; i < arguments.length; i++) {
        if (isNaN(arguments[i].value)) {
            mortgageLabel.innerHTML = "Please Enter Valid Inputs";
            return;
        }
        if (isNaN(parseFloat(arguments[i].value))) {
            mortgageLabel.innerHTML = "Awaiting Inputs";
            return;
        }
    }

    var monthlyPayment = parseFloat(document.getElementById("monthlyPayment").value);
    var principal = parseFloat(document.getElementById("principal").value);
    var monthlyInterestRate = parseFloat(document.getElementById("monthlyInterestRate").value);
    var numberOfPayments = parseFloat(document.getElementById("numberOfPayments").value);
    
    var overallMortgage = (principal * ((monthlyInterestRate * Math.pow((1 + monthlyInterestRate), numberOfPayments)) / (Math.pow((1 + monthlyInterestRate), numberOfPayments) - 1)));

    mortgageLabel.innerHTML = "Mortgage Amount: " + overallMortgage.toFixed(2);    
}