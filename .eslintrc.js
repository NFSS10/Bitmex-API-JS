module.exports = {
    extends: "standard",
    parser: "@babel/eslint-parser",
    parserOptions: {
        requireConfigFile: false
    },
    plugins: ["mocha"],
    rules: {
        indent: [
            "warn",
            4,
            {
                SwitchCase: 1
            }
        ],
        quotes: [
            "error",
            "double",
            {
                avoidEscape: true
            }
        ],
        semi: ["error", "always"],
        "space-before-function-paren": [
            "error",
            {
                anonymous: "never",
                named: "never",
                asyncArrow: "always"
            }
        ],
        "linebreak-style": ["error", "windows"],
        "object-shorthand": ["error", "consistent"],
        "no-debugger": "warn",
        "brace-style": "off",
        "no-useless-escape": "off",
        "no-case-declarations": "off",
        "no-mixed-operators": "off",
        "operator-linebreak": "off",
        "standard/no-callback-literal": "off",
        "standard/computed-property-even-spacing": "off",
        "mocha/no-exclusive-tests": "error",
        "node/no-callback-literal": "off"
    },
    env: {
        browser: true,
        jasmine: true
    }
};
