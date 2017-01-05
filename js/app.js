var bitcoin = Bitcoin;
var Crypto = Crypto;

var unspents = [];
$('#txConfirm').hide();

function txSetUnspent(text) {
    var r = JSON.parse(text);
    txUnspent = JSON.stringify(r, null, 4);
    $('#txUnspent').val(txUnspent);
    var address = $('#txAddr').val();
    var balance = parseInputs(txUnspent, address);
    var fval = balance;
    var fee = parseFloat($('#txFee').val());
    $('#txBalance').val(fval);
    var value = Math.floor((fval-fee)*1e8)/1e8;
    $('#txValue').val(value);
}

function sendTx() {

}

function parseInputs(unspent, addr) {
    var inputs;
    try {
        inputs = tx_parseBCI(unspent, addr);
    } catch(err) {
        inputs = parseTxs(unspent, addr);
    }

    var balance = 0;
    var unspent={};
    for (var hash in inputs.unspenttxs) {
        for (var outIndex in inputs.unspenttxs[hash]) {
            var input = inputs.unspenttxs[hash][outIndex]
            var txin = {
                hash: Crypto.util.bytesToHex(Crypto.util.hexToBytes(hash).reverse()),
                index: parseInt(outIndex)
            };
            unspent = {
                value: input.amount,
                tx_hash: Crypto.util.bytesToHex(Crypto.util.hexToBytes(hash).reverse()),
                tx_output_n: input.tx_output_n
            }
            balance += (input.amount / 1e8);
        }
        unspents.push(unspent);
    }
    return balance;
}

function txParseUnspent(text) {
    $('#txLoading').hide();
    txSetUnspent(text);
}

function sourceAddressEntered() {
    var addr = $('#txAddr').val();
    if (!addr) {
        return;
    }
    var url = 'https://blockchain.info/unspent?active=' + addr;

    $('#txLoading').show();
    tx_fetch(url, txParseUnspent, function(response, status) {
      if (response == 'No free outputs to spend') {
        alert("Balance is zero");
      } else {
        alert("Error: " + status + " : " + response);
      }
    });
}

function advanceTransaction() {
    if (!$('#txAddr').val()) {
        alert("Please input source address");
        return;
    }
    if (!$('#txRecoveryJson').val()) {
        alert("Please input redeem script");
        return;
    }
    if (!$('#txSec1').val()) {
        alert("Please input first private key");
        return;
    }
    if (!$('#txSec2').val()) {
        alert("Please input second private key");
        return;
    }
    if (!$('#txDest').val()) {
        alert("Please input destination address");
        return;
    }
    if (unspents.length == 0) {
        alert("There are no unspents associated with the source address");
        return;
    }

    var keyPairs = [
      $('#txSec1').val(),
      $('#txSec2').val()
    ].map(function (wif) { return bitcoin.ECPair.fromWIF(wif) })

    var redeemScript = $('#txRecoveryJson').val();
    var hexString = redeemScript.replace(/ /g, '').trim();
    var bytes = Crypto.util.hexToBytes(hexString);
    var redeem_script = bitcoin.script.compile(bytes);
    console.dir(redeem_script);
    var targetValue = $('#txValue').val();

    // make a random destination address
    var targetAddress = $('#txDest').val();

    var txb = new bitcoin.TransactionBuilder()

    var unspents = [
        {
            "tx_hash":"32978d88f13fd71a4731592145bf2d0308a984c6db86d9caaff99c622dbdadf0",
            "tx_hash_big_endian":"32978d88f13fd71a4731592145bf2d0308a984c6db86d9caaff99c622dbdadf0",
            "tx_index":41070935,
            "tx_output_n": 0,
            "script":"a91422c678bd5a8ddc0bd89cabc05961a4393da10b7d87",
            "value": 100000000,
            "value_hex": "05f5e100",
            "confirmations":152804
        }  
    ]

    unspents.forEach(function (unspent) {
      txb.addInput(unspent.tx_hash, unspent.tx_output_n)
    })

    txb.addOutput(targetAddress, targetValue)

    // sign with 1st and 3rd key
    unspents.forEach(function (unspent, index) {
      txb.sign(index, keyPairs[0], redeem_script)
      txb.sign(index, keyPairs[1], redeem_script)
    })

    // broadcast our transaction
    var tx = txb.build()
    var txId = tx.getId()

    console.log(tx.toHex())
    $('#txConfirm').show();
    $('#tx').hide();
    $('#txRaw').val(tx.toHex());
}
