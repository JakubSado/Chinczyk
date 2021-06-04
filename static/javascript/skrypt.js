import {Pole, Kolko, Pionek} from './klasy.js';
import {kolka_startowe,kolka_koncowe,dane_gry,pola,pionki} from './rozne_zmienne_i_stale.js';

var synth = window.speechSynthesis;
var glosy = synth.getVoices();
var glos = glosy.find(function (glos) {
  return glos.lang === 'pl-PL';
});

dane_gry.nick = new URLSearchParams(window.location.search).get('nick')
dane_gry.kolor = new URLSearchParams(window.location.search).get('kolor')

function plansza() {
  for (let i = 0; i < 40; i++) {
    var pole = new Pole();
    switch (i) {
      case 0:
      case 38:
      case 39:
        pole.ustawlewymargines(21);
        break;
      case 1:
      case 37:
        pole.ustawlewymargines(83);
        break;
      case 2:
      case 36:
        pole.ustawlewymargines(142);
        break;
      case 3:
      case 35:
        pole.ustawlewymargines(201);
        break;
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 34:
      case 33:
      case 32:
      case 31:
      case 30:
        pole.ustawlewymargines(262);
        break;
      case 9:
      case 29:
        pole.ustawlewymargines(320);
        break;
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 28:
      case 27:
      case 26:
      case 25:
      case 24:
        pole.ustawlewymargines(381);
        break;
      case 15:
      case 23:
        pole.ustawlewymargines(442);
        break;
      case 16:
      case 22:
        pole.ustawlewymargines(503);
        break;
      case 17:
      case 21:
        pole.ustawlewymargines(564);
        break;
      case 18:
      case 19:
      case 20:
        pole.ustawlewymargines(625);
        break;
    }
    switch (i) {
      case 8:
      case 9:
      case 10:
        pole.ustawgornymargines(21);
        break;
      case 7:
      case 11:
        pole.ustawgornymargines(83);
        break;
      case 6:
      case 12:
        pole.ustawgornymargines(142);
        break;
      case 5:
      case 13:
        pole.ustawgornymargines(204);
        break;
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
        pole.ustawgornymargines(262);
        break;
      case 39:
      case 19:
        pole.ustawgornymargines(320);
        break;
      case 38:
      case 37:
      case 36:
      case 35:
      case 34:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
        pole.ustawgornymargines(381);
        break;
      case 33:
      case 25:
        pole.ustawgornymargines(442);
        break;
      case 32:
      case 26:
        pole.ustawgornymargines(503);
        break;
      case 31:
      case 27:
        pole.ustawgornymargines(564);
        break;
      case 30:
      case 29:
      case 28:
        pole.ustawgornymargines(625);
        break;
    }
    pola.push(pole);
    pole.wygenerujkwadrat();
  }
  for (let i = 0; i < 16; i++) {
    var bazastart = new Kolko();
    var bazakoniec = new Kolko();
    kolka_startowe.push(bazastart);
    kolka_koncowe.push(bazakoniec);
    switch (i) {
      case 0:
      case 1:
      case 2:
      case 3:
        bazastart.wygenerujkolko('niebieska-start-baza', 'kolko-start');
        bazakoniec.wygenerujkolko('niebieska-baza-koniec', 'kolko-koniec');
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        bazastart.wygenerujkolko('czerwona-start-baza', 'kolko-start');
        bazakoniec.wygenerujkolko('czerwona-baza-koniec', 'kolko-koniec');
        break;
      case 8:
      case 9:
      case 10:
      case 11:
        bazastart.wygenerujkolko('żółta-start-baza', 'kolko-start');
        bazakoniec.wygenerujkolko('żółta-baza-koniec', 'kolko-koniec');
        break;
      case 12:
      case 13:
      case 14:
      case 15:
        bazastart.wygenerujkolko('zielona-start-baza', 'kolko-start');
        bazakoniec.wygenerujkolko('zielona-baza-koniec', 'kolko-koniec');
        break;
    }
  }
  kolka_startowe.forEach((kolko, index) => {
    const pionek = new Pionek(index, 'kolko-start', index);
    switch (index) {
      case 0:
      case 1:
      case 2:
      case 3:
        kolko.elementhtml.appendChild(pionek.wygenerujpionek('blue'));
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        kolko.elementhtml.appendChild(pionek.wygenerujpionek('red'));
        break;
      case 8:
      case 9:
      case 10:
      case 11:
        kolko.elementhtml.appendChild(pionek.wygenerujpionek('yellow'));
        break;
      case 12:
      case 13:
      case 14:
      case 15:
        kolko.elementhtml.appendChild(pionek.wygenerujpionek('green'));
        break;
    }
    pionki.push(pionek);
  });
}

plansza();

