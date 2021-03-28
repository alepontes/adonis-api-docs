const path = require('path');
const root = path.join(__dirname);
const absolutePath = require('swagger-ui-dist').absolutePath();

module.exports = {
    root,
    public: absolutePath,
}