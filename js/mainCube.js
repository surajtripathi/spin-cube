var maxz_node;
var sideLen = 100;

var node0 = [-sideLen, -sideLen, -sideLen];
var node1 = [-sideLen, -sideLen,  sideLen];
var node2 = [-sideLen,  sideLen, -sideLen];
var node3 = [-sideLen,  sideLen,  sideLen];
var node4 = [ sideLen, -sideLen, -sideLen];
var node5 = [ sideLen, -sideLen,  sideLen];
var node6 = [ sideLen,  sideLen, -sideLen];
var node7 = [ sideLen,  sideLen,  sideLen];
var nodes = [node0, node1, node2, node3, node4, node5, node6, node7];
var canvas_width;
var edge0  = [0, 1];
var edge1  = [1, 3];
var edge2  = [3, 2];
var edge3  = [2, 0];
var edge4  = [4, 5];
var edge5  = [5, 7];
var edge6  = [7, 6];
var edge7  = [6, 4];
var edge8  = [0, 4];
var edge9  = [1, 5];
var edge10 = [2, 6];
var edge11 = [3, 7];
var edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11];

var faces  = [[2,3,7,6],[1,3,7,5], [5,7,6,4], [4,6,2,0], [0,1,5,4], [0,2,3,1]];
var colors = ["#3F3278", "#170C4B", "#291C62", "#5D5191", "#361173", "#37377C"];


var mouseX1, mouseY1, mouseX2, mouseY2;

var rate = 100;
var runningX = false, myVarX, localthetaX = 0;
var runningY = false, myVarY, localthetaY = 0;
var runningZ = false, myVarZ, localthetaZ = 0;
var maxSpeed = 360;
var controlSpeed = 200;
var timeInt = 25;


var rotateY3D = function(theta) {
    localthetaY += theta;
    if(Math.abs(localthetaY)>maxSpeed)
        localthetaY = localthetaY> 0?maxSpeed:-maxSpeed;
    if(!runningY){
        runningY = true;
        myVarY =setInterval(function(){
            var sin_t = Math.sin(localthetaY/controlSpeed);
            var cos_t = Math.cos(localthetaY/controlSpeed);
            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                var x = node[0];
                var z = node[2];
                node[0] = x * cos_t - z * sin_t;
                node[2] = z * cos_t + x * sin_t;
            }
            localthetaY+=localthetaY>0?-rate:rate;
            if(Math.abs(Math.floor(localthetaY))<rate){
                clearInterval(myVarY);
                localthetaY = 0;
                runningY = false;
            }
        }, timeInt);
    }
};

var rotateX3D = function(theta) {
    localthetaX += theta;
    if(Math.abs(localthetaX)>maxSpeed)
        localthetaX = localthetaX>0?maxSpeed:-maxSpeed;
    if(!runningX){
        runningX = true;
        myVarX =setInterval(function(){
            var sin_t = Math.sin(localthetaX/controlSpeed);
            var cos_t = Math.cos(localthetaX/controlSpeed);
            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                var y = node[1];
                var z = node[2];
                node[1] = y * cos_t - z * sin_t;
                node[2] = z * cos_t + y * sin_t;
            }
            localthetaX+=localthetaX>0?-rate:rate;
            if(Math.abs(Math.floor(localthetaX))<rate){
                clearInterval(myVarX);
                localthetaX = 0;
                runningX = false;
            }

        }, timeInt);
    }
};

var rotateZ3D = function(theta) {
    localthetaZ += theta;
    if(Math.abs(localthetaZ)>maxSpeed)
        localthetaZ = localthetaZ>0?maxSpeed:-maxSpeed;
    if(!runningZ){
        runningZ = true;
        myVarZ =setInterval(function(){
            var sin = Math.sin(localthetaZ/controlSpeed );
            var cos = Math.cos(localthetaZ/controlSpeed);
            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                var x = node[0];
                var y = node[1];
                node[0] = x * cos - y * sin;
                node[1] = y * cos + x * sin;
            }
            localthetaZ+=localthetaZ>0?-rate:rate;
            if(Math.abs(Math.floor(localthetaZ))<rate){
                clearInterval(myVarZ);
                localthetaZ = 0;
                runningZ = false;
            }

        }, timeInt);
    }
};

