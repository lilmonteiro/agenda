import { ListItemContainer } from "./components/ListItemContainer.js";
import { ContactDataContainer } from "./components/ContactDataContainer.js";
import { GoogleMapsApi } from './components/google-maps-api.js';

var userData;
var contatoAtual;
var newName, birthYear, newPhone, newCell, newEmail, newAddress;
var novoContato;
var times = 0;
var objData, objsrt;
var saveDataLocalStorage;

var inicia = function() {
    var searchButton = document.querySelector(".search_button");
    searchButton.addEventListener("click", swipeScreen.bind(window, true)); //Mobile - ao clicar na lupa swipa a tela//

    var searchButtonWide = document.querySelector(".search-button-widescreen");
    searchButtonWide.addEventListener("click", searchEventHandler); //Wide - ao clicar ascende o campo a tela//

    var contactButton = document.querySelector(".contact_icon");
    contactButton.addEventListener("click", swipeScreen.bind(window, false)); //Mobile - ao clicar no contact swipa a tela//

    var addNewContact = document.querySelector(".add-btn");
    addNewContact.addEventListener("click", addNewContactHandler.bind(window, true));
    addNewContact.addEventListener("click", swipeScreen.bind(window, false));

    var cancelBtn = document.querySelector("#cancel-btn");
    var saveBtn = document.querySelector("#save-btn");
    cancelBtn.addEventListener("click", cancelEventHandler);
    saveBtn.addEventListener("click", saveEventHandler);

    var inputCheck = document.querySelector(".search-field ");
    inputCheck.addEventListener("input", inputChangeHandler); // Filtro de contatos por input //
    inputCheck.addEventListener("blur", blurEventHandler);

    var resetBtn = document.querySelector(".reset-btn");
    resetBtn.addEventListener("click", resetEventHandler);

    var editBtn = document.querySelector(".edit-icon");
    editBtn.addEventListener("click", editClickEventHandler);

    var deleteBtn = document.querySelector(".delete-icon");
    deleteBtn.addEventListener("click", deleteClickHandler)

    //verifica se ja existem dados salvos locais
    userData = localStorage.getItem("dataObj");
    if (userData != null && userData != "null") { // userData é puxado do localStorage
        userData = JSON.parse(userData) // userData volta a ser objeto e nao string
        setupData();
    } else {
        requestJSON(
            // 'https://randomuser.me/api/?nat=BR&results=50',
            'data_sample.json',

            function(obj) { // Chamando request do banco de dados//    
                console.log(obj)
                userData = obj.results;
                userData.sort(compare); // Ordem alfabetica
                regExNumbers(userData); // tira a formatacao nativa pra uma string só de numberos
                setupData();
                saveDataLocalStorage();
            },

            function() {
                alert("No internet connection to load your contact list.")
            }
        );
    }
}

var setupData = function() {
    fillUser(userData[0], true); // Puxa o primeiro usuário // 
    fillContactList(userData); // Na primeira vez, puxa a lista com TODOS os contatos
    initializeAPI(userData[0]);
}

var saveCacheEventHandler = function(event) {
    var html = document.querySelector("html");
    html.setAttribute("manifest", "cache.appcache")
    window.location.reload()
}

var saveDataLocalStorage = function() {
    objData = userData
    objsrt = JSON.stringify(objData);
    localStorage.setItem("dataObj", objsrt);
}


var compare = function(a, b) {
    var iA = a.name.first;
    var iB = b.name.first;

    let comparison = 0;
    if (iA > iB) {
        comparison = 1;
    } else if (iA < iB) {
        comparison = -1;
    }
    return comparison;
}

