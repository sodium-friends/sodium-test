# sodium-test

Test harness for Javascript `libsodium` implementations

```sh
npm install sodium-test
```

## Usage

```js
require('sodium-test')(require('sodium-native'))

```

The above will test that `sodium-native` passes all the `sodium-test` tests and
write results in TAP format to `stdio`.

## API

`harness(sodiumApi)`

Will run tests on `sodiumApi` and assert whether it conforms to the libsodium
API. Individual subAPI's can be tested, and all follow the same pattern, eg.
`require('randombytes_buf')(sodiumApi)`.

Findings are written to `stdio`.

## License

[MIT](LICENSE.md)
