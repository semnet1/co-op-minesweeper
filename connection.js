const socket = io("https://Minesweeper.semnet1.repl.co");
socket.on("connect", () => {
    console.log("You connected with id: " + socket.id);
});

function createRoom(){
    if(document.getElementById("name").reportValidity()){
        console.log("Creating Server...");

        let properties = {};
        properties.name = document.getElementById("name").value;
        properties.password = document.getElementById("password").value;
        let difficulties = document.getElementsByName("difficulty");
        for(let difficultyEl of difficulties){
            if(difficultyEl.checked){
                properties.difficulty = difficultyEl.value;
                break;
            }
        }
        switch(properties.difficulty){
            case "beginner":
                properties.percentage = 12.345;
                break;
            case "intermediate":
                properties.percentage = 15.625;
                break;
            case "expert":
                properties.percentage = 20.625;
                break;
            case "custom":
                properties.percentage = document.getElementById("bombSlider").value;
                break;
        }
        let sizes = document.getElementsByName("size");
        for(let sizeEl of sizes){
            if(sizeEl.checked){
                properties.size = sizeEl.value;
                break;
            }
        }
        switch(properties.size){
            case "small":
                properties.width = 9;
                properties.height = 9;
                break;
            case "medium":
                properties.width = 16;
                properties.height = 16;
                break;
            case "large":
                properties.width = 30;
                properties.height = 16;
                break;
            case "extraLarge":
                properties.width = 60;
                properties.height = 32;
                break;
        }
        properties.autoFlag = document.getElementById("autoFlag").checked;
        properties.autoReveal = document.getElementById("autoReveal").checked;
        properties.noDeath = document.getElementById("noDeath").checked;
        properties.limitPlayers = document.getElementById("limitPlayers").checked;
        if(properties.limitPlayers){
            properties.maxPlayers = document.getElementById("playersSlider").value;
        } else{
            properties.maxPlayers = "inf";
        }

        console.log(properties);

        document.getElementById("loadingScreen").classList.add("show");
        document.getElementById("loadingScreen").classList.add("fade");

        socket.emit("createroom", properties);
    }
}

function joinRoom(roomName){
    console.log("joining room "+roomName);

    document.getElementById("loadingScreen").classList.add("show");
    document.getElementById("loadingScreen").classList.add("fade");

    socket.emit("joinroom", roomName);
}

var gameStarted = false;
document.getElementById("loadingScreen").addEventListener("transitionend", () => {
    if(!gameStarted){
        document.getElementById("menu").classList.add("w3-hide");
        document.getElementById("canvas").classList.add("w3-show");
        document.getElementById("loadingScreen").classList.remove("fade");

        gameStarted = true;
        render();
    } else{
        document.getElementById("loadingScreen").classList.remove("show");
    }
});

socket.on("updaterooms", rooms => {
    console.log("updating rooms");
    console.log(rooms);
    let serverList = document.getElementById("serverList");
    serverList.innerHTML = "<tr><th>Server Name</th><th>Players</th></tr>";
    for(let room of rooms){
        serverList.innerHTML += "<tr><td>"+room.properties.name+"</td><td>"+room.players.length+"/"+room.properties.maxPlayers+"</td><td><button onclick='joinRoom(\""+room.properties.name+"\")' class='w3-button w3-green w3-right'>Join</button></td></tr>";
    }
});

socket.on("playerids", players => {
    for(let player in players){
        let id = players[player];
        this.players[id] = {
            x: 0,
            y: 0
        }
    }
});

socket.on("joined", id => {
    console.log("Someone joined with id: " + id);
    players[id] = {
        x: 0,
        y: 0
    };
});

socket.on("left", id => {
    console.log("Someone left with id: " + id);
    delete players[id];
});

socket.on("updatepos", (id, position) => {
    console.log("someone moved!");
    players[id].x = position.x;
    players[id].y = position.y;
    render();
});