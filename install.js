const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { UPLOADS_DIR, ENGINES_POOL_DIR, LEVELS_POOL_DIR, SOURCE_DIR, TEMP_EXTRACT_DIR } = require('./config.js');
const { hasPackageFiles, hasLevelConfigurations, cleanBuildTargets, getAvailableEngines } = require('./install-helpers.js');
const { processAndLinkAsset, writeLevelManifest } = require('./install-assets.js');
const { handleLevelModification } = require('./install-modifier.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Define the process directory
// Just to sync up the process of making a new directory.
try {
    process.chdir(__dirname);
    console.log(`New directory: ${process.cwd()}`);
} catch (err) {
    console.error(`Error changing directory: ${err}`);
}

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// Run the Sonolus Server
// This function runs the Sonolus server
const runSonoServer = async function () {
    console.log('\n[INFO] Launching the Sonolus Server');

    // 1. Close this temporary configuration readline instance right before handing over control
    rl.close();

    // 2. Wrap the child lifecycle into a blocking Promise to prevent early async script termination
    await new Promise((resolve) => {
        try {
            const { spawn } = require('child_process');

            // Spawn the server index file using your exact inheritance layout
            const serverProcess = spawn('node', ['index.js'], { stdio: 'inherit' });

            serverProcess.on('close', (code) => {
                console.log(`\n[INFO] Sonolus server exited with code ${code}.`);
                resolve(); // Unblocks the installation pass thread execution cleanly
                process.exit(code || 0);
            });

            serverProcess.on('error', (err) => {
                console.error('\n[INFO] Failed to start Sonolus Server:', err.message);
                resolve();
                process.exit(1);
            });

        } catch (serverRunError) {
            console.error('\n[INFO] Sonolus Server stopped:', serverRunError.message);
            resolve();
            process.exit(1);
        }
    });
    return;
}

// Adds a new level into Sonolus
const addLevel = async function () {
    console.log('\n[INFO] Step 2: Managing Levels Pool Database Context...');
    console.log(' [1] Keep your currently installed songs and add this new chart package alongside them');
    console.log(' [2] Wipe out all current custom song folders inside levels_pool and install only this one');
    console.log(' [3] Exit');

    const poolChoice = await askQuestion('\n👉 Select level storage behavior (Enter 1 or 2):\n> ');
    if (poolChoice.trim() === '2') {
        try {
            fs.rmSync(LEVELS_POOL_DIR, { recursive: true, force: true });
            fs.mkdirSync(LEVELS_POOL_DIR, { recursive: true });
            console.log('[INFO] Emptied all levels and adding new level...');
        } catch (err) { console.error('⚠️ Levels pool clear error:', err.message); }
    } else if (poolChoice.trim() === '1') {
        console.log('[INFO] Adding new level...');
    } else {
        console.log("[INFO] Step aborted.")
        return;
    }

    console.log('\n[INFO] Configuring New Level...');
    const inputTitle = await askQuestion('🎵 Level Title (e.g., "Execution Clap"):\n> ');
    const inputArtist = await askQuestion('🎤 Artist / Band Name (e.g., "Trap Chick"):\n> ');
    const inputAuthor = await askQuestion('✍️  Chart Author / Mapper (e.g., "Nexint#496350"):\n> ');
    const inputRating = await askQuestion('📊 Chart Difficulty Rating Level (e.g., "31"):\n> ');

    let chosenEngine = "Next-RUSH";
    const availableEngines = getAvailableEngines(ENGINES_POOL_DIR);
    if (availableEngines.length > 0) {
        console.log('\n⚙️  Select a Gameplay Engine for this Chart:');
        availableEngines.forEach((eng, idx) => console.log(`  [${idx + 1}] ${eng}`));
        const engineSelection = await askQuestion('👉 Enter engine number (Default fallback is 1):\n> ');
        const parsedIdx = parseInt(engineSelection.trim(), 10) - 1;
        if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < availableEngines.length) {
            chosenEngine = availableEngines[parsedIdx];
        }
    }

    const sanitizedSongSlug = inputTitle
        .trim()
        .replace(/[\[\](){}\uff08\uff09\u3010\u3011]/g, '') // Strip brackets and parens
        .replace(/[^a-zA-Z0-9-_]+/g, '-')                   // Convert remaining symbols/spaces to hyphens
        .replace(/-+/g, '-')                                 // Collapse duplicate consecutive hyphens
        .replace(/^-|-$/g, '')                               // Trim leading/trailing trailing hyphens
        || `Level-${Date.now()}`;
    const targetSongFolder = path.join(LEVELS_POOL_DIR, sanitizedSongSlug);
    fs.mkdirSync(targetSongFolder, { recursive: true });

    const manifestCreated = writeLevelManifest(targetSongFolder, inputTitle, inputArtist, inputAuthor, inputRating, chosenEngine);
    if (manifestCreated) {
        console.log(`✨ Generated metadata profile configuration: levels_pool/${sanitizedSongSlug}/item.json`);
    }

    console.log('\n📦 Linking Loose Chart Core Assets to Directory Workspace...');
    let jacketInput = await askQuestion('🖼️  DRAG & DROP your Jacket / Cover artwork image (.png, .webp, .jpg):\n> ');
    if (jacketInput == "") {
        jacketInput = path.join(__dirname, "placeholder", "placeholder.png");
        console.log("Loading Placeholder Image...")
    }
    await processAndLinkAsset(jacketInput, targetSongFolder, 'jacket.png');

    const musicInput = await askQuestion('🎵 DRAG & DROP your Audio Track file (.mp3, .wav, .ogg, .m4a):\n> ');
    await processAndLinkAsset(musicInput, targetSongFolder, 'music.mp3');

    const chartInput = await askQuestion('📊 DRAG & DROP your Chart Data node mapping payload file (.data, .json.gz, or raw file):\n> ');
    await processAndLinkAsset(chartInput, targetSongFolder, 'level.data');

    const optionalPreviewInput = await askQuestion('⏭️  (Optional) DRAG & DROP short preview audio file, or press Enter to skip:\n> ');
    if (optionalPreviewInput.trim() !== '') {
        await processAndLinkAsset(optionalPreviewInput, targetSongFolder, 'music_pre.mp3');
    }

    console.log('\n🏁 Workspace loose asset level installation completed successfully!');
    return;
}

