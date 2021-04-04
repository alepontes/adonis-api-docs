const _ = require('lodash');



const func = (obj) => {

    const keys = Object.keys(obj);

    return keys
        .map(key => {

            if (key.includes('.*.')) {

                const splitedKey = key.split('.*.');

                return {
                    [splitedKey[0]]: [{
                        [splitedKey[1]]: obj[key],
                    }],
                }
            }

            if (key.includes('.')) {
                const splitedKey = key.split('.');

                return {
                    [splitedKey[0]]: {
                        [splitedKey[1]]: obj[key],
                    },
                };
            }

            return { [key]: obj[key] };

        }).reduce((acc, cur) => {
            return _.merge(acc, cur);
        });
}

console.log(func(rules));


        // TODO: AJUSTAR ṔROFUNDIDADE

        const keys = Object.keys(obj);

        if (!keys.length) {
            return [];
        }

        return keys
            .map(key => {

                if (key.includes('.*.')) {
                    const splitedKey = key.split('.*.');

                    return {
                        [splitedKey[0]]: [{
                            [splitedKey[1]]: obj[key],
                        }],
                    }
                }

                if (key.includes('.')) {
                    const splitedKey = key.split('.');

                    return {
                        [splitedKey[0]]: {
                            [splitedKey[1]]: obj[key],
                        },
                    };
                }

                return { [key]: obj[key] };

            }).reduce((acc, cur) => {
                return _.merge(acc, cur);
            });