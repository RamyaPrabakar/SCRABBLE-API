var express = require("express");
var bodyParser = require("body-parser");
const mysql = require('mysql');

const app = express();
//const jsonParser = bodyParser.json();

//let connected = false;

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tribias4',
  database: 'scrabbleDB',
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log('Connection Failed');
  } else {
    console.log('Connected');
    connected = true;
  }
});


app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => { res.render("index") });

/*app.get('/scrabble/(:arr)*', (req, res) => {
        res.render("index1");
        var letters = [req.params.arr].concat(req.params[0].split('/').slice(1));
        console.log(letters);
});*/

app.get('/scrabble/:data', (req, res) => {
    res.render("index1", { letters: req.params.data });
    console.log(req.params.data);
})

/*app.post('/checkDatabase', jsonParser, (req, res) => {
  if (connected) {
    const sql1 = `INSERT INTO todolist (task_name) VALUES ("${req.body.taskName}")`;
    mysqlConnection.query(sql1, (err) => {
      if (err) throw err;
    });
});*/

app.listen(3000);
