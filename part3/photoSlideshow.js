var _images = {}
var buttonNameDict = {};
var listOfImgSrc = ['gabled_roof.png', 'hipped_roof.png', 'shed_roof.png'];
var listOfImgCaptions = ['1', '2', '3'];
var transitionsListDict = {};
var photoInterval;
var currentTransition;
var currentPhotoIndex = 0;
var transitionFunctionList = [noAnimationTransition, floatDownTransition, spinToTheCenterTransition, fadeInTransition];

requestAnimationFrame(drawImageUsingTransition);
function preloadImages() {
    loadImages(listOfImgSrc, listOfImgCaptions, function(images) {
        _images = images;
    });
}

function loadImages(imgSrcArray, captionArray, callback) {
    this.images = {};
    var loadedImageCount = 0;

    for (var i = 0; i < imgSrcArray.length; i++) {
        var img = new Image();
        img.onload = imageLoaded();
        img.src = imgSrcArray[i];
        this.images[imgSrcArray[i]] = img;
        this.images[imgSrcArray[i]].caption = captionArray[i];
    }

    function imageLoaded() {
        loadedImageCount++;
        if (loadedImageCount >= imgSrcArray.length) {
            callback(images);
        }
    }
}

function loadTransitionsListDict() {
    var transitionsList = document.getElementById("transitionsDropdownMenu");
    for (var i = 0; i < transitionsList.children.length; i++) {
        transitionsListDict[transitionsList.children[i].innerHTML] = [i, transitionFunctionList[i]];
    }
}

function initButtonNameDict() {
    var initialButtonValue = ['Start', 'Sequential', 'Forward'];
    var pressedButtonValue = ['Stop', 'Random', 'Backward'];
    for (var i = 0; i < initialButtonValue.length; i++) {
        buttonNameDict[initialButtonValue[i]] = pressedButtonValue[i];
        buttonNameDict[pressedButtonValue[i]] = initialButtonValue[i];
    }
}

function initListeners() {
    currentPhoto = 0;
    currentTransition = "No Animation";
    var startButton = document.getElementById("start_stop_button");
    var sequentialButton = document.getElementById("random_sequential_button");
    var forwardButton = document.getElementById("forward_backward_button");
    var transitionsList = document.getElementById("transitionsDropdownMenu");

    startButton.addEventListener("click", function() {
        changeButtonValue(startButton);
        startStop(startButton, sequentialButton, forwardButton);
    });

    sequentialButton.addEventListener("click", function() {
        changeButtonValue(sequentialButton);
        forwardBackwardAvailability(sequentialButton, forwardButton);
    });

    forwardButton.addEventListener("click", function() {
        changeButtonValue(forwardButton);
    });

    transitionsList.addEventListener("click", function(event) {
        changeTransition(currentTransition, event);
    });
}

function changeButtonValue(button) {
    button.innerHTML = buttonNameDict[button.innerHTML];
}

function displayImageOnCanvas() {
    var canvas = document.getElementById("slideshowCanvas");
    var image = _images[listOfImgSrc[currentPhotoIndex]];
    var scale = 0.5;
    while(image.height > canvas.height) {
        image.height *= scale;
        image.width *= scale;
    } 
    while (image.width > canvas.width) {
        image.height *= scale;
        image.width *= scale;
    }
    var ctx = canvas.getContext("2d");
    // ctx.drawImage(_images[listOfImgSrc[currentPhotoIndex]], canvas.height / 2, 0);
    //drawImageUsingTransition(ctx, canvas);
    transitionsListDict[currentTransition][1]();
}

function initCanvas() {
    var canvas = document.getElementById("slideshowCanvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.style.maxHeight = "89vh";
    canvas.style.maxWidth = "100%";
    displayImageOnCanvas();
}

function startStop(startButton, randomButton, forwardButton) {
    // If the button text is stop, then photos should be moving
    if (startButton.innerHTML === "Stop") {
        photoInterval = window.setInterval(function() {
            switchPhoto(randomButton, forwardButton);
        }, 2000);
    }
    else { // Photos should not be moving
        window.clearInterval(photoInterval);
    }
}

function switchPhoto(randomButton, forwardButton) {
    displayImageOnCanvas();
    if (randomButton.innerHTML === "Random") {
        currentPhotoIndex = Math.floor(Math.random() * listOfImgSrc.length);    
    }
    else if (randomButton.innerHTML === "Sequential") {
        currentPhotoIndex = forwardButton.innerHTML === "Forward" ? (currentPhotoIndex + 1 ) % listOfImgSrc.length : currentPhotoIndex === 0 ? listOfImgSrc.length - 1 : (currentPhotoIndex - 1 ) % listOfImgSrc.length;
    }
}

function forwardBackwardAvailability(randomButton, forwardButton) {
    if (randomButton.innerHTML === "Random") {
        forwardButton.style.backgroundColor = "#A9A9A9";
        forwardButton.style.color = "#000000";
        forwardButton.disabled = true;
    }
    else {
        forwardButton.style.backgroundColor = "#000000";
        forwardButton.style.color = "#FFFFFF";
        forwardButton.disabled = false;
    }
}

function changeTransition(transitionName, targetTransition) {
    var transitionList = document.getElementById("transitionsDropdownMenu");
    clearTransitionListCSS(transitionList, transitionName);
    currentTransition = targetTransition.target.innerHTML;
    if (transitionName === "No Animation") {
        transitionList.children[transitionsListDict[currentTransition][0]].classList.add("selectedTransition");
    }
    else if (transitionName === "Float Down") {
        transitionList.children[transitionsListDict[currentTransition][0]].classList.add("selectedTransition");

    }
    else if (transitionName === "Spin To The Center") {
        transitionList.children[transitionsListDict[currentTransition][0]].classList.add("selectedTransition");

    }
    else if (transitionName === "FadeIn/Out") {
        transitionList.children[transitionsListDict[currentTransition][0]].classList.add("selectedTransition");

    }
}

function clearTransitionListCSS(transitionList, transitionName) {
    for (var i = 0; i < transitionList.children.length; i++) {
        transitionList.children[i].classList.remove("selectedTransition");
    }
}

function noAnimationTransition() {
    var canvas = document.getElementById("slideshowCanvas");
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(_images[listOfImgSrc[currentPhotoIndex]], canvas.height / 2, 0);
}

function floatDownTransition() {

}

function spinToTheCenterTransition() {

}

var alpha = 0;
function fadeInTransition() {
    var canvas = document.getElementById("slideshowCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = alpha;
    ctx.drawImage(_images[listOfImgSrc[currentPhotoIndex]], canvas.height / 2, 0);
    alpha += 0.01;
    if (alpha < 1) {
        requestAnimationFrame(fadeInTransition);
    }
    else {
        alpha = 0;
    }
}
