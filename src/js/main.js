//=include ../../node_modules/owlcarousel/assets/js/jquery-1.9.1.min.js
//=include ../../node_modules/owlcarousel/owl-carousel/owl.carousel.min.js

// -------- SLIDER ------- //
;$(document).ready(function() {

  $("#slider").owlCarousel({

      navigation : true,
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem : true,
      autoPlay : true
  });
});
// -------- POPUP ------- //
;var btnsBuy = document.querySelectorAll(".btn-buy");
var modalBag = document.getElementById("modal-bag");

var btnMap = document.getElementById("btn-map");
var modalMap = document.getElementById("modal-map");

var btnWriteUs = document.getElementById("btn-write-us");
var modalWriteUs = document.getElementById("modal-write-us");
var form = document.querySelector(".modal-content__form");
var userName = document.getElementById("user-name-field");
var userEmail = document.getElementById("user-email-field");
var userText = document.getElementById("email-text-field");
var storageName = localStorage.getItem("name");
var storageEmail = localStorage.getItem("email");


var btnsClose = document.querySelectorAll(".modal-content__close");


for(var i=0; i<btnsBuy.length; i++) {
  btnsBuy[i].addEventListener("click", function(event) {
  event.preventDefault();
  modalBag.classList.add("modal-bag__show");
});
};

for(var i=0; i<btnsClose.length; i++) {
  btnsClose[i].addEventListener("click", function(event) {
    event.preventDefault();
    modalBag.classList.remove("modal-bag__show");
    modalMap.classList.remove("modal-map__show");
    modalWriteUs.classList.remove("modal-content__show");
  });
};

btnMap.addEventListener("click", function(event) {
  event.preventDefault();
  modalMap.classList.add("modal-map__show");
});

btnWriteUs.addEventListener("click", function(event) {
  event.preventDefault();
  modalWriteUs.classList.add("modal-content__show");
  if(storageName && storageEmail) {
    userName.value = storageName;
    userEmail.value = storageEmail;
    userText.focus();
  } else if(storageName || storageEmail) {
    if(storageName) {
      userName.value = storageName;
      userEmail.focus();
    }
    if(storageEmail) {
      userEmail.value = storageEmail;
      userName.focus();
    }
  } else {
    userName.focus();
  }
});

window.addEventListener("keydown", function(event) {
  if(event.keyCode === 27) {
    modalWriteUs.classList.remove("modal-content__show");
    modalBag.classList.remove("modal-bag__show");
    modalMap.classList.remove("modal-map__show");
  }
});

form.addEventListener("submit", function(event) {
  if(!userName.value || !userEmail.value || !userText.value) {
    event.preventDefault();
    modalWriteUs.classList.remove("modal-error");
    modalWriteUs.offsetWidth = modalWriteUs.offsetWidth;
    modalWriteUs.classList.add("modal-error");
  } else {
    localStorage.setItem("name", userName.value);
    localStorage.setItem("email", userEmail.value);
  }
 });


// -------- MAP ------- //
;ymaps.ready(init);

  function init(){
      var myMap = new ymaps.Map("map", {
          center: [59.93869566557761,30.323097415344236],
          zoom: 17,
          controls: []
      });

      var myPlacemark = new ymaps.Placemark(
        [59.93869566557761,30.323097415344236],
        {
            hintContent: 'КОМПАНИЯ «Техномарт»',
            balloonContent: 'Интернет-магазин строительных материалов и инструментов для ремонта',
            iconContent: 'Большая Конюшенная ул., 19'
        },
        {
            preset: 'islands#redStretchyIcon',
        });

        myMap.behaviors.disable(['scrollZoom']);

        myMap.geoObjects.add(myPlacemark);
  };
