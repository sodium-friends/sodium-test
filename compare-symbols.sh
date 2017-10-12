#!/usr/bin/env bash

LIB_SYMBOLS=$(cat documented-symbols | sed -e '/^\s*$/d' -e '/^#.*/d')
NODE_SYMBOLS=$(node -e 'Object.keys(require("sodium-native")).forEach(d => console.log(d))')

diff --side-by-side --suppress-common-lines <(echo "$LIB_SYMBOLS" | sort) <(echo "$NODE_SYMBOLS" | sort)
