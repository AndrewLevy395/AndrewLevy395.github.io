//board
var board, newboard;

//spaces
var spaceLength;
var xspaces, randomR, randomC;

//colors
var randomColor, remaining, color, newcolor;

//movement
var xdir, ydir, movement, id, solokey, releasekey;

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
      remaining = 9;
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
  if (solokey == 0 && releasekey == 0) {
    solokey = 1;
    releasekey = 1;
    movement = 1;
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
    $("#score").html("Remaining Colors: " + remaining);
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
            newboard[col + xdir][row + ydir] = convert(board[col][row]);
            newboard[col][row] = "";
            board[col][row] = "";
            board[col + xdir][row + ydir] = "";
            movement = 1;
          } else if (board[col + xdir][row + ydir] == "") {
            newboard[col + xdir][row + ydir] = board[col][row];
            movement = 1;
          } else {
            newboard[col][row] = board[col][row];
          }
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
    randomFill();
    solokey = 0;
    clearInterval(id);
  } else {
    movement = 0;
    move(xdir, ydir);
  }
}

//convert color to next color in sequence
function convert(color) {
  switch (color) {
    case "blue":
      newcolor = "purple";
      break;
    case "purple":
      newcolor = "darkgreen";
      break;
    case "darkgreen":
      newcolor = "greenyellow";
      break;
    case "greenyellow":
      newcolor = "yellow";
      break;
    case "yellow":
      newcolor = "orange";
      break;
    case "orange":
      newcolor = "red";
      break;
    case "red":
      newcolor = "pink";
      break;
    case "pink":
      newcolor = "gray";
      break;
    case "gray":
      newcolor = "brown";
      break;
    case "brown":
      newcolor = "black";
  }
  return newcolor;
}