var addNewContactHandler = function(event) {
    var personContainer = document.querySelector(".person_container");
    var personPhoto = document.querySelector(".person_photo");
    var newContactBtn = document.querySelector(".newcontact-btn");
    var editBtn = document.querySelector(".edit-icon");
    var nameField = document.querySelector(".person_data p:nth-child(1)");
    var ageField = document.querySelector(".person_data p:nth-child(2)");
    var tellField = document.querySelector(".tell-container");
    var cellField = document.querySelector(".cell-container");
    var emailField = document.querySelector(".email-container");
    var addressField = document.querySelector(".local_container p");
    var deleteBtn = document.querySelector(".delete-icon");

    personPhoto.src = "assets/default-profile.svg";
    personContainer.classList.add("new-contact");
    nameField.classList.add("newcontact")
    ageField.classList.add("newcontact")
    tellField.classList.add("newcontact");
    cellField.classList.add("newcontact");
    emailField.classList.add("newcontact");
    addressField.classList.add("newcontact");

    newContactBtn.classList.add("active");

    editBtn.classList.remove("active");
    deleteBtn.classList.remove("active");

    turnEditableContent(true);

    nameField.innerHTML = "Insert name";
    ageField.innerHTML = "Insert birthday (yyyy-mm)";
    tellField.innerHTML = "Insert telefone";
    cellField.innerHTML = "Insert celular";
    emailField.innerHTML = "Insert e-mail";
    addressField.innerHTML = "Insert address";

    nameField.addEventListener("keydown", newContactKeyDownHandler.bind(window, nameField, "name"));
    ageField.addEventListener("keydown", newContactKeyDownHandler.bind(window, ageField, "age"));
    tellField.addEventListener("keydown", newContactKeyDownHandler.bind(window, tellField, "phone"));
    cellField.addEventListener("keydown", newContactKeyDownHandler.bind(window, cellField, "cell"));
    emailField.addEventListener("keydown", newContactKeyDownHandler.bind(window, emailField, "email"));
    addressField.addEventListener("keydown", newContactKeyDownHandler.bind(window, addressField, "address"));
}

var newContactKeyDownHandler = function(field, property, event) {
    // console.log(1)
    var tab = event.which === 9;
    if (times == 1) {
        field.innerHTML = " ";
    }
    times = times + 1; // acrescenta mais um

    if (tab) {
        times = 1; // reinicia a variavel 
    }

    var enter = event.which == 13;
    var esc = event.which == 27;

    if (enter || tab) {
        field.blur();
    } else if (esc) {
        document.execCommand('undo');
        field.blur();
    }

    if (property == "name") {
        newName = event.target.innerHTML;
    } else if (property == "age") {
        birthYear = event.target.innerHTML;;
    } else if (property == "phone") {
        newPhone = event.target.innerHTML;
    } else if (property == "cell") {
        newCell = event.target.innerHTML;
    } else if (property == "email") {
        newEmail = event.target.innerHTML;
    } else if (property == "address") {
        newAddress = event.target.innerHTML;
    }
}

var cancelEventHandler = function(event) {
    var nameField = document.querySelector(".person_data p:nth-child(1)");
    var ageField = document.querySelector(".person_data p:nth-child(2)");
    var emailField = document.querySelector(".email-container");
    var personContainer = document.querySelector(".person_container");
    var tellField = document.querySelector(".tell-container");
    var cellField = document.querySelector(".cell-container");
    var addressField = document.querySelector(".local_container p");

    var editBtn = document.querySelector(".edit-icon");
    var newContactBtn = document.querySelector(".newcontact-btn");
    var deleteBtn = document.querySelector(".delete-icon");

    nameField.classList.remove("newcontact");
    ageField.classList.remove("newcontact");
    tellField.classList.remove("newcontact");
    cellField.classList.remove("newcontact");
    emailField.classList.remove("newcontact")
    addressField.classList.remove("newcontact");

    personContainer.classList.remove("new-contact");

    newContactBtn.classList.remove("active");
    editBtn.classList.add("active");
    deleteBtn.classList.add("active");

    fillUser(contatoAtual, false);
    turnEditableContent(false);

    times = 1;
};

