//board
var board;

//spaces
var spaceLength;
var xspaces, randomR, randomC;

//colors
var randomColor, remaining;

//extra
var direction;

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
  board = new Array(xspaces);
  for (i = 0; i < xspaces; i++) {
    board[i] = new Array(xspaces);
    for (j = 0; j < xspaces; j++) {
      board[i][j] = "";
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
    randomColor = Math.floor(Math.random() * 3);
    if (randomColor >= 1) {
      board[randomR][randomC] = "blue";
    } else {
      board[randomR][randomC] = "purple";
      remaining = 9;
    }
  }
  ctx.fillStyle = board[randomR][randomC];
  ctx.fillRect(
    5 + randomR * 4 + randomR * spaceLength,
    5 + randomC * 4 + randomC * spaceLength,
    spaceLength,
    spaceLength
  );
};

//direction from arrow keys
$(document).keydown(function(e) {
  e.preventDefault();
  if (e.which == 38) {
    direction = "up";
  } else if (e.which == 40) {
    direction = "down";
  } else if (e.which == 39) {
    direction = "right";
  } else if (e.which == 37) {
    direction = "left";
  }
  randomFill();
  $("#score").html("Remaining Colors: " + remaining);
});
