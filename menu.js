// variáveis
let properties = {};

// elementos
var radios = document.getElementsByName('difficulty');
for (var i = 0, length = radios.length; i < length; i++){
    radios[i].onchange = () => {
        if(document.getElementById("custom").checked){
            document.getElementById("bombSlider").disabled = false;
        } else{
            document.getElementById("bombSlider").disabled = true;
        }
    }
}

document.getElementById("difficultyTitle").onclick = () => toggleAccordion("difficultyRow");
document.getElementById("boardSizeTitle").onclick = () => toggleAccordion("boardSizeRow");
document.getElementById("othersTitle").onclick = () => toggleAccordion("othersRow");

let bombSlider = document.getElementById("bombSlider");
let playersSlider = document.getElementById("playersSlider");
let limitPlayers = document.getElementById("limitPlayers");
bombSlider.oninput = () => rename("bombPercentage", "Bomb Percentage: "+bombSlider.value+"%");
playersSlider.oninput = () => rename("maxPlayers", "Max Players: "+playersSlider.value);
limitPlayers.oninput = () => toggleDisabled(limitPlayers.checked, "playersSlider");

document.getElementById("createRoom").onclick = () => createRoom();

// abre uma aba no menu
function toggleAccordion(id){
    let x = document.getElementById(id);
    if(x.className.indexOf("w3-show") == -1){
        x.className += " w3-show";
    } else{ 
        x.className = x.className.replace(" w3-show", "");
    }
}

// habilita/desabilita um input
function toggleDisabled(checked, id){
    let element = document.getElementById(id);
    if(checked){
        element.disabled = false;
    } else{
        element.disabled = true;
    }
}

// muda o texto de um elemento
function rename(id, text){
    document.getElementById(id).innerHTML = text;
}

// cria uma sala
function createRoom(){
    if(!document.getElementById("name").reportValidity()) return;
    console.log("Creating Server...");

    let name = document.getElementById("name").value;

    for(let room in rooms){
        if(room == name){
            console.log("Cancelled. Can't have two rooms with the same name");
            return;
        }
    }

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
        case "infinite":
            properties.width = 1;
            properties.height = 1;
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

    socket.emit("createroom", name, properties);
}

// tela de carregamento
var gameStarted = false;
document.getElementById("loadingScreen").addEventListener("transitionend", () => {
    if(!gameStarted){
        // tela de carregamento
        document.getElementById("menu").classList.add("w3-hide");
        document.getElementById("canvas").classList.add("w3-show");
        document.getElementById("loadingScreen").classList.remove("fade");
        document.getElementById("body").style.backgroundImage = "url('')";
        document.addEventListener('contextmenu', event => event.preventDefault());

        if(properties){
            // centraliza o campo na tela
            pos.x = ((window.innerWidth/zoom)/2 - (properties.width*16)/2)*(-1);
            pos.y = ((window.innerHeight/zoom)/2 - (properties.height*16)/2)*(-1);
        }
        
        // carrega o primeiro frame
        gameStarted = true;
        render();
    } else{
        // tira a tela de carregamento
        document.getElementById("loadingScreen").classList.remove("show");
    }
});

// chamado quando o player local entra em uma sala
function joinRoom(roomName, password){
    console.log("joining room "+roomName);

    document.getElementById("loadingScreen").classList.add("show");
    document.getElementById("loadingScreen").classList.add("fade");

    socket.emit("joinroom", roomName, password);
}