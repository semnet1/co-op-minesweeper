// variáveis globais
var mouse = {
    x:null, // posição do mouse relativo à tela
    y:null,
    abs:{ // posição do mouse relativo ao jogo
        x:null,
        y:null
    },
    down:false, // botão esquerdo
    when:0,
    moving:false
}
var pos = { // posição da tela relativa ao jogo
    x:0,
    y:0
}
var pin = { // posição do pin para mover o jogo
    x:null, // mouse
    y:null,
    pos:{ // tela
        x:null,
        y:null
    },
    zoom:null
}
var zoom = 2;

// detecta roda do mouse, seta o zoom de acordo
window.addEventListener('wheel', e => {
    if(!gameStarted) return;

    let oldZoom = zoom;
    zoom = zoom * (1 + e.deltaY/(-1000));

    if(zoom < 1){zoom = 1};
    if(zoom > 100){zoom = 100};

    pos.x += mouse.x/oldZoom - mouse.x/zoom;
    pos.y += mouse.y/oldZoom - mouse.y/zoom;

    render();
});

// detecta o clique do mouse e ativa o pin
window.onmousedown = e => {
    if(!gameStarted) return;

    mouse.down = true;
    mouse.when = Date.now();
    
    pin.x = mouse.x;
    pin.y = mouse.y;
}
window.onmouseup = e => {
    if(!gameStarted) return;

    mouse.down = false;
    canvas.style.cursor = null;
    
    if(!mouse.moving){
        if(e.which == 1){ // botão esquerdo
            let x = Math.floor((pos.x+mouse.x/zoom)/16);
            let y = Math.floor((pos.y+mouse.y/zoom)/16);
            if(!board[x] || !board[x][y]) return;

            leftClick();
            socket.emit("mouseclick", "leftClick", x, y);

        } else if(e.which == 3){ // botão direito
            let x = Math.floor((pos.x+mouse.x/zoom)/16);
            let y = Math.floor((pos.y+mouse.y/zoom)/16);
            if(!board[x] || !board[x][y]) return;

            rightClick();
            socket.emit("mouseclick", "rightClick", x, y);
        }
    }

    mouse.moving = false;
};

// detecta movimento do mouse, seta suas coordenadas
window.addEventListener("mousemove", function(e){
    if(!gameStarted) return;

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if(mouse.down){
        let dist = Math.sqrt(Math.abs(pin.x - mouse.x) + Math.abs(pin.y - mouse.y));
        if(mouse.moving){
            pos.x = pin.pos.x - ((pin.pos.x + mouse.x/zoom) - (pin.x/pin.zoom+pin.pos.x));
            pos.y = pin.pos.y - ((pin.pos.y + mouse.y/zoom) - (pin.y/pin.zoom+pin.pos.y));
        } else if(dist > 3){
            pin.x = mouse.x;
            pin.y = mouse.y;
            pin.pos.x = pos.x;
            pin.pos.y = pos.y;
            pin.zoom = zoom;

            mouse.moving = true;
            canvas.style.cursor = "move";
        }
    }

    socket.emit("updatepos", {
        x: pos.x+mouse.x/zoom,
        y: pos.y+mouse.y/zoom
    });

    render();
}, false);

// detecta movimento de outro jogador, seta suas coordenadas
socket.on("updatepos", (id, position) => {
    players[id].x = position.x;
    players[id].y = position.y;
    render();
});


// recebe o campo e atualiza ele
socket.on("getboard", board => {
    this.board = board;
});

socket.on("getprops", props => {
    console.log("properties", props);
    properties = props;
});

function mergeDeep(target, source) {
    for (let key in source) {
        if (typeof source[key] == "object") {
            if (!target[key]) Object.assign(target, { [key]: {} });
            mergeDeep(target[key], source[key]);
        } else {
            Object.assign(target, { [key]: source[key] });
        }
    }
}

// recebe informações novas do campo e atualiza ele
socket.on("boardinfo", changes => {
    mergeDeep(board, changes);

    render();
});

// recebe informações novas do campo e atualiza ele
socket.on("newtilesinfo", changes => {
    mergeDeep(board, changes);

    for(let x in changes){
        let column = changes[x];
        for(let y in column){
            let tile = board[x][y];
            let around = getTilesAround(tile);
            for(let tile of around){
                if(tile.sprite == "load"){
                    revealTile(tile);
                }
            }
        }
    }

    render();
});