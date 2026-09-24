// Sample code to import a client and other constants.

const { helpMenu, readline, safeShutdown } = require('../../index.js');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    // Example of a help menu given by the bot.
    // Input: none
    // Expected Return: An array of strings.
    help() {
        return [
            'Built-in:',
            'help (page) - Opens this help menu.',
            'h (page) - Mirror of /help.',
            'The help menu can be expanded upon by other plugins.',
            'info (page) - Opens a neat info menu!',
            'This function can\'t be expanded upon by other plugins.',
            'stop - Closes bot.',
            'end - Mirror of /stop.',
        ];
    },
    // Example of a command in the CLI (command line) of the bot.
    // Input: command given by the bot
    // Expected Return: true or false depending on if the command was valid or not. Otherwise, this breaks the code used to determine if a command is valid or not.
    async command(command) {
        switch (command.split(" ")[0].toLowerCase()) {
            case "h":
            case "help":
                let page;
                if (command.split(" ")[1] != undefined) {
                    page = Number(parseInt(command.split(" ")[1].toLowerCase(), 10));
                    if (isNaN(page) || page < 1) {
                        page = 1;
                    }
                } else {
                    page = 1;
                }
                console.log(`[INFO]`, `\x1b[36m----------------- Help menu: (${page}/${Math.ceil((helpMenu.length) / 8)}) -----------------\x1b[0m`);
                for (let i = (page - 1) * 8; i < Math.min(8 + ((page - 1) * 8), helpMenu.length); i++) {
                    console.log('[INFO] ' + helpMenu[i]);
                }
                console.log('[INFO]', '\x1b[36m--------------------- Nex 2026 ---------------------\x1b[0m');
                return true;
            case "info":
                let info;
                const infoList = [
                    'Version control:',
                    'The first number (X.0.0) is the major release.',
                    'The second number (0.X.0) is the minor release.',
                    'The third number (0.0.X) is the build #.',
                    'Built-in plugins aside from "built-in" are typically',
                    'not updated as often, and may be unstable.',
                ];
                if (command.split(" ")[1] != undefined) {
                    info = Number(parseInt(command.split(" ")[1].toLowerCase(), 10));
                    if (isNaN(info) || info < 1) {
                        info = 1;
                    }
                } else {
                    info = 1;
                }
                console.log(`[INFO]`, `\x1b[36m----------------- Info menu: (${info}/${Math.ceil((infoList.length) / 8)}) -----------------\x1b[0m`);
                for (let i = (info - 1) * 8; i < Math.min(8 + ((info - 1) * 8), infoList.length); i++) {
                    console.log('[INFO] ' + infoList[i]);
                }
                console.log('[INFO]', '\x1b[36m--------------------- Nex 2025 ---------------------\x1b[0m');
                return true;
            case "end":
            case "stop":
                console.log('[INFO] Stopping server execution.');
                readline.close();
                safeShutdown('TERMINAL_COMMAND_STOP');
                return true;
            default:
                return false;
        }
    }
}