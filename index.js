const { dateOptions } = require('./config.js');
global.DateFormatter = new Intl.DateTimeFormat(undefined, dateOptions); // Ensures a global Date Formatter usable in any bot.

const express = require('express');
const { Sonolus, SonolusSpaShare } = require('@sonolus/express');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const AdmZip = require('adm-zip');
const rateLimit = require('express-rate-limit');
const readline = require('readline');

// Logging script
// This might honestly be offloaded to a seperate "functions" folder lol
// Part of the AI generated fixing.
// INFO: number, text: text, debugToggle: boolean (optional)
const logging = function(info, text, debugOnly = false){
    if(debug || !debugOnly){
        console.log(`[${info}] ${text}`);
    }
}

// helps readability ig
// log type is basically a constant
const LOG_TYPE = {
    INFO: "INFO",
    SUCCESS: "SUCCESS",
    WARN: "WARN",
    ERROR: "ERROR",
    CRITICAL: "CRITICAL",
    UNKNOWN: "UNKNOWN",
};

// Define the process directory
// Just to sync up the process of making a new directory.
try {
    process.chdir(__dirname);
    console.log(`New directory: ${process.cwd()}`);
} catch (err) {
    console.error(`Error changing directory: ${err}`);
}

// Start
const startTime = Date.now();
let newStart = Date.now();

// dependancies
const { PORT, UPLOADS_DIR, ENGINES_POOL_DIR, LEVELS_POOL_DIR, BANNER_POOL_DIR, SOURCE_DIR, TEMP_EXTRACT_DIR, ADDRESS } = require('./config');
const { processExtractedFiles } = require('./decompiler');
const { title, desc, https, debug, baseUrl } = require('./config');
if (!baseUrl.startsWith('/') || !baseUrl.endsWith('/')) {
    throw new Error('config.js baseUrl must start and end with a slash (for example, / or /server/).');
}
const basePath = baseUrl === '/' ? '' : baseUrl.slice(0, -1);

const app = express();
let serverInstance = null;
let isShuttingDown = false;

// Rate limiter
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    statusCode: 429,
    message: { error: "Too many requests. Exponential backoff activated." },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(apiLimiter);

// Get the health of the server with the endpoint: /health
app.get('/health', (req, res) => {
    if (isShuttingDown) return res.status(503).json({ status: "shutting_down" });
    res.status(200).json({ status: "healthy" });
});

logging(LOG_TYPE.INFO, "Debug mode is enabled.", true);

    
logging(LOG_TYPE.SUCCESS, "Phase 1 has begun.");
logging(LOG_TYPE.INFO, "Phase 1: Loading engines, levels and banners.\n");
newStart = Date.now();

