const fs = require('fs')

const ccp_path = './connection-org1.json'

function loadCCP(){
    const ccp = JSON.parse(
        fs.readFileSync(ccp_path).toString()
    )
    //console.log(ccp)
    return ccp        
}

function getCA(){
    const ccp = loadCCP()
    const ca = ccp['certificateAuthorities']['ca.org1.example.com']
    console.log(ca)
    return ca
}


module.exports = {
    loadCCP,
    getCA
}