const modifyLevel = async function () {
    if (!fs.existsSync(LEVELS_POOL_DIR)) {
        console.error('❌ Error: No levels pool folder exists yet to modify.');
        return false;
    }

    const songDirs = fs.readdirSync(LEVELS_POOL_DIR).filter(item =>
        fs.statSync(path.join(LEVELS_POOL_DIR, item)).isDirectory()
    );

    if (songDirs.length === 0) {
        console.error('❌ Error: There are no existing level subfolders inside your levels pool folder.');
        return false;
    }

    console.log('\n📋 Existing Levels Available for Modification:');
    songDirs.forEach((dir, i) => console.log(`  [${i + 1}] ${dir}`));

    const selectionInput = await askQuestion('\n🎯 Enter the number of the level you wish to modify:\n> ');
    const index = parseInt(selectionInput.trim(), 10) - 1;

    if (isNaN(index) || index < 0 || index >= songDirs.length) {
        console.error('❌ Error: Invalid selection choice.');
        return false;
    }

    const targetSongSlug = songDirs[index];
    const targetSongFolder = path.join(LEVELS_POOL_DIR, targetSongSlug);
    const manifestPath = path.join(targetSongFolder, 'item.json');

    let currentMeta = { title: targetSongSlug, artist: '', author: '', rating: '31', engine: 'Next-RUSH' };
    if (fs.existsSync(manifestPath)) {
        try {
            const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            currentMeta.title = parsed.title || currentMeta.title;
            currentMeta.artist = parsed.artists || '';
            currentMeta.author = parsed.author || '';
            currentMeta.rating = String(parsed.rating || '31');
            currentMeta.engine = parsed.engine || currentMeta.engine;
        } catch (e) { }
    }

    console.log(`\n✏️  [Part A]: Modifying Level Metadata: [${targetSongSlug}] (Press Enter to keep current values)`);
    const newTitle = await askQuestion(`🎵 New Title [Current: "${currentMeta.title}"]:\n> `);
    const newArtist = await askQuestion(`🎤 New Artist [Current: "${currentMeta.artist}"]:\n> `);
    const newAuthor = await askQuestion(`✍️  New Author [Current: "${currentMeta.author}"]:\n> `);
    const newRating = await askQuestion(`📊 New Difficulty Rating [Current: "${currentMeta.rating}"]:\n> `);

    let selectedEngine = currentMeta.engine;
    const engines = getAvailableEngines(ENGINES_POOL_DIR);
    if (engines.length > 0) {
        console.log(`\n⚙️  Available Gameplay Engines [Current Bind: "${currentMeta.engine}"]:`);
        engines.forEach((eng, idx) => console.log(`  [${idx + 1}] ${eng}`));
        const engInput = await askQuestion(`👉 Enter an engine number to switch, or press Enter to keep current:\n> `);
        const engIdx = parseInt(engInput.trim(), 10) - 1;
        if (!isNaN(engIdx) && engIdx >= 0 && engIdx < engines.length) {
            selectedEngine = engines[engIdx];
        }
    }

    const updatedTitle = newTitle.trim() || currentMeta.title;
    const updatedArtist = newArtist.trim() || currentMeta.artist;
    const updatedAuthor = newAuthor.trim() || currentMeta.author;
    const updatedRating = newRating.trim() || currentMeta.rating;

    writeLevelManifest(targetSongFolder, updatedTitle, updatedArtist, updatedAuthor, updatedRating, selectedEngine);

    console.log('\n📦 [Part B]: Modifying Loose Core Assets (Drag any file variant to replace/convert, press Enter to skip)');

    const jacketInput = await askQuestion('🖼️  New Jacket/Cover Artwork (.png, .webp, .jpg):\n> ');
    if (jacketInput.trim() !== '') await processAndLinkAsset(jacketInput, targetSongFolder, 'jacket.png');

    const musicInput = await askQuestion('🎵 New Audio Track (.mp3, .wav, .ogg, .m4a):\n> ');
    if (musicInput.trim() !== '') await processAndLinkAsset(musicInput, targetSongFolder, 'music.mp3');

    const chartInput = await askQuestion('📊 New Chart Data File (.data / .json.gz):\n> ');
    if (chartInput.trim() !== '') await processAndLinkAsset(chartInput, targetSongFolder, 'level.data');

    const previewInput = await askQuestion('⏭️  New Optional Audio Preview Track (.mp3, .wav, .ogg):\n> ');
    if (previewInput.trim() !== '') await processAndLinkAsset(previewInput, targetSongFolder, 'music_pre.mp3');

    const newSongSlug = updatedTitle
        .trim()
        .replace(/[\[\](){}\uff08\uff09\u3010\u3011]/g, '')
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    if (newSongSlug !== targetSongSlug) {
        const newSongFolder = path.join(LEVELS_POOL_DIR, newSongSlug);
        try {
            fs.renameSync(targetSongFolder, newSongFolder);
            console.log(`\n🔄 Renamed directory framework bounds: ${targetSongSlug} -> ${newSongSlug}`);
        } catch (renameErr) {
            console.error(`⚠️ Folder renaming step encountered an issue:`, renameErr.message);
        }
    }

    console.log('\n✨ Level profile modifications successfully evaluated!');
    return;
}

