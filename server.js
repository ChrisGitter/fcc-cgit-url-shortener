'use strict'

var express = require('express')
var app = express()
var pug = require('pug')

var shortenURL = require('./shortenURL')
var redirectURL = require('./redirectURL')
var parseURL = require('./parseURL')

app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/static'))

app.use(parseURL())

app.get('/', (req, res) => { 
	res.render('index') 
})
app.get('/new/:inputUrl', shortenURL)

app.get(/[A-Za-z0-9]{5}/, redirectURL)

// log errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
})


app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port '+(process.env.PORT || 3000)+'!');
});