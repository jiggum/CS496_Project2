var Ground = require('../models/ground.js');
var PREFIX = '/C/ground';
var _ = require('underscore');
var async = require('async');

module.exports = function (app) {
    //Players
    var maxPlayers = 1;
    var currentPlayers = 0;
    var players = [];
    var winnerIndex = 1;

    //ports
    var ports = []; //each player port
    var nextPort = 10501;
    var problemPort = 10400;

    var mapSize = 25;
    var map = _.range(mapSize).map(function (x, i) { return '-1'; });
    var mapDifficulties = _.range(mapSize).map(function (x, i) { return 5; });

    // var isGaming=false;

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
            // if(!isGaming)
            //     return;
            var playerName = req.query.fid;
            var playerIndex = players.indexOf(playerName);

            var cell = req.query.problem;

            var problem = createProblem(mapDifficulties[cell]);
            var answer = calcAnswer(problem);
            problems.unshift(problem);
            answers.unshift(answer);
            var problemIndex = problems.indexOf(problem);
            problemsCell.unshift(cell);

            var choiceStart = Math.floor(answer / 10) * 10;
            var choices = _.range(choiceStart, choiceStart + 10);

            res.writeHead(200);
            res.write('{\"problem\":[' + problem.toString() + '],\"choices\":[' + choices + ']}');
            // res.write(problem.toString() + ' ans : ' + answers[problemIndex]);
            res.end();
        });
        app.get(PREFIX + '/result', function (req, res) {
            var playerIndex = players.indexOf(req.query.fid);
            var cell = req.query.problem;
            var problemIndex = problemsCell.indexOf(cell);
            // if(!isGaming)
            //     return;
            // var problem=problems[problemIndex];
            var answer = answers[problemIndex];
            console.log('problem['+problems[problemIndex]+'] answer : ' +answer);

            res.writeHead(200);
            res.write('{\"result\":');
            console.log('real answer : ' + answer + '\trequested : ' + req.query.answer);
            if (answer == req.query.answer) {
                map[cell] = playerIndex;
                mapDifficulties[cell] +=2;

                res.write('1, \"map\":\"{[' + map.toString() + ']}\"}');

                var flushingBuffer = mapBuffer.slice();
                var flushingBufferIndex = mapBufferIndex.slice();
                var flushingCounts = mapPlayers;
                mapBuffer = [];
                mapBufferIndex = [];
                mapPlayers = 0;
                resetUpToDate();
                upToDate[playerIndex] = false;
                for (var i = 0; i < flushingCounts; i++) {
                    flushingBuffer[i].writeHead(200);
                    flushingBuffer[i].write('{\"map\":[' + map.toString() + ']}');
                    flushingBuffer[i].end();
                    upToDate[flushingBufferIndex[i]] = false;
                }

                console.log('===== flushed ' + flushingCounts);
            }
            else
                res.write('0}');
            res.end();
        });

        var upToDate = _.range(maxPlayers).map(function (x, i) { return false; });
        function resetUpToDate() { upToDate = _.range(maxPlayers).map(function (x, i) { return true; }); }
        var mapBuffer = [];
        var mapBufferIndex = [];
        var mapPlayers = 0;
        // var mapBufferFlushing = false;
        app.get(PREFIX + '/map', function (req, res) {
            // if(!isGaming)
            //     return;
            var playerIndex = players.indexOf(req.query.fid);
            console.log('================== map request ' + players[playerIndex]);
            if (req.query.intermediate == '1' || upToDate[playerIndex]) {
                console.log('intermediate');
                res.writeHead(200);
                res.write('{\"map\":[' + map.toString() + ']}');
                res.end();
                upToDate[playerIndex] = false;
            }
            else {
                if (mapBufferIndex.indexOf(playerIndex) == -1) {
                    console.log('booked');
                    mapBuffer.push(res);
                    mapBufferIndex.push(playerIndex);
                    mapPlayers++;
                }
                else {
                    console.log('update booked');
                    mapBuffer[mapBufferIndex.indexOf(playerIndex)]=res;
                }
            }
        })
    }

    //Retire
    {

        var retiredBuffer = [];
        var retiredBufferIndex = [];
        var retiredPlayers = 0;
        app.get(PREFIX + '/retire', function (req, res) {
            var playerName = req.query.fid;
            var playerIndex = players.indexOf(playerName);

            if(retiredBufferIndex.indexOf(playerIndex)!=-1) {
                console.log('already retired');
                res.writeHead(404);
                res.write('already retired');
                res.end();
                return;
            }
            retiredBuffer.push(res);
            retiredBufferIndex.push(playerIndex);
            retiredPlayers++;

            if (retiredPlayers == maxPlayers) {
                var count = _.range(maxPlayers).map(function (x, j) { return 0; });
                for (var i = 0; i < mapSize; i++)
                    count[map[i]]++;
                var max = count[0];
                var winnerIndex = 0;

                for (var i = 0; i < maxPlayers; i++) {
                    if (max < count[i]) {
                        max = count[i];
                        winnerIndex = i;
                    }
                }
                for (var i = 0; i < maxPlayers; i++) {
                    retiredBuffer[i].writeHead(200);
                    retiredBuffer[i].write('{\"winnername\":\"' + players[winnerIndex] + '\",\"winnerindex\":' + winnerIndex + '}');
                    retiredBuffer[i].end();
                }
                retiredBuffer = [];
                retiredPlayers = 0;


                currentPlayers = 0;
                map = _.range(mapSize).map(function (x, i) { return '-1'; });
                console.log('======================= GAME FINISHED ================');
                isGaming=false;
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

            if(readyBufferIndex.indexOf(playerIndex)!=-1) {
                console.log('already ready');
                res.writeHead(404);
                res.write('already ready');
                res.end();
                return;
            }
            readyBuffer.push(res);
            readyBufferIndex.push(playerIndex);
            readyPlayers++;

            console.log('===== user ' + playerName + ' accessed for his port');

            if (readyPlayers == maxPlayers) {
                    // isgaming=true;
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
                res.write('You got your own port. Access with your port : ' + ports[index]);
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
