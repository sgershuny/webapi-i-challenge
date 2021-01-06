// implement your API here

const express = require('express')
const users = require('./data/db');

const port = 8000;

const server = express();
server.use(express.json()); // add this line to make POST and PUT work

server.get('/',(req,res) => {
    res.send('Hello World from Express!')
})

let hobbits = [
    {
        id: 1,
        name: 'Samwise Gamgee',
        age: 30
      },
      {
        id: 2,
        name: 'Frodo Baggins',
        age: 33,
      },      {
        id: 3,
        name: 'Bilbo Baggins',
        age: 111
    }

];

server.get('/hobbits', (req, res) => {
    console.log(req.query)
    // query string parameters get added to req.query
    const sortField = req.query.sortby || 'id';

  
    // apply the sorting
    const response = hobbits.sort(
      (a, b) => (a[sortField] < b[sortField] ? -1 : 1)
    );
  
    res.status(200).json(response);
});

let nextId = 4

server.post('/hobbits',(req,res) => {
    const hobbit = req.body;
    console.log(req.body)
    hobbit.id = nextId++;

    hobbits.push(hobbit)

    res.status(201).json(hobbits)
})

server.put('/hobbits/:id',(req,res) => {
    console.log("Hobbits: ", hobbits)
    const hobbit = hobbits.find(h => h.id == req.params.id);
    console.log("Req.Params: ",req.params)
    if(!hobbit) {
        res.status(404).json({message: 'Hobbit does not exist'})
    } else {
        //modifying the existing hobbit
        Object.assign(hobbit, req.body);
        
        res.status(200).json(hobbit);
    }

})
//
server.delete('/hobbits/:id',(req,res) => {
    const id = req.params.id;
    console.log(req.params);
    // or we could destructure it like so: const { id } = req.params;
    res.status(200).json({
      url: `/hobbits/${id}`,
      opeation: `DELETE for hobbit with id ${id}`,
    });
})


server.get('/users',(req,res)=>{
    const id = req.params.id;

    console.log("REQ: ", req)
    console.log("RES: ",res)

    users.find().then(r => {
        res.status(200).json(r)
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved." })
    })

});

server.get('/users/:id', (req,res) => {
    const id = req.params.id;
    console.log(id)


    users.findById(id)
        .then(user => {
            if(!user){
                res.status(404).send({ message: "The user with the specified ID does not exist." })
            } else{
                res.status(201).send(user)
            }

        })
        .catch(err=>{
            res.status(500).send({errorMessage: "Huge ID ERROR!"})}
        )
})
server.delete('/users/:id',(req,res) => {
    const { id } = req.params;

    users.remove(id)
        .then(del => {
            if(!del){
                res.status(404).send({ message: "The user with the specified ID does not exist." })
            } else{
                res.sendStatus(204)
            }
        })
        .catch(err => {
            res.status(500).send("Error in DELETE")
        })
})

let db_nextId = 3

server.post('/users', (req,res) => {
    const user = req.body
    user.id = db_nextId++
    if(!user.body || user.name){
        res.status(400).json({errorMessage: "Please provide name and bio for the user." })
    }

    users.insert(user)
        .then(use => {
            res.status(201).json(use)
        })
        .catch(err => {
            res.status(500).send("ERROR!!")
        })

})

server.put('/users/:id', (req,res) => {
    let userUpdate = req.body
    const id = req.params.id
    if(!userUpdate.body && userUpdate.name){
        res.status(400).json({errorMessage: "Please provide name and bio for the user." })
    }
    users.update(id,userUpdate)
        .then(upd => {
            if(!upd){
                res.status(404).send({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json(upd)
            }
        })
        .catch(err => {
            res.status(500).send("Error Updating")
        })
})


server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})