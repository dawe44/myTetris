//import {map, shapes, colors} from "./structures.js";

// map[columns][row]
// y = columns, x = rows

//const matrix = new Array(5).fill(0).map(() => new Array(4).fill(0));
//5 is the number of rows and 4 is the number of columns.


// Mina globala variabler
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let cellSize = 30;
let columns = 20;
let rows = 10;
let posX = 3;
let posY = 0;
let score = 0;
let mapArray = new Array(columns).fill(0).map(() => new Array(rows).fill(0));
let stackArray = new Array(columns).fill(0).map(() => new Array(rows).fill(0));
let gameRunning = true;
let currTet;
let tetrominos = [];
let tetrominoColor = ["purple", "cyan", "blue", "violet", "orange", "green", "red"];
let currTetColor;
let direction;
let DIRECTION = {
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  UP: 4
};

document.addEventListener("DOMContentLoaded", InitializeCanvas()); //körs när hemsidan laddas

function InitializeCanvas(){ //Kör kod för att göra spelet redo för start
  drawBackground();
  drawCells();
  
  document.addEventListener("keydown", HandleKeyPress);

  loadTetrominos();
  loadNewTetromino();

  console.log(currTet);
  console.log(tetrominos);
  drawCurrPiece();
}

function drawBackground(){ //ritar bakgrunden i spelrutan canvas
  context.fillStyle = "seashell";
  context.fillRect(0, 0, canvas.width, canvas.height);

}



function drawCells(){ //ritar cellerna i spelrutan canvas
  for (i = 0; i < 400; i += cellSize){
    for(j = 0; j < 800; j += cellSize){
      context.strokeStyle = "lightgray";
      context.strokeRect(i, j, cellSize, cellSize);
    }
  }
}

function drawCurrPiece(){ //ritar spelarens pjäs på spelbaan
  for(let i = 0; i < currTet.length; i++){
    for(let j = 0; j < currTet[0].length; j++){
      if(currTet[i][j] == 1){
        mapArray[posY + i][posX + j] = 1;
        context.fillStyle = currTetColor;
        context.fillRect((posX + j)* cellSize, (posY + i) * cellSize, cellSize, cellSize);
        context.strokeStyle = "lightgray";
        context.strokeRect((posX +j)* cellSize, (posY + i) * cellSize, cellSize, cellSize);
      }
    }
  }
}

function deleteOldPiece(){//raderar spelarens pjäs
  for(let i = 0; i < currTet.length; i++){
    for(let j = 0; j < currTet[0].length; j++){
      if(currTet[i][j] == 1){
        mapArray[posY + i][posX + j] = 0;
        context.fillStyle = "seashell";
        context.fillRect((posX + j)* cellSize, (posY + i) * cellSize, cellSize, cellSize);
        context.strokeStyle = "lightgray";
        context.strokeRect((posX +j)* cellSize, (posY + i) * cellSize, cellSize, cellSize);
      }
    }
  }
}

function loadTetrominos(){//laddar Tetrominos till string listan
  tetrominos.push([[1, 1, 1],
                   [0, 1, 0]]); //T
  tetrominos.push([[1, 1, 1, 1]]); //I
  tetrominos.push([[1, 0, 0], 
                   [1, 1, 1]]); //J
  tetrominos.push([[1, 1], 
                   [1, 1]]);//O
  tetrominos.push([[0, 0, 1], 
                   [1, 1, 1]]);//L
  tetrominos.push([[0, 1, 1], 
                   [1, 1, 0]]);//S
  tetrominos.push([[1, 1, 0], 
                   [0, 1, 1]]);//Z
}

function loadNewTetromino(){ //laddar ny Tetromino till spelaren
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  currTet = tetrominos[randomTetromino];
  currTetColor = tetrominoColor[randomTetromino];
}

