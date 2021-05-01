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
    this.inFinishBase = false;
    this.outOfBase = false;
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
          const pionek = pionki.find(pionek => pionek.elementhtml === dziecko);
          if (pionek.kolor !== this.kolor) {
            document.querySelectorAll('.pole')[this.numerrodzica].removeChild(pionek.elementhtml);
            pionek.ustawpolaodbazy(0);
            pionek.ustawnumerrodzica(pionek.numerpionka);
            pionek.ustawnazwerodzica('kolko-start');
            document.querySelectorAll('.kolko-start')[pionek.numerpionka].appendChild(pionek.elementhtml);
          }
        });
      }
      pola[this.numerrodzica].elementhtml.appendChild(this.elementhtml);
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
          this.nazwarodzica = 'baza-koniec';
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
          dane_gry.pionki_w_bazie++;
          if (dane_gry.pionki_w_bazie === 4) {
            alert('koniec gry');
            fetch('/koniec-gry', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nick: dane_gry.nick }),
            });
            location.href = '/';
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
          const dzieci = pola[this.numerrodzica].elementhtml.childNodes;
          dzieci.forEach(dziecko => {
            const pionek = pionki.find(
              pionek => pionek.elementhtml === dziecko
            );
            if (pionek.kolor !== this.kolor) {
              document.querySelectorAll('.pole')[this.numerrodzica].removeChild(pionek.elementhtml);
              pionek.ustawpolaodbazy(0);
              pionek.ustawnumerrodzica(pionek.numerpionka);
              pionek.ustawnazwerodzica('kolko-start');
              document.querySelectorAll('.kolko-start')[pionek.numerpionka].appendChild(pionek.elementhtml);
            }
          });
        }
        pola[this.numerrodzica].elementhtml.appendChild(this.elementhtml);
      }
    }
  };
}

export { Pole, Kolko, Pionek };
