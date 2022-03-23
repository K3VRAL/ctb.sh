// TODO remove debugging
let spawn = require('child_process').spawn;

let timeout = 172800000; // ms = 2 days

let osupy = (() => {
    // I fucking hate javascript/nodejs
    let i = setInterval(() => {
        clearInterval(i);
        new Promise((resolve, reject) => {
            console.log("Running "  + new Date().getSeconds());
            let process = spawn('python', ['./src/server/data/scripts/osu.py', '-r', '-d']);
            process.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            process.on("exit", (() => {
                if (process.exitCode == 0) {
                    resolve();
                } else {
                    reject();
                }
            }));
        }).then(() => {
            console.log("Finished " + new Date().getSeconds());
            osupy();
        }).catch(() => {
            new Promise((resolve) => {
                console.log("Failed " + new Date().getSeconds());
                let process = spawn('python', ['./src/server/data/scripts/osu.py', '-c', '-d']);
                process.stdout.on('data', (data) => {
                    console.log(data.toString());
                });
                process.on("exit", resolve);
            }).then(() => {
                new Promise((resolve) => {
                    console.log("Rerunning "  + new Date().getSeconds());
                    let process = spawn('python', ['./src/server/data/scripts/osu.py', '-r', '-d']);
                    process.stdout.on('data', (data) => {
                        console.log(data.toString());
                    });
                    process.on("exit", resolve);
                }).then(() => {
                    console.log("Refinished " + new Date().getSeconds());
                    osupy();
                });
            });
        });
    }, timeout);
});

let malodypy = (() => {
    let i = setInterval(() => {
        clearInterval(i);
        new Promise((resolve) => {
            console.log("Running "  + new Date().getSeconds());
            let process = spawn('python', ['./src/server/data/scripts/malody.py', '-r', '-d']);
            process.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            process.on("exit", resolve);
        }).then(() => {
            console.log("Finished " + new Date().getSeconds());
            malodypy();
        });
    }, timeout);
});

module.exports = { osupy, malodypy };