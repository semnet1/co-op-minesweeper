var players = {};

// define o canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//imagens
var spriteMap = {
    "0":          {"x": 0,   "y": 0 },
    "1":          {"x": 16,  "y": 0 },
    "2":          {"x": 32,  "y": 0 },
    "3":          {"x": 48,  "y": 0 },
    "4":          {"x": 64,  "y": 0 },
    "5":          {"x": 80,  "y": 0 },
    "6":          {"x": 96,  "y": 0 },
    "7":          {"x": 112, "y": 0 },
    "8":          {"x": 128, "y": 0 },
    "bomb":       {"x": 32,  "y": 16},
    "flag":       {"x": 64,  "y": 16},
    "unrevealed": {"x": 80,  "y": 16}
};
var sprites = new Image();
sprites.src = "img/sprites.png";
var cursor = new Image();
cursor.src = "img/cursor.png";

// variáveis globais
var mouse = {
    x:null,
    y:null,
    down:false
}
var pos = {
    x:0,
    y:0
}
var pin = {
    x:null,
    y:null,
    zoom:null,
    pos:{x:null, y:null}
}
var zoom = 1;

// atualiza o tamanho do canvas
resize();
window.onresize = resize;
function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;
    render();
}

// desenha um sprite
function draw(image, x, y){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprites, spriteMap[image].x, spriteMap[image].y, 16, 16, (x-pos.x)*zoom, (y-pos.y)*zoom, 16*zoom, 16*zoom);
}

// detecta roda do mouse, seta o zoom de acordo
window.addEventListener('wheel', (e) => {
    let oldZoom = zoom;
    zoom = zoom * (1 + e.deltaY/(-1000));

    if(zoom < 1){zoom = 1};
    if(zoom > 100){zoom = 100};

    pos.x += mouse.x/oldZoom - mouse.x/zoom;
    pos.y += mouse.y/oldZoom - mouse.y/zoom;

    render();
});

// detecta o clique do mouse e ativa o pin
window.onmousedown = function(){
    mouse.down = true;
    
    pin.x = mouse.x;
    pin.y = mouse.y;
    pin.pos.x = pos.x;
    pin.pos.y = pos.y;
    pin.zoom = zoom;
}
window.onmouseup = function(){
    mouse.down = false;
    canvas.style.cursor = null;
};

// detecta movimento do mouse, seta suas coordenadas
window.addEventListener("mousemove", function(e){
    if(!gameStarted) return;

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if(mouse.down){
        canvas.style.cursor = "move";

        pos.x = pin.pos.x - ((pin.pos.x + mouse.x/zoom) - (pin.x/pin.zoom+pin.pos.x));
        pos.y = pin.pos.y - ((pin.pos.y + mouse.y/zoom) - (pin.y/pin.zoom+pin.pos.y));
    }

    console.log("you moved!");
    socket.emit("updatepos", {
        x: pos.x+mouse.x/zoom,
        y: pos.y+mouse.y/zoom
    });

    render();
}, false);

function render(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw("flag", 0, 0);
    draw("bomb", 16, 0);

    for(id in players){
        ctx.drawImage(cursor, 0, 0, cursor.width, cursor.height, (players[id].x-pos.x)*zoom, (players[id].y-pos.y)*zoom, cursor.width, cursor.height);
    }
}