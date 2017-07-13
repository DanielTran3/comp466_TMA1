var _images = {}
var buttonNameDict = {};
function preloadImages() {
    var listOfImgSrc = ['gabled_roof.png', 'hipped_roof.png', 'shed_roof.png'];
    var listOfImgCaptions = ['1', '2', '3'];
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

function initButtonNameDict() {
    var initialButtonValue = ['Start', 'Sequential', 'Forward'];
    var pressedButtonValue = ['Stop', 'Random', 'Backward'];
    for (var i = 0; i < initialButtonValue.length; i++) {
        buttonNameDict[initialButtonValue[i]] = pressedButtonValue[i];
        buttonNameDict[pressedButtonValue[i]] = initialButtonValue[i];
    }
}

function initListeners() {
    var startButton = document.getElementById("start_stop_button");
    startButton.addEventListener("click", function() {
        changeButtonValue(startButton);
    });
    var sequentialButton = document.getElementById("random_sequential_button");
    sequentialButton.addEventListener("click", function() {
        changeButtonValue(sequentialButton);
    });
    var randomButton = document.getElementById("forward_backward_button");
    randomButton.addEventListener("click", function() {
        changeButtonValue(randomButton);
    });
}

function startStop(button) {
}

function changeButtonValue(button) {
    button.innerHTML = buttonNameDict[button.innerHTML];
}

function displayImageOnCanvas(imgName) {
    var canvas = document.getElementById("slideshowCanvas");
    var image = _images[imgName];
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
    ctx.drawImage(_images[imgName], canvas.height / 2, 0);
}

function initCanvas() {
    var canvas = document.getElementById("slideshowCanvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.style.maxHeight = "89vh";
    canvas.style.maxWidth = "100%";
    displayImageOnCanvas('shed_roof.png');
}