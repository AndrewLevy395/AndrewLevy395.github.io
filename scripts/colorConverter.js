//game
var checkWin, gameOver;

//board
var board, newboard;

//spaces
var spaceLength;
var xspaces, randomR, randomC;

//colors
var randomColor, remaining, color, newcolor;

//movement
var xdir, ydir, movement, id, solokey, releasekey, fillmove;

//initialize when new game is clicked
$(document).ready(function() {
  $("#AboutMe #newButton").click(function() {
    $("#canvas").off();
    colorConverter = document.createElement("canvas");
    colorConverter.setAttribute("id", "colorConverter");
    colorConverter.height = 502;
    colorConverter.width = 502;
    mainCanvas = document.getElementById("canvas");
    ctx = mainCanvas.getContext("2d");
    $("#win").html("Game in progress");
    start();
  });
});

//creates spaces and makes them gray
var start = function() {
  spaceLength = 120;
  xspaces = 4;
  solokey = 0;
  releasekey = 0;
  gameOver = 0;
  board = new Array(xspaces);
  newboard = new Array(xspaces);
  for (i = 0; i < xspaces; i++) {
    board[i] = new Array(xspaces);
    newboard[i] = new Array(xspaces);
    for (j = 0; j < xspaces; j++) {
      board[i][j] = "";
      newboard[i][j] = "";
      ctx.fillStyle = "lightgray";
      ctx.fillRect(
        5 + i * 4 + i * spaceLength,
        5 + j * 4 + j * spaceLength,
        spaceLength,
        spaceLength
      );
    }
  }
  remaining = 10;
  //randomly fill in two starting spaces
  randomFill();
  randomFill();
  $("#score").html("Remaining Colors: " + remaining);
};

//fills random unoccupied space with either blue or purple
var randomFill = function() {
  randomR = Math.floor(Math.random() * xspaces);
  randomC = Math.floor(Math.random() * xspaces);
  if (board[randomR][randomC] != "") {
    randomFill();
  } else {
    randomColor = Math.floor(Math.random() * 7);
    if (randomColor >= 2) {
      board[randomR][randomC] = "blue";
    } else {
      board[randomR][randomC] = "purple";
      remaining = Math.min(remaining, 9);
    }
  }
  fill(randomR, randomC);
};

//fill in space with color
var fill = function(r, c) {
  ctx.fillStyle = board[r][c];
  if (board[r][c] == "") {
    ctx.fillStyle = "lightgray";
  }
  ctx.fillRect(
    5 + r * 4 + r * spaceLength,
    5 + c * 4 + c * spaceLength,
    spaceLength,
    spaceLength
  );
};

//direction from arrow keys
$(document).keydown(function(e) {
  e.preventDefault();
  if (gameOver == 0) {
    if (solokey == 0 && releasekey == 0) {
      solokey = 1;
      releasekey = 1;
      movement = 1;
      fillmove = 0;
      if (e.which == 38) {
        //up
        xdir = 0;
        ydir = -1;
      } else if (e.which == 40) {
        //down
        xdir = 0;
        ydir = 1;
      } else if (e.which == 39) {
        //right
        xdir = 1;
        ydir = 0;
      } else if (e.which == 37) {
        //left
        xdir = -1;
        ydir = 0;
      }
      //display spaces every .2 seconds
      id = setInterval(frame, 200, xdir, ydir);
    }
  }
});

$(document).keyup(function(e) {
  releasekey = 0;
});

//checks if space is available and then moves piece there
var move = function(xdir, ydir) {
  for (col = 0; col < board.length; col++) {
    for (row = 0; row < board[col].length; row++) {
      //checks if board is occupied
      if (board[col][row] != "") {
        //checks if piece is moving out of bounds
        if (
          col + xdir >= 0 &&
          col + xdir <= 3 &&
          row + ydir >= 0 &&
          row + ydir <= 3
        ) {
          //checks if piece is moving into piece of the same color
          if (board[col + xdir][row + ydir] == board[col][row]) {
            //checks if piece 2 away is out of bounds
            if (
              col + xdir + xdir < 0 ||
              col + xdir + xdir > 3 ||
              row + ydir + ydir < 0 ||
              row + ydir + ydir > 3
            ) {
              newboard[col + xdir][row + ydir] = convert(board[col][row]);
              newboard[col][row] = "";
              board[col][row] = "";
              board[col + xdir][row + ydir] = "";
              movement = 1;
              //checks if its pieces turn to move when 3 in a row collide
            } else if (
              board[col + xdir + xdir][row + ydir + ydir] ==
              board[col + xdir][row + ydir]
            ) {
              newboard[col][row] = board[col][row];
              //result is neither of: 2 away is out of bounds, 3 in a row
            } else {
              newboard[col + xdir][row + ydir] = convert(board[col][row]);
              newboard[col][row] = "";
              board[col][row] = "";
              board[col + xdir][row + ydir] = "";
              movement = 1;
            }
            //result is not moving into piece of same color but still moving
          } else if (board[col + xdir][row + ydir] == "") {
            newboard[col + xdir][row + ydir] = board[col][row];
            movement = 1;
            //result is not moving
          } else {
            newboard[col][row] = board[col][row];
          }
          //result is piece is moving out of bounds so dont move
        } else {
          newboard[col][row] = board[col][row];
        }
      }
    }
  }
  //display board with movements
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      board[i][j] = newboard[i][j];
      fill(i, j);
      newboard[i][j] = "";
    }
  }
};

//determine when pieces should stop moving
function frame(xdir, ydir) {
  if (movement == 0) {
    if (fillmove > 1) {
      randomFill();
      fullBoardCheck();
      $("#score").html("Remaining Colors: " + remaining);
    }
    solokey = 0;
    clearInterval(id);
  } else {
    movement = 0;
    move(xdir, ydir);
    fillmove++;
  }
}

//checks if board is full
function fullBoardCheck() {
  checkWin = 0;
  for (col = 0; col < board.length; col++) {
    for (row = 0; row < board[col].length; row++) {
      if (board[col][row] == "") {
        checkWin++;
      }
    }
  }
  if (checkWin == 0) {
    gameOver = 1;
    $("#score").html("You Lose :(");
  }
}

//convert color to next color in sequence
function convert(color) {
  switch (color) {
    case "blue":
      newcolor = "purple";
      remaining = Math.min(remaining, 9);
      break;
    case "purple":
      newcolor = "darkgreen";
      remaining = Math.min(remaining, 8);
      break;
    case "darkgreen":
      newcolor = "greenyellow";
      remaining = Math.min(remaining, 7);
      break;
    case "greenyellow":
      newcolor = "yellow";
      remaining = Math.min(remaining, 6);
      break;
    case "yellow":
      newcolor = "orange";
      remaining = Math.min(remaining, 5);
      break;
    case "orange":
      newcolor = "red";
      remaining = Math.min(remaining, 4);
      break;
    case "red":
      newcolor = "pink";
      remaining = Math.min(remaining, 3);
      break;
    case "pink":
      newcolor = "gray";
      remaining = Math.min(remaining, 2);
      break;
    case "gray":
      newcolor = "brown";
      remaining = Math.min(remaining, 1);
      break;
    case "brown":
      newcolor = "black";
      remaining = 0;
      $("#score").html("You Win!");
  }
  return newcolor;
}
