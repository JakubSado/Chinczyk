import { dane_gry } from './rozne_zmienne_i_stale.js';

var mojnick = '';
var nicki = [];
var chcegrac = false;
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
      nick: mojnick,
    }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.gotowi === 2) {
        location.href = '/gra';
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
        nick: mojnick,
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
        nick: mojnick,
        numerek: 1,
      }),
    });
  }
}

fetch('/gracze')
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    var pokoj = data[data.length - 1];
    dane_gry.nick = pokoj[pokoj.length - 1].nick;
    wyswietlgraczy(data);
  });
fetch('/gotowi-gracze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nick: mojnick,
  }),
})
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    if (data.gotowi === 2) {
      location.href = '/gra';
    }
  });

function wyswietlgraczy(data) {
  for (i = 0; i < data[data.length - 1].length; i++) {
    if (!nicki.includes(data[data.length - 1][i].nick)) {
      nicki.push(data[data.length - 1][i].nick);
      var div = document.createElement('div');
      div.classList.add('nick');
      div.innerText = data[data.length - 1][i].nick;
      div.style.backgroundColor = data[data.length - 1][i].kolor;
      document.getElementById('kontener').appendChild(div);
    }
  }
  var pokoj = data[data.length - 1];
  if (pokoj[pokoj.length - 1].gracze.length === 4) {
    location.href = '/gra';
  }
}

document.getElementById('start').onclick = function () {
  start();
};
