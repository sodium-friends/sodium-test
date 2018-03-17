var tape = require('tape')
var alloc = require('buffer-alloc')

module.exports = function (sodium) {
  tape('crypto_box_keypair generate key-pair', function (t) {
    var pubKey = alloc(sodium.crypto_box_PUBLICKEYBYTES)
    sodium.randombytes_buf(pubKey)

    var secret = alloc(sodium.crypto_box_SECRETKEYBYTES)
    sodium.randombytes_buf(secret)

    var pubKeyCopy = alloc(sodium.crypto_box_PUBLICKEYBYTES)
    pubKey.copy(pubKeyCopy)

    var secretCopy = alloc(sodium.crypto_box_SECRETKEYBYTES)
    secret.copy(secretCopy)

    sodium.crypto_box_keypair(pubKey, secret)
    t.notEqual(pubKey, pubKeyCopy)
    t.notEqual(secret, secretCopy)

    t.end()
  })
}
