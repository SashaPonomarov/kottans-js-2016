'use strict'

class MyPromise extends Promise {
    static map(input, mapper) {
        let results = []
        let waiting = 0
        return new Promise(function(resolve, reject) {
            Promise.resolve(input).then(function(data) {
                for (let i = 0; i < data.length; i++) 
                {
                    waiting++
                    Promise.resolve(data[i]).then(function(element) {
                        Promise.resolve(mapper(element)).then(function(result) {
                            results.push(result)
                            if (--waiting == 0) {
                                resolve(results)
                            }
                        }, reject)                
                    }, reject)
                }
            }, reject)
        })
    }
}