const addSCPFile = async function () {
    console.log('\n[INFO] Step 2: Add .scp file...');
    console.log(' [1] Remove all existing .scp files and add one!');
    console.log(' [2] Keep .scp files and add a new one!');
    console.log(' [3] Exit Current Step');

    const archiveChoice = await askQuestion('\n[INFO] Choose one of these options:\n> ');
    if (archiveChoice.trim() === '1') {
        try {
            const files = fs.readdirSync(UPLOADS_DIR);
            files.forEach(f => {
                const ext = path.extname(f).toLowerCase();
                if (ext === '.scp' || ext === '.zip') fs.unlinkSync(path.join(UPLOADS_DIR, f));
            });
            console.log('[INFO] Emptied all .scp files.');
        } catch (err) { console.error('⚠️ Uploads clear warning:', err.message); }
    } else if (archiveChoice.trim() === '2') {
        console.log('[INFO] Adding .scp file....');
    } else {
        console.log("[INFO] Step Aborted.");
        return;
    }

    const droppedInputPath = await askQuestion('[INFO] Drag and drop your .scp/.zip profile archive here and press Enter:\n> ');
    const sanitizedSourcePath = droppedInputPath.trim().replace(/^["']|["']$/g, '');

    if (!fs.existsSync(sanitizedSourcePath)) {
        console.error(`\n[ERROR] Target file path does not exist.`);
        rl.close(); process.exit(1);
    }

    const originalFileName = path.basename(sanitizedSourcePath);
    try {
        fs.copyFileSync(sanitizedSourcePath, path.join(UPLOADS_DIR, originalFileName));
        console.log(`[INFO] Successfully compiled archive target inside: uploads/${originalFileName}`);
    } catch (e) {
        console.error(`[ERROR] File mapping error:`, e.message);
        rl.close(); process.exit(1);
    }

    console.log('\n[INFO] Server profile update operation completed successfully!');
    return;
}

async function runInstallationPass() {
    console.log('\n--- Sono-Server Setup Wizard ---');

    const uploadsExist = hasPackageFiles(UPLOADS_DIR);
    const levelsExist = hasLevelConfigurations(LEVELS_POOL_DIR);
    let normalizedChoice = '1';

    if (!uploadsExist || !levelsExist) {
        console.log('[WARN] Either levels or .scp files do not exist.');
        console.log('[WARN] Please add a level and a .scp file!');
    }
    console.log('1. Run the Sonolus Server');
    console.log('2. Add a new level');
    console.log('3. Modify an existing level');
    console.log('4. Add a .scp file (containing bg, effects, particles, skins)');
    console.log('5. Delete everything.');
    console.log('6. Exit this GUI');

    const choice = await askQuestion('\n[INFO] Choose an option (Enter 1, 2, 3, 4, 5, or 6):\n> ');
    normalizedChoice = choice.trim();

    // Choose an option:
    switch (normalizedChoice) {
        case "1":
            await runSonoServer();
            return false;
        case "2":
            await addLevel();
            return false;
        case "3":
            await modifyLevel();
            // await handleLevelModification(LEVELS_POOL_DIR, ENGINES_POOL_DIR, askQuestion);
            // rl.close();
            return false;
        case "4":
            await addSCPFile();
            return false;
        case "5":
            const nukeChoice = await askQuestion('\n[INFO] Are you sure you want to nuke everything? (Y/N)\n> ');
            if (nukeChoice.trim().toLowerCase() === 'y') {
                if (fs.existsSync(LEVELS_POOL_DIR)) {
                    try { fs.rmSync(LEVELS_POOL_DIR, { recursive: true, force: true }); console.log('✅ Entire levels_pool completely vaporized.'); } catch (e) { }
                }
                if (fs.existsSync(UPLOADS_DIR)) {
                    try { fs.rmSync(UPLOADS_DIR, { recursive: true, force: true }); console.log('✅ Uploads directory archive cache cleared clean.'); } catch (e) { }
                }
                console.log("[INFO] Deleted everything.")
            } else {
                console.log("[INFO] Step Aborted. No changes were made.");
            }
            return false;
        case "6":
            console.log('[INFO] Setup wizard closed. Goodbye!\n');
            return true;
        default:
            console.error('[ERROR] This option is not available.');
            return false;
    }

    // The below code is AI generated artifacts.
    // I used this as a base, and modified it extensively.
    // Look at the above code for more context!
    /*

    if (!['1', '2', '3', '4', '5', '6'].includes(normalizedChoice)) {
        console.error('[ERROR] This option is not available.');
        rl.close();
        process.exit(1);
    }

    if (normalizedChoice === '6') {
        console.log('[INFO] Setup wizard closed. Goodbye!\n');
        rl.close();
        process.exit(0);
    }

    if (normalizedChoice === '1') {
        console.log('\n[INFO] Launching the Sonolus Server');

        // 1. Close this temporary configuration readline instance right before handing over control
        rl.close();

        // 2. Wrap the child lifecycle into a blocking Promise to prevent early async script termination
        await new Promise((resolve) => {
            try {
                const { spawn } = require('child_process');

                // Spawn the server index file using your exact inheritance layout
                const serverProcess = spawn('node', ['index.js'], { stdio: 'inherit' });

                serverProcess.on('close', (code) => {
                    console.log(`\n[INFO] Sonolus server exited with code ${code}.`);
                    resolve(); // Unblocks the installation pass thread execution cleanly
                    process.exit(code || 0);
                });

                serverProcess.on('error', (err) => {
                    console.error('\n[INFO] Failed to start Sonolus Server:', err.message);
                    resolve();
                    process.exit(1);
                });

            } catch (serverRunError) {
                console.error('\n[INFO] Sonolus Server stopped:', serverRunError.message);
                resolve();
                process.exit(1);
            }
        });
        return;
    }

    if (normalizedChoice === '3') {
        await handleLevelModification(LEVELS_POOL_DIR, ENGINES_POOL_DIR, askQuestion);
        rl.close();
        return;
    }

    console.log('\n[INFO] Step 1: Pruning Information...');
    cleanBuildTargets(SOURCE_DIR, TEMP_EXTRACT_DIR, path.join(__dirname, 'pack'));

    // 🧹 [Step 1]: Starting workspace pruning phase...
    cleanBuildTargets(SOURCE_DIR, TEMP_EXTRACT_DIR, path.join(__dirname, 'pack'));

    // 💥 MULTI-LEVEL LOGIC FOR OPTION 3 (NUKE)
    if (normalizedChoice === '5') {
        const nukeChoice = await askQuestion('\n[INFO] Are you sure you want to nuke everything? (Y/N)\n> ');
        if (nukeChoice.trim() === 'y') {
            if (fs.existsSync(LEVELS_POOL_DIR)) {
                try { fs.rmSync(LEVELS_POOL_DIR, { recursive: true, force: true }); console.log('✅ Entire levels_pool completely vaporized.'); } catch (e) { }
            }
            if (fs.existsSync(UPLOADS_DIR)) {
                try { fs.rmSync(UPLOADS_DIR, { recursive: true, force: true }); console.log('✅ Uploads directory archive cache cleared clean.'); } catch (e) { }
            }
            console.log("[INFO] Deleted everything.")
        } else {
            console.log("[INFO] Step Aborted. No changes were made.");
        }
    }

    // Ensure baseline directories exist
    if (!fs.existsSync(LEVELS_POOL_DIR)) fs.mkdirSync(LEVELS_POOL_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    // 📥 MULTI-ARCHIVE TRACKING BRANCH FOR OPTION 2 (Replace/Manage Server Profile)
    if (normalizedChoice === '4') {
        console.log('\n[INFO] Step 2: Add .scp file...');
        console.log(' [1] Remove all existing .scp files and add one!');
        console.log(' [2] Keep .scp files and add a new one!');
        console.log(' [3] Exit Current Step');

        const archiveChoice = await askQuestion('\n[INFO] Choose one of these options:\n> ');
        if (archiveChoice.trim() === '1') {
            try {
                const files = fs.readdirSync(UPLOADS_DIR);
                files.forEach(f => {
                    const ext = path.extname(f).toLowerCase();
                    if (ext === '.scp' || ext === '.zip') fs.unlinkSync(path.join(UPLOADS_DIR, f));
                });
                console.log('[INFO] Emptied all .scp files.');
            } catch (err) { console.error('⚠️ Uploads clear warning:', err.message); }
        } else if (archiveChoice.trim() === '2') {
            console.log('[INFO] Adding .scp file....');
        } else {
            console.log("[INFO] Step Aborted.");
            return;
        }

        const droppedInputPath = await askQuestion('[INFO] Drag and drop your .scp/.zip profile archive here and press Enter:\n> ');
        const sanitizedSourcePath = droppedInputPath.trim().replace(/^["']|["']$/g, '');

        if (!fs.existsSync(sanitizedSourcePath)) {
            console.error(`\n[ERROR] Target file path does not exist.`);
            rl.close(); process.exit(1);
        }

        const originalFileName = path.basename(sanitizedSourcePath);
        try {
            fs.copyFileSync(sanitizedSourcePath, path.join(UPLOADS_DIR, originalFileName));
            console.log(`[INFO] Successfully compiled archive target inside: uploads/${originalFileName}`);
        } catch (e) {
            console.error(`[ERROR] File mapping error:`, e.message);
            rl.close(); process.exit(1);
        }

        console.log('\n[INFO] Server profile update operation completed successfully!');
        rl.close();
        return;
    }

    // 🎵 MULTI-LEVEL TRACKING BRANCH FOR OPTION 1 (Add Level from Loose Assets)
    if (normalizedChoice === '2') {
        console.log('\n[INFO] Step 2: Managing Levels Pool Database Context...');
        console.log(' [1] Keep your currently installed songs and add this new chart package alongside them');
        console.log(' [2] Wipe out all current custom song folders inside levels_pool and install only this one');
        console.log(' [3] Exit');

        const poolChoice = await askQuestion('\n👉 Select level storage behavior (Enter 1 or 2):\n> ');
        if (poolChoice.trim() === '2') {
            try {
                fs.rmSync(LEVELS_POOL_DIR, { recursive: true, force: true });
                fs.mkdirSync(LEVELS_POOL_DIR, { recursive: true });
                console.log('[INFO] Emptied all levels and adding new level...');
            } catch (err) { console.error('⚠️ Levels pool clear error:', err.message); }
        } else if (poolChoice.trim() === '1') {
            console.log('[INFO] Adding new level...');
        } else {
            console.log("[INFO] Step aborted.")
            return;
        }

        console.log('\n[INFO] Configuring New Level...');
        const inputTitle = await askQuestion('🎵 Level Title (e.g., "Execution Clap"):\n> ');
        const inputArtist = await askQuestion('🎤 Artist / Band Name (e.g., "Trap Chick"):\n> ');
        const inputAuthor = await askQuestion('✍️  Chart Author / Mapper (e.g., "Nexint#496350"):\n> ');
        const inputRating = await askQuestion('📊 Chart Difficulty Rating Level (e.g., "31"):\n> ');

        let chosenEngine = "Next-RUSH";
        const availableEngines = getAvailableEngines(ENGINES_POOL_DIR);
        if (availableEngines.length > 0) {
            console.log('\n⚙️  Select a Gameplay Engine for this Chart:');
            availableEngines.forEach((eng, idx) => console.log(`  [${idx + 1}] ${eng}`));
            const engineSelection = await askQuestion('👉 Enter engine number (Default fallback is 1):\n> ');
            const parsedIdx = parseInt(engineSelection.trim(), 10) - 1;
            if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < availableEngines.length) {
                chosenEngine = availableEngines[parsedIdx];
            }
        }

        const sanitizedSongSlug = inputTitle
            .trim()
            .replace(/[\[\](){}\uff08\uff09\u3010\u3011]/g, '') // Strip brackets and parens
            .replace(/[^a-zA-Z0-9-_]+/g, '-')                   // Convert remaining symbols/spaces to hyphens
            .replace(/-+/g, '-')                                 // Collapse duplicate consecutive hyphens
            .replace(/^-|-$/g, '')                               // Trim leading/trailing trailing hyphens
            || `Level-${Date.now()}`;
        const targetSongFolder = path.join(LEVELS_POOL_DIR, sanitizedSongSlug);
        fs.mkdirSync(targetSongFolder, { recursive: true });

        const manifestCreated = writeLevelManifest(targetSongFolder, inputTitle, inputArtist, inputAuthor, inputRating, chosenEngine);
        if (manifestCreated) {
            console.log(`✨ Generated metadata profile configuration: levels_pool/${sanitizedSongSlug}/item.json`);
        }

        console.log('\n📦 Linking Loose Chart Core Assets to Directory Workspace...');
        let jacketInput = await askQuestion('🖼️  DRAG & DROP your Jacket / Cover artwork image (.png, .webp, .jpg):\n> ');
        if (jacketInput == "") {
            jacketInput = path.join(__dirname, "placeholder", "placeholder.png");
            console.log("Loading Placeholder Image...")
        }
        await processAndLinkAsset(jacketInput, targetSongFolder, 'jacket.png');

        const musicInput = await askQuestion('🎵 DRAG & DROP your Audio Track file (.mp3, .wav, .ogg, .m4a):\n> ');
        await processAndLinkAsset(musicInput, targetSongFolder, 'music.mp3');

        const chartInput = await askQuestion('📊 DRAG & DROP your Chart Data node mapping payload file (.data, .json.gz, or raw file):\n> ');
        await processAndLinkAsset(chartInput, targetSongFolder, 'level.data');

        const optionalPreviewInput = await askQuestion('⏭️  (Optional) DRAG & DROP short preview audio file, or press Enter to skip:\n> ');
        if (optionalPreviewInput.trim() !== '') {
            await processAndLinkAsset(optionalPreviewInput, targetSongFolder, 'music_pre.mp3');
        }

        console.log('\n🏁 Workspace loose asset level installation completed successfully!');
        rl.close();
        return;
    }

    console.log('\n🏁 Workspace loose asset level installation completed successfully!');
    console.log(`💡 Run "node server.js" or select Option 1 now. Your chart database files will compile flawlessly.\n`);
    rl.close();
    */
}

// Looping Logic
const setup = async function () {
    let exitIndicate = false;
    while (true) {
        process.stdout.write('\x1b[2J\x1b[0;0H');
        exitIndicate = await runInstallationPass();
        // if still running
        if (exitIndicate) {
            process.exit(0);
        }

        const endChoice = await askQuestion('\n[INFO] Do you wish to exit? (Y/N)\n> ');
        if (endChoice.trim().toLowerCase() === 'y') {
            console.log("[INFO] Stopped the installation wizard.")
            rl.close();
            process.exit(0);
        } else {
            console.log("[INFO] Continuing with setup...");
        }
    }
}
setup();