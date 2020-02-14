var tape = require('tape')

module.exports = function (sodium) {
  tape('crypto_stream', function (t) {
    var buf = Buffer.alloc(50)
    var nonce = random(sodium.crypto_stream_NONCEBYTES)
    var key = random(sodium.crypto_stream_KEYBYTES)

    sodium.crypto_stream(buf, nonce, key)

    t.notEquals(buf, Buffer.alloc(50), 'contains noise now')
    var copy = Buffer.from(buf.toString('hex'), 'hex')

    sodium.crypto_stream(buf, nonce, key)
    t.same(buf, copy, 'predictable from nonce, key')

    t.end()
  })

  tape('crypto_stream_xor', function (t) {
    var message = Buffer.from('Hello, World!')
    var nonce = random(sodium.crypto_stream_NONCEBYTES)
    var key = random(sodium.crypto_stream_KEYBYTES)

    sodium.crypto_stream_xor(message, message, nonce, key)

    t.notEquals(message, Buffer.from('Hello, World!'), 'encrypted')

    sodium.crypto_stream_xor(message, message, nonce, key)

    t.same(message, Buffer.from('Hello, World!'), 'decrypted')

    t.end()
  })

  function random (n) {
    var buf = Buffer.alloc(n)
    sodium.randombytes_buf(buf)
    return buf
  }
}
