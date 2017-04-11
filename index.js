module.exports = function (sodium) {
  require('./randombytes_buf')(sodium)
  require('./crypto_sign')(sodium)
}
