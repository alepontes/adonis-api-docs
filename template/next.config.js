module.exports = {
    webpack: (config) => {
        const rule = config.module.rules[0];
        const originalExcludeMethod = rule.exclude;
        config.module.rules[0].exclude = (moduleName, ...otherArgs) => {

            if (moduleName.indexOf("node_modules/adonis-api-docs") >= 0) {
                return false;
            }

            return originalExcludeMethod(moduleName, ...otherArgs);
        };

        return config;
    },
};