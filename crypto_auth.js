var tape = require('tape')

module.exports = function (sodium) {
  tape('crypto_auth', function (t) {
    const key = stringToArray('Jefe', 32)
    const c = stringToArray('what do ya want for nothing?')
    const a = new Uint8Array(sodium.crypto_auth_BYTES)
    const expected = [
      0x16, 0x4b, 0x7a, 0x7b, 0xfc, 0xf8, 0x19, 0xe2, 0xe3, 0x95, 0xfb, 0xe7,
      0x3b, 0x56, 0xe0, 0xa3, 0x87, 0xbd, 0x64, 0x22, 0x2e, 0x83, 0x1f, 0xd6,
      0x10, 0x27, 0x0c, 0xd7, 0xea, 0x25, 0x05, 0x54
    ]

    sodium.crypto_auth(a, c, key)

    t.deepEqual(a, expected)
    t.ok(sodium.crypto_auth_verify(a, c, key))

    c[Math.round(Math.random() * a.length)] += 1
    t.notOk(sodium.crypto_auth_verify(a, c, key))

    t.end()
  })
}

function stringToArray (s, size = s.length) {
  const array = new Uint8Array(size)
  array.set(s.split('').map((c) => c.charCodeAt(0)))
  return array
}
