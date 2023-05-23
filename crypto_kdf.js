const test = require('brittle')

module.exports = function (sodium) {
  test('crypto_kdf_keygen', function (t) {
    const key = Buffer.alloc(sodium.crypto_kdf_KEYBYTES + 1)
    key[sodium.crypto_kdf_KEYBYTES] = 0xdb

    t.exception.all(function () {
      sodium.crypto_kdf_keygen(Buffer.alloc(1))
    })

    sodium.crypto_kdf_keygen(key.subarray(0, sodium.crypto_kdf_KEYBYTES))

    t.not(key, Buffer.alloc(key.length))
    t.is(key[sodium.crypto_kdf_KEYBYTES], 0xdb)
  })

  test('crypto_kdf_derive_from_key', function (t) {
    const key = Buffer.alloc(sodium.crypto_kdf_KEYBYTES)

    sodium.crypto_kdf_keygen(key)

    const subkey = Buffer.alloc(sodium.crypto_kdf_BYTES_MIN)

    sodium.crypto_kdf_derive_from_key(subkey, 0, Buffer.from('context_'), key)
    t.not(subkey, Buffer.alloc(subkey.length))

    const subkey2 = Buffer.alloc(sodium.crypto_kdf_BYTES_MIN)

    sodium.crypto_kdf_derive_from_key(subkey2, 1, Buffer.from('context_'), key)
    t.not(subkey, subkey2)

    sodium.crypto_kdf_derive_from_key(subkey2, 0, Buffer.from('context_'), key)
    t.alike(subkey, subkey2)
  })

  test('test vectors', function (t) {
    const fixtures = require('./fixtures/crypto_kdf.json')

    for (let i = 0; i < fixtures.length; i++) {
      const key = Buffer.from(fixtures[i].key, 'hex')
      const subkeyLen = fixtures[i].subkey_len
      const id = fixtures[i].id
      const context = Buffer.from(fixtures[i].context, 'hex')

      const shouldError = fixtures[i].error

      const actual = Buffer.alloc(subkeyLen)

      try {
        sodium.crypto_kdf_derive_from_key(actual, id, context, key)
        const expected = Buffer.from(fixtures[i].subkey, 'hex')
        if (Buffer.compare(actual, expected) !== 0) {
          t.fail('Failed on fixture #' + i)
        }
      } catch (ex) {
        if (shouldError === false) t.fail('Failed on fixture #' + i)
      }
    }

    t.pass('Passed all fixtures')
  })

  test('constants', function (t) {
    t.ok(sodium.crypto_kdf_PRIMITIVE)
    t.ok(sodium.crypto_kdf_BYTES_MAX > 0)
    t.ok(sodium.crypto_kdf_BYTES_MIN <= sodium.crypto_kdf_BYTES_MAX)
    t.ok(sodium.crypto_kdf_CONTEXTBYTES > 0)
    t.ok(sodium.crypto_kdf_KEYBYTES >= 16)
  })
}
