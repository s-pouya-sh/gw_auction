const express = require('express')
const bodyParser = require('body-parser')


const {initUser} = require('./CA')
const {invoke , evaluate} = require('./Transaction')

const app = express()

app.use(bodyParser.json())


const SERVER_USER_ID = 'user15'
const channelName = 'interairlining'
const chaincodeName = 'interairlining'

//getBaggage
app.get('/mybaggage/', async (req , res) =>{


    console.log('mybaggage')

    return res.status(201).send()
})

//getBaggageById
app.get('/baggage/:id', async (req , res) =>{

    const baggageId = req.params.id;
    console.log('baggageId:', baggageId)

    const baggage =  await evaluate(
        SERVER_USER_ID,
        channelName,
        chaincodeName,
        'getBaggage',
        [baggageId]
    )


    return res.status(201).send(baggage)
})

//baggageByQuery
app.get('/baggageByQuery/', async(req , res) =>{

    const baggageValue = req.query.baggageValue
    const baggages =  await evaluate(
        SERVER_USER_ID,
        channelName,
        chaincodeName,
        'getBaggageByQuery',
        [baggageValue]
    )

    console.log('baggageList', baggages)
    return res.send(baggages)
})


//insert new baggage
app.post('/baggage', async (req , res) =>{
    const baggage = req.body;
    console.log(baggage)
  
    
    const {
        baggageId,
        userId,
        weight,
        value
    } = baggage

    try{
        await invoke(
            SERVER_USER_ID,
            channelName,
            chaincodeName,
            'createBaggage',
            [
                baggageId,
                userId,
                weight,
                value
            ]
        )
    }catch(ex){
        console.log(ex.message)
        return res.send({
            message : ex.message
        })
    }


    console.log('create baggage:' , baggage)
    return res.send(baggage)
})

initUser(SERVER_USER_ID)

app.listen(4000 , () =>{
    console.log('app is listen to port 4000')
})
