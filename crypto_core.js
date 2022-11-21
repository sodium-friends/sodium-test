const test = require('tape')

const exp = [
  '5858cdec40a044b1548b3bb08f8ce0d71103d1f887df84ebc502643dac4df40b',
  '09688ce78a8ff8273f636b0bc748c0cceeeeedecebeae9e8e7e6e5e4e3e2e100',
  'f70b4f272b47bd6a1015a511fb3c9fc1b9c21ca4ca2e17d5a225b4c410b9b60d',
  '201f1e1d1c1b1a191817161514131211100f0e0d0c0b0a090807060504030201',
  'e46b69758fd3193097398c9717b11e48111112131415161718191a1b1c1d1e0f',
  '09688ce78a8ff8273f636b0bc748c0cceeeeedecebeae9e8e7e6e5e4e3e2e100',
  'cdb4d73ffe47f83ebe85e18dcae6cc03f0f0f1f2f3f4f5f6f7f8f9fafbfcfd0e',
  '201f1e1d1c1b1a191817161514131211100f0e0d0c0b0a090807060504030201',
  'e56b69758fd3193097398c9717b11e48111112131415161718191a1b1c1d1e0f',
  '09688ce78a8ff8273f636b0bc748c0cceeeeedecebeae9e8e7e6e5e4e3e2e100',
  'ceb4d73ffe47f83ebe85e18dcae6cc03f0f0f1f2f3f4f5f6f7f8f9fafbfcfd0e',
  '201f1e1d1c1b1a191817161514131211100f0e0d0c0b0a090807060504030201',
  'f7567cd87c82ec1c355a6304c143bcc9ecedededededededededededededed0d',
  'f67c79849de0253ba142949e1db6224b13121212121212121212121212121202',
  'b02e8581ce62f69922427c23f970f7e951525252525252525252525252525202',
  '3da570db4b001cbeb35a7b7fe588e72aaeadadadadadadadadadadadadadad0d',
  '4453ef38408c06677c1b810e4bf8b1991f01c88716fbfa2f075a518b77da400b',
  'b18e62cf804b022fec392b0e2d6539d0f059732616c11913f510f73ae2544ebc',
  'b9d23004e78c58e22da72e109550133e3d3bb9e46afcc066b82326319653d62c',
  '14063782c8b8a677dce09c4e51719b1cf942bf71bc765c1ec9832a8b4446983c',
  '02d6dbac70f6a14de72f4e17386016b08d6506336a086f10e719fbad8831d550',
  '11c851408e7892c2eae37584423a8f9c797e3649d45946b53e64319318a750b0',
  'd4b9eaf70ffdc238c88725e294bdd02a6ce85577c5e7add7ca07041873019842',
  '740a6141079285c1b9e84ed463dcce5d3d40a167fa13129463eaf97d2a7bf654',
  'e504a3e00bbf506cbe388784d85e85b10c428c37eba04ebd19a60948b71ad2cf',
  '67cd50902c40c943f22c479c587fb3e5da2f8f1ad402049ac49ddc45ec20884c',
  '658bffa23b425a91268ee17559073c4b1548209054ed7cf00ffe582696dda8dc',
  'b55b93e7a0fe554f86f1f4c991871a27756fee359a8c6bb7554ec91d5d552c49',
  'fbc2bb45df1d806489a5a6415898c719c45c932d3467b6ce948ee80c0e8122c9',
  '93164e57b5e3ae6826ac9e0c31ddecf94e21a39a29ba9d1d24e9e588fe065d95',
  '16824d74c9482890dc57b0ec843a0a5231b581d2ce3909934d7658389f169093',
  '2f5b0336c7f0af520badeae99450f92835c27224ab4cd117f55b176afb6f0001',
  'e5d3f55c1a631258d69cf7a2def9de1400000000000000000000000000000010',
  'e5d3f55c1a631258d69cf7a2def9de1400000000000000000000000000000010',
  '0100000000000000000000000000000000000000000000000000000000000000',
  '0800000000000000000000000000000000000000000000000000000000000000',
  '0800000000000000000000000000000000000000000000000000000000000000',
  '0100000000000000000000000000000000000000000000000000000000000000',
  '609faee7d21893c0b2e6bc17f5cef7a600000000000000000000000000000000',
  '609faee7d21893c0b2e6bc17f5cef7a600000000000000000000000000000000',
  '8d344775474a7f9723b63a8be92ae76dffffffffffffffffffffffffffffff0f',
  '8d344775474a7f9723b63a8be92ae76dffffffffffffffffffffffffffffff0f',
  '726cf51b9ec1dda146af8c58ffd22d148f6ffd85f41cbb738f260cdf4650e60c',
  '0700000000000000000000000000000000000000000000000000000000000000',
  '0700000000000000000000000000000000000000000000000000000000000000',
  'ebd3f55c1a631258d69cf7a2def9de1400000000000000000000000000000010',
  '0900000000000000000000000000000000000000000000000000000000000000',
  '0900000000000000000000000000000000000000000000000000000000000000',
  '0200000000000000000000000000000000000000000000000000000000000000',
  '8c344775474a7f9723b63a8be92ae76dffffffffffffffffffffffffffffff0f',
  '8c344775474a7f9723b63a8be92ae76dffffffffffffffffffffffffffffff0f',
  '8e344775474a7f9723b63a8be92ae76dffffffffffffffffffffffffffffff0f',
  '8e344775474a7f9723b63a8be92ae76dffffffffffffffffffffffffffffff0f',
  '1000000000000000000000000000000000000000000000000000000000000000'
].map(b => Buffer.from(b, 'hex'))

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
const L_p1 = Buffer.from([
  0xee, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10
])
const L = Buffer.from([
  0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10
])
const L_1 = Buffer.from([
  0xec, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10
])
const sc_8 = Buffer.from([
  0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
])
const sc_highbit = Buffer.from([
  0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80
])

