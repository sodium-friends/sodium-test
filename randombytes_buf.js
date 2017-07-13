var test = require('tape')
var alloc = require('buffer-alloc')
var equals = require('buffer-equals')
var freq = require('buffer-byte-frequency')

module.exports = function (sodium) {
  test('Generates random bytes', function (assert) {
    var bufConst = alloc(64)
    sodium.randombytes_buf(bufConst)

    var buf1 = alloc(64)
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
    var buf = alloc(1 << 17)
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
