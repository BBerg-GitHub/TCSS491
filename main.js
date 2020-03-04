var automata_canvas = document.getElementById("automata");
var automata_context = automata_canvas.getContext("2d");

var col = 200;
var row = 200;
var array = new Array(row); //original array
var temp = new Array(row); //updated array

var go = 0;
var start = false;

//color array: lght purp,lght blue, green, dk purp
var colorArray = ["#D8BFD8", "#E0FFFF", "#20B2AA", "#8B008B"];

//number array.
for (var i = 0; i < row; i += 1) {
    array[i] = new Array(col);
    temp[i] = new Array(col);
}

function define() {
    var x, y;
    for (var i = 0; i < 8000; i++) {
        x = parseInt(Math.random() * row);
        y = parseInt(Math.random() * col);
        array[x][y] = parseInt(Math.random() * 2); //number of possible states 0-1
    }
    draw();
}

function draw() {
    for (var m = 0; m < row; m++) {
        for (var n = 0; n < col; n++) {
            if (array[m][n] == 1) {
                automata_context.fillStyle = getRandomColor(); //fill cells
            } else {
                automata_context.fillStyle = "rgb(0,0,0)";
            }
            automata_context.beginPath();
            automata_context.fillRect(m * 15, n * 15, 25, 25);
            automata_context.closePath();
        }
    }
}

var next = define();

for (var i = 0; i < col; i++) {
    for (var j = 0; j < row; j++) {}
}

//count the value of the neighborhood
//3 x 3 Moore Neighborhood
function MooreNeigborhood(i, j) {
    var value = 0;
    if (array[i + 1][j - 1] == 1) {
        //top right
        value += 1;
    }
    if (array[i + 1][j] == 1) {
        value += 1;
    }
    if (array[i + 1][j + 1] == 1) {
        value += 1;
    }
    if (array[i][j - 1] == 1) {
        value += 1;
    }
    if (array[i][j + 1] == 1) {
        value += 1;
    }
    if (array[i - 1][j - 1] == 1) {
        value += 1;
    }
    if (array[i - 1][j] == 1) {
        value += 1;
    }
    if (array[i - 1][j + 1] == 1) {
        value += 1;
    }
    return value;
}

function rule1() {
    console.log("TEST");
    if (start) {
        for (i = 0; i < row; i++) {
            for (j = 0; j < col; j++) {
                if (
                    array[i] != undefined &&
                    array[i - 1] != undefined &&
                    array[i + 1] != undefined
                ) {
                    count = MooreNeigborhood(i, j);
                    if (count < 2 || count > 3) {
                        //Death(count =< 4 or count >= 1): overpopulation and loneliness
                        temp[i][j] = 0;
                    } else if (count == 3) {
                        //Birth(count = 3): exactly three neighbors
                        temp[i][j] = 1;
                    } else {
                        //Stagnant (all other states): state remains the same
                        temp[i][j] = array[i][j];
                    }
                }
            }
        }

        for (i = 0; i < row; i++) {
            for (j = 0; j < col; j++) {
                array[i][j] = temp[i][j];
            }
        }

        draw();
    }
}

function run() {
    define();
    time = setInterval(rule1, 20);
}

function start_button() {
    if (go == 0) {
        run();
        go += 1;
    }
    if (!start) {
        document.getElementById("button").setAttribute("value", "Stop");
        start = true;
    } else {
        document.getElementById("button").setAttribute("value", "Play");
        start = false;
    }
}

//Restart
function new_button() {
    run();
}

//Randomize the colors in each cell
function random_button() {
    draw();
}

//Randomize the color array
function getRandomColor() {
    return colorArray[(Math.random() * colorArray.length) | 0];
}

window.onload = function() {
    var socket = io.connect("http://24.16.255.56:8888");

    socket.on("load", function(data) {
        array = JSON.parse(data.data);
        temp = JSON.parse(data.data);
        console.log(data);
    });

    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");

    saveButton.onclick = function() {
        var myStuff = JSON.stringify(array);
        console.log(myStuff);
        console.log("save");
        text.innerHTML = "Saved.";
        socket.emit("save", {
            studentname: "Brandi Berg",
            statename: "aState",
            data: myStuff
        });
    };

    loadButton.onclick = function() {
        console.log("load");
        text.innerHTML = "Loaded.";
        socket.emit("load", { studentname: "Brandi Berg", statename: "aState" });
    };
};