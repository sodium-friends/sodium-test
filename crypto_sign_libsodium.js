const tape = require('tape')
const tests = require('./crypto_sign.json')

const non_canonical_p = Buffer.from([
  0xf6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f
])

module.exports = function (sodium) {
  tape('libsodium', t => {
    let sig = Buffer.alloc(sodium.crypto_sign_BYTES)
    let sm = Buffer.alloc(1024 + sodium.crypto_sign_BYTES)
    let m = Buffer.alloc(1024)
    let skpk = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
    let pk = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
    let sk = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
    let siglen
    let smlen
    let mlen
    let i
    let test
    

    sig.fill(0)
    for (i = 0; i < test.length; i++) {
      test = parseTest(tests[i])

      skpk.set(test.sk)
      skpk.set(test.pk, crypto_sign_SEEDBYTES)

      smlen = crypto_sign(sm, test.m.subarray(0, i), skpk)
      t.equal(smlen, sodium.crypto_sign_BYTES + m.byteLength)
      t.same(test.sig, sm.subarray(smlen))
      t.assert(crypto_sign_open(m, sm.subarray(0, smlen), test.pk))

      crypto_sign_detached(sig, test.m.subarray(0, i), skpk)

      t.assert(sig.byteLength != 0 && sig.byteLength <= crypto_sign_BYTES)
      t.same(test.sig, sig)
      t.assert(crypto_sign_verify_detached(sig, test.m.subarray(0, i), test.pk))
    }

    i--

    sm.set(test.m.subarray(0, i))
    var tmp = crypto_sign(sm, sm.subarray(0, i), skpk)
    t.equal(tmp, i + crypto_sign_BYTES)
    smlen = tmp

    mlen = crypto_sign_open(sm, sm.subarray(0, smlen), test.pk)
    t.same(test.m.subarray(0, mlen), sm.subarray(0, mlen))

    for (let j = 1; j < 8; j++) {
        sig[63] ^= (j << 5);
      
        t.notOk(crypto_sign_verify_detached(sig, test.m.subarray(0, i), test.pk))

        sig[63] ^= (j << 5);
    }

    pk.fill(0)
    t.notOk(crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    sig.subarray(0, 32).fill(0xff);
    sig[0] = 0xdb;

    t.notOk(crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))
    crypto_sign_detached(sig, test.m.subarray(0, i), skpk)

    pk.write("3eee494fb9eac773144e34b0c755affaf33ea782c0722e5ea8b150e61209ab36", 'hex')    
    t.notOk(crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    pk.write("0200000000000000000000000000000000000000000000000000000000000000", 'hex')
    t.notOk(crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    pk.write("0500000000000000000000000000000000000000000000000000000000000000", 'hex')
    t.notOk(crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    t.equal(crypto_sign_seed_keypair(pk, sk, keypair_seed), 0)
    t.equal(crypto_sign_keypair(pk, sk), 0)

    t.assert(crypto_sign_BYTES > 0)
    t.assert(crypto_sign_SEEDBYTES > 0)
    t.assert(crypto_sign_PUBLICKEYBYTES > 0)
    t.assert(crypto_sign_SECRETKEYBYTES > 0)
    t.equal(crypto_sign_BYTES, 64)
    t.equal(crypto_sign_SEEDBYTES, 32)
    t.equal(crypto_sign_PUBLICKEYBYTES, 32)
    t.equal(crypto_sign_SECRETKEYBYTES, 64)

    t.end()
  }
}

function parseTest (t) {
  return {
    sk: Buffer.from(t[0]),
    pk: Buffer.from(t[1]),
    sig: Buffer.from(t[2]),
    m: Buffer.from(t[3]),
  }
}
