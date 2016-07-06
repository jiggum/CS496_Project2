var Ground = require('../models/ground.js');
var PREFIX = '/C/ground';
var _ = require('underscore');
var async = require('async');

module.exports = function (app) {
    //Players
    var maxPlayers = 2;
    var currentPlayers = 0;
    var players = [];
    var winnerIndex = 1;

    //ports
    var ports = []; //each player port
    var nextPort = 10501;
    var problemPort = 10400;

    var mapSize = 25;
    var map = _.range(mapSize).map(function (x, i) { return '-1'; });

    var ress = [];

    //Problem and Result || Map
    {
        function createProblem(len) {
            var problem = [];
            for (var i = 0; i < len; i++) {
                problem.push(Math.floor(Math.random() * 100));
            }
            return problem;
        }
        function calcAnswer(problem) {
            var sum = 0;
            async.forEachOf(problem, function (value, key, callback) {
                sum += value;
            }, function (err) {
                if (err) {
                    console.error(err.message);
                    sum = -1;
                }
                else {
                    console.log('===== ' + problem + 's answer is ' + sum);
                }
            });
            return sum;
        }
        var problems = [];
        var answers = [];
        var problemsCell = [];
        app.get(PREFIX + '/problem', function (req, res) {
            var playerName = req.query.fid;
            var playerIndex = players.indexOf(playerName);

            var cell = req.query.problem;
            var problem = createProblem(5);
            problems.unshift(problem);
            answers.unshift(calcAnswer(problem));
            var problemIndex = problems.indexOf(problem);
            problemsCell.unshift(cell);

            res.writeHead(200);
            res.write(problem.toString() + ' ans : ' + answers[problemIndex]);
            res.end();
        });
        app.get(PREFIX + '/result', function (req, res) {
            var playerIndex = players.indexOf(req.query.fid);
            var cell = req.query.problem;
            var problemIndex = problemsCell.indexOf(cell);
            // var problem=problems[problemIndex];
            var answer = answers[problemIndex];

            res.writeHead(200);
            res.write('{\"result\":');
            console.log('real answer : ' + answer + '\trequested : ' + req.query.answer);
            if (answer == req.query.answer) {
                map[cell] = playerIndex;
                res.write(' \"Y\", \"map\":\"{[' + map.toString() + ']}\"}');



                var flushingBuffer = mapBuffer.slice();
                var flushingCounts = mapPlayers;
                mapBuffer = [];
                mapPlayers = 0;
                for (var i = 0; i < flushingCounts; i++) {
                    flushingBuffer[i].writeHead(200);
                    flushingBuffer[i].write('{\"map\":[' + map.toString() + ']}');
                    flushingBuffer[i].end();
                }

                console.log('===== flushed');
            }
            else
                res.write('\"N\"}');
            res.end();
        });

        var upToDate = _.range(maxPlayers).map(function (x, i) { return true; });
        function resetUpToDate() { upToDate = _.range(maxPlayers).map(function (x, i) { return true; }); }
        var mapBuffer = [];
        var mapPlayers = 0;
        // var mapBufferFlushing = false;
        app.get(PREFIX + '/map', function (req, res) {
            if (req.query.intermediate == '1') {
                res.writeHead(200);
                res.write('{\"map\":[' + map.toString() + ']}');
                res.end();
            }
            else {
                mapBuffer.push(res);
                mapPlayers++;
                /////////////////////???????????????????????//////////////
            }
        })
    }

    //Retire
    {

        var retiredBuffer = [];
        var retiredPlayers = 0;
        app.get(PREFIX + '/retire', function (req, res) {
            var playerName = req.query.fid;
            var playerIndex = players.indexOf(playerName);

            retiredBuffer.push(res);
            retiredPlayers++;

            if (retiredPlayers == currentPlayers) {
                for (var i = 0; i < currentPlayers; i++) {
                    retiredBuffer[i].writeHead(200);
                    retiredBuffer[i].write('Winner is ' + players[winnerIndex]);
                    retiredBuffer[i].end();
                }
                retiredBuffer = [];
                retiredPlayers = 0;


                currentPlayers = 0;
                map = _.range(mapSize).map(function (x, i) { return '-1'; });
                console.log('======================= GAME FINISHED ================');
            }
        });
    }

    //Access and Start
    {

        var readyBuffer = [];
        var readyBufferIndex = [];
        var readyPlayers = 0;
        app.get(PREFIX + '/start', function (req, res) {
            var playerName = req.query.fid;
            var playerIndex = players.indexOf(playerName);

            readyBuffer.push(res);
            readyBufferIndex.push(playerIndex);
            readyPlayers++;

            console.log('===== user ' + playerName + ' accessed for his port');

            if (readyPlayers == maxPlayers) {
                for (var i = 0; i < readyPlayers; i++) {
                    readyBuffer[i].writeHead(200);
                    // readyBuffer[i].write(map.toString());
                    readyBuffer[i].write('{\"refreshport\":\"' + ports[readyBufferIndex[i]] + '\", \"' +
                        'problemport\":\"' + problemPort + '\"}');
                    readyBuffer[i].end();
                }
                readyBuffer = [];
                readyPlayers = 0;

                app.listen(problemPort, function () {
                    console.log('===================GAME START =================');
                })
            }
        });
        app.get(PREFIX + '/access', function (req, res) {
            var playerName = req.query.fid;
            if (players.indexOf(playerName) != -1) {
                var index = players.indexOf(playerName);
                res.writeHead(200);
                res.write('Access with your port : ' + ports[index]);
                res.end();
                return;
            }
            if (currentPlayers == maxPlayers) {
                res.writeHead(404);
                res.write('Server is full');
                res.end();
            }
            else {
                var playerIndex = currentPlayers;
                currentPlayers++;
                var newPort = nextPort;
                nextPort++;

                players.push(playerName);
                ports.push(newPort);

                app.listen(newPort, function () {
                    console.log('===== Listening for user # ' + playerIndex + ' ' + playerName + ' on port ' + newPort + '...');
                });

                console.log('===== user # ' + currentPlayers + ' ' + playerName + ' accessed. port : ' + newPort);
                res.writeHead(200);
                res.write((newPort).toString());
                res.end();
            }
        });
    }

}
