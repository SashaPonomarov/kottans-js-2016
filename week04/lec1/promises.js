'use strict'

function map(input, mapper) {
	let results = []
	let waiting = 0
	return new Promise(function(resolve, reject) {
		for (let i = 0; i < input.length; i++) 
		{
			waiting++
			Promise.resolve(input[i]).then(function(element) {
					Promise.resolve(mapper(element)).then(function(result) {
						results.push(result)
						if (--waiting == 0) {
							resolve(results)
						}
					}, reject)				
				}, reject)
		}
	})

}