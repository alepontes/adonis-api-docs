const path = require('path');
const root = path.join(__dirname);

module.exports = {
    root,
    template: `${root}/template`,
    public: `${root}/template/out`,
}