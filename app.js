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

app.get('/', async (req, res) => {
    res.render('rezerwuj-wizyte', {layout : 'main' });
});

app.listen(port, host, () => {
    console.log(`Running on http://${host}:${port}/`);
  });