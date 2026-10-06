// Sample code to import a client and other constants.

const { helpMenu, readline, safeShutdown } = require('../../index.js');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const { LEVELS_POOL_DIR } = require('../../config.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    // Example of a help menu given by the bot.
    // Input: none
    // Expected Return: An array of strings.
    help() {
        return [
            'Sonolus:',
            'list (category): List something.',
            'Valid Parameters:',
            '- L - Levels',
            '- E - Engines',
            '- B - Backgrounds',
            '- F - Effects',
            '- P - Particles',
            '- S - Skins',
            'Append a number at the end (ex: list l 2)',
            'to view the page number!',
            'ls (category): Mirror of list.',
        ];
    },
    // Example of a command in the CLI (command line) of the bot.
    // Input: command given by the bot
    // Expected Return: true or false depending on if the command was valid or not. Otherwise, this breaks the code used to determine if a command is valid or not.
    async command(command) {
        switch (command.split(" ")[0].toLowerCase()) {
            case "ls":
            case "list":
                let print;
                if (command.split(" ")[1] != undefined) {
                    print = command.split(" ")[1].toLowerCase();
                }
                let dir; // directory to scan for
                let category; // named category
                let list; // list of folders inside
                let listBool = false; // should we list?
                switch (print) {
                    case "level":
                    case "levels":
                    case "l":
                        category = "Levels"
                        dir = path.join(process.cwd(), "source", "levels");
                        listBool = true;
                        break;
                    case "engine":
                    case "engines":
                    case "eng":
                    case "e":
                        category = "Engines"
                        dir = path.join(process.cwd(), "source", "engines");
                        listBool = true;
                        break;
                    case "background":
                    case "backgrounds":
                    case "bg":
                    case "bgs":
                    case "b":
                        category = "Backgrounds"
                        dir = path.join(process.cwd(), "source", "backgrounds");
                        listBool = true;
                        break;
                    case "effects":
                    case "effects":
                    case "f":
                        category = "Effects"
                        dir = path.join(process.cwd(), "source", "effects");
                        listBool = true;
                        break;
                    case "skins":
                    case "skin":
                    case "s":
                        category = "Skins"
                        dir = path.join(process.cwd(), "source", "skins");
                        listBool = true;
                        break;
                    case "particle":
                    case "particles":
                    case "part":
                    case "p":
                        category = "Particles"
                        dir = path.join(process.cwd(), "source", "particles");
                        listBool = true;
                        break;
                    default:
                        console.log('[INFO]', 'Invalid parameter.');
                        console.log('[INFO]', 'Valid parameters:');
                        console.log('[INFO]', '- Levels (l): List levels');
                        console.log('[INFO]', '- Engines (e): List engines');
                        console.log('[INFO]', '- Backgrounds (b): List Backgrounds');
                        console.log('[INFO]', '- Effects (f): List Effects');
                        console.log('[INFO]', '- Particles (p): List Particles');
                        console.log('[INFO]', '- Skins (s): List Skins');
                }
                if (listBool) {
                    // Define the page

                    let page;
                    if (command.split(" ")[2] != undefined) {
                        page = Number(parseInt(command.split(" ")[2].toLowerCase(), 10));
                        if (isNaN(page) || page < 1) {
                            page = 1;
                        }
                    } else {
                        page = 1;
                    }

                    // efficiency 100
                    list = fs.readdirSync(dir).filter(item =>
                        fs.statSync(path.join(dir, item)).isDirectory()
                    );

                    if (list.length === 0) {
                        console.error('[WARN] There are no levels.');
                        return true;
                    }

                    console.log(`[INFO]`, `\x1b[36m----------------- List Menu: (${page}/${Math.ceil((list.length) / 8)}) -----------------\x1b[0m`);
                    console.log("[INFO] Category: " + category);
                    for (let i = (page - 1) * 8; i < Math.min(8 + ((page - 1) * 8), list.length); i++) {
                        console.log(`[INFO] [${i + 1}] ` + list[i]);
                    }
                    console.log('[INFO]', '\x1b[36m--------------------- Nex 2026 ---------------------\x1b[0m');
                }
                return true;
            default:
                return false;
        }
    }
}