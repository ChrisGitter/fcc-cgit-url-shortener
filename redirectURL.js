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
    var matched = false
    var err = false

    return (req, res) => {
        if (typeof data.urls == 'undefined' || !Array.isArray(data.urls)) {
            // no data yet, return error
            err = 'Error, requested URL not found!'
        }
        if (!err) {
            data.urls.forEach(function(val) {
                // if we found the right dataset, just redirect
                if (req.url.slice(1) === val.short_url) {
                    matched = true
                    res.redirect(val.original_url)
                }
            })
            if (!matched) err = 'Error, requested URL not found!' 
        } 
        if (err) {
            res.send('Requested URL not found, please try again.')
            throw err
        }
    }
}