/*
This function generates the /source on the fly.
Is this inefficient? Yes, but it allows for MASSIVE flexibility and ease of use.
I want this program to be as painless as possible. I want people to use it.
*/
function generateSourceOnTheFly() {
    if (debug) console.log('[INFO] Generating Source...');
    try {
        // Delete the source and temporary directories
        if (fs.existsSync(SOURCE_DIR)) {
            fs.rmSync(SOURCE_DIR, { recursive: true, force: true });
            logging(LOG_TYPE.INFO, `Purged directory: ${SOURCE_DIR}.`, true);
        }
        if (fs.existsSync(TEMP_EXTRACT_DIR)) {
            fs.rmSync(TEMP_EXTRACT_DIR, { recursive: true, force: true });
            logging(LOG_TYPE.INFO, `Purged directory: ${TEMP_EXTRACT_DIR}.`, true);
        }

        // Create clean directories for source and temporary extract.
        fs.mkdirSync(SOURCE_DIR, { recursive: true });
        logging(LOG_TYPE.INFO, `Created new directory: ${SOURCE_DIR}`, true);
        fs.mkdirSync(TEMP_EXTRACT_DIR, { recursive: true });
        logging(LOG_TYPE.INFO, `Created new directory: ${TEMP_EXTRACT_DIR}`, true);

        // Make the directories
        const directoryList = [
            UPLOADS_DIR,
            ENGINES_POOL_DIR,
            LEVELS_POOL_DIR,
            BANNER_POOL_DIR,
        ];
        directoryList.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                logging(LOG_TYPE.INFO, `Created ${dir}.`, true);
            }
        });
    } catch (dirError) {
        console.error('[ERROR] Failed to build / rebuild directories', dirError.message);
        process.exit(1);
    }

    // Engine Scanner
    let compiledAny = false;
    const prioritizedEnginesList = new Set();
    try {
        logging(LOG_TYPE.INFO, `Finding all engines in ${ENGINES_POOL_DIR}...`, true);
        if (fs.existsSync(ENGINES_POOL_DIR)) {
            const engineItems = fs.readdirSync(ENGINES_POOL_DIR);

            // Loop through every folder, ignore normal files
            engineItems.forEach(itemFolder => {
                const itemFolderPath = path.join(ENGINES_POOL_DIR, itemFolder);

                if (fs.statSync(itemFolderPath).isDirectory()) {
                    logging(LOG_TYPE.INFO, `Processing Engine: [${itemFolder}]`, true);

                    // Run the compiler sweep focusing exclusively on this isolated subfolder branch path block context
                    const engineProcessed = processExtractedFiles(itemFolderPath, 'engines', itemFolderPath, prioritizedEnginesList);
                    if (engineProcessed) compiledAny = true;
                }
            });
        }
    } catch (err) {
        console.error('[ERROR] Failed to process engines:', err.message);
    }

    // Level Scanner
    try {
        logging(LOG_TYPE.INFO, `Finding all levels in ${LEVELS_POOL_DIR}...`, true);
        if (fs.existsSync(LEVELS_POOL_DIR)) {
            const levelItems = fs.readdirSync(LEVELS_POOL_DIR);

            // Loop through each individual item directory inside the levels pool
            levelItems.forEach(itemFolder => {
                const itemFolderPath = path.join(LEVELS_POOL_DIR, itemFolder);

                if (fs.statSync(itemFolderPath).isDirectory()) {
                    logging(LOG_TYPE.INFO, `Processing level: ${itemFolder}`, true);

                    // Route the compilation pass pointing specifically to this individual subfolder path block context
                    const levelsProcessed = processExtractedFiles(itemFolderPath, 'levels', itemFolderPath, prioritizedEnginesList);
                    if (levelsProcessed) compiledAny = true;
                }
            });

            // Bind levels to engines
            // not sure what this was on, i think AI was tripping :sob:
            // this works, dont touch it lol
            const enginesSourceDir = path.join(SOURCE_DIR, 'engines');
            const levelsSourceDir = path.join(SOURCE_DIR, 'levels');

            if (fs.existsSync(levelsSourceDir) && fs.existsSync(enginesSourceDir)) {

                // Sync compiled engines
                const compiledEngines = fs.readdirSync(enginesSourceDir);
                if (compiledEngines.length > 0) {

                    // Sync compiled levels and scans through it
                    const mappedLevels = fs.readdirSync(levelsSourceDir);
                    mappedLevels.forEach(lvlFolder => {
                        const lvlItemPath = path.join(levelsSourceDir, lvlFolder, 'item.json');
                        if (fs.existsSync(lvlItemPath)) {
                            try {
                                const lvlJson = JSON.parse(fs.readFileSync(lvlItemPath, 'utf8'));
                                let targetEngine = lvlJson.engine;

                                if (!targetEngine || targetEngine === "Next-RUSH") { // dude?
                                    const smartMatch = compiledEngines.find(eng =>
                                        lvlFolder.toLowerCase().includes(eng.toLowerCase()) ||
                                        eng.toLowerCase().includes(lvlFolder.toLowerCase())
                                    );
                                    targetEngine = smartMatch || compiledEngines[0];
                                } else {
                                    if (!compiledEngines.includes(targetEngine)) {
                                        targetEngine = compiledEngines[0];
                                    }
                                }

                                lvlJson.engine = targetEngine;
                                fs.writeFileSync(lvlItemPath, JSON.stringify(lvlJson, null, 4), 'utf8');
                                logging(LOG_TYPE.INFO, `Mapped the level [${lvlFolder}] to the directory: ${targetEngine}`, true);
                            } catch (e) {
                                console.error(`[ERROR] Level ${lvlFolder} refused to load.`, e.message);
                            }
                        }
                    });
                }
            }
        }
    } catch (err) { console.error('[ERROR] Failed processing levels', err.message); }

    // Banner script
    // This should really be changed in the future.
    // TODO: Change
    try {
        if (debug) console.log('[INFO] Finding banners...');
        const { BANNER_POOL_DIR } = require('./config');
        const bannerPoolFiles = fs.readdirSync(BANNER_POOL_DIR);
        if (bannerPoolFiles.length > 0) {
            const bannerProcessed = processExtractedFiles(BANNER_POOL_DIR, 'banners', BANNER_POOL_DIR);
            if (bannerProcessed) compiledAny = true;
        }
    } catch (err) { console.error('[ERROR] Failed to process banners.', err.message); }

    console.log(`\n[SUCCESS] Phase 2 has begun in ${(Date.now() - newStart) / 1000}s. (${(Date.now() - startTime) / 1000}s total)`)
    console.log("[INFO] Phase 2: Unzipping files\n");
    newStart = Date.now();

    // FINALLY, now scan the uploads folders
    try {
        logging(LOG_TYPE.INFO, `Loading Sonolus bundled files inside ${UPLOADS_DIR}`, true);
        const files = fs.readdirSync(UPLOADS_DIR);
        let foundAssets = false;

        files.forEach(file => {
            const filePath = path.join(UPLOADS_DIR, file);
            const ext = path.extname(file).toLowerCase();
            if (ext === '.zip' || ext === '.scp') {
                logging(LOG_TYPE.INFO, `Unzipping package: ${file}...`, true);
                try {
                    const zip = new AdmZip(filePath);
                    zip.extractAllTo(TEMP_EXTRACT_DIR, true);
                    foundAssets = true;
                } catch (error) {
                    console.error(`[ERROR] Could not extract ${file}:`, error.message);
                }
            }
        });

        if (foundAssets) {
            if (debug) console.log('[INFO] Decompiling / Extracting .scp files');
            const zipProcessed = processExtractedFiles(TEMP_EXTRACT_DIR, 'skins', TEMP_EXTRACT_DIR, prioritizedEnginesList);
            if (zipProcessed) compiledAny = true;
        }
    } catch (err) { console.error('[ERROR] Failed processing uploads safely:', err.message); }

    // Removes the temp directory
    logging(LOG_TYPE.INFO, `${TEMP_EXTRACT_DIR} removed.`, true);
    if (fs.existsSync(TEMP_EXTRACT_DIR)) {
        try { fs.rmSync(TEMP_EXTRACT_DIR, { recursive: true, force: true }); } catch (e) { }
    }

    // Writes the info of this server
    try {
        const infoPath = path.join(SOURCE_DIR, 'info.json');
        if (debug) console.log('[INFO] Generating the info for this server');

        fs.writeFileSync(infoPath, JSON.stringify({
            "title": { "en": title },
            "description": { "en": desc }
        }, null, 4), 'utf8');

    } catch (err) {
        console.error('[ERROR] Failed to write the info.json file.', err.message);
        process.exit(1);
    }

    console.log(`\n[SUCCESS] Phase 3 has begun in ${(Date.now() - newStart) / 1000}s. (${(Date.now() - startTime) / 1000}s total)`)
    console.log("[INFO] Phase 3: Compiling everything together\n");
    newStart = Date.now();
    try {
        if (debug) {
            execSync('npx sonolus-pack', { stdio: 'inherit' });
            console.log('[INFO] Compilation successful!');
        } else {
            execSync('npx sonolus-pack', { stdio: 'inherit' });
        }
    } catch (error) {
        console.error('[INFO] Compilation failed:', error.message);
    }
}