function HandleKeyPress(key){//kör kod när en tangent är i, gör så att spelarens Tetromino flyttar på sig
  if(gameRunning){
  if(key.keyCode === 37){ // left arrow button
    direction = DIRECTION.LEFT;
    if(legalMove() && legalMoveSide()){
      deleteOldPiece();
      posX--;
      drawCurrPiece();
    }
  }else if(key.keyCode === 39) { // right arrow button
    direction = DIRECTION.RIGHT;
      if(legalMove() && legalMoveSide()){
        deleteOldPiece();
        posX++;
        drawCurrPiece();
      }
  }else if(key.keyCode === 40){ // down arrow button
      direction = DIRECTION.DOWN;
      if(legalMove() && legalMoveSide()){
        deleteOldPiece();
        posY++;
        drawCurrPiece();
      }
  } else if(key.keyCode === 38){ // up arrow button
    direction = DIRECTION.UP;
    rotateClockwise();
  }
}
}

function legalMove(){ //kollar ifall spelarens flytt inte får Tetromino att hamna utanför banan
      if(posX == 0 && direction === DIRECTION.LEFT){
          return false;
      } else if(posX + currTet[0].length >= 10 && direction === DIRECTION.RIGHT){
          return false;
      }else if(posY + currTet.length >= 20 && direction === DIRECTION.DOWN){
          return false;
      }
  
  return true;
}

function legalMoveSide(){ // Kollar ifall spelarens flytt inte gör så att tetromino går in i en annan tetromino

  for(let y = 0; y < currTet.length; y++){
    for(let x = 0; x < currTet[0].length; x++){
        if(currTet[y][x] == 1 && stackArray[posY + y ][posX + x - 1] != 0 && direction === DIRECTION.LEFT){
          return false;
        }else if(currTet[y][x] == 1 && stackArray[posY + y][posX + x + 1] != 0 && direction === DIRECTION.RIGHT){
          return false;
        }else if(currTet[y][x] == 1 && stackArray[posY + y + 1][posX + x] != 0 && direction === DIRECTION.DOWN){
          return false;
        }
    }
  }
  return true;
}

function rotateClockwise() {//Roterar en tetromino 90 grader åt klockan
  let tempTet;

  let x = currTet.length;
  let y = currTet[0].length;

  if(currTet.length === 4){
      tempTet = [[]];

  }else if(currTet.length == 1){
      tempTet = [[],[], [], []];

  }else if(x < y){
     tempTet = [[],[], []];

  }else{
     tempTet = [[],[]];
  }

  for (let i=0; i<x; i++){
    for (let j=0;j<y; j++){
      tempTet [j][x-1-i] = currTet[i][j];
    }
  }

  deleteOldPiece();
  currTet = tempTet;
  if(posX + currTet[0].length > 10){
    if(currTet[0].length == 4){
      posX = posX - currTet[0].length + 1;

    }else{
    posX = posX - currTet[0].length + 2;
    }
  }
  drawCurrPiece();
}

window.setInterval(function (){ //kör kod var 750 milisekund
    if(gameRunning){
      updateGame();
    }
    document.getElementById("restartBtn").addEventListener("click", function() {
        resetGame();
          }); 
          
  }, 750);


