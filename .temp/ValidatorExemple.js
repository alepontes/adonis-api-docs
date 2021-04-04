'use strict'

const SuperValidator = use('AdonisApiDocs/SuperValidator');

/**
 * PUT /user/:id?param=foo
 * {
 *    lorem: "ipsum",
 *    dolor: "set"
 * }
 */
class UserValidator extends SuperValidator {

    /** */
    get rulesQuery() {
        return {
            'param': 'string',
        }
    }

    /** */
    get rulesBody() {
        return {
            'lorem': 'string',
            'dolor': 'string',
        }
    }

    /** */
    get rulesPath() { 
        return {
            'id': 'exist:users,id'
        }
    }

}

module.exports = UserValidator