initCanvas = function() {
    canvas = document.getElementById('cube');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('container').style.width = screen.width + "px";
    if (canvas.width < canvas.height)
        sideLen = canvas.width * 0.7;
    else
        sideLen = canvas.height * 0.7;
    context = canvas.getContext('2d');
    context.translate(canvas.width/2, canvas.height/2);

    rotateY3D((180 / Math.PI));
    rotateX3D((180 / Math.PI));
    rotateZ3D((180 / Math.PI));
};

var drawCube = function() {
    context.clearRect(-(canvas.width/2) , -(canvas.height/2), canvas.width, canvas.height);
    for ( i=0; i<12; i++) {
        var edge = edges[i];
        var start = nodes[edge[0]];
        var end = nodes[edge[1]];
        var cx1 = start[0];
        var cy1 = start[1];
        var cx2 = end[0];
        var cy2 = end[1];
        drawAnEdge(cx1, cy1, cx2, cy2);
    }
    colorFaces();
}

var drawAnEdge = function(x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke(); 
}

function getVertexWithMaxZ() {
    maxzv = 0;
    var maxz = 0;
    for (var i=0; i<8; i++) {
        if(nodes[i][2] > maxz) {
            maxz = nodes[i][2] ;
            maxz_node = i;
        }
    }
}

function colorFaces() {
   getVertexWithMaxZ();
   for (i=0; i<6; i++) {
        var face = faces[i];
        for (j=0; j<4; j++) {
            if (face[j] == maxz_node) {
                colorOneFace(face, i);
            }
        }
    }
}

var colorOneFace = function(face, i) {
    context.fillStyle = colors[i];
    context.beginPath();
    context.moveTo(nodes[face[0]][0], nodes[face[0]][1]);
    context.lineTo(nodes[face[1]][0], nodes[face[1]][1]);
    context.lineTo(nodes[face[2]][0], nodes[face[2]][1]);
    context.lineTo(nodes[face[3]][0], nodes[face[3]][1]);
    context.fill();
}

function mouseDown(e) {
    rate = 30;
    mouseX1 = e.pageX ;
    mouseY1 = e.pageY ;
    canvas.onmousemove = mousemove;
    canvas.touchmove = mousemove;
    canDrag = true;
}

function mousemove(e) {
    var getCubeElement = document.getElementById("cube");
    var leftLimit = getCubeElement.offsetLeft + 80;
    var rightLimit = getCubeElement.offsetLeft + getCubeElement.offsetWidth - 80;
    var TopLimit = getCubeElement.offsetTop + 80;
    var BottomLimit = getCubeElement.offsetTop + getCubeElement.offsetHeight - 80;
    var canSpin = e.pageX < rightLimit && e.pageX > leftLimit && e.pageY < BottomLimit && e.pageY > TopLimit;
    if (screen.width < 600  || canSpin){
        if (canDrag) {
            rate = 2;
            mouseX2 = mouseX1 - e.pageX;
            mouseY2 = mouseY1 - e.pageY;
            rotateZ3D((Math.atan(mouseX2/142)+ Math.atan(mouseY2/142))*0.007);
            rotateY3D(mouseX2 * 0.007 * (180/Math.PI));
            rotateX3D(mouseY2 * 0.007 * (180/Math.PI));
            mouseX1 = e.pageX;
            mouseY1 = e.pageY;
        }
    }
    else {
        //donothing
        canvas.onmousemove = null
        canvas.touchmove = null;
    }
}

function mouseUp(){
    rate = 2;
    canDrag = false;
    canvas.onmousemove = null;
    canvas.touchmove = null;
}

function preventDefaultTouch() {
    document.body.addEventListener("touchstart", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
    
    document.body.addEventListener("touchend", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);

    document.body.addEventListener("touchmove", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
}

function initListeners() {
    preventDefaultTouch();
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
           clientX: touch.clientX,
           clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
}

window.onload = function() {
    initCanvas();
    initListeners();
    setInterval(drawCube, timeInt);
};