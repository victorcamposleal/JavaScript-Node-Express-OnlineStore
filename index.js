

const express = require('express');
const mongodb = require('mongodb');
let ObjectId = mongodb.ObjectID;

const MongoClient = mongodb.MongoClient;

let db;

MongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {

    if (err !== null) {
        console.log()
    }

    else {

        db = client.db('socks')


    }

});

const app = express();

app.use(express.json());

app.use(express.static('public'));


// metodo Get para mostar los calcetines que tenemos
app.get('/apipocket/socks', function (request, response) {
    db.collection('socks').find().toArray(function (err, socks) {

        if (err !== null) {
            console.log(err);
            response.send(err);
        }
        else {

            response.send(socks)

            console.log({ mensaje: 'aqui estan los datos pedidos' })

        }
    });
});

// metodo Get para sacar la infomación sobre el tipo de calcetines

app.get('/apipocket/:type', function (request, response) {
    let type = request.params.type
    db.collection('socks').find({ type }).toArray(function (err, sock) {


        if (err !== null) {
            response.send(err)

        }
        else {

            response.send(sock)
        }


    })


})
// metodo Post para añadir calcetines a la base de datos 

app.post('/api/sock', function (request, response) {
    let sock = request.body


    db.collection('socks').insertOne(sock, function (err, resultado) {

        if (err !== null) {
            response.send(err)
        }

        else {

            db.collection('socks').find().toArray(function (err, socks) {

                if (err !== null) {
                    console.log(err);
                    response.send(err);
                }
                else {



                    response.send(socks)

                    console.log({ mensaje: 'aqui estan los datos pedidos' })

                }


            })


        }
    })

})

//metodo put para modificar la cantidad de calcetines en la base de datos

app.put('/api/:qty/:id', function (request, response) {
    let id = request.params.id
    let qty =parseInt (request.params.qty)

    db.collection('socks').updateOne({ _id: ObjectId(id) }, { $set: { qty: qty } },
        function (err, result) {
            if (err !== null) {

                console.log(err)
                response.send(err)


            }
            else {
                db.collection('socks').find().toArray(function (err, result) {


                    if (err !== null) {

                        console.log(err)


                    }
                    else {

                        response.send(result)

                    }
                });




            }

        })

})








//metodo delte para borrar productos de la base de datos

app.delete('/borrar/:id', function (request, response) {
    let id = request.params.id
    console.log(id)

    db.collection('socks').deleteOne({ _id: ObjectId(id) }, function (err, resultado) {
        if (err !== null) {
            console.log(err);
            response.send(err);

        }
        else {
            if (resultado.deletedCount === 1) {


                db.collection('socks').find().toArray(function (err, socks) {

                    if (err !== null) {
                        console.log(err);
                        response.send(err);
                    }
                    else {

                        response.send(socks)
                        console.log(socks)
                        console.log({ mensaje: 'aqui estan los datos pedidos' })

                    }


                })
            }
            else {

                response.send({ mensaje: "no se ha borrado el calcetin" })
            }



        }

    })

});








let port = process.env.PORT || 3000;

app.listen(port)


