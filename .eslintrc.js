module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 11,
    ecmaFeatures: {
      impliedStrict: true
    },
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:vue/base',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  globals: {
    __static: true
  },
  plugins: ['html', 'vue'],
  rules: {
    // Two spaces but disallow semicolons
    indent: 'off',
    semi: 'off',
    "one-var": "off",
    "object-curly-newline": "off",
    "quotes": "off",
    "comma-dangle": "off",
    "no-unmodified-loop-condition": "off",
    'space-before-function-paren': 'off',
    'keyword-spacing': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'comma-spacing': 'off',
    'block-spacing': 'off',
    'no-trailing-spaces': 'off',
    'func-call-spacing': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'arrow-spacing': 'off',
    'semi-spacing': 'off',
    'key-spacing': 'off',
    'no-multiple-empty-lines': 'off',
    'space-before-blocks': 'off',
    'no-whitespace-before-property': 'off',
    'spaced-comment': 'off',
    //indent: ['error', 2, { 'SwitchCase': 1, 'ignoreComments': true }],
    //semi: [2, 'never'],
    "no-unused-vars": "off",
    'no-return-await': 'error',
    'no-return-assign': 'error',
    'no-new': 'error',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    // allow console
    'no-console': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'require-atomic-updates': 'off',
    // TODO: fix these errors someday
    'prefer-const': 'off',
    'no-mixed-operators': 'off',
    'no-prototype-builtins': 'off'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['common', './src/common'],
          // Normally only valid for renderer/
          ['@', './src/renderer'],
          ['muya', './src/muya']
        ],
        extensions: ['.js', '.vue', '.json', '.css', '.node']
      }
    }
  },
  ignorePatterns: [
    'node_modules',
    'src/muya/dist/**/*',
    'src/muya/webpack.config.js'
  ]
}
