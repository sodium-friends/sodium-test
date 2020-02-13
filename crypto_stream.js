var tape = require('tape')
var alloc = require('buffer-alloc')
var toBuffer = require('buffer-from')

module.exports = function (sodium) {
  tape('crypto_stream', function (t) {
    var buf = alloc(50)
    var nonce = random(sodium.crypto_stream_NONCEBYTES)
    var key = random(sodium.crypto_stream_KEYBYTES)

    sodium.crypto_stream(buf, nonce, key)

    t.notEquals(buf, alloc(50), 'contains noise now')
    var copy = toBuffer(buf.toString('hex'), 'hex')

    sodium.crypto_stream(buf, nonce, key)
    t.same(buf, copy, 'predictable from nonce, key')

    t.end()
  })

  tape('crypto_stream_xor', function (t) {
    var message = toBuffer('Hello, World!')
    var nonce = random(sodium.crypto_stream_NONCEBYTES)
    var key = random(sodium.crypto_stream_KEYBYTES)

    sodium.crypto_stream_xor(message, message, nonce, key)

    t.notEquals(message, toBuffer('Hello, World!'), 'encrypted')

    sodium.crypto_stream_xor(message, message, nonce, key)

    t.same(message, toBuffer('Hello, World!'), 'decrypted')

    t.end()
  })

  function random (n) {
    var buf = alloc(n)
    sodium.randombytes_buf(buf)
    return buf
  }
}