generateSourceOnTheFly();

console.log(`\n[SUCCESS] Phase 4 has begun in ${(Date.now() - newStart) / 1000}s. (${(Date.now() - startTime) / 1000}s total)`)
console.log("[INFO] Phase 4: Starting the server\n");
newStart = Date.now();

// Bound to a custom port
let httpStatus = "http://";
if (https) {
    httpStatus = "https://";
}
const sonolus = new Sonolus({
    address: `${httpStatus}${ADDRESS}:${PORT}`,
});

// what?
// Make sonolus load files
try {
    const absolutePackPath = path.resolve(__dirname, 'pack');
    logging(LOG_TYPE.INFO, `Sonolus is now loading files from ${absolutePackPath}`, true);
    sonolus.load(absolutePackPath);
} catch (loadError) {
    console.error('[ERROR] Conflict has occured:', loadError.message);
    process.exit(1);
}

// Advertise the request's reachable host in Sonolus items (0.0.0.0 is only for binding).
app.use((req, res, next) => {
    sonolus.address = `${httpStatus}${req.get('host')}${basePath}`;
    next();
});

app.use(sonolus.router);
if (basePath) app.use(basePath, sonolus.router);

app.use((err, req, res, next) => {
    console.error('[ERROR] Unhandled exception has occured in the sonolus router:', err.stack);
    res.status(500).json({ error: 'Internal Server Error', description: err.message });
});

