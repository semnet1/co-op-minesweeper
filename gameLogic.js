function getTilesAround(tile){
    let tiles = [];

    for(let i = -1; i < 2; i++){ 
        for(let j = -1; j < 2; j++){
            if(i == 0 && j == 0) continue;
            if(board[tile.x+j] && board[tile.x+j][tile.y+i]){
                tiles.push(board[tile.x+j][tile.y+i]);
            }
        }
    }
    return tiles;
}

function revealTile(tile){
    let around = getTilesAround(tile);
    if(around.length < 8 && properties.size == "infinite"){
        tile.revealed = true;
        tile.sprite = "load";
        return;
    }

    let count = 0;
    for(let tile of around){
        if(tile.bomb) count++
    }
    tile.sprite = count.toString();
    tile.revealed = true;

    if(count == 0){
        for(let tile of around){
            if(!tile.revealed) revealTile(tile);
        }
    }
}

function leftClick(){
    let x = Math.floor((pos.x+mouse.x/zoom)/16);
    let y = Math.floor((pos.y+mouse.y/zoom)/16);
    if(!board[x] || !board[x][y]) return;
    let tile = board[x][y];

    if(tile.revealed){
        let tiles = getTilesAround(tile);
        let count = 0;
        for(let tile of tiles){
            if(tile.flagged) count++;
        }

        if(tile.sprite == count.toString()){
            for(let tile of tiles){
                if(!tile.revealed && !tile.flagged){
                    revealTile(tile);
                }
            }
        }
    } else if(!tile.flagged){
        if(tile.bomb) {
            tile.revealed = true;
            tile.sprite = "bomb";
        } else{
            revealTile(tile);
        }
    }

    render();
}

function rightClick(){
    let x = Math.floor((pos.x+mouse.x/zoom)/16);
    let y = Math.floor((pos.y+mouse.y/zoom)/16);
    let tile = board[x][y];

    if(tile.revealed){
        let tiles = getTilesAround(tile);
        let count = 0;
        for(let tile of tiles){
            if(!tile.revealed) count++;
        }

        if(tile.sprite == count.toString()){
            for(let tile of tiles){
                if(!tile.revealed){
                    tile.flagged = true;
                    tile.sprite = "flag";
                }
            }
        }
    } else{
        if(tile.flagged){
            tile.flagged = false;
            tile.sprite = "unrv";
        } else {
            tile.flagged = true;
            tile.sprite = "flag";
        }
    }

    render();
}