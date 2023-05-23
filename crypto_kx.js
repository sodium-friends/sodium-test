const test = require('brittle')

const exp = [
  Buffer.from('0e0216223f147143d32615a91189c288c1728cba3cc5f9f621b1026e03d83129', 'hex'),
  Buffer.from('cb2f5160fc1f7e05a55ef49d340b48da2e5a78099d53393351cd579dd42503d6', 'hex')
]

module.exports = function (sodium) {
  test('crypto_kx', t => {
    const seed = Buffer.alloc(sodium.crypto_kx_SEEDBYTES)
    const clientpk = Buffer.alloc(sodium.crypto_kx_PUBLICKEYBYTES)
    const clientsk = Buffer.alloc(sodium.crypto_kx_SECRETKEYBYTES)
    let i

    for (i = 0; i < sodium.crypto_kx_SEEDBYTES; i++) seed[i] = i

    sodium.crypto_kx_seed_keypair(clientpk, clientsk, seed)

    t.alike(clientpk, exp[0])
    t.alike(clientsk, exp[1])

    t.is(sodium.crypto_kx_SEEDBYTES, 32)
    t.is(sodium.crypto_kx_PUBLICKEYBYTES, 32)
    t.is(sodium.crypto_kx_SECRETKEYBYTES, 32)
  })
}
