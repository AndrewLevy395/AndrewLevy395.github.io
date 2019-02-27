//board
var board, minesweeper, mainCanvas, ctx;

//mouse
var mouseX, mouseY, clicks;

//cells
var xCells, yCells;
var cellWidth, cellHeight;
var cellBorder;
var cellRow, cellColumn;

//mines
var numMines, flaggedMines;

//cell values
class cell {
  constructor(leftClicked, rightClicked, neighbors, mine) {
    this.leftClicked = leftClicked;
    this.rightClicked = rightClicked;
    this.neighbors = neighbors;
    this.mine = mine;
  }
}

//remove right click menu
document.oncontextmenu = function() {
  return false;
};

//initialize game when new game is clicked
$(document).ready(function() {
  $("#AboutMe #newButton").click(function() {
    $("#canvas").off();
    minesweeper = document.createElement("canvas");
    minesweeper.setAttribute("id", "minesweeper");
    minesweeper.height = 502;
    minesweeper.width = 502;
    mainCanvas = document.getElementById("canvas");
    ctx = mainCanvas.getContext("2d");
    $("#score").html("Flagged Mines: 0");
    $("#win").html("Game in progress");
    start();
  });
});

//updates score
var updateScore = function() {
  $("#score").html("Flagged Mines: " + flaggedMines);
};

//when game is in progress
var start = function() {
  cellWidth = 49;
  cellHeight = 49;
  xCells = 10;
  yCells = 10;
  numMines = 20;
  flaggedMines = 0;
  clicks = 0;
  var i, j, k;

  //initializes board
  board = new Array(xCells);
  for (i = 0; i < xCells; i++) {
    board[i] = new Array(yCells);
    for (j = 0; j < yCells; j++) {
      board[i][j] = new cell(0, 0, 0, 0);
      ctx.fillStyle = "gray";
      ctx.fillRect(1 + i + i * 49, 1 + j + j * 49, cellWidth, cellHeight);
    }
  }

  //sets mines to board
  k = 0;
  while (k < numMines) {
    randMineRow = Math.floor(Math.random() * xCells);
    randMineColumn = Math.floor(Math.random() * yCells);
    if (board[randMineColumn][randMineRow].mine == 0) {
      board[randMineColumn][randMineRow].mine = 1;
      k += 1;
    }
  }

  //counts neighbors for each cell
  var countNeighbors = function(x, y) {
    var neighbors = 0;
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (x + i >= 0 && x + i < xCells && y + j >= 0 && y + j < yCells) {
          if (board[x + i][y + j].mine == 1) {
            neighbors += 1;
          }
        }
      }
    }
    return neighbors;
  };

  //sets neighbor count to each cell
  for (i = 0; i < xCells; i++) {
    for (j = 0; j < yCells; j++) {
      board[i][j].neighbors = countNeighbors(i, j);
    }
  }

  //when mouse is pressed on canvas
  $("canvas").mousedown(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    mouseX -= canvas.offsetLeft;
    mouseY -= canvas.offsetTop;
    cellRow = Math.floor(mouseY / cellHeight);
    cellColumn = Math.floor(mouseX / cellWidth);

    //left click
    if (e.button == 0) {
      leftClick(cellColumn, cellRow);
    }

    //right click flags cell
    if (e.button == 2 && board[cellColumn][cellRow].leftClicked == 0) {
      if (board[cellColumn][cellRow].rightClicked == 0) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
          1 + cellColumn * 1 + cellColumn * 49,
          1 + cellRow * 1 + cellRow * 49,
          cellWidth,
          cellHeight
        );
        board[cellColumn][cellRow].rightClicked = 1;
        flaggedMines += 1;
        updateScore();
      } else if (board[cellColumn][cellRow].rightClicked == 1) {
        ctx.fillStyle = "gray";
        ctx.fillRect(
          1 + cellColumn * 1 + cellColumn * 49,
          1 + cellRow * 1 + cellRow * 49,
          cellWidth,
          cellHeight
        );
        board[cellColumn][cellRow].rightClicked = 0;
        flaggedMines -= 1;
        updateScore();
      }
    }
  });

  //left click opens cell and posts neighbors
  var leftClick = function(cellColumn, cellRow) {
    if (board[cellColumn][cellRow].leftClicked == 0) {
      clicks += 1;
      ctx.fillStyle = "white";
      ctx.fillRect(
        1 + cellColumn * 1 + cellColumn * 49,
        1 + cellRow * 1 + cellRow * 49,
        cellWidth,
        cellHeight
      );
      board[cellColumn][cellRow].leftClicked = 1;
      if (board[cellColumn][cellRow].rightClicked == 1) {
        flaggedMines -= 1;
        board[cellColumn][cellRow].rightClicked = 0;
      }
      if (board[cellColumn][cellRow].mine == 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
          1 + cellColumn * 1 + cellColumn * 49,
          1 + cellRow * 1 + cellRow * 49,
          cellWidth,
          cellHeight
        );
        $("#win").html("You Lose :(");
        showAllCells(0);
      } else if (board[cellColumn][cellRow].neighbors > 0) {
        ctx.fillStyle = "black";
        ctx.font = "30px serif";
        ctx.fillText(
          board[cellColumn][cellRow].neighbors,
          (cellColumn + 0.52) * cellWidth,
          (cellRow + 0.75) * cellHeight
        );
      } else if (board[cellColumn][cellRow].neighbors == 0) {
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            if (
              cellColumn + i >= 0 &&
              cellColumn + i < xCells &&
              cellRow + j >= 0 &&
              cellRow + j < yCells
            ) {
              leftClick(cellColumn + i, cellRow + j);
            }
          }
        }
      }
    }
    gameWon();
  };

  //checks to see if game has been won
  var gameWon = function() {
    if (clicks >= xCells * yCells - numMines) {
      $("#win").html("You Win!");
      showAllCells(1);
    }
  };

  //reveals all cells to players
  var showAllCells = function(win) {
    for (i = 0; i < xCells; i++) {
      for (j = 0; j < yCells; j++) {
        board[i][j].leftClicked = 1;
        if (board[i][j].mine == 0) {
          ctx.fillStyle = "white";
          ctx.fillRect(
            1 + i * 1 + i * 49,
            1 + j * 1 + j * 49,
            cellWidth,
            cellHeight
          );
          if (board[i][j].neighbors > 0) {
            ctx.fillStyle = "black";
            ctx.font = "30px serif";
            ctx.fillText(
              board[i][j].neighbors,
              (i + 0.5) * cellWidth,
              (j + 0.75) * cellHeight
            );
          }
        } else if (win == 0) {
          ctx.fillStyle = "blue";
          ctx.fillRect(
            1 + i * 1 + i * 49,
            1 + j * 1 + j * 49,
            cellWidth,
            cellHeight
          );
        } else if (win == 1) {
          ctx.fillStyle = "green";
          ctx.fillRect(
            1 + i * 1 + i * 49,
            1 + j * 1 + j * 49,
            cellWidth,
            cellHeight
          );
        }
      }
    }
  };
};
