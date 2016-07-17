var JsonDB = require('node-json-db')
var db = new JsonDB("data", true, false)

module.exports = redirectURL

/*
    this searches the database for the query
    and redirects the use to the requested site
    if the data is found
*/

function redirectURL () {
var data = db.getData('/')
var redirect = ''
    return (req, res) => {
        if (typeof data.urls == 'undefined' || !Array.isArray(data.urls)) {
            // no data yet, return error
            return res.send('Error, requested URL not found!')
        }
        data.urls.forEach(function(val) {
            // if we found the right dataset, just redirect
            if (req.url === val.short_url)
                window.location = val.original_url
        })
    }
}