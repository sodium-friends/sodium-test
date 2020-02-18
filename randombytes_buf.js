var test = require('tape')
var freq = require('buffer-byte-frequency')

module.exports = function (sodium) {
  test('Various test cases', function (assert) {
    sodium.randombytes_buf(Buffer.alloc(0))
    sodium.randombytes_buf(new Uint8Array(16))

    assert.throws(function () {
      sodium.randombytes_buf([])
    })

    assert.end()
  })

  test('Generates random bytes', function (assert) {
    var bufConst = Buffer.alloc(64)
    sodium.randombytes_buf(bufConst)

    var buf1 = Buffer.alloc(64)
    for (var i = 0; i < 1e4; i++) {
      sodium.randombytes_buf(buf1)
      if (equals(buf1, bufConst) === true) {
        assert.fail('Constant buffer should not be equal')
        assert.end()
        return
      }
    }

    assert.pass('Generated unique buffers')
    assert.end()
  })

  test('Exceed quota', function (assert) {
    var buf = Buffer.alloc(1 << 17)
    sodium.randombytes_buf(buf)

    freq(buf)
    .map(function (cnt) {
      return (cnt / 256) | 0
    })
    .forEach(function (cnt) {
      if (cnt < 1 && cnt > 3) assert.fail('Statistically unreasonable')
    })

    assert.end()
  })
}

function equals (buf1, buf2) {
  return Buffer.compare(buf1, buf2) === 0
}
