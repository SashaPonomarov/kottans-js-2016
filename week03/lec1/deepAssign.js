(function() {
    "use strict"

    if (typeof Object.deepAssign == "function") return

    var isEnumerable = {}.propertyIsEnumerable //in case of object created with Object.create(null)

    function isObject (obj) {
        return obj != null && typeof obj === 'object'
    }

    Object.defineProperty(Object, "deepAssign", {
        value: function deepAssign(target) 
        {
            if (target == null) throw new TypeError('Cannot convert undefined or null to object')
            for (let i = 1; i < arguments.length; i++)
                {
                    let from = arguments[i]
                    if (!isObject(from)) continue
                    Reflect.ownKeys(from).forEach(function(key)
                    {
                        if (isEnumerable.call(from, key))
                        {
                            if (isObject(target[key]) && isObject(from[key]))
                            {
                                Object.deepAssign(target[key], from[key])
                            }
                            else
                            {
                                target[key] = from[key]
                            }
                        }
                    })
                }
            return target
        },
        writable: true,
        configurable: true
    })
})()