const
    express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    utils = require('./utils'),
    app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/', function (req, res) {
   res.send('Hello World');
})

const server = http.createServer(app);

utils.readBD()
    .then(json => {
        app.get('/db', (req, res) => {
            res.send(json);
        });
        console.info('Created get /db')

        for (let key in json) {
            utils.createAll(app, key, json);
        }
    });

/*
endpoints.forEach(function(endpoint){
  require('./' + endpoint + '/index.js')(app, server);
})
*/

server.listen(3000, function listening() {
    console.log('Listening on %d', server.address().port);
});
