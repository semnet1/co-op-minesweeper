// conexão com o server
const socket = io("http://10.0.0.102:3000");
socket.on("connect", () => {
    console.log("You connected with id: " + socket.id);
});

// recebe informações da sala logo depois de entrar
socket.on("playerids", players => {
    this.players = players;
});

// recebe informações das salas quando são atualizadas
socket.on("updaterooms", rooms => {
    console.log("updating rooms");
    console.log(rooms);
    this.rooms = rooms;

    let serverList = document.getElementById("serverList");
    serverList.innerHTML = "<tr><th>Room Name</th><th>Players</th></tr>";

    for(let room in rooms){
        serverList.innerHTML +=
        "<tr><td>"+room+"</td>" +
        "<td>"+rooms[room].players+"/"+rooms[room].maxPlayers+"</td>" +
        "<td><button onclick='joinRoom(\""+room+"\", document.getElementById(\"password\").value)' class='w3-button w3-blue w3-right w3-round-xxlarge'>Join</button></td></tr>";
    }
});

// recebe informações de um player novo quando quando ele entra
socket.on("joined", id => {
    console.log("Someone joined with id: " + id);
    players[id] = {
        x: 0,
        y: 0
    };
});

// recebe informações de um player quando quando ele sai
socket.on("left", id => {
    console.log("Someone left with id: " + id);
    delete players[id];
});