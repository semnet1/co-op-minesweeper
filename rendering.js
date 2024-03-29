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
    "0":    {x:0  ,y: 0 },
    "1":    {x:16 ,y: 0 },
    "2":    {x:32 ,y: 0 },
    "3":    {x:48 ,y: 0 },
    "4":    {x:64 ,y: 0 },
    "5":    {x:80 ,y: 0 },
    "6":    {x:96 ,y: 0 },
    "7":    {x:112,y: 0 },
    "8":    {x:128,y: 0 },
    "bomb": {x:144,y: 0 },
    "flag": {x:0  ,y: 16},
    "unrv": {x:16 ,y: 16}, // unrevealed
    
    "load": [ // loading
        {x:32 ,y:16},
        {x:48 ,y:16},
        {x:64 ,y:16},
        {x:80 ,y:16},
        {x:96 ,y:16},
        {x:112,y:16},
        {x:128,y:16},
        {x:144,y:16}
    ]
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

    let sprite = spriteMap[tile];
    if(Array.isArray(sprite)){
        let frame = Math.floor(Date.now()/50) % sprite.length;
        sprite = sprite[frame];
    }

    ctx.drawImage(sprites, sprite.x, sprite.y, 16, 16, (x*16-pos.x)*zoom, (y*16-pos.y)*zoom, 16*zoom, 16*zoom);
}

let pressed = false;
setInterval(() => {
    if(!gameStarted) return;
    render();

    if(mobile && mouse.down && Date.now() > mouse.when+250 && !pressed && !zooming && !mouse.moving){
        pressed = true;
        // botão direito
        let x = Math.floor((pos.x+mouse.x/zoom)/16);
        let y = Math.floor((pos.y+mouse.y/zoom)/16);
        if(!board[x] || !board[x][y]) return;

        rightClick();
        socket.emit("mouseclick", "rightClick", x, y);
    }

    if(zooming){
        let dist1 = Math.sqrt(Math.abs(zoomtouch.x1 - zoomtouch.x2) + Math.abs(zoomtouch.y1 - zoomtouch.y2));
        let dist2 = Math.sqrt(Math.abs(mouse.x - mouse.x2) + Math.abs(mouse.y - mouse.y2));
        zoom = zoom * (dist2/dist1);
    
        if(zoom < 1){zoom = 1};
        if(zoom > 100){zoom = 100};
    
        zoomtouch.x1 = mouse.x;
        zoomtouch.x2 = mouse.x2;
        zoomtouch.y1 = mouse.y;
        zoomtouch.y2 = mouse.y2;
    
        render();
    }
}, 50);

// renderiza o jogo
function render(){
    if(!gameStarted) return;
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