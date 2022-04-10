const test = require('tape')

const non_canonical_p = Buffer.from([
  0xf6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f
])
const non_canonical_invalid_p = Buffer.from([
  0xf5, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f
])
const max_canonical_p = Buffer.from([
  0xe4, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f
])

const B = Buffer.from([
  0x58, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
  0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66
])

module.exports = function (sodium) {
  return test('crypto_scalarmult_ed25519', t => {
    const n = Buffer.alloc(sodium.crypto_scalarmult_ed25519_SCALARBYTES)
    const p = Buffer.alloc(sodium.crypto_scalarmult_ed25519_BYTES)
    const q = Buffer.alloc(sodium.crypto_scalarmult_ed25519_BYTES)
    const q2 = Buffer.alloc(sodium.crypto_scalarmult_ed25519_BYTES)

    n.fill(1)
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_base(q, n),
      'sodium.crypto_scalarmult_ed25519_base() should pass')

    console.log(q)
    p.set(B)
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519(q2, n, p),
        'sodium.crypto_scalarmult_ed25519() should pass')
    t.equals(Buffer.compare(q, q2), 0,
        'sodium.crypto_scalarmult_ed25519_base(n) === sodium.crypto_scalarmult_ed25519(n, 9)')

    n.fill(0)
    t.throws(() => sodium.crypto_scalarmult_ed25519_base(q, n),
        'sodium.crypto_scalarmult_ed25519_base(0) should fail\n')
    t.throws(() => sodium.crypto_scalarmult_ed25519(q2, n, p),
        'sodium.crypto_scalarmult_ed25519(0) should fail\n')
    t.throws(() => sodium.crypto_scalarmult_ed25519_noclamp(q2, n, p),
        'sodium.crypto_scalarmult_ed25519_noclamp(0) should fail\n')

    n[0] = 1
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_base(q, n),
        'sodium.crypto_scalarmult_ed25519_base() should pass')
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519(q2, n, p),
        'sodium.crypto_scalarmult_ed25519() should pass')
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_noclamp(q2, n, p),
        'sodium.crypto_scalarmult_ed25519_noclamp() should pass')

    t.throws(() => sodium.crypto_scalarmult_ed25519(q, n, non_canonical_p),
        'sodium.crypto_scalarmult_ed25519() should fail')
    t.throws(() => sodium.crypto_scalarmult_ed25519(q, n, non_canonical_invalid_p),
        'sodium.crypto_scalarmult_ed25519() should fail')
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519(q, n, max_canonical_p),
        'sodium.crypto_scalarmult_ed25519() should pass')

    n[0] = 9
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519(q, n, p),
        'sodium.crypto_scalarmult_ed25519() should pass')
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_noclamp(q2, n, p),
        'sodium.crypto_scalarmult_ed25519_noclamp() should pass')
    t.notSame(q, q2, 'clamping should be applied')

    n[0] = 9
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_base(q, n),
        'sodium.crypto_scalarmult_ed25519_base() should pass')
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_base_noclamp(q2, n),
        'sodium.crypto_scalarmult_ed25519_base_noclamp() should pass')
    t.notSame(q, q2, 'clamping should be applied')

    n[0] = 8
    n[31] = 64
    t.doesNotThrow(() => sodium.crypto_scalarmult_ed25519_noclamp(q2, n, p),
        'sodium.crypto_scalarmult_ed25519_noclamp() should pass')
    t.same(q, q2, 'clamping should be consistent')

    p.fill(0)
    t.throws(() => sodium.crypto_scalarmult_ed25519(q, n, p),
        'sodium.crypto_scalarmult_ed25519() should fail')
    t.throws(() => sodium.crypto_scalarmult_ed25519_noclamp(q, n, p),
        'sodium.crypto_scalarmult_ed25519_noclamp() should fail')

    n[0] = 8
    t.throws(() => sodium.crypto_scalarmult_ed25519(q, n, p),
        'sodium.crypto_scalarmult_ed25519() should fail')
    t.throws(() => sodium.crypto_scalarmult_ed25519_noclamp(q, n, p),
        'sodium.crypto_scalarmult_ed25519_noclamp() should fail')

    t.equal(sodium.crypto_scalarmult_ed25519_BYTES, 32)
    t.equal(sodium.crypto_scalarmult_ed25519_SCALARBYTES, 32)

    t.end()
  })
}
