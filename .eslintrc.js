module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes': [0, 'double'],
    'semi': [0, 'always'],
    'comma-dangle': [0, 'never'],
    // 'comma-spacing': 0,
    // 'arrow-parens': 0
  }
}
