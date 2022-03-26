// TODO remove debugging
let spawn = require('child_process').spawn;

let osupy = (() => {
    // I fucking hate javascript/nodejs
    let i = setInterval(() => {
        clearInterval(i);
        new Promise((resolve, reject) => {
            console.log("Running "  + new Date().getSeconds());
            let process = spawn('python', ['./src/server/data/scripts/osu.py', '-r']);
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
                let process = spawn('python', ['./src/server/data/scripts/osu.py', '-c']);
                process.stdout.on('data', (data) => {
                    console.log(data.toString());
                });
                process.on("exit", resolve);
            }).then(() => {
                new Promise((resolve) => {
                    console.log("Rerunning "  + new Date().getSeconds());
                    let process = spawn('python', ['./src/server/data/scripts/osu.py', '-r']);
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
    }, 86400000); // 1 days
});

let malodypy = (() => {
    let i = setInterval(() => {
        clearInterval(i);
        new Promise((resolve) => {
            console.log("Running "  + new Date().getSeconds());
            let process = spawn('python', ['./src/server/data/scripts/malody.py', '-r']);
            process.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            process.on("exit", resolve);
        }).then(() => {
            console.log("Finished " + new Date().getSeconds());
            malodypy();
        });
    }, 1800000); // 30 minutes
});

module.exports = { osupy, malodypy };