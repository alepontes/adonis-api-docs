**Important**
> This package is being developed, it will be stable from version v1.0.0, come back in a few days :)

# Adonis API Docs 
Automatic API documentation creator for AdonisJS

## Install 
```bash
# with adonis install
$ adonis install adonis-api-docs

# or npm
$ npm i adonis-api-docs

# or yarn
$ yarn adonis-api-docs
```

## Register Provider 
```js
// app/start.js
const providers = [
    'adonis-api-docs/providers/AdonisApiDocsProvider'
]
```

## Run 
```bash
$ adonis serve --dev
```
> If all is right, you will see the documentation API in `/docs`

## Requirements
Adonis API Docs uses the [routes](https://adonisjs.com/docs/4.1/routing) in `app/routes.js` and the [Route Validator](https://adonisjs.com/docs/4.1/validator#_route_validator) rules to create automatic documentation. **Your requests must be validated in this way**

```js
// app/router.js
Route.post('users', 'UserController.store').validator('StoreUser')
```

```js
// app/Validators/StoreUser.js
class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
}

module.exports = StoreUser
```

For more details read [Route Validator](https://adonisjs.com/docs/4.1/validator#_route_validator) or see [this example]()