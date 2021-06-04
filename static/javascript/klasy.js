import { dane_gry, pionki, pola } from './rozne_zmienne_i_stale.js';

class Pole {
  constructor() {
    this.lewymargines = 0;
    this.gornymargines = 0;
    this.elementhtml = undefined;
  }
  ustawgornymargines = margines => {
    this.gornymargines = margines;
  };
  ustawlewymargines = margines => {
    this.lewymargines = margines;
  };
  wygenerujkwadrat = () => {
    var div = document.createElement('div');
    div.classList.add('pole');
    div.style.top = `${this.gornymargines}px`;
    div.style.left = `${this.lewymargines}px`;
    this.elementhtml = div;
    document.getElementById('plansza').appendChild(div);
  };
}

class Kolko {
  constructor() {
    this.elementhtml = undefined;
  }
  wygenerujkolko = (nazwarodzica, nazwaklasy) => {
    var div = document.createElement('div');
    div.classList.add(nazwaklasy);
    this.elementhtml = div;
    document.getElementById(nazwarodzica).appendChild(div);
  };
}

class Pionek {
  constructor(numerrodzica, nazwarodzica, numerpionka) {
    this.numerrodzica = numerrodzica;
    this.polaodbazy = 0;
    this.kolor = undefined;
    this.elementhtml = undefined;
    this.nazwarodzica = nazwarodzica;
    this.numerpionka = numerpionka;
  }
  ustawnumerrodzica = numer => {
    this.numerrodzica = numer;
  };
  ustawnazwerodzica = nazwa => {
    this.nazwarodzica = nazwa;
  };
  ustawpolaodbazy = numer => {
    this.polaodbazy = numer;
  };
  wygenerujpionek = kolor => {
    var pionek = document.createElement('div');
    pionek.classList.add('pionek');
    this.kolor = kolor;
    pionek.style.backgroundColor = kolor;
    pionek.onclick = () => {
      this.ruszpionkiem();
    };
    this.elementhtml = pionek;
    return pionek;
  };
  ruszpionkiem = () => {
    if(dane_gry.moja_tura && this.kolor === dane_gry.kolor && !dane_gry.kliknalem){
      var danepionka = {
        kolor: this.kolor,
        numerek: this.numerpionka,
        starynumer: this.numerrodzica,
        staryrodzic: this.nazwarodzica,
        nowynumer: undefined,
        nowyrodzic: undefined,
        zbite: []
      }
      if (this.elementhtml.parentElement.className === 'kolko-start' && this.elementhtml.parentElement.parentElement.className.split('-')[2] !== 'koniec' &&(dane_gry.wylosowanynumerek === 1 || dane_gry.wylosowanynumerek === 6)) {
        this.nazwarodzica = 'pole';
        switch (this.kolor) {
          case 'blue':
            this.elementhtml.parentElement.removeChild(this.elementhtml);
            this.numerrodzica = 0;
            break;
          case 'red':
            this.elementhtml.parentElement.removeChild(this.elementhtml);
            this.numerrodzica = 10;
            break;
          case 'green':
            this.elementhtml.parentElement.removeChild(this.elementhtml);
            this.numerrodzica = 20;
            break;
          case 'yellow':
            this.elementhtml.parentElement.removeChild(this.elementhtml);
            this.numerrodzica = 30;
            break;
        }
        if (pola[this.numerrodzica].elementhtml.hasChildNodes()) {
          var dzieci = pola[this.numerrodzica].elementhtml.childNodes;
          dzieci.forEach(dziecko => {
            var pionek = pionki.find(function(pionek) {
              return pionek.elementhtml === dziecko
            });
            if (pionek.kolor !== this.kolor) {
              document.querySelectorAll('.pole')[this.numerrodzica].removeChild(pionek.elementhtml);
              pionek.ustawpolaodbazy(0);
              pionek.ustawnumerrodzica(pionek.numerpionka);
              pionek.ustawnazwerodzica('kolko-start');
              document.querySelectorAll('.kolko-start')[pionek.numerpionka].appendChild(pionek.elementhtml);
              danepionka.zbite.push(pionek)
            }
          });
        }
        pola[this.numerrodzica].elementhtml.appendChild(this.elementhtml);
        dane_gry.pionki_w_bazie_startowej--;
        danepionka.nowynumer = this.numerrodzica
        danepionka.nowyrodzic = 'pole'
      } else if (this.elementhtml.parentElement.className === 'pole') {
        if (this.polaodbazy + dane_gry.wylosowanynumerek > 39) {
          var numerek = dane_gry.wylosowanynumerek - (39 - this.polaodbazy) - 1;
          var kolorek;
          switch (this.kolor) {
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
          if (document.getElementById(`${kolorek}-baza-koniec`).childNodes[numerek] && !document.getElementById(`${kolorek}-baza-koniec`).childNodes[numerek].firstChild) {
            this.nazwarodzica = 'kolko-koniec';
            switch (this.kolor) {
              case 'blue':
                this.numerrodzica = numerek;
                break;
              case 'red':
                this.numerrodzica = numerek + 4;
                break;
              case 'yellow':
                this.numerrodzica = numerek + 8;
                break;
              case 'green':
                this.numerrodzica = numerek + 12;
                break;
            }
            this.elementhtml.parentElement.removeChild(this.elementhtml);
            document.getElementById(`${kolorek}-baza-koniec`).childNodes[numerek].appendChild(this.elementhtml);
            dane_gry.pionki_w_bazie_koncowej++;
            danepionka.nowynumer = this.numerrodzica
            danepionka.nowyrodzic = this.nazwarodzica
            if (dane_gry.pionki_w_bazie_koncowej === 4) {
              alert('koniec gry');
              fetch('/koniec-gry', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nick: dane_gry.nick }),
              }).then(function(){
                location.href = '/';
              });
            }
          }
        } else {
          if (pola[this.numerrodzica + dane_gry.wylosowanynumerek]) {
            this.numerrodzica += dane_gry.wylosowanynumerek;
          } else {
            var zmienionynumerek =dane_gry.wylosowanynumerek - (39 - this.numerrodzica) - 1;
            this.numerrodzica = zmienionynumerek;
          }
          this.polaodbazy += dane_gry.wylosowanynumerek;
          this.elementhtml.parentElement.removeChild(this.elementhtml);
          if (pola[this.numerrodzica].elementhtml.hasChildNodes()) {
            var dzieci = pola[this.numerrodzica].elementhtml.childNodes;
            console.log(pola[this.numerrodzica].elementhtml)
            console.log(dzieci)
            dzieci.forEach(dziecko => {
              console.log(pionki)
              var pionek = pionki.find(function(pionek){
                  return pionek.elementhtml === dziecko
              });
              if (pionek.kolor !== this.kolor) {
                document.querySelectorAll('.pole')[this.numerrodzica].removeChild(pionek.elementhtml);
                pionek.ustawpolaodbazy(0);
                pionek.ustawnumerrodzica(pionek.numerpionka);
                pionek.ustawnazwerodzica('kolko-start');
                document.querySelectorAll('.kolko-start')[pionek.numerpionka].appendChild(pionek.elementhtml);
                danepionka.zbite.push(pionek)
              }
            });
          }
          pola[this.numerrodzica].elementhtml.appendChild(this.elementhtml);
          danepionka.nowynumer = this.numerrodzica
          danepionka.nowyrodzic = this.nazwarodzica
        }
      }
      if(dane_gry.pionki_w_bazie_startowej + dane_gry.pionki_w_bazie_koncowej !== 4 || dane_gry.pionki_w_bazie_startowej + dane_gry.pionki_w_bazie_koncowej === 4 && (dane_gry.wylosowanynumerek === 1 || dane_gry.wylosowanynumerek === 6)){
        clearInterval(dane_gry.interwal)
        document.getElementById('cyfry').innerText = ''
        document.getElementById('pasek').style.width = '100%'
        setTimeout(function(){
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
      }
      if(!Object.values(danepionka).includes(undefined)){
        dane_gry.kliknalem = true
        dane_gry.ostatniruch = danepionka
        clearInterval(dane_gry.interwal)
        document.getElementById('cyfry').innerText = ''
        document.getElementById('pasek').style.width = '100%'
        fetch('/ostatni-ruch?nick='+dane_gry.nick, {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({ruch: danepionka})
        })
        setTimeout(function(){
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
          dane_gry.kliknalem = false
        }, 500)
      }
    }
  };
}

export { Pole, Kolko, Pionek };
