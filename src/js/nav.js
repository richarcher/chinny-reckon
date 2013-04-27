var hash = location.hash.slice(1) + ".gif",
  image,
  i = document.getElementById('img');

var changeChin = function ( chin ) {
  if (typeof chin === "undefined" || chin === ".gif") {
    image = images[Math.floor(Math.random() * images.length )];
  } else {
    image = chin;
  }

  i.style.backgroundImage = "url( i/" + image + ")";
}

function locationHashChanged() {
  hash = location.hash.slice(1) + ".gif";
  if (images.indexOf(hash) === -1) {
    changeChin();
  } else {
    changeChin( hash );
  }
}

window.onhashchange = locationHashChanged;

changeChin( hash );
