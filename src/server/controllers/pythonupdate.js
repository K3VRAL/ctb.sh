// TODO remove debugging
let spawn = require('child_process').spawn;

let osupy = (() => {
    // I fucking hate javascript/nodejs
    let i = setInterval(() => {
        clearInterval(i);
        new Promise((resolve, reject) => {
            let process = spawn('python', ['./src/server/data/scripts/osu.py', '-r']);
            process.on("exit", (() => {
                if (process.exitCode == 0) {
                    resolve();
                } else {
                    reject();
                }
            }));
        }).then(() => {
            osupy();
        }).catch(() => {
            new Promise((resolve) => {
                let process = spawn('python', ['./src/server/data/scripts/osu.py', '-c']);
                process.on("exit", resolve());
            }).then(() => {
                new Promise((resolve) => {
                    let process = spawn('python', ['./src/server/data/scripts/osu.py', '-r']);
                    process.on("exit", resolve());
                }).then(() => {
                    osupy();
                });
            });
        });
    }, 86400000); // 1 days
});

let malodypy = (() => {
    let i = setInterval(() => {
        clearInterval(i);
        new Promise((resolve) => {
            let process = spawn('python', ['./src/server/data/scripts/malody.py', '-r']);
            process.on("exit", resolve());
        }).then(() => {
            malodypy();
        });
    }, 1800000); // 30 minutes
});

module.exports = { osupy, malodypy };