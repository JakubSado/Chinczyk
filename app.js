var express = require('express');

var path = require('path');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('static'));

var gracze = [];
var pokoje = [];

app.get('/', function (req, res) {
  res.sendFile('/static/index.html');
});

app.post('/wyslij-nick', function (req, res) {
  var nick = req.body.nick;
  var wylosowanykolor;
  if (gracze.length === 0 || !gracze.includes(nick)) {
    if (pokoje.length === 0) {
      pokoje.push({gracze: [nick], grasiezaczela: false, wylosowanaliczba: 0, kolory: ['red', 'blue', 'yellow', 'green'], gotowigracze: 0, czyjakolej: nick, ostatniruch: undefined, wygrany: undefined});
      var index = Math.abs(Math.round(Math.random() * 3));
      wylosowanykolor = pokoje[pokoje.length - 1].kolory[index];
      pokoje[pokoje.length - 1].kolory = pokoje[pokoje.length - 1].kolory.filter(function (kolor) {
        return kolor !== wylosowanykolor;
      });
      gracze.push([{ nick: nick, kolor: wylosowanykolor }]);
    } else {
      if (!pokoje[pokoje.length - 1].grasiezaczela && pokoje[pokoje.length - 1].gracze.length < 4) {
        pokoje[pokoje.length - 1].gracze.push(nick);
        var index;
        if (pokoje[pokoje.length - 1].kolory.length === 1) index = 0;
        else index = Math.abs(Math.round(Math.random() * pokoje[pokoje.length - 1].kolory.length - 1));
        wylosowanykolor = pokoje[pokoje.length - 1].kolory[index];
        pokoje[pokoje.length - 1].kolory = pokoje[pokoje.length - 1].kolory.filter(function (kolor) {
          return kolor !== wylosowanykolor;
        });
        if (pokoje[pokoje.length - 1].gracze.length === 4) pokoje[pokoje.length - 1].grasiezaczela = true;
        gracze[gracze.length - 1].push({ nick: nick, kolor: wylosowanykolor });
      } else {
        pokoje.push({gracze: [nick], grasiezaczela: false, wylosowanaliczba: 0, kolory: ['red', 'blue', 'yellow', 'green'], gotowigracze: 0, czyjakolej: nick, ostatniruch: undefined, wygrany: undefined});
        var index = Math.abs(Math.round(Math.random() * 3));
        wylosowanykolor = pokoje[pokoje.length - 1].kolory[index];
        pokoje[pokoje.length - 1].kolory = pokoje[
          pokoje.length - 1
        ].kolory.filter(function (kolor) {
          return kolor !== wylosowanykolor;
        });
        gracze.push([{ nick: nick, kolor: wylosowanykolor }]);
      }
    }
  }
  res.end();
});

app.get('/gracze', function (req, res) {
  res.send(JSON.stringify(gracze));
});

app.post('/gotowi-gracze', function (req, res) {
  var nick = req.body.nick;
  var pokoj = pokoje.find(function (pokoj) {
    return pokoj.gracze.includes(nick);
  });
  if (pokoj && pokoj.gotowigracze) {
    res.send(JSON.stringify({ gotowi: pokoj.gotowigracze }));
  } else{
    res.end(JSON.stringify({}))
  }
});

app.get('/lobby', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/lobby.html'));
});

app.post('/zmiana-stanu', function (req, res) {
  var nick = req.body.nick;
  var zmiana = req.body.numerek;
  var pokoj = pokoje.find(function (pokoj) {
    return pokoj.gracze.includes(nick);
  });
  pokoj.gotowigracze += zmiana;
  if (pokoj.gotowigracze === 2){
    pokoj.grasiezaczela = true;
  }
  res.end()
});

app.get('/gra', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/game.html'));
});

app.get('/koniec-gry', function(req, res){
  var nick = req.query.nick
  var pokoj = pokoje.find(function(pokoj){
    return pokoj.gracze.includes(nick)
  })
  if(pokoj.wygrany){
    pokoj.gracze = pokoj.gracze.filter(function(gracz){
      return gracz !== nick
    })
    gracze = gracze.filter(function (gracz) {
      return gracz.nick !== nick;
    });
    res.send(JSON.stringify({koniec: true, wygrany: pokoj.wygrany}))
  } else{
    res.send(JSON.stringify({koniec: false}))
  }
})

app.post('/koniec-gry', function (req, res) {
  var nick = req.body.nick;
  gracze = gracze.filter(function (gracz) {
    return gracz.nick !== nick;
  });
  var pokoj = pokoje.find(function(pokoj){
    return pokoj.gracze.includes(nick)
  })
  pokoj.wygrany = nick
  pokoj.gracze = pokoj.gracze.filter(function(gracz){
    return gracz !== nick
  })
  res.end()
});

app.post('/czyja-tura', function (req, res) {
  var nick = req.body.nick;
  var pokoj = pokoje.find(function (pokoj) {
    return pokoj.gracze.includes(nick);
  });
  res.send({nick: pokoj.czyjakolej})
});

app.post('/zmien-gracza', function (req, res) {
  var nick = req.body.nick;
  var pokoj = pokoje.find(function (pokoj) {
    return pokoj.gracze.includes(nick);
  });
  var index = pokoj.gracze.indexOf(nick)
  if(pokoj.gracze[index+1]){
    pokoj.czyjakolej = pokoj.gracze[index+1]
  } else{
    pokoj.czyjakolej = pokoj.gracze[0]
  }
  res.end()
});

app.get('/ostatni-ruch', function (req, res) {
  var nick = req.query.nick
  var pokoj = pokoje.find(function(pokoj){
    return pokoj.gracze.includes(nick)
  })
  if(pokoj.ostatniruch){
    res.send(JSON.stringify(pokoj.ostatniruch))
  } else{
    res.send(JSON.stringify({}))
  }
});

app.post('/ostatni-ruch', function (req, res) {
  var nick = req.query.nick;
  var ruch = req.body.ruch
  var pokoj = pokoje.find(function(pokoj){
    return pokoj.gracze.includes(nick)
  })
  pokoj.ostatniruch = ruch
  res.end()
});

app.listen(port, function () {
  console.log('nasłuchiwanie na porcie ' + port.toString());
});