function rzuckostka() {
  var numer = Math.round(Math.random() * 5 + 1);
  dane_gry.wylosowanynumerek = numer;
  document.getElementById('obrazek-kostki').src ='./kostka/' + numer.toString() + '.png';
  var utter = new SpeechSynthesisUtterance(numer);
  utter.voice = glos;
  synth.speak(utter);
  if(dane_gry.pionki_w_bazie_startowej + dane_gry.pionki_w_bazie_koncowej === 4 && numer !== 1 && numer !== 6){
    clearInterval(dane_gry.interwal)
    document.getElementById('cyfry').innerText = ''
    document.getElementById('pasek').style.width = '100%'
    setTimeout(() => {
      dane_gry.moja_tura = false
      dane_gry.rzuconakostka = false
      document.getElementById('rzuc-kostka').disabled = true
      document.getElementById('obrazek-kostki').src = ''
      fetch('/zmien-gracza', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({nick: dane_gry.nick})
      }).then(function(){
        dane_gry.interwal = undefined
      })
    }, 1500)
  } else{
    var ruch = []
    var pionki2 = pionki.filter(function(pionek){
      return pionek.kolor === dane_gry.kolor
    })
    pionki2 = pionki2.filter(function(pionek){
      return pionek.nazwarodzica === 'pole'
    })
    pionki2.forEach(function(pionek){
      if(pionek.polaodbazy + numer > 39){
        var numerek = numer - (39 - pionek.polaodbazy) - 1;
        var kolorek;
        switch (pionek.kolor) {
          case 'red':
            kolorek = 'czerwona';
            break;
          case 'blue':
            kolorek = 'niebieska';
            break;
          case 'green':
            kolorek = 'zielona';
            break;
          case 'yellow':
            kolorek = 'żółta';
            break;
        }
        if (document.getElementById(`${kolorek}-baza-koniec`).childNodes[numerek] && !document.getElementById(`${kolorek}-baza-koniec`).childNodes[numerek].firstChild){
          ruch.push(true)
        } else{
          ruch.push(false)
        }
      }
    })
    if(ruch.length !== 0 && !ruch.includes(true)){
      dane_gry.kliknalem = true
      setTimeout(function(){
        clearInterval(dane_gry.interwal)
        dane_gry.moja_tura = false
        dane_gry.rzuconakostka = false
        dane_gry.kliknalem = false
        document.getElementById('rzuc-kostka').disabled = true
        document.getElementById('obrazek-kostki').src = ''
        document.getElementById('pasek').style.width = '100%'
        document.getElementById('cyfry').innerText = ''
        fetch('/zmien-gracza', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({nick: dane_gry.nick})
        }).then(function(){
          dane_gry.interwal = undefined
        })
      }, 1500)
    }
  }
};
function czyjakolej(){
  fetch('/czyja-tura', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({nick: dane_gry.nick})
  }).then(function(response){
    return response.json()
  }).then(function(data){
    if(data.nick === dane_gry.nick){
      dane_gry.moja_tura = true
      if(!dane_gry.interwal){
        timer()
      }
      document.getElementById('rzuc-kostka').disabled = false
    }
  })
}
function ostatniruch(){
  fetch('/ostatni-ruch?nick='+dane_gry.nick, {
    method: 'GET',
  }).then(function(response){
    return response.json()
  }).then(function(data){
    if(Object.keys(data).length > 0 && JSON.stringify(data) !== JSON.stringify(dane_gry.ostatniruch)){
      dane_gry.ostatniruch = data
      if(data.zbite.length > 0){
        data.zbite.forEach(function(zbity){
          var pionek = pionki[zbity.numerpionka]
          pionek.ustawpolaodbazy(0)
          pionek.ustawnumerrodzica(pionek.numerpionka)
          pionek.ustawnazwerodzica('kolko-start')
          pionek.elementhtml.parentElement.removeChild(pionek.elementhtml)
          document.querySelectorAll(`.kolko-start`)[pionek.numerrodzica].appendChild(pionek.elementhtml)
          if(pionek.kolor === dane_gry.kolor){
            dane_gry.pionki_w_bazie_startowej++
          }
        })
      }
      var pionek = pionki[data.numerek]
      pionek.elementhtml.parentElement.removeChild(pionek.elementhtml)
      document.querySelectorAll(`.${data.nowyrodzic}`)[data.nowynumer].appendChild(pionek.elementhtml)
    }
  })
}
function koniecgry(){
  fetch('/koniec-gry?nick='+dane_gry.nick, {
    method: 'GET'
  }).then(function(response){
    return response.json()
  }).then(function(data){
    if(data.koniec){
      alert('koniec! wygrał gracz '+data.wygrany)
      location.href = '/'
    }
  })
}
function timer(){
  var sekundy = 60
  var procent = 100
  document.getElementById('cyfry').innerText = sekundy
  dane_gry.interwal = setInterval(function(){
    console.log(sekundy)
    if(sekundy === 0){
      clearInterval(dane_gry.interwal)
      dane_gry.interwal = undefined
      document.getElementById('cyfry').innerText = ''
      document.getElementById('pasek').style.width = '100%'
      document.getElementById('rzuc-kostka').disabled = true
      fetch('/zmien-gracza', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({nick: dane_gry.nick})
      })
    } else{
      procent -= 1.66666666666667
      document.getElementById('pasek').style.width = procent.toString()+'%'
      sekundy--
      document.getElementById('cyfry').innerText = sekundy
    }
  }, 1000)
}

czyjakolej()
setInterval(function(){
  czyjakolej();
  ostatniruch()
  koniecgry()
}, 2000)

document.getElementById('rzuc-kostka').onclick = function () {
  if(!dane_gry.rzuconakostka){
    dane_gry.rzuconakostka = true
    rzuckostka();
  }
};
