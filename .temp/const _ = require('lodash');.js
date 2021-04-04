const _ = require('lodash');

// REFERENCIA
// https://swagger.io/specification/

/**
 * PAREI NA FASE DE COLOCAR O JSON NO FORMADO SWAGGER A CIMA
 * 
 */





const rules = {
    "deliveryAt": "string",
    "withdrawalAt": "string",
    "obj.a": "ObjA",
    "obj.b": "ObjB",
    "customers.*.customerId": "string",
    "customers.*.lorem": "string",
    "customers.*.ipsum": "string",
}

const result = {
    "deliveryAt": "string",
    "withdrawalAt": "string",
    "obj": {
        "a": "ObjA",
        "b": "ObjB",
    },
    "customers": [{
        "customerId": "string",
        "lorem": "string",
        "ipsum": "string",
    }],
}

const swagger = {
    "deliveryAt": "string",
    "withdrawalAt": "string",
    "obj": {
        "a": "ObjA",
        "b": "ObjB",
    },
    "customers": [{
        "customerId": "string",
        "lorem": "string",
        "ipsum": "string",
    }],
}

const keys = Object.keys(rules);

const obg = [];

for (const key of keys) {
    // console.log(key)

    if (key.includes('.*.')) {

        const splitedKey = key.split('.*.');

        const param = {
            [splitedKey[0]]: [{
                [splitedKey[1]]: key,
            }],
        }

        obg.push(param);
    } else if (key.includes('.')) {
        const splitedKey = key.split('.');

        const param = {
            [splitedKey[0]]: {
                [splitedKey[1]]: key,
            },
        };

        obg.push(param);
    } else {

        obg.push({ key: key });
    }



}

const a = obg.reduce((acc, cur) => {
    return _.merge(acc, cur);
});

console.log(a);
// const a = _.mapKeys(rules, (value, key) => {

//     console.log('value: ' + value);
//     console.log('key: ' + key);

//     return key

// })

