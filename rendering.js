var rooms = {};
var players = {};

class Tile {
    constructor(x, y, revealed, bomb, flagged, sprite){
        this.x = x,
        this.y = y
        this.revealed = revealed;
        this.bomb = bomb;
        this.flagged = flagged;
        this.sprite = sprite;
    }
}

var board = {};

// define o canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//imagens
var spriteMap = {
    "0":    0,
    "1":    16,
    "2":    32,
    "3":    48,
    "4":    64,
    "5":    80,
    "6":    96,
    "7":    112,
    "8":    128,
    "bomb": 144,
    "flag": 160,
    "unrv": 176, // unrevealed
    "wall": 192
};
var sprites = new Image();
sprites.src = "themes/default/sprites.png";
var cursor = new Image();
cursor.src = "img/cursor.png";

// atualiza o tamanho do canvas
resize();
window.onresize = resize;
function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;
    if(gameStarted) render();
}

// desenha um tile
function drawTile(tile, x, y){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprites, spriteMap[tile], 0, 16, 16, (x*16-pos.x)*zoom, (y*16-pos.y)*zoom, 16*zoom, 16*zoom);
}

// renderiza o jogo
function render(){
    // apaga o canvas
    ctx.fillStyle = "#36393f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // renderiza os tiles
    for(x in board){
        var column = board[x];
        for(y in column){
            var tile = board[x][y];
            drawTile(tile.sprite, x, y);
        }
    }

    // desenha o cursor dos outros jogadores
    for(id in players){
        ctx.drawImage(cursor, 0, 0, cursor.width, cursor.height, (players[id].x-pos.x)*zoom, (players[id].y-pos.y)*zoom, cursor.width, cursor.height);
    }
}

// recebe uma mensagem e renderiza ela
socket.on("message", (id, message) => {
});