var saveEventHandler = function() {
    var nameField = document.querySelector(".person_data p:nth-child(1)");
    var ageField = document.querySelector(".person_data p:nth-child(2)");

    var tellField = document.querySelector(".tell-container");
    var cellField = document.querySelector(".cell-container");
    var emailField = document.querySelector(".email-container");

    var editBtn = document.querySelector(".edit-icon");
    var personContainer = document.querySelector(".person_container");
    var newContactBtn = document.querySelector(".newcontact-btn");
    var currentYear = new Date().getFullYear();
    birthYear = birthYear.toString();
    var addressField = document.querySelector(".local_container p");
    var newAge =  ((currentYear - birthYear)-1);

    novoContato = {
        "name": {},
        "dob": {
            "date": birthYear,
            "age": newAge,
        },
        "phone": newPhone,
        "cell": newCell,
        "email": newEmail,
        "location": newAddress,
        "picture": {
            "large": "assets/default-profile.svg"
        }
    }

    console.log(newAge, novoContato.age)    

    splitNamer(newName, novoContato);

    userData.push(novoContato);
    userData.sort(compare);
    eraseContactList();
    fillContactList(userData);
    fillUser(novoContato, false);

    personContainer.classList.remove("new-contact");
    newContactBtn.classList.remove("active");

    nameField.classList.remove("newcontact");
    ageField.classList.remove("newcontact");
    tellField.classList.remove("newcontact");
    cellField.classList.remove("newcontact");
    emailField.classList.remove("newcontact")
    addressField.classList.remove("newcontact")

    editBtn.classList.add("active");
    contatoAtual = userData[userData.length - 1];

    if (newName == undefined) {
        alert("Você precisa inserir um nome para salvar!")
    } else if (newPhone == undefined) {
        alert("Você precisa inserir um número de telefone válido")
    } else if (newCell == undefined) {
        alert("Você precisa inserir um celular válido")
    } else if (newEmail == undefined) {
        alert("Você precisa inserir um email válido")
    } else {
        turnEditableContent(false);
    }

    var userDataStr = JSON.stringify(userData);
    localStorage.setItem("dataObj", userDataStr)
};

var splitNamer = function(nameToSplit, obj) {
    var newNameArray = nameToSplit.split(" ");
    if (newNameArray.length == 1) {
        obj.name.first = newNameArray[0];
        obj.name.last = "";
    } else if (newNameArray.length > 1) {
        obj.name.first = newNameArray[0];
        obj.name.last = newNameArray[newNameArray.length - 1];
    }
}

var fillUser = function(data, boolean) { // funcao que puxa do JSON e preenche no HTML (parametro - base de dados)// 
    var personDataContainer = document.querySelector(".person_data");

    var nameField = document.querySelector(".person_data p:nth-child(1)");
    nameField.innerHTML = data.name.first + " " + data.name.last;

    
    birthYear = new Date(data.dob.date).getFullYear();
    var currentYear = new Date().getFullYear();

    var ageField = document.querySelector(".person_data p:nth-child(2)");
    ageField.innerHTML = (currentYear - birthYear) + " years";

    let telContainer = new ContactDataContainer('assets/tell.svg');
    let celContainer = new ContactDataContainer('assets/wpp.svg');
    let emailContainer = new ContactDataContainer('assets/arroba.svg');

    if (boolean == true) {
        personDataContainer.appendChild(telContainer)
        telContainer.classList.add("tell-container")

        personDataContainer.appendChild(celContainer);
        celContainer.classList.add("cell-container");

        personDataContainer.appendChild(emailContainer);
        emailContainer.classList.add("email-container");
    }

    document.querySelector(".email-container").innerHTML = data.email;

    phoneMask(data.phone, document.querySelector(".tell-container"))
    phoneMask(data.cell, document.querySelector(".cell-container"))

    var localField = document.querySelector(".local_container p");
    if (data.location.street == undefined) {
        localField.innerHTML = data.location;
    } else {
        localField.innerHTML = data.location.street.number + " " + data.location.street.name;
    }

    var postField = document.querySelector(".post_container p");
    postField.innerHTML = data.location.postcode;

    var profileField = document.querySelector(".person_photo");
    profileField.src = data.picture.large;

    contatoAtual = data;
}

