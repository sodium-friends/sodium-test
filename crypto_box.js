var tape = require('tape')

const seed = Buffer.from([
  0x77, 0x07, 0x6d, 0x0a, 0x73, 0x18, 0xa5,
  0x7d, 0x3c, 0x16, 0xc1, 0x72, 0x51, 0xb2,
  0x66, 0x45, 0xdf, 0x4c, 0x2f, 0x87, 0xeb,
  0xc0, 0x99, 0x2a, 0xb1, 0x77, 0xfb, 0xa5,
  0x1d, 0xb9, 0x2c, 0x2a
])

const exp_pk = Buffer.from([
  0xed, 0x77, 0x49, 0xb4, 0xd9, 0x89, 0xf6, 0x95,
  0x7f, 0x3b, 0xfd, 0xe6, 0xc5, 0x67, 0x67, 0xe9,
  0x88, 0xe2, 0x1c, 0x9f, 0x87, 0x84, 0xd9, 0x1d,
  0x61, 0x00, 0x11, 0xcd, 0x55, 0x3f, 0x9b, 0x06
])

const exp_sk = Buffer.from([
  0xac, 0xcd, 0x44, 0xeb, 0x8e, 0x93, 0x31, 0x9c,
  0x05, 0x70, 0xbc, 0x11, 0x00, 0x5c, 0x0e, 0x01,
  0x89, 0xd3, 0x4f, 0xf0, 0x2f, 0x6c, 0x17, 0x77,
  0x34, 0x11, 0xad, 0x19, 0x12, 0x93, 0xc9, 0x8f
])

module.exports = function (sodium) {
  tape('crypto_box_keypair generate key-pair', function (t) {
    var pubKey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES)
    sodium.randombytes_buf(pubKey)

    var secret = Buffer.alloc(sodium.crypto_box_SECRETKEYBYTES)
    sodium.randombytes_buf(secret)

    var pubKeyCopy = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES)
    pubKey.copy(pubKeyCopy)

    var secretCopy = Buffer.alloc(sodium.crypto_box_SECRETKEYBYTES)
    secret.copy(secretCopy)

    sodium.crypto_box_keypair(pubKey, secret)
    t.notEqual(pubKey, pubKeyCopy)
    t.notEqual(secret, secretCopy)

    t.end()
  })

  tape('crypto_box_seal/crypto_box_seal_open self-decrypt', function (t) {
    var pubKey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES)
    var secret = Buffer.alloc(sodium.crypto_box_SECRETKEYBYTES)

    sodium.crypto_box_keypair(pubKey, secret)

    var msg = Buffer.from('hello world')
    var cipher = Buffer.alloc(sodium.crypto_box_SEALBYTES + msg.length)
    sodium.crypto_box_seal(cipher, msg, pubKey)

    var out = Buffer.alloc(cipher.length - sodium.crypto_box_SEALBYTES)
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

    var out = Buffer.alloc(cipher.length - sodium.crypto_box_SEALBYTES)
    sodium.crypto_box_seal_open(out, cipher, pubKey, secret)
    t.same(out.toString(), 'hello world')
    t.end()
  })

  tape('crypto_box_seed_keypair', function (t) {
    const sk = Buffer.alloc(32)
    const pk = Buffer.alloc(32)

    sodium.crypto_box_seed_keypair(pk, sk, seed)

    t.same(pk, exp_pk)
    t.same(sk, exp_sk)

    t.end()
  })
}
