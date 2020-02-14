var tape = require('tape')

module.exports = function (sodium) {
  tape('crypto_kdf_keygen', function (t) {
    var key = Buffer.alloc(sodium.crypto_kdf_KEYBYTES)

    t.throws(function () {
      sodium.crypto_kdf_keygen(Buffer.alloc(1))
    })

    sodium.crypto_kdf_keygen(key)

    t.notEqual(key, Buffer.alloc(key.length))
    t.end()
  })

  tape('crypto_kdf_derive_from_key', function (t) {
    var key = Buffer.alloc(sodium.crypto_kdf_KEYBYTES)

    sodium.crypto_kdf_keygen(key)

    var subkey = Buffer.alloc(sodium.crypto_kdf_BYTES_MIN)

    sodium.crypto_kdf_derive_from_key(subkey, 0, Buffer.from('context_'), key)
    t.notEqual(subkey, Buffer.alloc(subkey.length))

    var subkey2 = Buffer.alloc(sodium.crypto_kdf_BYTES_MIN)

    sodium.crypto_kdf_derive_from_key(subkey2, 1, Buffer.from('context_'), key)
    t.notEqual(subkey, subkey2)

    sodium.crypto_kdf_derive_from_key(subkey2, 0, Buffer.from('context_'), key)
    t.same(subkey, subkey2)

    t.end()
  })

  tape('test vectors', function (assert) {
    var fixtures = require('./fixtures/crypto_kdf.json')

    for (var i = 0; i < fixtures.length; i++) {
      var key = Buffer.from(fixtures[i].key, 'hex')
      var subkeyLen = fixtures[i].subkey_len
      var id = fixtures[i].id
      var context = Buffer.from(fixtures[i].context, 'hex')

      var shouldError = fixtures[i].error

      var actual = Buffer.alloc(subkeyLen)

      try {
        sodium.crypto_kdf_derive_from_key(actual, id, context, key)
        var expected = Buffer.from(fixtures[i].subkey, 'hex')
        if (equals(actual, expected) === false) {
          assert.fail('Failed on fixture #' + i)
        }
      } catch (ex) {
        if (shouldError === false) assert.fail('Failed on fixture #' + i)
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })

  tape('constants', function (t) {
    t.ok(sodium.crypto_kdf_PRIMITIVE)
    t.ok(sodium.crypto_kdf_BYTES_MAX > 0)
    t.ok(sodium.crypto_kdf_BYTES_MIN <= sodium.crypto_kdf_BYTES_MAX)
    t.ok(sodium.crypto_kdf_CONTEXTBYTES > 0)
    t.ok(sodium.crypto_kdf_KEYBYTES >= 16)
    t.end()
  })
}

function equals (buf1, buf2) {
  return Buffer.compare(buf1, buf2) === 0
}
