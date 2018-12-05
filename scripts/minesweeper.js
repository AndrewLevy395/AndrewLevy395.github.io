//board
var board;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//cells
var xCells = 10, yCells = 10;
var cellWidth = 10, cellHeight = 10;
var cellBorder = 1;

board = new Array(xCells);
	for (var i = 0; i < xCells; i++) {
		board[i] = new Array(yCells);
		for (var j = 0; j < yCells; j++) {
            board[i][j] = 0;
            drawRect(i, j);
		}
    }
    