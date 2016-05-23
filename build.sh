#!/bin/sh
export BITCOINJS=external/bitcoinjs-lib

# Update bitcoinjs-lib
git submodule init
git submodule update

# Update bitcoinjs-lib's dependencies
cd $BITCOINJS
git submodule init
git submodule update
cd ../..

# Build bitcoinjs-lib
(cd $BITCOINJS ; bash build.sh)
cp $BITCOINJS/build/bitcoinjs-lib.js js
cp $BITCOINJS/vendor/sjcl/sjcl.min.js js
