var express = require("express");
var bodyParser = require("body-parser");

const app = express();


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
    res.render("index1", { letters:req.params.data });
    console.log(req.params.data);
})

app.listen(3000);
