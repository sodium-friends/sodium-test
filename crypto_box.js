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

  tape('crypto_box_seal/crypto_box_seal_open self-decrypt', function (t) {
    var pubKey = alloc(sodium.crypto_box_PUBLICKEYBYTES)
    var secret = alloc(sodium.crypto_box_SECRETKEYBYTES)

    sodium.crypto_box_keypair(pubKey, secret)

    var msg = Buffer.from('hello world')
    var cipher = alloc(sodium.crypto_box_SEALBYTES + msg.length)
    sodium.crypto_box_seal(cipher, msg, pubKey)

    var out = alloc(cipher.length - sodium.crypto_box_SEALBYTES)
    sodium.crypto_box_seal_open(out, cipher, pubKey, secret)
    t.same(out.toString(), msg.toString())
    t.end()
  })

  tape('crypto_box_seal_open cross-decrypt', function (t) {
    var pubKey = Buffer.from(
      'e0bb844ae3f48bb04323c8dfe7c34cf86608db2e2112f927953060c80506287f', 'hex')
    var secret = Buffer.from(
      '036a9de1ecc9d152cf39fed1b3e15bf761ae39a299031adc011cc9809041abfa', 'hex')
    var cipher = Buffer.from(
      '249912e916ad8bcf96a3f9b750da2703' +
      '2eccdf83b5cff0d6a59a8bbe0bcd5823' +
      '5de9fbca55bd5416c754e5e0e0fe2f0c' +
      '4e50df0cb302f1c4378f80', 'hex')

    var out = alloc(cipher.length - sodium.crypto_box_SEALBYTES)
    sodium.crypto_box_seal_open(out, cipher, pubKey, secret)
    t.same(out.toString(), 'hello world')
    t.end()
  })
}
