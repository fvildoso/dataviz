const express = require('express');
const router = express.Router();
const mysql = require("mysql");


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

/* GET actors. */
router.get('/actors',
    function (
        req,
        res) {

        //decimos en los headers que responderemos con un json
        res.header('Content-Type', 'application/json');

        //cualquiera nos puede hacer una request
        res.header("Access-Control-Allow-Origin", "*");

        con.query({
            sql: 'SELECT * FROM `actor` LIMIT 1000',
            timeout: 40000, // 40s
        }, function (error, results) {
            if (error) {
                console.error(error); // something went wrong
                res.send(JSON.stringify({error: error}));
            }

            if (results.length > 0) {
                res.json({resultados: results});
            } else {
                res.send(JSON.stringify({resultados: "No se encuentraron registros"}));
            }
        });
    });

/* GET actores con nombre y limite. */
router.get('/actors/:nombre',
    function (
        req,
        res) {

        //decimos en los headers que responderemos con un json
        res.header('Content-Type', 'application/json');

        //cualquiera nos puede hacer una request
        res.header("Access-Control-Allow-Origin", "*");

        //get params
        let nombre = req.params.nombre;
        nombre = nombre.replace(/[^\w\s!?]/g, '');
        nombre = "%" + nombre + "%"

        con.query({
            sql: 'SELECT * FROM `actor` WHERE `first_name` like ? OR last_name like ? ',
            timeout: 40000, // 40s
            values: [nombre, nombre]
        }, function (error, results) {
            if (error) {
                console.error(error); // something went wrong
                res.send(JSON.stringify({error: error}));
            }

            if (results.length > 0) {
                res.json({resultados: results});
            } else {
                res.send(JSON.stringify({resultados: "No se encuentraron registros"}));
            }
        });
    });

/* GET actores con nombre y limite. */
router.get('/actors/:nombre/:limit',
    function (
        req,
        res) {

        //decimos en los headers que responderemos con un json
        res.header('Content-Type', 'application/json');

        //cualquiera nos puede hacer una request
        res.header("Access-Control-Allow-Origin", "*");

        //get params
        let nombre = req.params.nombre;
        if (nombre === undefined) {
            nombre = "";
        }
        nombre = nombre.replace(/[^\w\s!?]/g, '');
        nombre = "%" + nombre + "%"

        let limit = req.params.limit;
        if (limit === undefined) {
            limit = 10;
        }
        limit = parseInt(limit.replace(/\D/g, ""));

        con.query({
            sql: 'SELECT * FROM `actor` WHERE `first_name` like ? OR last_name like ? LIMIT ' + limit,
            timeout: 40000, // 40s
            values: [nombre, nombre]
        }, function (error, results) {
            if (error) {
                console.error(error); // something went wrong
                res.send(JSON.stringify({error: error}));
            }

            if (results.length > 0) {
                res.json({resultados: results});
            } else {
                res.send(JSON.stringify({resultados: "No se encuentraron registros"}));
            }
        });
    });

//conexion a MariaDB
let con;

function handleDisconnect() {
    con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'local',
        database: 'sakila',
        charset: 'utf8mb4'
    });

    con.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    con.on('error', function (err) {
        //console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = router;
