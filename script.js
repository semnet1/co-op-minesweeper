function toggleAccordion(id){
    let x = document.getElementById(id);
    if(x.className.indexOf("w3-show") == -1){
        x.className += " w3-show";
    } else{ 
        x.className = x.className.replace(" w3-show", "");
    }
}

function toggleDisabled(checked, id){
    let element = document.getElementById(id);
    if(checked){
        element.disabled = false;
    } else{
        element.disabled = true;
    }
}

function rename(id, text){
    document.getElementById(id).innerHTML = text;
}

var radios = document.getElementsByName('difficulty');
for (var i = 0, length = radios.length; i < length; i++) {
    radios[i].onchange = () => {
        if(document.getElementById("custom").checked){
            document.getElementById("bombSlider").disabled = false;
        } else{
            document.getElementById("bombSlider").disabled = true;
        }
    }
}