var editClickEventHandler = function(event) {
    alert("To save changes press enter, to cancel press Esc")
    turnEditableContent(true);
    var nameField = document.querySelector(".person_data p:nth-child(1)");
    var ageField = document.querySelector(".person_data p:nth-child(2)");
    var telField = document.querySelector(".tell-container");
    var celField = document.querySelector(".cell-container");
    var emailField = document.querySelector(".email-container");
    var addressField = document.querySelector(".local_container p");

    nameField.addEventListener("keydown", keydownEventHandler.bind(window, nameField, "name"));
    ageField.addEventListener("keydown", keydownEventHandler.bind(window, ageField, "age"));
    telField.addEventListener("keydown", keydownEventHandler.bind(window, telField, "phone"));
    celField.addEventListener("keydown", keydownEventHandler.bind(window, celField, "cell"));
    emailField.addEventListener("keydown", keydownEventHandler.bind(window, emailField, "email"));
    addressField.addEventListener("keydown", keydownEventHandler.bind(window, addressField, "address"));

    var deleteBtn = document.querySelector(".delete-icon");
    deleteBtn.classList.remove("active");
}

var turnEditableContent = function(boolean) {
    var nameField = document.querySelector(".person_data p:nth-child(1)");
    var ageField = document.querySelector(".person_data p:nth-child(2)");
    var telField = document.querySelector(".tell-container");
    var celField = document.querySelector(".cell-container");
    var emailField = document.querySelector(".email-container");
    var addressField = document.querySelector(".local_container p");

    nameField.contentEditable = boolean;
    ageField.contentEditable = boolean;
    telField.contentEditable = boolean;
    celField.contentEditable = boolean;
    emailField.contentEditable = boolean;
    addressField.contentEditable = boolean;

    nameField.focus();
}

var keydownEventHandler = function(field, property, event) {
    var enter = event.which == 13;
    var esc = event.which == 27;
    var deleteBtn = document.querySelector(".delete-icon");

    if (enter == true) {
        editContent(property, contatoAtual, event);
        field.blur();
        eraseContactList();
        userData = userData.sort(compare);
        // put something here to reorganize by alphabetic order
        fillContactList(userData);
        initializeAPI(contatoAtual)
        turnEditableContent(false);
        deleteBtn.classList.add("active");

    } else if (esc) {
        document.execCommand('undo');
        turnEditableContent(false);
        field.blur();
        deleteBtn.classList.add("active");
    }
}

var editContent = function(property, obj, event) {
    if (property == "name") {
        splitNamer(event.target.innerHTML, obj);
    } else if (property == "age") {
        obj.dob.age = event.target.innerHTML;;
    } else if (property == "phone") {
        obj.phone = event.target.innerHTML;
    } else if (property == "cell") {
        obj.cell = event.target.innerHTML;
    } else if (property == "email") {
        obj.email = event.target.innerHTML;
    } else if (property == "address") {
        obj.location = event.target.innerHTML;
    }

    var userDataStr = JSON.stringify(userData)
    localStorage.setItem("dataObj", userDataStr);
}

