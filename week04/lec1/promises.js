'use strict'

class AggregateError extends Error {}

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

    static some(input, count) {
        let results = []
        let rejected = []
        return new Promise(function(resolve, reject) {
            Promise.resolve(input).then(function(data) { //in case input is promised
                if (isIterable(data)) {
                    for (let i = 0; i < data.length; i++) 
                    {
                        Promise.resolve(data[i]).then(function(element) { //in case separate elements of input are promised
                            results.push(element)
                            if (results.length == count) {
                                resolve(results)
                            }
                        }, function(error){
                            rejected.push(error)
                            if ((data.length - rejected.length) < count) {
                                reject(new AggregateError(rejected))
                            }
                        })
                    }
                }
                else {
                    reject(new TypeError('input is not iterable'))
                }
            }, reject)
        })
    }

    static reduce(input, reducer, initialValue) {
        let chain = Promise.resolve()
        return new Promise(function(resolve, reject) {
            Promise.resolve(input).then(function(data) {
                if (isIterable(data)) {
                    for (let i = 0; i < data.length; i++) 
                    {
                        Promise.resolve(data[i]).then(function(element) {
                            chain = chain.then(function(accumulated){
                                return Promise.resolve(reducer(accumulated, element))
                            })
                            if ((i+1) === data.length) {
                                chain.then(resolve, reject)
                            }
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