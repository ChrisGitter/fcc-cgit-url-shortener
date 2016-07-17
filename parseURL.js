module.exports = parseURL

function parseURL() {
	var favicon = new RegExp('\/favicon\.?(?:jpe?g|png|ico|gif)?')
	var pattern = new RegExp('(?:\/new\/)((?:http|https):\/\/)?(.{4,})?')

	return (req, res, next) => {
		var reqUrl = req.url
		var error = false

		// no favicon pls
		if (favicon.test(reqUrl)) {
			res.status(404).end()
		} else {
			/*
				search for the regExp matches in the url
				the result must be an array with length 4
				the second index is the matched url
				after the /new/
			*/
			var match = reqUrl.match(pattern)
			if (Array.isArray(match)) {
				// if anything is missing, return an error
				if (typeof match[1] == 'undefined' || typeof match[2] == 'undefined') {
					error = true
				} else {
					// encode the url and return it
					req.url = '/new/' + encodeURIComponent(match[1]+match[2])
				}
			}

			if (error) {
				res.json({status: 404, message: 'Input data was not in the correct format.'}).end()
			} else {
				next()
			}
		}	
	}
}