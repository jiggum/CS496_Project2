// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var connect = require('connect');

var port = 10012

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/test_dongmin');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());
app.use(connect.json());
app.use(connect.urlencoded());

// [CONFIGURE SERVER PORT]


// [CONFIGURE ROUTER]
require('./routes/Tab_A.js')(app);
require('./routes/Tab_B.js')(app);
require('./routes/Tab_C.js')(app);

// [RUN SERVER]
var User = require('./models/user.js');
var user = new User({_id:"gimun",
                    gallery:"[]",
                    contacts:"[]"});
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

