#!/bin/sh

export BITCOINJS=external/bitcoinjs-lib
(cd $BITCOINJS ; bash build.sh)
cp $BITCOINJS/build/bitcoinjs-lib.js js
cp $BITCOINJS/vendor/sjcl/sjcl.min.js js
