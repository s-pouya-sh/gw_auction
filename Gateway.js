const {Gateway , Wallets} = require('fabric-network')
const CCP = require('./CCP')

async function createGateway(walletId){
    const gateway = new Gateway()

    //connection profile
    const ccp = CCP.loadCCP()

    //wallet
    const wallet = await Wallets.newFileSystemWallet('./wallet')

    await gateway.connect(ccp , {
        wallet,
        identity: walletId,
        discovery: {
            enabled: true
        }
    })

    return gateway
}

module.exports = {
    createGateway
}