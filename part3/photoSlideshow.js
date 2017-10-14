var _images = {}
var buttonNameDict = {};
var listOfImgSrc = ['../shared/beef_tartare.png', '../shared/blazePizza.png', '../shared/chinese_shaved_ice.png', '../shared/edmonton_fireworks.png',
                    '../shared/edmonton_riverValley.png', '../shared/edmonton_sunset.png', '../shared/homemade_mango_cake.png', 
                    '../shared/homemade_origami.png', '../shared/homemade_pizza.png', '../shared/homemade_steak_and_veggies.png', 
                    '../shared/homemade_tacos.png', '../shared/homemade_tacosalad.png', '../shared/korean_hot_wings.png', 
                    '../shared/nature.png', '../shared/ramen.png', '../shared/sushi.png', '../shared/thePint_wings.png', '../shared/toma_burger.png',
                    '../shared/toronto_cityView1.png', '../shared/toronto_cityView2.png', '../shared/toronto_traintracks.png'];
var listOfImgCaptions = ['Beef Tartare', 'Blaze Pizza custom pizza', 'Chinese Shaved Ice',
                         'Edmonton Fireworks', 'Edmonton River Valley', 'Edmonton Sunset',
                         'Homemade Mango Cake', 'Homemade Origami Bird and Basket', 'Homemade Pizza',
                         'Homemade Steak and Broccoli', 'Homemade Tacos', 'Homemade Taco Salad',
                         'Korean Hot Wings', 'Nature View', 'Ramen', 'Sushi', 'The Pint Wings (40 Wings)',
                         'Toma Burger', 'View of Toronto 1', 'View of Toronto 2', 'Old Train Tracks in Toronto'];
var transitionsListDict = {};
var photoInterval;
var currentTransition;
var currentPhotoIndex = 0;
var transitionFunctionList = [noAnimationTransition, floatDownTransition, fadeInTransition];

var yPos = -400;
var xPos = 0;
var angle = 0;
var alpha = 0;

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

function scaleImage(image, canvas) {
    var scale = 0.8;
    // Get the actual height and width of the image
    var height = image.naturalHeight;
    var width = image.naturalWidth;
    // Compare with the current size of the canvas
    while(height > (canvas.clientHeight * scale) || width > (canvas.clientWidth * scale)) {
        height *= scale;
        width *= scale;
    } 
    return [width, height];
}

function displayImageOnCanvas() {
    transitionsListDict[currentTransition][1]();
}

function initCanvas() {
    var canvas = document.getElementById("slideshowCanvas");
    canvas.style.width = "100%";
    canvas.style.height = "80vh";
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.style.maxHeight = "80vh";
    canvas.style.maxWidth = "100%";
    var ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
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
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    var image = _images[listOfImgSrc[currentPhotoIndex]];
    var dimensions = scaleImage(image, canvas);
    ctx.drawImage(image, -dimensions[0] / 2, -dimensions[1] / 2, dimensions[0], dimensions[1]);
    document.getElementById("captionLabel").innerHTML = image.caption;
}

function floatDownTransition() {
    var canvas = document.getElementById("slideshowCanvas");
    var ctx = canvas.getContext("2d");
    var image = _images[listOfImgSrc[currentPhotoIndex]];
    var dimensions = scaleImage(image, canvas);
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.drawImage(image, -dimensions[0] / 2, yPos+=5, dimensions[0], dimensions[1]);
    document.getElementById("captionLabel").innerHTML = image.caption;
    if (yPos < -dimensions[1] / 2) {
        requestAnimationFrame(floatDownTransition);
    }
    else {
        yPos = -400;
    }
}

function fadeInTransition() {
    var canvas = document.getElementById("slideshowCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.globalAlpha = alpha;
    var image = _images[listOfImgSrc[currentPhotoIndex]];
    var dimensions = scaleImage(image, canvas);    
    ctx.drawImage(image, -dimensions[0] / 2, -dimensions[1] / 2, dimensions[0], dimensions[1]);
    document.getElementById("captionLabel").innerHTML = image.caption;
    alpha += 0.01;
    if (alpha < 1) {
        requestAnimationFrame(fadeInTransition);
    }
    else {
        alpha = 0;
    }
}
