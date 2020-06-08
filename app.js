var moment = require('moment');
require('moment/locale/pl');

const UsersClasses = require('./users-classes.js');
const Classes = require('./classes');

const db = require('./db');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const handlebars = require('express-handlebars');

const host = '127.0.0.1';
const port = 2500;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: __dirname + '/views/partials/'
}));

app.use(express.static('public'));

app.get('/rezerwuj-wizyte', async (req, res) => {
    res.redirect('/');
});

app.get('/panel/wizyty/pacjent', async (req, res) => {
    res.render('panel-wizyty-pacjent', {layout : 'main' });
  });

  app.get('/panel/wizyty/pracownik', async (req, res) => {
    res.render('panel-wizyty-pracownik', {layout : 'main' });
  });

app.get('/', async (req, res) => {
    res.render('rezerwuj-wizyte', {layout : 'main' });
});

app.get('/lekarze/specjalnosci', async (req, res) => {
    try {
      const rows = await UsersClasses.Lekarz.pobierzSpecjalnosci(res);
    } catch (err){
      console.error(err);
    }
});

app.get('/lekarze/specjalnosci/:option', async (req, res) => {
    try {
        const rows = await UsersClasses.Lekarz.pobierzLekarzySpecjalnosc(res, req.params.option);
    } catch (err){
        console.error(err);
    }
});

app.get('/lekarze/:id/przyjecia', async (req, res) => {
    try {
        const rows = await UsersClasses.Lekarz.pobierzPrzyjecia(res, req.params.id);
    } catch (err){
        console.error(err);
    }
});

app.get('/wizyty/zajete/data/:data', async (req, res) => {
    try {
        const rows = await Classes.Wizyta.pobierzZarezerwowaneWizyty(res, req.params.data);
    } catch (err){
        console.error(err);
    }
});

app.get('/wizyty/zajete/data/:data/godzina/:godzina/lekarz/:lekarz', async (req, res) => {
    try {
        const rows = await Classes.Wizyta.sprawdzTermin(res, req.params.data, req.params.godzina, req.params.lekarz);
    } catch (err){
        console.error(err);
    }
});
  
app.post('/wizyty/nowa-wizyta', async (req, res) => {
    try {
        const rows = await UsersClasses.Pacjent.rezerwujWizyte(res, req.body.IDPacjenta, req.body.PWZLekarza, req.body.Data, req.body.DataJS, "konsultacja");
    } catch (err){
        console.error(err);
    }
});

app.get('/wizyty/pacjent/:id', async (req, res) => {
    try {
        const wizyty = await Classes.Wizyta.pobierzWizytyPacjent(res, req.params.id);
    } catch (err){
        console.error(err);
    }
});

app.get('/wizyty/:id/zmien-status', async (req, res) => {
    try {
        const rows = await Classes.Wizyta.zmienStatus(res, req.query.nowyStatus, req.params.id);
    } catch (err){
        console.error(err);
        res.send(false);
    }
});

app.get('/panel/wizyty/pacjent/wizyta/:id/anuluj', async (req, res) => {
    try {
        const rows = await UsersClasses.Pacjent.anulujWizyte(res, req.params.id);
    } catch (err){
        console.error(err);
        res.send(false);
    }
});

app.get('/wizyty/:id/anuluj', async (req, res) => {
    try {
        const rows = await Classes.Wizyta.zmienStatus(res, "A", req.params.id);
    } catch (err){
        console.error(err);
        res.send(false);
    }
});

app.get('/wizyty/wszystkie', async (req, res) => {
    try {
        const wizyty = await Classes.Wizyta.pobierzWizyty(res);
    } catch (err){
        console.error(err);
    }
});

app.listen(port, host, () => {
    console.log(`Running on http://${host}:${port}/`);
});