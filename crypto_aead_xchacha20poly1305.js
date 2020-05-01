var tape = require('tape')
var alloc = require('buffer-alloc')

module.exports = function (sodium) {
  tape('crypto_aead_xchacha20poly1305 encrypt+decrypt with ad', function (t) {
    var fixtures = require('./fixtures/crypto_aead_xchacha20poly1305.json')
    t.equal(
      sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
      fixtures.KEYLEN
    )
    t.equal(
      sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES,
      16 + fixtures.NONCELEN
    )
    t.equal(
      sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES,
      fixtures.MACLEN
    )
    var payloads = [
      {
        plaintext: 'whatever',
        key: random(fixtures.KEYLEN),
        nonce: random(fixtures.NONCELEN)
      },
      {
        plaintext: 'hmm',
        key: random(fixtures.KEYLEN),
        nonce: random(fixtures.NONCELEN)
      }
    ].concat(fixtures.encrypt)

    var elongatedNonce = sodium.sodium_malloc(
      sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
    )
    payloads.forEach(function (p) {
      var plaintext = Buffer.from(p.plaintext)
      var nonce = Buffer.from(p.nonce, 'hex')
      var key = Buffer.from(p.key, 'hex')

      var ciphertext = Buffer.alloc(plaintext.byteLength + fixtures.MACLEN)
      var decrypted = Buffer.alloc(plaintext.byteLength)
      var ad = Buffer.from('version 0')
      sodium.sodium_memzero(elongatedNonce)
      elongatedNonce.set(nonce, 16)
      var encBytesWritten = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        ciphertext, plaintext, ad, null, elongatedNonce, key)
      sodium.sodium_memzero(elongatedNonce)

      if (p.ciphertext) {
        t.deepEqual(Buffer.from(p.ciphertext,'hex'), ciphertext,
          'matches expected ciphertext')
      }
      var decrypted = Buffer.alloc(plaintext.byteLength)
      sodium.sodium_memzero(elongatedNonce)
      elongatedNonce.set(nonce, 16)
      var decBytesWritten = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        decrypted, null, ciphertext, ad, elongatedNonce, key
      )
      sodium.sodium_memzero(elongatedNonce)

      t.deepEqual(decrypted, plaintext, 'decrypted value matches plaintext')
    })
    t.end()
  })
  function random (n) {
    var buf = Buffer.alloc(n)
    sodium.randombytes_buf(buf)
    return buf
  }
}
