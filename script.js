var userData;
var map;
var contatoAtual;

var inicia = function() {
    var searchButton = document.querySelector(".search_button");
    searchButton.addEventListener("click", swipeScreen.bind(window, true)); //Mobile - ao clicar na lupa swipa a tela//

    var searchButtonWide = document.querySelector(".search-button-widescreen");
    searchButtonWide.addEventListener("click", searchEventHandler); //Wide - ao clicar ascende o campo a tela//

    var contactButton = document.querySelector(".contact_icon");
    contactButton.addEventListener("click", swipeScreen.bind(window, false)); //Mobile - ao clicar no contact swipa a tela//

    var inputCheck = document.querySelector(".search-field ");
    inputCheck.addEventListener("input", inputChangeHandler); // Filtro de contatos por input //
    inputCheck.addEventListener("blur", blurEventHandler);

    var resetBtn = document.querySelector(".reset-btn");
    resetBtn.addEventListener("click", resetEventHandler);

    var editBtn = document.querySelector(".edit-icon");
    editBtn.addEventListener("click", editClickEventHandler);

    requestJSON('https://randomuser.me/api/?results=100', function(obj) { // Chamando request do banco de dados//
        userData = obj.results;
        regExNumbers(userData); // tira a formatacao nativa pra uma string só de numberos
        fillUser(userData[0]); // Puxa o primeiro usuário // 
        fillContactList(userData); // Na primeira vez, puxa a lista com TODOS os contatos
        phoneMask(userData[0].phone, document.querySelector(".tel_container p")); // formata do jeito que eu quero agora
        phoneMask(userData[0].cell, document.querySelector(".wpp_container p")); // formata do jeito que eu quero agora
        initializeAPI();

        var nameField = document.querySelector(".person_data p:nth-child(1)");
        nameField.addEventListener("keydown", keydownEventHandler.bind(window, nameField, "name"));

        var ageField = document.querySelector(".person_data p:nth-child(2)");
        ageField.addEventListener("keydown", keydownEventHandler.bind(window, ageField, "dob.age"));

        var telField = document.querySelector(".tel_container p");
        telField.addEventListener("keydown", keydownEventHandler.bind(window, telField, "phone"));

        var celField = document.querySelector(".wpp_container p");
        celField.addEventListener("keydown", keydownEventHandler.bind(window, celField, "cell"));

        var emailField = document.querySelector(".mail_container p");
        emailField.addEventListener("keydown", keydownEventHandler.bind(window, emailField, "email"));
    });
}


var fillUser = function(data) { // funcao que puxa do JSON e preenche no HTML (parametro - base de dados)// 

    var nameField = document.querySelector(".person_data p:nth-child(1)");
    nameField.innerHTML = data.name.first + " " + data.name.last;

    var birthDay = data.dob.date;
    var birthYear = new Date(birthDay).getFullYear();
    var currentYear = new Date().getFullYear();

    var ageField = document.querySelector(".person_data p:nth-child(2)");
    ageField.innerHTML = (currentYear - birthYear) + " years";

    var celField = document.querySelector(".wpp_container p");
    celField.innerHTML = data.cell;

    var telField = document.querySelector(".tel_container p");
    telField.innerHTML = data.phone;

    var emailField = document.querySelector(".mail_container p");
    emailField.innerHTML = data.email;

    var localField = document.querySelector(".local_container p");
    localField.innerHTML = data.location.street.number + " " + data.location.street.name;

    var postField = document.querySelector(".post_container p");
    postField.innerHTML = data.location.postcode;

    var profileField = document.querySelector(".person_photo");
    profileField.src = data.picture.large;

    phoneMask(data.phone, document.querySelector(".tel_container p"))
    phoneMask(data.cell, document.querySelector(".wpp_container p"))

    contatoAtual = data;
}

var editClickEventHandler = function(event) {
    var nameField = document.querySelector(".person_data p:nth-child(1)");
    var ageField = document.querySelector(".person_data p:nth-child(2)");
    var telField = document.querySelector(".tel_container p");
    var celField = document.querySelector(".wpp_container p");
    var emailField = document.querySelector(".mail_container p");

    nameField.contentEditable = "true";
    ageField.contentEditable = "true";
    telField.contentEditable = "true";
    celField.contentEditable = "true";
    emailField.contentEditable = "true";

    nameField.focus();
}

var keydownEventHandler = function(field, property, event) {
    var enter = event.which == 13;
    var esc = event.which == 27;

    if (enter == true) {
        editContent(property, contatoAtual, event);
        field.blur();
        eraseContactList();
        fillContactList(userData);
    } else if (esc) {
        document.execCommand('undo');
        field.blur();
    }
}

var editContent = function(property, obj, event) {
    if (property == "name") {
        var newName = event.target.innerHTML;
        var newNameArray = newName.split(" ");
        obj.name.first = newNameArray[0];
        obj.name.last = newNameArray[newNameArray.length - 1];

    } else if (property == "dob.age") {
        obj.dob.age = event.target.innerHTML;;
    } else if (property == "phone") {
        obj.phone = event.target.innerHTML;
    } else if (property == "cell") {
        obj.cell = event.target.innerHTML;
    } else if (property == "email") {
        obj.email = event.target.innerHTML;
    }
}