var phoneMask = function(number, field) {
    var numeroAtual = number;
    var numeroFormatado;

    if (number == undefined) {
        alert("Numero de telefone invalido");
    } else {
        var onzeNum = number.length == 11;
        var dezNum = number.length == 10;
        var noveNum = number.length == 9;
        var oitoNum = number.length == 8;
        var seteNum = number.length == 7;
    }

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

var blurEventHandler = function(event) {
    var field = document.querySelector(".search-field");
    var addNewContact = document.querySelector(".add-btn");

    if (event.srcElement.value == "") {
        field.classList.remove("active");
        addNewContact.classList.add("active");
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
    let contactList = document.querySelector(".contact_list");
    for (let i = 0; i < objs.length; i++) { // for que preenche cada um da lista//
        let newContactItem = new ListItemContainer(objs[i]);
        newContactItem.innerHTML = `${objs[i].name.first} ${objs[i].name.last}`;
        newContactItem.addEventListener("click", itemClickHandler.bind(window, objs[i]))
        contactList.appendChild(newContactItem);
    }
}

var regExNumbers = function(objs) {
    for (var j = 0; j < objs.length; j++) {
        objs[j].cell = userData[j].cell.replace(/\D/g, '');
        objs[j].phone = userData[j].phone.replace(/\D/g, '');
    }
}

var itemClickHandler = function(itemObj, event) {
    eraseContactList();
    fillUser(itemObj, false)
    initializeAPI(itemObj);
    swipeScreen(false);

    var resetBtn = document.querySelector(".reset-btn");

    resetEventHandler();
    resetBtn.classList.remove("active");
    cancelEventHandler();
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
    var addNewContact = document.querySelector(".add-btn");

    if (event.srcElement.value == "") {
        resetBtn.classList.remove("active");
    } else {
        resetBtn.classList.add("active");
    }

    addNewContact.classList.remove("active");
}

var eraseContactList = function() { //funcao pra limpar os contatos pra filtrar//
    var toRemove = document.querySelectorAll(".contact_list > list-item-container");
    var removeContactContainer = document.querySelector(".contact_list");

    for (var j = 0; j < toRemove.length; j++) {
        removeContactContainer.removeChild(toRemove[j]);
    }

}

var requestJSON = function(url, successCallback, errorCallback) { //Criando request do banco de dados//
    var xhr = new XMLHttpRequest();

    xhr.onerror = function() { // offline 
        if (errorCallback && errorCallback.constructor == Function) {
            errorCallback(false);
        } else {
            console.error("Variavel de callback de error não é uma função válida.")
        }
    }

    xhr.onload = function() {
        var obj = JSON.parse(xhr.responseText);
        successCallback(obj);
    }

    xhr.open('GET', url, true);
    xhr.send('');
}


var initializeAPI = function(obj) { //new function to display my Map, that avoid a lot of code lines

    const gmapApi = new GoogleMapsApi(); // initialize the api
    gmapApi.load().then(() => { // on api load do the following things
        let map = new google.maps.Map(document.querySelector('#map'), { // insert the map inside a div
            zoom: 18 // you must to set a zoom to display the map
        });

        var formattedAddress; // variable to use a formatted address version
        if (obj.location.street == undefined) { //if you edit the contact address, this is the new structure
            formattedAddress = obj.location;
        } else { // else keep the last settings of object location/address
            formattedAddress = obj.location.street.number + " " + obj.location.street.name;
        }

        var geocoder = new google.maps.Geocoder(); //initialize geocode to geocode the string address to lat lng format
        geocoder.geocode({
            'address': formattedAddress // parameter that get the address

        }, function(results, status) {
            let center = {
                lat: results[0].geometry.location.lat(), // current contact location 
                lng: results[0].geometry.location.lng()
            }
            map.setCenter(center); // set the new center from the current contact

            var marker = new google.maps.Marker({ // initialize a new market
                position: center,
            });
            marker.setMap(map) // set which map needs to insert the marker

        });
    });
}

var deleteClickHandler = function(event) {
    var confirmPopUp = confirm("Are you sure?");

    if (confirmPopUp == true) {
        var index = userData.findIndex(a => a.phone == contatoAtual.phone);
        userData.splice(index, 1)
        var userDataStr = JSON.stringify(userData)
        localStorage.setItem("dataObj", userDataStr)
        fillUser(userData[0], false);
        eraseContactList();
        fillContactList(userData);
    }
}

window.addEventListener("load", inicia);
