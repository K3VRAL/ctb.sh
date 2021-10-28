// TODO replace this with node js equivalent
let { spawn } = require('child_process');

let interval = 1000; // TODO Change this is to a realistic interval according to 'osu api v2 wiki'

// let osuInterval = setInterval(function() {
//     let spawned = spawn('python', ['./src/server/data/osu.py', '1']);
//     spawned.stdout.on('data', function(data) {
//         console.log(data.toString());
//     });
//     spawned.on('exit', function(ecode) {
//         console.log('osuInterval 1 - Exited with code: ' + ecode);
//         if (ecode == 1) {
//             let spawned = spawn('python', ['./src/server/data/osu.py', '2']);
//             spawned.stdout.on('data', function(data) {
//                 console.log(data.toString());
//             });
//             spawned.on('exit', function(ecode) {
//                 clearInterval(osuInterval);
//                 console.log('osuInterval 2 - Exited with code: ' + ecode + ' - CLEARED INTERVAL FOR OSU: PLEASE INVESTIGATE!');
//             });
//         }
//     });
// }, interval);

// TODO test this under ytinterval
let ytInterval = (function(callback) {
    let spawned = spawn('python', ['./src/server/data/youtube.py']);
    let array = [];
    spawned.stdout.on('data', function(data) {
        array.push(data.toString());
    });
    spawned.on('exit', function(ecode) {
        callback(array);
    });
});

module.exports = { ytInterval };