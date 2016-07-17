var express = require('express')
var app = express()
var pug = require('pug')
var logger = require('morgan')
var shortenUrl = require('./shortenUrl')
var getUrl = require('./getUrl')
var encodeUrl = require('./encodeUrl')

app.set('view engine', 'pug')

app.use(logger('combined', { kip: (req, res) => { return res.statusCode < 400 } }))
app.use('/static', express.static(__dirname + '/static'))
app.use(encodeUrl())

app.get('/new/:inputUrl', shortenUrl)
app.get('/:url', getUrl)
app.get('/', (req, res) => { res.render('index') })


app.listen(process.env.PORT, function () {
  console.log('App listening on port '+process.env.PORT+'!');
});