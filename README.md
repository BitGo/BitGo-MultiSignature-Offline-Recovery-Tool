# BitGo Recovery Tool for BitGo MultiSignature Wallets

# Deprecation Notice!

This recovery tool is only meant to be used on legacy BitGo wallets.
The current recovery tool can be found in the BitGoJS SDK's 'example' directory.

# Background

This open-source, standalone tool is a utility to demonstrate that BitGo
wallets can be recovered using the BitGo Account KeyCards and BitGo Disaster
Recovery Email information.

In general, users will never need to use this tool.  However, if you wish
to prove to yourself that BitGo wallets are recoverable without the assistance
of BitGo servers, you can use this tool.

# What the tool does

The tool will transfer all of your funds from a BitGo wallet to a new address of the user's choosing.

First, the user will provide 3 key pieces of information:
* (1) redeem script for the recovered address
* (2) private keys for signing the transaction
* (1) new address to send the funds to

Upon pressing "Recover My Funds", the tool will do the following:

* Get the list of unspent transactions for the receovered address using the blockchain.info
API.

* Create a valid bitcoin transaction within the user's browser to transfer all of the inputs
from the recovery address to the new address.

* Sign the transaction.

* Send the bitcoin into the blockchain using the coinb.in API.

# Installation

* sh build.sh

# Running

Just load the file URL in your browser.

# Warning

We do not recommend using this tool for anything other than emergency situations
or proof-of-concept, as it requires you to bring all of your multi-signature
keys onto a single machine for signing.  If you do use this tool to recover account
funds, please discard your recovered wallet(s) and keys after using the tool.


# Credits

Thank you to the users, the open source software, the apis, and tools which make this recovery tool possible:

* The JavaScript Client-Side Multisignature P2SH Address and
   Transaction Generator http://github.com/ms-brainwallet/ms-brainwallet.github.io

* https://blockchain.info/ For their unspent transaction API

* https://coinb.in/ For their send transaction API

* bitcoinjs-lib https://github.com/BitGo/bitcoinjs-lib
