import chalk from 'chalk';

function rand() {
    return Math.floor(256 * Math.random());
}

function main() {
    setInterval(() => {
        console.log(chalk.rgb(rand(), rand(), rand()).bold('Hello World!!!'));
    }, 500);
}

main();
