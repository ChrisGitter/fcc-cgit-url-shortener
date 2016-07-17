var express = require('express')
var app = express()
var JsonDB = require('node-json-db')
var pug = require('pug')
var logger = require('morgan')
var db = new JsonDB("data", true, false)
var serverUrl = "https://cgw-tinyurl.herokuapp.com/"

app.set('view engine', 'pug')

app.use(logger('combined', {
  skip: (req, res) => { return res.statusCode < 400 }
}))
app.use(express.static('static'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/new/:inputUrl', (req, res) => {
  var data = db.getData('/')
  if (typeof data.urls == 'undefined' || !Array.isArray(data.urls)) {
    data = {urls: []}
  }
  
  // check if url is already shortened
  // make new id and check if that id is unique
  var newId = makeid()
  var hasId = false
  var inData = false
  data.urls.forEach(function(val, i) {
    if (val.original_url === req.params.inputUrl) inData = i
    if (newId === val.short_url.slice(serverUrl.length-1)) hasId = true
  })
  // filter out data that is older than 24h ( or 86.400.000 ms )
  var now = new Date().getTime()
  data.urls = data.urls.filter(function(val) {
    if (now - val.timestamp > 86400000) return false
    return true
  })
  // if we found the id previously then create new ones until its unique
  var foundId = false
  while(hasId) {
    newId = makeid()
    foundId = false
    data.urls.forEach(function(val) {
      if (newId === val.short_url.slice(serverUrl.length-1)) foundId = true
    })
    hasId = foundId
  }
  
  if (inData === false) {
    // create new object, save it and send it back
    var newObj = {original_url : req.params.inputUrl, short_url: serverUrl + newId, timestamp: now}
    data.urls.push( newObj )
    // if data object is over 9000 -> delete first item
    if (data.urls.length > 9000) data.urls.shift()
    db.push('/', data)
    res.json({original_url: newObj.original_url, short_url: newObj.short_url})
  } else {
    res.json({original_url : req.params.inputUrl, short_url: data.urls[inData].short_url})
  }
  
})

app.get('/:url', (req, res) => {
  // search string in data
  if (typeof req.params.url == 'string' && req.params.url.length > 0 && req.params.url !== 'favicon.ico') {
    var data = db.getData('/')
    var redirect = ''
    if (typeof data.urls == 'undefined' || !Array.isArray(data.urls))
      return res.send('Url not found!')
    data.urls.forEach(function(val) {
      if (serverUrl + req.params.url === val.short_url) redirect = val.original_url
    })
    // redirect
    if (!redirect.startsWith('http://') && !redirect.startsWith('https://')) {
      redirect = 'http://' + redirect
    }
    res.redirect(redirect)
  }
})


app.listen(process.env.PORT, function () {
  console.log('App listening on port '+process.env.PORT+'!');
});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}