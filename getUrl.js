var JsonDB = require('node-json-db')
var db = new JsonDB("data", true, false)
var serverUrl = "https://cgw-tinyurl.herokuapp.com/"

function getUrl (req, res) {
// search string in data
if (typeof req.params.url == 'string' && req.params.url.length > 0 && req.params.url !== 'favicon.ico') {
    var data = db.getData('/')
    var redirect = ''
    if (typeof data.urls == 'undefined' || !Array.isArray(data.urls))
        return res.send('Url not found!')
    data.urls.forEach(function(val) {
        if (serverUrl + req.params.url === val.short_url)
            redirect = val.original_url
    })
    // redirect
    if (!redirect.startsWith('http://') && !redirect.startsWith('https://'))
        redirect = 'http://' + redirect
    res.redirect(redirect)
    }
}

module.exports = getUrl