'use strict'

class AggregateError extends Error {}

const isIterable = function (obj) {
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
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
            Promise.resolve(input).then(function(data) {
                if (isIterable(data)) {
                    for (let i = 0; i < data.length; i++) 
                    {
                        Promise.resolve(data[i]).then(function(element) {
                            results.push(element)
                            if (results.length == count) {
                                return resolve(results)
                            }
                        }, function(error){
                            rejected.push(error)
                            if ((data.length - rejected.length) < count) {
                                return reject(new AggregateError(rejected))
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
                    Promise.resolve(initialValue).then(function(initial){
                        if (data.length === 0) {
                            return resolve(initial)
                        }
                        if ((data.length === 1) && (!initial)) {
                            return resolve(data[0])
                        }
                        for (let i = 0; i < data.length; i++) 
                        {
                            Promise.resolve(data[i]).then(function(element) {
                                chain = chain.then(function(accumulated){
                                    if (i === 0) {
                                        accumulated = initial
                                    }
                                    return Promise.resolve(reducer(accumulated, element, i))
                                })
                                if ((i+1) === data.length) {
                                    chain.then(resolve, reject)
                                }
                            }, reject)
                        }
                    }, reject)
                }
                else {
                    reject(new TypeError('input is not iterable'))
                }
            }, reject)
        })
    }
}