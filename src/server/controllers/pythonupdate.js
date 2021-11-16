// TODO figure this out
let osupy = (() => {
    setInterval(() => {
        let spawn = require('child_process').spawn;
        let process = spawn('python', ['./src/server/data/scripts/osu.py', '-d']);
        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
    }, 1000);
});

let malodypy = (() => {
    setInterval(() => {
        let spawn = require('child_process').spawn;
        let process = spawn('python', ['./src/server/data/scripts/malody.py', '-d']);
        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
    }, 1000);
});

module.exports = { osupy, malodypy };