module.exports = (sodium) => {
  function add_P (S) {
    const P = Buffer.from([
      0xed, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f
    ])

    sodium.sodium_add(S, P)
  }

  function add_l64 (S) {
    const l = Buffer.from([
      0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58,
      0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ])

    sodium.sodium_add(S, l)
  }

  test('crypto_core', t => {
    let i, j

    const r = Buffer.alloc(sodium.crypto_core_ed25519_UNIFORMBYTES)
    const p = Buffer.alloc(sodium.crypto_core_ed25519_BYTES)

    for (i = 0; i < 500; i++) {
      sodium.randombytes_buf(r, sodium.crypto_core_ed25519_UNIFORMBYTES)
      sodium.crypto_core_ed25519_from_uniform(p, r)
      t.ok(sodium.crypto_core_ed25519_is_valid_point(p))
      sodium.crypto_core_ed25519_random(p)
      t.ok(sodium.crypto_core_ed25519_is_valid_point(p))
    }

    const p2 = Buffer.alloc(sodium.crypto_core_ed25519_BYTES)
    const p3 = Buffer.alloc(sodium.crypto_core_ed25519_BYTES)

    sodium.crypto_core_ed25519_random(p2)

    // console.log(p, p2)
    j = 1 + Math.floor(Math.random() * 100)
    p3.set(p.subarray(0, sodium.crypto_core_ed25519_BYTES))
    for (i = 0; i < j; i++) {
      sodium.crypto_core_ed25519_add(p, p, p2)
      t.assert(sodium.crypto_core_ed25519_is_valid_point(p))
    }
    t.assert(!p.equals(p3.subarray(0, sodium.crypto_core_ed25519_BYTES)))
    for (i = 0; i < j; i++) {
      sodium.crypto_core_ed25519_sub(p, p, p2)
    }
    t.assert(p.equals(p3.subarray(0, sodium.crypto_core_ed25519_BYTES)))
    const sc = Buffer.alloc(sodium.crypto_scalarmult_ed25519_SCALARBYTES)
    sc.fill(0, 0, sodium.crypto_scalarmult_ed25519_SCALARBYTES)
    sc[0] = 8
    p2.set(p.subarray(0, sodium.crypto_core_ed25519_BYTES))
    p3.set(p.subarray(0, sodium.crypto_core_ed25519_BYTES))

    for (i = 0; i < 254; i++) {
      sodium.crypto_core_ed25519_add(p2, p2, p2)
    }
    for (i = 0; i < 8; i++) {
      sodium.crypto_core_ed25519_add(p2, p2, p)
    }
    sodium.crypto_scalarmult_ed25519(p3, sc, p)
    t.assert(p2.equals(p3.subarray(0, sodium.crypto_core_ed25519_BYTES)))

    t.ok(sodium.crypto_core_ed25519_is_valid_point(p))

    p.fill(0, 0, sodium.crypto_core_ed25519_BYTES)
    t.ok(!sodium.crypto_core_ed25519_is_valid_point(p))

    p[0] = 1
    t.ok(!sodium.crypto_core_ed25519_is_valid_point(p))

    p[0] = 2
    t.ok(!sodium.crypto_core_ed25519_is_valid_point(p))

    p[0] = 9
    t.ok(sodium.crypto_core_ed25519_is_valid_point(p))

    t.ok(sodium.crypto_core_ed25519_is_valid_point(max_canonical_p))
    t.ok(!sodium.crypto_core_ed25519_is_valid_point(non_canonical_invalid_p))
    t.ok(!sodium.crypto_core_ed25519_is_valid_point(non_canonical_p))

    p2.set(p.subarray(0, sodium.crypto_core_ed25519_BYTES))
    add_P(p2)
    sodium.crypto_core_ed25519_add(p3, p2, p2)
    sodium.crypto_core_ed25519_sub(p3, p3, p2)
    t.ok(!p2.equals(p.subarray(0, sodium.crypto_core_ed25519_BYTES)))
    t.ok(p3.equals(p.subarray(0, sodium.crypto_core_ed25519_BYTES)))

    p[0] = 2
    t.throws(() => sodium.crypto_core_ed25519_add(p3, p2, p))
    sodium.crypto_core_ed25519_add(p3, p2, non_canonical_p)
    t.throws(() => sodium.crypto_core_ed25519_add(p3, p2, non_canonical_invalid_p))
    t.throws(() => sodium.crypto_core_ed25519_add(p3, p, p3))
    sodium.crypto_core_ed25519_add(p3, non_canonical_p, p3)
    t.throws(() => sodium.crypto_core_ed25519_add(p3, non_canonical_invalid_p, p3))

    t.throws(() => sodium.crypto_core_ed25519_sub(p3, p2, p))
    sodium.crypto_core_ed25519_sub(p3, p2, non_canonical_p)
    t.throws(() => sodium.crypto_core_ed25519_sub(p3, p2, non_canonical_invalid_p))
    t.throws(() => sodium.crypto_core_ed25519_sub(p3, p, p3))
    sodium.crypto_core_ed25519_sub(p3, non_canonical_p, p3)
    t.throws(() => sodium.crypto_core_ed25519_sub(p3, non_canonical_invalid_p, p3))

    for (i = 0; i < 1000; i++) {
      sodium.crypto_core_ed25519_random(p)
      do {
        sodium.crypto_core_ed25519_scalar_random(sc)
      } while (sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
      sodium.crypto_scalarmult_ed25519_noclamp(p2, sc, p)
      t.assert(sodium.crypto_core_ed25519_is_valid_point(p2))
      sodium.crypto_core_ed25519_scalar_invert(sc, sc)
      sodium.crypto_scalarmult_ed25519_noclamp(p3, sc, p2)
      t.assert(p3.equals(p.subarray(0, sodium.crypto_core_ed25519_BYTES)))
    }

    const sc64 = Buffer.alloc(64)
    sodium.crypto_core_ed25519_scalar_random(sc)
    sc64.set(sc.subarray(0, sodium.crypto_core_ed25519_BYTES))
    sc64.fill(0, sodium.crypto_core_ed25519_BYTES, 64 - sodium.crypto_core_ed25519_BYTES)
    i = Math.floor(Math.random() * 100)
    do {
      add_l64(sc64)
    } while (i-- > 0)
    sodium.crypto_core_ed25519_scalar_reduce(sc64, sc64)
    t.ok(sc.equals(sc64.subarray(0, sodium.crypto_core_ed25519_BYTES)))

    sodium.randombytes_buf(r, sodium.crypto_core_ed25519_UNIFORMBYTES)
    sodium.crypto_core_ed25519_from_uniform(p, r)
    p2.set(p.subarray(0, sodium.crypto_core_ed25519_BYTES))
    sodium.crypto_core_ed25519_scalar_random(sc)
    sodium.crypto_scalarmult_ed25519_noclamp(p, sc, p)
    sodium.crypto_core_ed25519_scalar_complement(sc, sc)
    sodium.crypto_scalarmult_ed25519_noclamp(p2, sc, p2)
    sodium.crypto_core_ed25519_add(p3, p, p2)
    sodium.crypto_core_ed25519_from_uniform(p, r)
    sodium.crypto_core_ed25519_sub(p, p, p3)
    t.assert(p[0] === 0x01)
    for (i = 1; i < sodium.crypto_core_ed25519_BYTES; i++) {
      t.assert(p[i] === 0)
    }

    sodium.crypto_core_ed25519_random(p)
    p2.set(p.subarray(0, sodium.crypto_core_ed25519_BYTES))
    sodium.crypto_core_ed25519_scalar_random(sc)
    sodium.crypto_scalarmult_ed25519_noclamp(p, sc, p)
    sodium.crypto_core_ed25519_scalar_negate(sc, sc)
    sodium.crypto_scalarmult_ed25519_noclamp(p2, sc, p2)
    sodium.crypto_core_ed25519_add(p, p, p2)
    t.assert(p[0] === 0x01)
    for (i = 1; i < sodium.crypto_core_ed25519_BYTES; i++) {
      t.assert(p[i] === 0)
    }

    for (i = 0; i < sodium.crypto_core_ed25519_SCALARBYTES; i++) {
      sc[i] = 255 - i
    }
    sodium.crypto_core_ed25519_scalar_invert(sc, sc)

    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_invert(sc, sc)
    t.same(sc, exp.shift())
    for (i = 0; i < sodium.crypto_core_ed25519_SCALARBYTES; i++) {
      sc[i] = 32 - i
    }
    sodium.crypto_core_ed25519_scalar_invert(sc, sc)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_invert(sc, sc)
    t.same(sc, exp.shift())

    for (i = 0; i < sodium.crypto_core_ed25519_SCALARBYTES; i++) {
      sc[i] = 255 - i
    }
    sodium.crypto_core_ed25519_scalar_negate(sc, sc)
    t.same(sc, exp.shift()) // --
    sodium.crypto_core_ed25519_scalar_negate(sc, sc)
    t.same(sc, exp.shift())
    for (i = 0; i < sodium.crypto_core_ed25519_SCALARBYTES; i++) {
      sc[i] = 32 - i
    }
    sodium.crypto_core_ed25519_scalar_negate(sc, sc)
    t.same(sc, exp.shift()) // --
    sodium.crypto_core_ed25519_scalar_negate(sc, sc)
    t.same(sc, exp.shift())

    for (i = 0; i < sodium.crypto_core_ed25519_SCALARBYTES; i++) {
      sc[i] = 255 - i
    }
    sodium.crypto_core_ed25519_scalar_complement(sc, sc)
    t.same(sc, exp.shift()) // --
    sodium.crypto_core_ed25519_scalar_complement(sc, sc)
    t.same(sc, exp.shift())
    for (i = 0; i < sodium.crypto_core_ed25519_SCALARBYTES; i++) {
      sc[i] = 32 - i
    }
    sodium.crypto_core_ed25519_scalar_complement(sc, sc)
    t.same(sc, exp.shift()) // --
    sodium.crypto_core_ed25519_scalar_complement(sc, sc)
    t.same(sc, exp.shift())

    const sc2 = Buffer.alloc(sodium.crypto_core_ed25519_SCALARBYTES)
    const sc3 = Buffer.alloc(sodium.crypto_core_ed25519_SCALARBYTES)
    for (i = 0; i < 1000; i++) {
      sodium.randombytes_buf(sc, sodium.crypto_core_ed25519_SCALARBYTES)
      sodium.randombytes_buf(sc2, sodium.crypto_core_ed25519_SCALARBYTES)
      sc[sodium.crypto_core_ed25519_SCALARBYTES - 1] &= 0x7f
      sc2[sodium.crypto_core_ed25519_SCALARBYTES - 1] &= 0x7f
      sodium.crypto_core_ed25519_scalar_add(sc3, sc, sc2)
      t.ok(!sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
      sodium.crypto_core_ed25519_scalar_sub(sc3, sc3, sc2)
      t.ok(!sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
      sodium.crypto_core_ed25519_scalar_sub(sc3, sc3, sc)
      t.ok(sodium.sodium_is_zero(sc3, sodium.crypto_core_ed25519_SCALARBYTES)) // --
    }

    sc.fill(0x69, 0, sodium.crypto_core_ed25519_SCALARBYTES)
    sc2.fill(0x42, 0, sodium.crypto_core_ed25519_SCALARBYTES)
    sodium.crypto_core_ed25519_scalar_add(sc, sc, sc2)
    sodium.crypto_core_ed25519_scalar_add(sc, sc2, sc)
    t.same(sc, exp.shift())

    sodium.crypto_core_ed25519_scalar_sub(sc, sc2, sc)
    sodium.crypto_core_ed25519_scalar_sub(sc, sc, sc2)
    t.same(sc, exp.shift()) // --

    sc.fill(0xcd, 0, sodium.crypto_core_ed25519_SCALARBYTES)
    sc2.fill(0x42, 0, sodium.crypto_core_ed25519_SCALARBYTES)
    sodium.crypto_core_ed25519_scalar_add(sc, sc, sc2)
    sodium.crypto_core_ed25519_scalar_add(sc, sc2, sc)
    t.same(sc, exp.shift())

    sodium.crypto_core_ed25519_scalar_sub(sc, sc2, sc)
    sodium.crypto_core_ed25519_scalar_sub(sc, sc, sc2)
    t.same(sc, exp.shift()) // --

    sc.fill(0x69, 0, sodium.crypto_core_ed25519_SCALARBYTES)
    sc2.fill(0x42, 0, sodium.crypto_core_ed25519_SCALARBYTES)
    for (i = 0; i < 100; i++) {
      sodium.crypto_core_ed25519_scalar_mul(sc, sc, sc2)
      sodium.crypto_core_ed25519_scalar_mul(sc2, sc, sc2)
    }
    t.same(sc2, exp.shift())
    for (i = 0; i < 1000; i++) {
      sodium.crypto_core_ed25519_scalar_random(sc)
      sc2.fill(0, 0, sodium.crypto_core_ed25519_SCALARBYTES)
      sodium.crypto_core_ed25519_scalar_mul(sc3, sc, sc2)
      t.ok(sodium.sodium_is_zero(sc3, sodium.crypto_core_ed25519_SCALARBYTES))

      sc2[0]++
      sodium.crypto_core_ed25519_scalar_mul(sc3, sc, sc2)
      t.ok(sc3.equals(sc.subarray(0, sodium.crypto_core_ed25519_SCALARBYTES)))

      sc2[0]++
      sodium.crypto_core_ed25519_scalar_mul(sc3, sc, sc2)
      sodium.crypto_core_ed25519_scalar_sub(sc3, sc3, sc)
      sodium.crypto_core_ed25519_scalar_sub(sc3, sc3, sc)
      t.ok(sodium.sodium_is_zero(sc3, sodium.crypto_core_ed25519_SCALARBYTES))

      do {
        sodium.crypto_core_ed25519_scalar_random(sc2)
      } while (sodium.sodium_is_zero(sc2, sodium.crypto_core_ed25519_SCALARBYTES))
      sodium.crypto_core_ed25519_scalar_mul(sc3, sc, sc2)
      sodium.crypto_core_ed25519_scalar_invert(sc2, sc2)
      sodium.crypto_core_ed25519_scalar_mul(sc3, sc3, sc2)
      t.ok(sc3.equals(sc.subarray(0, sodium.crypto_core_ed25519_SCALARBYTES)))

      sc[31] |= 0x11
      sc2.fill(0, 0, sodium.crypto_core_ed25519_SCALARBYTES)
      sc2[0] = 1
      sodium.crypto_core_ed25519_scalar_mul(sc3, sc, sc2)
      t.ok(!sc3.equals(sc.subarray(0, sodium.crypto_core_ed25519_SCALARBYTES)))
    }

    const seed = Buffer.alloc(sodium.randombytes_SEEDBYTES, 0xdb)
    for (i = 0; i < 15; i++) {
      sodium.randombytes_buf_deterministic(r, seed)
      sodium.crypto_core_ed25519_from_uniform(p, r)
      t.same(p, exp.shift())
      sodium.sodium_increment(seed, sodium.randombytes_SEEDBYTES)
    }
    sodium.crypto_core_ed25519_scalar_mul(sc, L_1, sc_8)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, sc_8, L_1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, L_1, L_1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, L, sc_8)

    sodium.crypto_core_ed25519_scalar_mul(sc, L_p1, sc_8)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, sc_8, L_p1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, L_p1, L_p1)
    t.same(sc, exp.shift())

    sodium.crypto_core_ed25519_scalar_mul(sc, L_1, sc_highbit)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, sc_highbit, L_1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, L_p1, sc_highbit)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, sc_highbit, L_p1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_mul(sc, sc_highbit, sc_highbit)
    t.same(sc, exp.shift())

    sodium.crypto_core_ed25519_scalar_mul(sc, L, sc_8)
    t.ok(sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
    sodium.crypto_core_ed25519_scalar_mul(sc, sc_8, L)
    t.ok(sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
    sodium.crypto_core_ed25519_scalar_mul(sc, L, L)
    t.ok(sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
    sodium.crypto_core_ed25519_scalar_mul(sc, L, L_1)
    t.ok(sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))
    sodium.crypto_core_ed25519_scalar_mul(sc, L_1, L)
    t.ok(sodium.sodium_is_zero(sc, sodium.crypto_core_ed25519_SCALARBYTES))

    sodium.crypto_core_ed25519_scalar_add(sc, L_1, sc_8)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, sc_8, L_1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, L_1, L_1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, L, sc_8)

    sodium.crypto_core_ed25519_scalar_add(sc, L_p1, sc_8)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, sc_8, L_p1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, L_p1, L_p1)
    t.same(sc, exp.shift())

    sodium.crypto_core_ed25519_scalar_add(sc, L_1, sc_highbit)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, sc_highbit, L_1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, L_p1, sc_highbit)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, sc_highbit, L_p1)
    t.same(sc, exp.shift())
    sodium.crypto_core_ed25519_scalar_add(sc, sc_highbit, sc_highbit)
    t.same(sc, exp.shift())

    t.ok(sodium.crypto_core_ed25519_BYTES === 32)
    t.ok(sodium.crypto_core_ed25519_SCALARBYTES === 32)
    t.ok(sodium.crypto_core_ed25519_NONREDUCEDSCALARBYTES === 64)
    t.ok(sodium.crypto_core_ed25519_NONREDUCEDSCALARBYTES >= sodium.crypto_core_ed25519_SCALARBYTES)
    t.ok(sodium.crypto_core_ed25519_UNIFORMBYTES === 32)
    t.ok(sodium.crypto_core_ed25519_UNIFORMBYTES >= sodium.crypto_core_ed25519_BYTES)

    t.end()
  })
}
