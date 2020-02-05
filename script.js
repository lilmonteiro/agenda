var userData;
var map;

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

    requestJSON('https://randomuser.me/api/?results=100', function(obj) { // Chamando request do banco de dados//
        userData = obj.results;        
        fillUser(userData[0]); // Puxa o primeiro usuário //
        fillContactList(userData); // Na primeira vez, puxa a lista com TODOS os contatos
        initializeAPI();       
    });
}    

var initializeMap=function(){
    console.log(1);
    initMap(userData[0]);
}

var blurEventHandler = function(event) {
    var field = document.querySelector(".search-field");
    var resetBtn = document.querySelector(".reset-btn");

    if (event.srcElement.value == "") {
        field.classList.remove("active");
    }
    if (event==true) {
        resetBtn.remove("active");
    }
}

var resetEventHandler = function(event) {
    document.querySelector(".search-field").value = "";
    fillContactList(userData);
    document.querySelector(".search-field").focus();
}

var searchEventHandler = function(event) {
    var searchField = document.querySelector(".search-field");
    searchField.classList.add("active");
    searchField.focus();
}
var fillContactList = function(objs) {
    for (var i = 0; i < objs.length; i++) { // for que preenche cada um da lista//
        let newItem = createNewContact(objs[i].name.first + " " + objs[i].name.last);
        newItem.setAttribute("index", i);
        newItem.addEventListener("click", itemClickHandler.bind(window, objs[i]));
    }
}

var itemClickHandler = function(itemObj, event) {      
    fillUser(itemObj)
    initMap(itemObj);
    swipeScreen(false);
    
    var resetBtn = document.querySelector(".reset-btn");
    var field = document.querySelector(".search-field");
 
    if(event){
    resetEventHandler();
    resetBtn.classList.remove("active");
    field.classList.remove("active");
    }
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
    resetBtn.classList.add("active");

    var field = document.querySelector(".search-field");

    if (event.srcElement.value == "") {
        resetBtn.classList.remove("active");
    }
}

var eraseContactList = function() { //funcao pra limpar os contatos pra filtrar//
    var toRemove = document.querySelectorAll(".contact_list > a");
    var removeContactContainer = document.querySelector(".contact_list");

    for (var j = 0; j < toRemove.length; j++) {
        removeContactContainer.removeChild(toRemove[j]);
    }
}

var fillUser = function(userData) // funcao que puxa do JSON e preenche no HTML (parametro - base de dados)// 
    {
        var nameField = document.querySelector(".person_data p:nth-child(1)");
        nameField.innerHTML = userData.name.first + " " + userData.name.last;

        var ageField = document.querySelector(".person_data p:nth-child(2)");
        ageField.innerHTML = userData.dob.age + " years";

        var telField = document.querySelector(".tel_container p");
        telField.innerHTML = userData.phone;

        var celField = document.querySelector(".wpp_container p");
        celField.innerHTML = userData.cell;

        var emailField = document.querySelector(".mail_container p");
        emailField.innerHTML = userData.email;

        var localField = document.querySelector(".local_container p");
        localField.innerHTML = userData.location.street.number + " " + userData.location.street.name;

        var postField = document.querySelector(".post_container p");
        postField.innerHTML = userData.location.postcode;

        var profileField = document.querySelector(".person_photo");
        profileField.src = userData.picture.large;
        
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

var initMap=function(obj){
    var place = {lat: Number(obj.location.coordinates.latitude), lng: Number(obj.location.coordinates.longitude)};
   var map = new google.maps.Map(
       document.getElementById('map'), {zoom: 1, center: place});
   var marker = new google.maps.Marker({position: place, map: map});
}

var initializeAPI= function(){  

    var body= document.querySelector("body");
    var scriptContainer= document.createElement("script");
    body.appendChild(scriptContainer);  
    var url="https://maps.googleapis.com/maps/api/js?key=AIzaSyAl8YlkoUka-_WqecEFpCUuatP5Ta7p29E&callback=initializeMap";  
    scriptContainer.setAttribute("src", url); 
}
