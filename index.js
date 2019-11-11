module.exports = function (sodium) {
  require('./randombytes_buf')(sodium)
  require('./crypto_sign')(sodium)
  require('./crypto_kdf')(sodium)
  require('./crypto_generichash')(sodium)
  require('./crypto_shorthash')(sodium)
  require('./crypto_stream')(sodium)
  require('./crypto_secretbox')(sodium)
  require('./crypto_box')(sodium)
  require('./crypto_aead_xchacha20poly1305')(sodium)
}
