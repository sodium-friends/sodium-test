const test = require('tape')
const b4a = require('b4a')

const exp = [
  '3066f82a1a747d45120d1740f14358531a8f04bbffe6a819f86dfe50f44a0a46',
  'f26e5b6f7d362d2d2a94c5d0e7602cb4773c95a2e5c31a64f133189fa76ed61b',
  '006ccd2a9e6867e6a2c5cea83d3302cc9de128dd2a9a57dd8ee7b9d7ffe02826',
  'f8f0c87cf237953c5890aec3998169005dae3eca1fbb04548c635953c817f92a',
  'ae81e7dedf20a497e10c304a765c1767a42d6e06029758d2d7e8ef7cc4c41179',
  'e2705652ff9f5e44d3e841bf1c251cf7dddb77d140870d1ab2ed64f1a9ce8628',
  '80bd07262511cdde4863f8a7434cef696750681cb9510eea557088f76d9e5065'
].map(h => b4a.from(h, 'hex'))

module.exports = (sodium) => {
  test('crypto_core_ristretto255 bad encodings', t => {
    const bad_encodings_hex = [
      /* Non-canonical field encodings */
      '00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
      'f3ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
      'edffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
      '0100000000000000000000000000000000000000000000000000000000000080',

      /* Negative field elements */
      '0100000000000000000000000000000000000000000000000000000000000000',
      '01ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
      'ed57ffd8c914fb201471d1c3d245ce3c746fcbe63a3679d51b6a516ebebe0e20',
      'c34c4e1826e5d403b78e246e88aa051c36ccf0aafebffe137d148a2bf9104562',
      'c940e5a4404157cfb1628b108db051a8d439e1a421394ec4ebccb9ec92a8ac78',
      '47cfc5497c53dc8e61c91d17fd626ffb1c49e2bca94eed052281b510b1117a24',
      'f1c6165d33367351b0da8f6e4511010c68174a03b6581212c71c0e1d026c3c72',
      '87260f7a2f12495118360f02c26a470f450dadf34a413d21042b43b9d93e1309',

      /* Non-square x^2 */
      '26948d35ca62e643e26a83177332e6b6afeb9d08e4268b650f1f5bbd8d81d371',
      '4eac077a713c57b4f4397629a4145982c661f48044dd3f96427d40b147d9742f',
      'de6a7b00deadc788eb6b6c8d20c0ae96c2f2019078fa604fee5b87d6e989ad7b',
      'bcab477be20861e01e4a0e295284146a510150d9817763caf1a6f4b422d67042',
      '2a292df7e32cababbd9de088d1d1abec9fc0440f637ed2fba145094dc14bea08',
      'f4a9e534fc0d216c44b218fa0c42d99635a0127ee2e53c712f70609649fdff22',
      '8268436f8c4126196cf64b3c7ddbda90746a378625f9813dd9b8457077256731',
      '2810e5cbc2cc4d4eece54f61c6f69758e289aa7ab440b3cbeaa21995c2f4232b',

      /* Negative xy value */
      '3eb858e78f5a7254d8c9731174a94f76755fd3941c0ac93735c07ba14579630e',
      'a45fdc55c76448c049a1ab33f17023edfb2be3581e9c7aade8a6125215e04220',
      'd483fe813c6ba647ebbfd3ec41adca1c6130c2beeee9d9bf065c8d151c5f396e',
      '8a2e1d30050198c65a54483123960ccc38aef6848e1ec8f5f780e8523769ba32',
      '32888462f8b486c68ad7dd9610be5192bbeaf3b443951ac1a8118419d9fa097b',
      '227142501b9d4355ccba290404bde41575b037693cef1f438c47f8fbf35d1165',
      '5c37cc491da847cfeb9281d407efc41e15144c876e0170b499a96a22ed31e01e',
      '445425117cb8c90edcbc7c1cc0e74f747f2c1efa5630a967c64f287792a48a4b',

      /* s = -1, which causes y = 0 */
      'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f'
    ].map(h => b4a.from(h, 'hex'))

    for (let i = 0; i < bad_encodings_hex.length; i++) {
      t.notOk(sodium.crypto_core_ristretto255_is_valid_point(bad_encodings_hex[i]))
    }

    t.end()
  })

  test('crypto_core_ristretto255 fixtures', t => {
    const hash_hex = [
      '5d1be09e3d0c82fc538112490e35701979d99e06ca3e2b5b54bffe8b4dc772c14d98b696a1bbfb5ca32c436cc61c16563790306c79eaca7705668b47dffe5bb6',
      'f116b34b8f17ceb56e8732a60d913dd10cce47a6d53bee9204be8b44f6678b270102a56902e2488c46120e9276cfe54638286b9e4b3cdb470b542d46c2068d38',
      '8422e1bbdaab52938b81fd602effb6f89110e1e57208ad12d9ad767e2e25510c27140775f9337088b982d83d7fcf0b2fa1edffe51952cbe7365e95c86eaf325c',
      'ac22415129b61427bf464e17baee8db65940c233b98afce8d17c57beeb7876c2150d15af1cb1fb824bbd14955f2b57d08d388aab431a391cfc33d5bafb5dbbaf',
      '165d697a1ef3d5cf3c38565beefcf88c0f282b8e7dbd28544c483432f1cec7675debea8ebb4e5fe7d6f6e5db15f15587ac4d4d4a1de7191e0c1ca6664abcc413',
      'a836e6c9a9ca9f1e8d486273ad56a78c70cf18f0ce10abb1c7172ddd605d7fd2979854f47ae1ccf204a33102095b4200e5befc0465accc263175485f0e17ea5c',
      '2cdc11eaeb95daf01189417cdddbf95952993aa9cb9c640eb5058d09702c74622c9965a697a3b345ec24ee56335b556e677b30e6f90ac77d781064f866a3c982'
    ].map(h => b4a.from(h, 'hex'))

    const s = b4a.alloc(sodium.crypto_core_ristretto255_BYTES)
    for (let i = 0; i < hash_hex.length; i++) {
      sodium.crypto_core_ristretto255_from_hash(s, hash_hex[i])
      t.same(s, exp[i])
    }

    t.end()
  })

  test('crypto_core_ristretto255 point artihmetic', t => {
    const l = b4a.from([
      0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58,
      0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10
    ])

    const r = b4a.alloc(sodium.crypto_core_ristretto255_SCALARBYTES)
    const r_inv = b4a.alloc(sodium.crypto_core_ristretto255_SCALARBYTES)
    const ru = b4a.alloc(sodium.crypto_core_ristretto255_HASHBYTES)
    const s = b4a.alloc(sodium.crypto_core_ristretto255_BYTES)
    const s_ = b4a.alloc(sodium.crypto_core_ristretto255_BYTES)
    const s2 = b4a.alloc(sodium.crypto_core_ristretto255_BYTES)

    for (let i = 0; i < 1000; i++) {
      sodium.crypto_core_ristretto255_scalar_random(r)
      t.assert(sodium.crypto_scalarmult_ristretto255_base(s, r) === 0 ||
          sodium.crypto_core_ristretto255_is_valid_point(s))
      sodium.crypto_core_ristretto255_random(s)
      t.assert(sodium.crypto_core_ristretto255_is_valid_point(s))
      t.assert(sodium.crypto_scalarmult_ristretto255(s, l, s) !== 0)
      sodium.randombytes_buf(ru, sodium.crypto_core_ristretto255_HASHBYTES)
      t.assert(sodium.crypto_core_ristretto255_from_hash(s, ru) === 0 ||
          sodium.crypto_core_ristretto255_is_valid_point(s))
      t.assert(sodium.crypto_scalarmult_ristretto255(s2, l, s) !== 0)
      t.assert(sodium.crypto_scalarmult_ristretto255(s2, r, s) === 0 ||
          sodium.crypto_core_ristretto255_is_valid_point(s2))
      t.doesNotThrow(() => sodium.crypto_core_ristretto255_scalar_invert(r_inv, r))
      t.assert(sodium.crypto_scalarmult_ristretto255(s_, r_inv, s2) === 0 ||
          sodium.crypto_core_ristretto255_is_valid_point(s_))
      t.assert(s.equals(s_))
      t.assert(sodium.crypto_scalarmult_ristretto255(s2, l, s2) !== 0)
      t.assert(sodium.crypto_core_ristretto255_add(s2, s, s_) === 0)
      t.assert(sodium.crypto_core_ristretto255_sub(s2, s2, s_) === 0)
      t.assert(sodium.crypto_core_ristretto255_is_valid_point(s2))
      t.assert(s.equals(s2))
      t.assert(sodium.crypto_core_ristretto255_sub(s2, s2, s) === 0)
      t.assert(sodium.crypto_core_ristretto255_is_valid_point(s2))
    }

    sodium.crypto_core_ristretto255_random(s)
    s_.fill(0xfe)
    t.assert(sodium.crypto_core_ristretto255_add(s2, s_, s) === -1)
    t.assert(sodium.crypto_core_ristretto255_add(s2, s, s_) === -1)
    t.assert(sodium.crypto_core_ristretto255_add(s2, s_, s_) === -1)
    t.assert(sodium.crypto_core_ristretto255_add(s2, s, s) === 0)
    t.assert(sodium.crypto_core_ristretto255_sub(s2, s_, s) === -1)
    t.assert(sodium.crypto_core_ristretto255_sub(s2, s, s_) === -1)
    t.assert(sodium.crypto_core_ristretto255_sub(s2, s_, s_) === -1)
    t.assert(sodium.crypto_core_ristretto255_sub(s2, s, s) === 0)

    t.end()
  })

  test('crypto_core_ristretto255 scalar artihmetic', t => {
    const r = b4a.alloc(sodium.crypto_core_ristretto255_NONREDUCEDSCALARBYTES)
    const s1 = b4a.alloc(sodium.crypto_core_ristretto255_SCALARBYTES)
    const s2 = b4a.alloc(sodium.crypto_core_ristretto255_SCALARBYTES)
    const s3 = b4a.alloc(sodium.crypto_core_ristretto255_SCALARBYTES)
    const s4 = b4a.alloc(sodium.crypto_core_ristretto255_SCALARBYTES)

    sodium.crypto_core_ristretto255_scalar_random(s1)
    sodium.randombytes_buf(r, sodium.crypto_core_ristretto255_NONREDUCEDSCALARBYTES)
    sodium.crypto_core_ristretto255_scalar_reduce(s2, r)
    s4.set(s1)
    sodium.crypto_core_ristretto255_scalar_add(s3, s1, s2)
    sodium.crypto_core_ristretto255_scalar_sub(s4, s1, s2)
    sodium.crypto_core_ristretto255_scalar_add(s2, s3, s4)
    sodium.crypto_core_ristretto255_scalar_sub(s2, s2, s1)
    sodium.crypto_core_ristretto255_scalar_mul(s2, s3, s2)
    sodium.crypto_core_ristretto255_scalar_invert(s4, s3)
    sodium.crypto_core_ristretto255_scalar_mul(s2, s2, s4)
    sodium.crypto_core_ristretto255_scalar_negate(s1, s1)
    sodium.crypto_core_ristretto255_scalar_add(s2, s2, s1)
    sodium.crypto_core_ristretto255_scalar_complement(s1, s2)
    s1[0]--
    t.assert(sodium.sodium_is_zero(s1, sodium.crypto_core_ristretto255_SCALARBYTES))

    t.end()
  })

  test('crypto_core_ristretto255 constants', t => {
    t.assert(sodium.crypto_core_ristretto255_BYTES === 32)
    t.assert(sodium.crypto_core_ristretto255_SCALARBYTES === 32)
    t.assert(sodium.crypto_core_ristretto255_NONREDUCEDSCALARBYTES === 64)
    t.assert(sodium.crypto_core_ristretto255_NONREDUCEDSCALARBYTES >= sodium.crypto_core_ristretto255_SCALARBYTES)
    t.assert(sodium.crypto_core_ristretto255_HASHBYTES === 64)
    t.assert(sodium.crypto_core_ristretto255_HASHBYTES >= sodium.crypto_core_ristretto255_BYTES)
    t.assert(sodium.crypto_core_ristretto255_BYTES === sodium.crypto_core_ed25519_BYTES)
    t.assert(sodium.crypto_core_ristretto255_SCALARBYTES === sodium.crypto_core_ed25519_SCALARBYTES)
    t.assert(sodium.crypto_core_ristretto255_NONREDUCEDSCALARBYTES === sodium.crypto_core_ed25519_NONREDUCEDSCALARBYTES)
    t.assert(sodium.crypto_core_ristretto255_HASHBYTES >= 2 * sodium.crypto_core_ed25519_UNIFORMBYTES)

    t.end()
  })
}
