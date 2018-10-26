function Queue () {
    this.buf = [];
    this.size = 0;
    this.isEmpty = function () {
        return this.size == 0;
    }
    this.front = function () {
        if (this.isEmpty()) {
            return undefined;
        } else {
            return this.buf[0];
        }
    }
    this.end = function () {
        if (this.isEmpty()) {
            return undefined;
        } else {
            return this.buf[this.size-1];
        } 
    }
    this.enqueue = function (info) {
        this.buf.push(info);
        ++this.size;
    }
    this.dequeue = function () {
        if(!this.isEmpty()) {
            --this.size;
            return this.buf.shift();
        }
    }
}

var SIZE = undefined;
var MATRIX = undefined;
var FOOD = undefined;
var SNAKE = new Queue();
var DIRECTION = "up";
var ONGAME = false;

function initTable (size = 20) {
    SIZE = size;
    document.write('<table id="board">');
    for (var r = 0; r < size; ++r) {
        document.write('<tr id="R',r,'">');
        for (var c = 0; c < size; ++c) {
            document.write('<td id="R',r,'C',c,'"></td>');
        }
        document.write('</tr>');
    }
    document.write('</table>');
}

function initMatrix () {
    MATRIX = new Array();
    for (var x = 0; x < SIZE; ++x) {
        MATRIX[x] = new Array();
        for (var y = 0; y < SIZE; ++y) {
            MATRIX[x][y] = 0;
        }
    }
}

function checkBlock (coord, set = false) {
    result = MATRIX[coord[0]][coord[1]];
    if (set) {
        if (result) {
            MATRIX[coord[0]][coord[1]] = 0;
        } else {
            MATRIX[coord[0]][coord[1]] = 1;
        }
    }
    return result;
}

function getRandomCoordinate () {
    var ranx = Math.floor(Math.random() * SIZE);
    var rany = Math.floor(Math.random() * SIZE);
    return [ranx,rany];
}

function getCoordString (coord) {
    return "R" + String(coord[0]) + "C" + String(coord[1]);
}

function initSnake () {
    for (var a = 13; a >= 10; --a) {
        checkBlock([a,10],true);
        SNAKE.enqueue([a,10]);
        document.getElementById(getCoordString([a,10])).style.backgroundColor = "#000";
    }
    document.getElementById(getCoordString(SNAKE.end())).style.backgroundColor = "#F00";
}

function setFood () {
    var coord = [5,10];
    while (checkBlock(coord)) {
        coord = getRandomCoordinate();
    }
    FOOD = coord;
    document.getElementById(getCoordString(coord)).style.backgroundColor = "#FF0";
}

function proceed () {
    document.getElementById(getCoordString(SNAKE.end())).style.backgroundColor = "#000";
    var oldHead = SNAKE.end();
    var newCoord = undefined;
    switch (DIRECTION) {
        case "up": newCoord = [oldHead[0]-1,oldHead[1]]; break;
        case "down": newCoord = [oldHead[0]+1,oldHead[1]]; break;
        case "left": newCoord = [oldHead[0],oldHead[1]-1]; break;
        case "right": newCoord = [oldHead[0],oldHead[1]+1]; break;
    }
    if (newCoord[0]<0 || newCoord[0]>=20 || newCoord[1]<0 || newCoord[1]>=20 || checkBlock(newCoord)) {
        window.clearInterval();
        window.alert("You lose");
        ONGAME = false;
        document.getElementById("start").onclick = "javascript:0";
    }
    SNAKE.enqueue(newCoord);
    checkBlock(SNAKE.end(), true);
    document.getElementById(getCoordString(SNAKE.end())).style.backgroundColor = "#F00";
    if (newCoord[0] == FOOD[0] && newCoord[1] == FOOD[1]) {
        setFood ();
    } else {
        document.getElementById(getCoordString(SNAKE.front())).style.backgroundColor = "whitesmoke";
        checkBlock(SNAKE.dequeue(), true);
    }
}

document.onkeyup = function(k) {
    switch(k.keyCode) {
        case 37:
            if (DIRECTION != "right") {
                DIRECTION = "left";
            }
            break;
        case 38:
            if (DIRECTION != "down") {
                DIRECTION = "up";
            }
            break;
        case 39:
            if (DIRECTION != "left") {
                DIRECTION = "right";
            }
            break;
        case 40:
            if (DIRECTION != "up") {
                DIRECTION = "down";
            }
            break;
    }
}

function cleanBoard () {
    window.clearInterval();
    while (!SNAKE.isEmpty()) {
        document.getElementById(getCoordString(SNAKE.dequeue())).style.backgroundColor = "whitesmoke";
    }
    document.getElementById(getCoordString(FOOD)).style.backgroundColor = "whitesmoke";
}