// Serve the official Sonolus Server Web single-page client and its share links.
const webDirectory = path.join(__dirname, 'web');
try {
    if (!fs.existsSync(path.join(webDirectory, 'node_modules', '.package-lock.json'))) {
        logging(LOG_TYPE.INFO, 'Installing web client dependencies.');
        execSync('npm ci', { cwd: webDirectory, stdio: 'inherit' });
    }

    const translationsDirectory = path.join(webDirectory, 'src', 'i18n');
    const missingTranslations = fs.readdirSync(translationsDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .some((entry) => !fs.existsSync(path.join(translationsDirectory, `generated-${entry.name}.ts`)));
    if (missingTranslations) {
        logging(LOG_TYPE.INFO, 'Generating missing web client translations.');
        execSync('npm run generate-i18n', { cwd: webDirectory, stdio: 'inherit' });
    }

    logging(LOG_TYPE.INFO, 'Building web client from config.js settings.');
    execSync('npm run build', { cwd: webDirectory, stdio: 'inherit' });
} catch (webBuildError) {
    console.error('[ERROR] Failed to build the web client.', webBuildError.message);
    process.exit(1);
}

const webShareRouter = new SonolusSpaShare(path.join(webDirectory, 'dist')).router;
app.use(basePath || '/', webShareRouter);

// OFFLINE TERMINAL TERMINATION BLUEPRINT
function safeShutdown(triggerSource) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n[INFO] Shutdown has been triggered by [${triggerSource}].`);

    if (serverInstance && serverInstance.listening) {
        console.log('[INFO] Closing active HTTP listener sockets...');
        if (typeof serverInstance.closeAllConnections === 'function') {
            serverInstance.closeAllConnections();
        }
        serverInstance.close((err) => {
            if (err) console.error('[WARN] Error closing network ports:', err.message);
            else console.log('[INFO] Cleaning up');
            cleanupAndExit();
        });
    } else {
        cleanupAndExit();
    }
}

function cleanupAndExit() {
    try {
        if (typeof rl !== 'undefined') {
            rl.close();
        }
        if (fs.existsSync(TEMP_EXTRACT_DIR)) {
            logging(LOG_TYPE.INFO, `Removing ${TEMP_EXTRACT_DIR} directory`);
            fs.rmSync(TEMP_EXTRACT_DIR, { recursive: true, force: true });
        }
    } catch (cleanupError) {
        console.error('[ERROR] Could not clean up temp directory.', cleanupError.message);
    }
    console.log('[INFO] Sonolus Server has stopped. Goodbye!\n');
    process.exit(0);
}

// Make sure the server can actually retry
function startServerWithBackoff(attempt = 0, baseDelay = 500, maxRetries = 6) {
    // Bound to 0.0.0.0 explicitly instead of an incomplete IP stub
    const tempServer = app.listen(PORT, ADDRESS, () => {
        serverInstance = tempServer;
        logging(LOG_TYPE.INFO, `Sonolus server successfully bound and listening at ${httpStatus}${ADDRESS}:${PORT}`);
        logging(LOG_TYPE.INFO, `Server started in ${(Date.now() - newStart) / 1000}s. (${(Date.now() - startTime) / 1000}s total)`);
        logging(LOG_TYPE.INFO, `Type "stop" and press Enter to safely shut down the server at any time.\n`);
    });

    tempServer.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (attempt >= maxRetries) {
                console.error(`\n[ERROR] Terminal Binding Error: Port ${PORT} remained locked after ${maxRetries} backoff attempts.`);
                process.exit(1);
            }

            const exponentialDelay = baseDelay * Math.pow(2, attempt);
            const jitter = Math.random() * 500;
            const executionWaitTime = exponentialDelay + jitter;

            console.warn(`[WARN] Port ${PORT} is currently in use.`);
            console.warn(`[INFO] Attempt ${attempt + 1}/${maxRetries} failed. Waiting ${Math.round(executionWaitTime)}ms before retrying...`);

            // Use close callback safely to ensure sequential retry cycles
            tempServer.close(() => {
                setTimeout(() => {
                    startServerWithBackoff(attempt + 1, baseDelay, maxRetries);
                }, executionWaitTime);
            });
        } else {
            console.error(`[ERROR] An unexplained error has occured in the network stack:`, err.message);
            process.exit(1);
        }
    });
}

// 🔍 CONTINUOUS SYSTEM READLINE SCANNER INTERFACE
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

// This part is my custom code.
// Modified from MikuBot.

// Create files if they don't exist.
var dirs = ['./logs', './plugins', './console'];
for (let i = 0; i < dirs.length; i++) {
    if (!fs.existsSync(dirs[i])) {
        logging(LOG_TYPE.INFO, `Creating folder ${dirs[i]}.`);
        fs.mkdirSync(dirs[i]);
    }
}

// constants?
const helpMenu = [];
const commandList = [];
const preloadPath = path.join(__dirname, 'console');
const preloadFolders = fs.readdirSync(preloadPath);

// exports?
module.exports = {
    helpMenu: helpMenu,
    readline: rl,
    spawn: spawn,
    safeShutdown,
}

// stole this code from mikubot lol consult that on how this works
// probably does some looping stuff?
// idk lol
for (const folder of preloadFolders) {
    const commandsPath = path.join(preloadPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        commandList.push(filePath);
        const command = require(filePath);
        if ('execute' in command) {
            command.execute();
        } else if ('help' in command) {
            helpMenu.push(...command.help());
        }
    }
}

// What happens when you press enter?
rl.on('line', async (line) => {
    let input = line.trim().toLowerCase();

    // Trim the forward slash.
    // I should've done this for MikuBot to be honest lol
    if (input.startsWith("/")) {
        input = input.slice(1)
    }

    // Scan the plugin list for commands
    let validCommand = false;
    for (let i = 0; i < commandList.length; i++) {
        const cmd = require(commandList[i]);

        if ('command' in cmd) {
            validCommand = await cmd.command(input);
            if (validCommand) {
                i = commandList.length; // Skip processing more commands if one is valid. Saves time.
            }
        }
    }

    // Only then do we do hardcoded plugins and the stop menu, like the /stop command
    // Only /stop has a fallback, no other command has a fallback.
    // I want modularity on this bot!
    if (validCommand == false) {
        switch (input) {
            case 'stop':
            case 'end':
                rl.close();
                safeShutdown('TERMINAL_COMMAND_STOP');
                break;
            default:

                // hardcoded error message
                console.log('[INFO] This command is not a valid command. Type "help" for a list of commands.');
        }
    }
});

// Fire runtime listener
startServerWithBackoff();

process.on('SIGINT', () => safeShutdown('TERMINAL_KEYBOARD_INTERRUPT'));
process.on('SIGTERM', () => safeShutdown('SYSTEM_SIGTERM'));
