const FabricCAServices = require('fabric-ca-client')
const {Wallets} = require('fabric-network')
const CCP = require('./CCP.js')

const ca = CCP.getCA()
const caService = new FabricCAServices(
    ca.url,
    {
        verify: ca.httpOptions.verify,
        trustedRoots: ca.tlsCACerts.pem
    },
    ca.caName
)

//console.log(caService)

//enrollmentID = admin , secret = adminpw
//enroll admin ca


async function enroll(enrollmentId , secret){
    const userCredentials = await caService.enroll({
        enrollmentID: enrollmentId,
        enrollmentSecret: secret
    })
    return userCredentials
}

async function register(registerRequest , registrarIdentity , registrarName = 'adminCA'){
    const wallet = await Wallets.newFileSystemWallet('./wallet')
    await wallet.get(registrarName)

    const provider = wallet.getProviderRegistry().getProvider('X.509')
    const registerarUser = await provider.getUserContext(registrarIdentity , registrarName)

    const creds = await caService.register(registerRequest , registerarUser)
    return creds
}




async function initUser(enrollmentId){
    let walletService = await Wallets.newFileSystemWallet('./wallet')
    if (await walletService.get(enrollmentId)){
        console.log(`user ${enrollmentId} exist`)
        return
    }

    const adminCred = await enroll('admin' , 'adminpw')
    const adminIdentity  = {
        credentials :{
            certificate: adminCred.certificate,
            privateKey: adminCred.key.toBytes()  
        },
        mspId: 'Org1MSP',
        type: 'X.509'
    }

    await walletService.put('adminCA' , adminIdentity)

    // register user to CA
    const registerRequest = {
        enrollmentID: enrollmentId,
        role: 'client',
        affiliation: 'org1.department1',
        maxEnrollments: 3
    }

    const userSecret = await register(registerRequest , adminIdentity)
    console.log(userSecret)


    //enroll user to CA and get cert
    const userCreds = await enroll(registerRequest.enrollmentID , userSecret)
    const userIdentity = {
        credentials :{
            certificate: userCreds.certificate,
            privateKey: userCreds.key.toBytes()  
        },
        mspId: 'Org1MSP',
        type: 'X.509'
    }
    await walletService.put(registerRequest.enrollmentID , userIdentity)
}

module.exports = {
    initUser
}
