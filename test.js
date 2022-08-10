const {Gateway , Wallets} = require('fabric-network')
const CCP = require('./CCP')

async function test(walletId){

const wallet = await Wallets.newFileSystemWallet('./wallet')

const ccp = CCP.loadCCP();
const gateway = new Gateway();

await gateway.connect(ccp, {
    identity: walletId,
    wallet,
    discovery: { enabled: false, asLocalhost: false }
});
console.log('Connected to network');
const network = await gateway.getNetwork('auction');
console.log('Found channel auction');
const contract = network.getContract('auction');
console.log('Found cc auction');

const result = await contract.createTransaction('createAuction')
    .submit('A_005', 'AUC_004', 'Bike4', 'Desc1', 'Featurs1',  '1200' , 'Image1' , 'Image2' , 'Image3' , '10' , '2022-10-05', 'P_001');
console.log('Done');
}

test('appuser');