function resetGame(){ //Återställer variabler och banan för ett nytt game
  
  for(let y = 0; y < 20; y++){
    for(let x = 0; x < 10; x++){
      stackArray[y][x] = 0;
      mapArray[y][x] = 0;
      context.fillStyle = "seashell";
      context.fillRect(x * cellSize,  y * cellSize, cellSize, cellSize);
      context.strokeStyle = "lightgray";
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  posX = 3;
  posY = 0;
  score = 0;
  deleteOldPiece();
  loadNewTetromino();
  drawCurrPiece();
  document.getElementById("score").innerHTML = 0;
  gameRunning = true;
}


//Kollar ifall spelarens tetromino hamnar på en annan tetromino, isåfall skapa en ny tetromino
//Kollar även om spelarens tetromino hamnar längst ner på spelbanan
//Om ingen kollision sker, flytta spelarens tetromino ett steg neddåt
//om kollision sker skapa ny tetromino för spelaren
function updateGame(){
  direction = DIRECTION.DOWN;

  let collision = false;

  for(let y = 0; y < currTet.length; y++){
    for(let x = 0; x < currTet[0].length; x++){
      if(posY + y < 19){
        if(currTet[y][x] == 1 && stackArray[posY + y + 1][posX + x] != 0){
          collision = true;

          break;
        }
      }
    }
    if(collision){
      break;
    }
  }

  if(posY + currTet.length >= 20 && collision != true){
    collision = true;
  }else if (!collision){
    deleteOldPiece();
    posY++;
    drawCurrPiece();
  }

  if(collision){

    if(posY <= 2){
        gameRunning = false;
        context.font = "40px Georgia";
        context.fillStyle = "black";
        context.fillStyle = "bold";
        context.fillText("Game Over!", 50, 200);
    }else{
      savePieceToMap();
      checkRows();
      //deleteOldPiece();
      loadNewTetromino();
      posX = 3;
      posY = 0;
      drawCurrPiece();
    }

  }

}

function checkRows(){//Kollar raderna på spelets array, om en eller flera hela rader finns ropa på MoveDownRows()
  let countCells = 0;
  let countRowsToDelete = 0;
  let startIndex = 0;

  for(let y = 0; y < 20; y++){
    for(let x = 0; x < 10; x++){
      countCells += mapArray[y][x];

    }
    if(countCells == 10){
      countRowsToDelete = countRowsToDelete + 1;
      if(startIndex == 0){
        startIndex = y;
      }
      for(let i = 0; i < 10; i++){
        mapArray[y][i] = 0;
        stackArray[y][i] = 0;
        context.fillStyle = "seashell";
        context.fillRect(i* cellSize, y * cellSize, cellSize, cellSize);
        context.strokeStyle = "lightgray";
        context.strokeRect(i* cellSize, y * cellSize, cellSize, cellSize);
      }
    }
    countCells = 0;
  }
  if(countRowsToDelete != 0){
    score = score + (countRowsToDelete * 100);
    document.getElementById("score").innerHTML = score;
    MoveDownRows(startIndex, countRowsToDelete);
  }
}

function MoveDownRows(startIndex, countRowsToDelete){ //flyttar rader neddåt efter att en rad har raderats
  for(let i = startIndex - 1; i >= 0; i--){
    for(let x = 0; x < 10; x++){
      let y2 = i + countRowsToDelete;
      let piece = stackArray[i][x];
      let nextPiece = stackArray[y2][x];

      if(piece != 0){
        nextPiece = piece;
        mapArray[y2][x] = 1;
        stackArray[y2][x] = piece;
        context.fillStyle = stackArray[y2][x];
        context.fillRect(x* cellSize, y2 * cellSize, cellSize, cellSize);
        context.strokeStyle = "lightgray";
        context.strokeRect(x* cellSize, y2 * cellSize, cellSize, cellSize);

        mapArray[i][x] = 0;
        stackArray[i][x] = 0;
        context.fillStyle = "seashell";
        context.fillRect(x* cellSize, i * cellSize, cellSize, cellSize);
        context.strokeStyle = "lightgray";
        context.strokeRect(x* cellSize, i * cellSize, cellSize, cellSize);

      }
    }
  }
}

function savePieceToMap(){//sparar en tetromino på spelarrayan och på stackArray
  for(let y = 0; y < currTet.length; y++){
    for(let x = 0; x < currTet[0].length; x++){
      if(currTet[y][x] == 1){
        stackArray[posY + y][posX + x] = currTetColor;
        mapArray[posY + y][posX + x] = 1;
      }
    }
  }
  console.log("StackArray");
  console.log(stackArray);
  console.log("MapArray");
  console.log(mapArray);
}



console.log(mapArray);