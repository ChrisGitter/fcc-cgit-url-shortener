'use strict'

var parseUrl = require('url-parse')
var JsonDB = require('node-json-db')
var db = new JsonDB("data", true, false)

module.exports = shortenURL

function shortenURL () {
  var data = db.getData('/')

  return function (req, res) {
    // decode the encoded url
    var inputUrl = decodeURIComponent(req.params.inputUrl)
    // if database is empty, create a new array
    if (typeof data.urls == 'undefined' || !Array.isArray(data.urls)) {
      data = {urls: []}
    }
    
    var searchIndex = searchData()
    if (searchIndex !== -1) {
      // url already shortened
      res.json({original_url : data.urls[searchIndex].original_url, short_url: data.urls[searchIndex].short_url})
    } else {
      // url is new

      // create a secure id that is unique in the database
      var newId = makeSecureId()
      
      // filter out data that is older than 24h ( or 86.400.000 ms )
      var now = new Date().getTime()
      data.urls = data.urls.filter(function(val) {
        if (now - val.timestamp > 86400000) return false
        return true
      })

      // create new object, save it and send it back
      var newObj = {original_url : req.params.inputUrl, short_url: newId, timestamp: now}
      data.urls.push( newObj )
      // if data object is over 9000 -> delete first item
      if (data.urls.length > 9000) data.urls.shift()
      db.push('/', data)
      res.json({original_url: newObj.original_url, short_url: req.hostname + '/' + newObj.short_url})
    }

    function makeId()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function makeSecureId()
    {
      var id
      var notSecure = true 
      var x = 0;
      while(notSecure || x >= 100) {
        id = makeId()
        if (!hasId(id)) notSecure = false
        x++
      }
      return id
    }

    function hasId(id) {
      var foundId = false
      data.urls.forEach(function(val) {
        if (id === val.short_url) foundId = true
      })
      return foundId
    }

    function searchData() {
      var index = -1
      data.urls.forEach(function(val, i) {
        if (val.original_url === req.params.inputUrl)
          index = i
      })
      return index
    }

  }
}