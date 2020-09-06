var express = require("express");
var bodyParser = require("body-parser");
const mysql = require('mysql');
const path = require('path');
const app = express();

let connected = false;

app.use(bodyParser.urlencoded({extended:false}));

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

let p01 = new Set(['A','E','I','O','U','L','N','S','T','R']);
let p02 = new Set(['D','G']);
let p03 = new Set(['B','C','M','P']);
let p04 = new Set(['F','H','V','W','Y']);
let p05 = new Set(['K']);
let p08 = new Set(['J','X']);
let p10 = new Set(['Q','Z']);

function getWordPoints(word) {
    var points = 0;
    var ltrs = word.split("");
    for ( index = 0; index < ltrs.length; index++) {
        var c = ltrs[index];
        if (p01.has(c)) {
            points += 1;
        }
        else if (p02.has(c)) {
            points += 2;
        }
        else if (p03.has(c)) {
            points += 3;
        }
        else if (p04.has(c)) {
            points += 4;
        }
        else if (p05.has(c)) {
            points += 5;
        }
        else if (p08.has(c)) {
            points += 8;
        }
        else if (p10.has(c)) {
            points += 10;
        }
    }
    return points;
}

function getPointMap(comb) {
    var pointArray = [];
    var pointMap = new Map();
    var points = new Set();
    comb.forEach(word => {
            var pts = getWordPoints(word);
            if (points.has(pts)) {
                pointWords=pointMap.get(pts);
                pointWords.push(word);
                pointMap.set(pts,pointWords);
            }
            else {
            points.add(pts)
            initialWord=[word];
            pointMap.set(pts,initialWord);
            }
        });
    return pointMap;

    }

function getCombinations(letters) {
var combinations = new Set();
var chars = [];
var letLen = Math.pow(2, letters.length);
for (var i = 0; i < letLen ; i++) {
    chars = [];
    for (var j = 0; j < letters.length; j++) {
        if ((i & Math.pow(2,j))){
            chars.push(letters[j]);
        }
    }
    chars.sort();
    if (chars.length > 0) {
         var temp = chars.join("");
         combinations.add(temp);
    }
}
return combinations;
}

function getScrabbleWords(words)
{
    return new Promise(function(resolve, reject) {
        var inclause ='';
        words.forEach(word => {
            if (inclause.length > 0) {
                inclause=inclause + ', "' + word + '"';
            }
            else {
                inclause='"' + word + '"';
            }
        });
        const sql = 'SELECT word FROM wordList WHERE orderedWord IN ('+inclause+')';
        //console.log(sql);
        var result;
        mysqlConnection.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}


async function getMaxPointWords(pMap, points) {
    var found=false;
    for (idx = 0; idx < points.length; idx++) {
        if (found) break;
        try {
            //console.log("loop entry"+idx);
            point = points[idx];
            //console.log("point:" + point);
            words = pMap.get(point);
            results = await getScrabbleWords(words);
            //console.log(results);
            if (results.length > 0) {
                found=true;
                //console.log("loop exit"+idx);
                return results;
            }
        }
        catch {

        }
    }
    return results;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/getBestWord', (req, res) => {
    var input = req.body.letters;
    var str = input.toUpperCase();
    var letters = str.split("");
    var comb = getCombinations(letters);
    var pMap = getPointMap(comb);
    var points = Array.from(pMap.keys());
    points.sort((a,b)=>a-b);
    points.reverse();
    //console.log(points);
    getMaxPointWords(pMap, points).then((solution) => {
    //console.log(solution);
    res.send(solution);
    }).catch((err) =>{
    // This function get called, when error
    console.log(error);
   });
});

app.listen(3000);
