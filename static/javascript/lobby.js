import { dane_gry } from './rozne_zmienne_i_stale.js';

var nicki = [];
var chcegrac = false;

fetch('/gracze')
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    var pokoj = data[data.length - 1];
    dane_gry.nick = pokoj[pokoj.length - 1].nick;
    console.log(dane_gry.nick)
    wyswietlgraczy(data);

  });
fetch('/gotowi-gracze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nick: dane_gry.nick,
    }),
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    if (data.gotowi === 2) {
      location.href = '/gra?nick='+dane_gry.nick+'&kolor='+dane_gry.kolor;
    }
  });

var interwal = setInterval(function () {
  fetch('/gracze')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      wyswietlgraczy(data);
    });
  fetch('/gotowi-gracze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nick: dane_gry.nick,
    }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data)
      if (data.gotowi === 2) {
        location.href = '/gra?nick='+dane_gry.nick+'&kolor='+dane_gry.kolor;
      }
    });
}, 3000);

function start() {
  if (chcegrac) {
    document.getElementById('start').innerText = 'chce grac';
    chcegrac = false;
    fetch('/zmiana-stanu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: dane_gry.nick,
        numerek: -1,
      }),
    });
  } else {
    document.getElementById('start').innerText = 'ok jestem gotowy';
    chcegrac = true;
    fetch('/zmiana-stanu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: dane_gry.nick,
        numerek: 1,
      }),
    });
  }
}

function wyswietlgraczy(data) {
  for (var i = 0; i < data[data.length - 1].length; i++) {
    if (!nicki.includes(data[data.length - 1][i].nick)) {
      nicki.push(data[data.length - 1][i].nick);
      var div = document.createElement('div');
      div.classList.add('nick');
      div.innerText = data[data.length - 1][i].nick;
      div.style.backgroundColor = data[data.length - 1][i].kolor;
      if(data[data.length - 1][i].nick === dane_gry.nick){
        dane_gry.kolor = data[data.length - 1][i].kolor
      }
      document.getElementById('kontener').appendChild(div);
    }
  }
  var pokoj = data[data.length - 1];
  if (pokoj.length === 4) {
    location.href = '/gra?nick='+dane_gry.nick+'&kolor='+dane_gry.kolor;
  }
}

document.getElementById('start').onclick = function () {
  start();
};
