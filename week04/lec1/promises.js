'use strict'

const isIterable = function (obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

class MyPromise extends Promise {

    static map(input, mapper) {
        let results = []
        let waiting = 0
        return new Promise(function(resolve, reject) {
            Promise.resolve(input).then(function(data) { //in case input is promised
                if (isIterable(data)) {
                    for (let i = 0; i < data.length; i++) 
                    {
                        waiting++
                        Promise.resolve(data[i]).then(function(element) { //in case separate elements of input are promised
                            Promise.resolve(mapper(element)).then(function(result) { //in case mapper returns Promise
                                results.push(result)
                                if (--waiting == 0) {
                                    resolve(results)
                                }
                            }, reject)                
                        }, reject)
                    }
                }
                else {
                    reject(new TypeError('input is not iterable'))
                }
            }, reject)
        })
    }
}