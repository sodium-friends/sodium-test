/* eslint-disable camelcase */
const test = require('tape')

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

module.exports = function (sodium) {
  const NONCE_OFFSET = sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES
  const PAD_OFFSET = NONCE_OFFSET + 12

  test('secretstream', (t) => {
    const state = new Uint8Array(sodium.crypto_secretstream_xchacha20poly1305_STATEBYTES)
    const statesave = new Uint8Array(sodium.crypto_secretstream_xchacha20poly1305_STATEBYTES)
    const state_copy = new Uint8Array(sodium.crypto_secretstream_xchacha20poly1305_STATEBYTES)
    const header = new Uint8Array(sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES)
    const tag = new Uint8Array(1)

    const ad_len = getRandomInt(0, 100)
    const m1_len = getRandomInt(0, 1000)
    const m2_len = getRandomInt(0, 1000)
    const m3_len = getRandomInt(0, 1000)

    const c1 = new Uint8Array(m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    const c2 = new Uint8Array(m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    const c3 = new Uint8Array(m3_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    const csave = new Uint8Array((m1_len | m2_len | m3_len) + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    const ad = new Uint8Array(ad_len)
    const m1 = new Uint8Array(m1_len)
    const m2 = new Uint8Array(m2_len)
    const m3 = new Uint8Array(m3_len)

    sodium.randombytes_buf(ad)
    sodium.randombytes_buf(m1)
    sodium.randombytes_buf(m2)
    sodium.randombytes_buf(m3)

    const m1_ = new Uint8Array(m1)
    const m2_ = new Uint8Array(m2)
    const m3_ = new Uint8Array(m3)

    const k = new Uint8Array(sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES)
    sodium.crypto_secretstream_xchacha20poly1305_keygen(k)

    /* push */

    let ret = sodium.crypto_secretstream_xchacha20poly1305_init_push(state, header, k)
    // t.equal(ret, 'init_push failed')

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c1, m1, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE) // how can ad be null here?
    t.equal(ret, m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c2, m2, ad, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c3, m3, ad, sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL)
    t.ok(ret, 'third push failed')

    /* pull */

    sodium.crypto_secretstream_xchacha20poly1305_init_pull(state, header, k)

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m1, tag, c1, null)
    t.equal(ret, m1_len, 'first pull passed')
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE[0], 'tag pull failed')
    t.same(m1, m1_, 'failed m1 memcmp')

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, ad)
    t.equal(ret, m2_len, 'second pull failed')
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE[0], 'second tag pull failed')
    t.same(m2, m2_, 'failed m2 memcmp')

    if (ad_len > 0) {
      t.throws(() => { sodium.crypto_secretstream_xchacha20poly1305_pull(state, m3, tag, c3) })
    }

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m3, tag, c3, ad)
    t.equal(ret, m3_len, 'failed fourth pull')
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL[0], 'failed final tag pull')
    t.same(m3, m3_, 'failed m3 memcmp')

    /* previous with FINAL tag */
    t.throws(() => {
      sodium.crypto_secretstream_xchacha20poly1305_pull(state, m3, tag, c3, ad)
    })

    /* previous without a tag */
    t.throws(() => {
      sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, null)
    })

    /* short ciphertext */
    t.throws(() => {
      sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag,
        c2.subarray(0, getRandomInt(0, sodium.crypto_secretstream_xchacha20poly1305_ABYTES)))
    })

    t.throws(() => {
      sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, null)
    })

    /* empty ciphertext */
    t.throws(() => {
      sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag,
        c2.subarray(0, sodium.crypto_secretstream_xchacha20poly1305_ABYTES))
    })

    /* without explicit rekeying */

    ret = sodium.crypto_secretstream_xchacha20poly1305_init_push(state, header, k)
    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c1, m1, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c2, m2, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    ret = sodium.crypto_secretstream_xchacha20poly1305_init_pull(state, header, k)
    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m1, tag, c1, null)
    t.equal(ret, m1_len)
    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, null)
    t.equal(ret, m2_len)

    /* with explicit rekeying */

    ret = sodium.crypto_secretstream_xchacha20poly1305_init_push(state, header, k)
    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c1, m1, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    sodium.crypto_secretstream_xchacha20poly1305_rekey(state)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c2, m2, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    ret = sodium.crypto_secretstream_xchacha20poly1305_init_pull(state, header, k)
    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m1, tag, c1, null)
    t.equal(ret, m1_len)

    t.throws(() => {
      sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, null)
    })

    sodium.crypto_secretstream_xchacha20poly1305_rekey(state)

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, null)
    t.equal(ret, m2_len)

    /* with explicit rekeying using TAG_REKEY */

    sodium.crypto_secretstream_xchacha20poly1305_init_push(state, header, k)

    statesave.set(state)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c1, m1, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_REKEY)
    t.equal(ret, m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c2, m2, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    csave.subarray(0, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES).set(c2.subarray(0, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES))

    sodium.crypto_secretstream_xchacha20poly1305_init_pull(state, header, k)
    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m1, tag, c1, null)
    t.equal(ret, m1_len)
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_REKEY[0])

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, null)
    t.equal(ret, m2_len)
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE[0])

    state.set(statesave)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c1, m1, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c2, m2, null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    t.notSame(
      csave.subarray(0, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES),
      c2.subarray(0, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    )

    /* New stream */

    sodium.crypto_secretstream_xchacha20poly1305_init_push(state, header, k)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c1, m1, null,
      sodium.crypto_secretstream_xchacha20poly1305_TAG_PUSH)
    t.equal(ret, m1_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)

    /* Force a counter overflow, check that the key has been updated
      * even though the tag was not changed to REKEY */

    const nonce = state.subarray(NONCE_OFFSET, PAD_OFFSET)
    for (let i = 0; i < 4; i++) {
      nonce[i] = 0xff
    }
    state_copy.set(state)

    ret = sodium.crypto_secretstream_xchacha20poly1305_push(state, c2, m2, ad, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE)
    t.equal(ret, m2_len + sodium.crypto_secretstream_xchacha20poly1305_ABYTES)
    t.notSame(state_copy.subarray(0, NONCE_OFFSET), state.subarray(0, NONCE_OFFSET))
    t.notSame(state_copy.subarray(NONCE_OFFSET, PAD_OFFSET), state.subarray(NONCE_OFFSET, PAD_OFFSET))
    t.equal(state.subarray(NONCE_OFFSET, PAD_OFFSET)[0], 1)
    t.ok(sodium.sodium_is_zero(state.subarray(NONCE_OFFSET + 1, NONCE_OFFSET + 4)))

    sodium.crypto_secretstream_xchacha20poly1305_init_pull(state, header, k)

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m1, tag, c1, null)
    t.equal(ret, m1_len)
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_PUSH[0])
    t.same(m1, m1_)

    for (let i = 0; i < 4; i++) {
      nonce[i] = 0xff
    }

    ret = sodium.crypto_secretstream_xchacha20poly1305_pull(state, m2, tag, c2, ad)
    t.equal(ret, m2_len)
    t.equal(tag[0], sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE[0])
    t.same(m2, m2_)

    t.end()
  })
}
