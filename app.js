const db = require('./db');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const handlebars = require('express-handlebars');