'use strict'

const { ServiceProvider, Validator } = require('../adonis-imports');

class SuperValidatorProvider extends ServiceProvider {

    async boot() {
        console.log('SuperValidatorProvider');

        console.log('Validator');
        // STRINGFY FUNCTION
        // console.log(JSON.stringify("" + Validator.prototype.handle));

        Validator.prototype.handle = async function (ctx, next, validator) {
            console.log('ALE ALE ALE ALE');
            await next();
        }

        // console.log("------------------------------------------------");
        // console.log(JSON.stringify("" + Validator.prototype.handle));

    }

}

module.exports = SuperValidatorProvider
