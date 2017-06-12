module.exports = function (sodium) {
  require('./randombytes_buf')(sodium)
  require('./crypto_sign')(sodium)
  require('./crypto_generichash')(sodium)
  require('./crypto_shorthash')(sodium)
}
