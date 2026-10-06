const path = require('path');

// Forces paths to look next to the .exe on any machine
const baseExecutionPath = process.cwd();

module.exports = {
    // Address
    // real
    ADDRESS: "0.0.0.0", 
    PORT: 39039, 
    https: false,

    // Visual
    title: "Sono-Overlay Local Server",
    desc: "Custom-coded, lightweight Sonolus server for Sono-Overlay users.",
    themeColor: "#000020",
    // Public path for the server and web client. Keep the leading and trailing slashes.
    baseUrl: "/",

    // Change these if you know what you are doing.
    debug: false,
    UPLOADS_DIR: path.join(baseExecutionPath, 'uploads'), 
    ENGINES_POOL_DIR: path.join(baseExecutionPath, 'engines_pool'), 
    LEVELS_POOL_DIR: path.join(baseExecutionPath, 'levels_pool'), 
    BANNER_POOL_DIR: path.join(baseExecutionPath, 'banner_pool'), 
    SOURCE_DIR: path.join(baseExecutionPath, 'source'), 
    TEMP_EXTRACT_DIR: path.join(baseExecutionPath, 'temp_extracted'), 

    // Build settings
    // This program cant actually be built due to dependancies...
    CONFIG_NAME: 'sea-config.json',
    OUTPUT_EXE: 'sono-utils.exe',

    dateOptions: {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    },
};
