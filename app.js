let answer = require('./dialogflow.js');
const express = require('express');
var cors = require('cors')
let bodyParser = require("body-parser");
let path = require('path')
const app = express();
app.use(cors());
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.post('/getAns', (req, res) => {
    let jsonData = Object.keys(req.body)[0];
    let question = JSON.parse(jsonData).question;
    answer.getResponse(question).then(responseJson => {
        console.log('responseJson::', responseJson);
        res.json(responseJson);
        console.log('sent to the client');
        return responseJson;
    })
})
app.listen(port, () => console.log(`server listening on port ${port}!`))