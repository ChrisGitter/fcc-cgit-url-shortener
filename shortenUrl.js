var parseUrl = require('url-parse')
var JsonDB = require('node-json-db')
var db = new JsonDB("data", true, false)
var serverUrl = "https://cgw-tinyurl.herokuapp.com/"

function shortenUrl (req, res) {
  var inputUrl = decodeURIComponent(req.params.inputUrl)
  // parse the url
  var parsed = new parseUrl(req.params.inputUrl);
  if (parsed.protocol !== 'http:' || parsed.protocol !== 'https:') {
    res.status(401).send({error: true, message: 'The given URL was not valid!'})
  } else {
  
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
  }

  function makeid()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }
}

module.exports = shortenUrl