var phoneMask = function(number, field) {
    var numeroAtual = number;
    var numeroFormatado;

    var onzeNum = number.length == 11;
    var dezNum = number.length == 10;
    var noveNum = number.length == 9;
    var oitoNum = number.length == 8;
    var seteNum = number.length == 7;

    if (onzeNum) {
        const ddd = numeroAtual.slice(0, 2);
        const parte1 = numeroAtual.slice(2, 6);
        const parte2 = numeroAtual.slice(6);
        numeroFormatado = "(" + ddd + ")" + " " + parte1 + "-" + parte2;
    } else if (dezNum) {
        const ddd = numeroAtual.slice(0, 2);
        const parte1 = numeroAtual.slice(2, 6);
        const parte2 = numeroAtual.slice(6);
        numeroFormatado = "(" + ddd + ")" + " " + parte1 + "-" + parte2;
    } else if (noveNum) {
        const ddd = numeroAtual.slice(0, 2);
        const parte1 = numeroAtual.slice(2, 5);
        const parte2 = numeroAtual.slice(5);
        numeroFormatado = "(" + ddd + ")" + " " + parte1 + "-" + parte2;
    } else if (oitoNum) {
        const parte1 = numeroAtual.slice(0, 4);
        const parte2 = numeroAtual.slice(4);
        numeroFormatado = "(XX)" + " " + parte1 + "-" + parte2;
    } else if (seteNum) {
        const parte1 = numeroAtual.slice(0, 3);
        const parte2 = numeroAtual.slice(3);
        numeroFormatado = "(XX)" + " " + parte1 + "-" + parte2;
    }

    field.innerHTML = numeroFormatado;
}

var initializeMap = function() {
    initMap(userData[0]);

}

var blurEventHandler = function(event) {
    var field = document.querySelector(".search-field");
    if (event.srcElement.value == "") {
        field.classList.remove("active");
    }
}

var resetEventHandler = function(event) {
    document.querySelector(".search-field").value = "";

    var resetBtn = document.querySelector(".reset-btn");
    resetBtn.classList.remove("active");

    document.querySelector(".search-field").focus();
    fillContactList(userData);
}

var searchEventHandler = function(event) {
    var searchField = document.querySelector(".search-field");
    searchField.classList.add("active");
    searchField.focus();
}

var fillContactList = function(objs) {
    var i;
    for (i = 0; i < objs.length; i++) { // for que preenche cada um da lista//
        let newItem = createNewContact(objs[i].name.first + " " + objs[i].name.last);
        newItem.setAttribute("index", i);
        newItem.addEventListener("click", itemClickHandler.bind(window, objs[i]));
    }
}

var regExNumbers = function(objs) {
    for (var j = 0; j < objs.length; j++) {
        objs[j].cell = userData[j].cell.replace(/\D/g, '');
        objs[j].phone = userData[j].phone.replace(/\D/g, '');
    }
}

var itemClickHandler = function(itemObj, event) {
    fillUser(itemObj)
    initMap(itemObj);
    swipeScreen(false);
    
    var resetBtn = document.querySelector(".reset-btn");

    resetEventHandler();
    resetBtn.classList.remove("active");
}

var createNewContact = function(name) { // cria containers pro contato na lista//
    var contactList = document.querySelector(".contact_list");
    var aLink = document.createElement("a");
    contactList.appendChild(aLink);

    var containerLetter = document.createElement("div");
    containerLetter.classList.add("contact_initial");
    var letter = name[0];
    aLink.appendChild(containerLetter);
    var contactLetter = document.createElement("p");
    contactLetter.innerHTML = letter;
    containerLetter.appendChild(contactLetter);

    var containerName = document.createElement("div");
    containerName.classList.add("contact_name");
    aLink.appendChild(containerName);
    var contactName = document.createElement("p");
    contactName.innerHTML = name;
    containerName.appendChild(contactName);

    return aLink;
}

var swipeScreen = function(listScreen, event) { //Mobile - funcao pra mudar de uma tela pra outra//
    var contactScreen = document.querySelector(".window_container");
    if (!listScreen) {
        contactScreen.classList.remove("transition-mobile");
    } else {
        contactScreen.classList.add("transition-mobile");
    }
}

var inputChangeHandler = function(event) { // funcao pra filtrar os contatos //
    filtered = userData.filter(
        function(e) {
            if (e.name.first.indexOf(event.srcElement.value) > -1) {
                return e.name.first.indexOf(event.srcElement.value) > -1;
            } else if (e.phone.indexOf(event.srcElement.value) > -1) {
                return e.phone.indexOf(event.srcElement.value) > -1;
            } else if (e.cell.indexOf(event.srcElement.value) > -1) {
                return e.cell.indexOf(event.srcElement.value) > -1;
            } else if (e.email.indexOf(event.srcElement.value) > -1) {
                return e.email.indexOf(event.srcElement.value) > -1;
            }
        }
    )
    eraseContactList();
    fillContactList(filtered);

    var resetBtn = document.querySelector(".reset-btn");
    var field = document.querySelector(".search-field");

    if (event.srcElement.value == "") {
        resetBtn.classList.remove("active");
    } else {
        resetBtn.classList.add("active");
    }
}

var eraseContactList = function() { //funcao pra limpar os contatos pra filtrar//
    var toRemove = document.querySelectorAll(".contact_list > a");
    var removeContactContainer = document.querySelector(".contact_list");

    for (var j = 0; j < toRemove.length; j++) {
        removeContactContainer.removeChild(toRemove[j]);
    }

}

var requestJSON = function(url, callback) { //Criando request do banco de dados//
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var obj = JSON.parse(xhr.responseText);
            callback(obj);
        }
    }
    xhr.open('GET', url, true);
    xhr.send('');
}

var initMap = function(obj) {
    var place = { lat: Number(obj.location.coordinates.latitude), lng: Number(obj.location.coordinates.longitude) };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: place });
    var marker = new google.maps.Marker({ position: place, map: map });
}

var initializeAPI = function() {

    var body = document.querySelector("body");
    var scriptContainer = document.createElement("script");
    body.appendChild(scriptContainer);
    var url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAl8YlkoUka-_WqecEFpCUuatP5Ta7p29E&callback=initializeMap";
    scriptContainer.setAttribute("src", url);
}
