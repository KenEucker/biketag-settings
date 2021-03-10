const config = require('clobfig')()

module.exports = config

if (process.argv.indexOf('--out') !== -1) {
    let out = config
    if (process.argv.indexOf('--mod') !== -1) {
        /// Ignore these keys from output
        const ignore = ['AppRoot', 'appRootPath', 'configFilePath', 'configFolderName', 'relativePath']
        /// Get all config keys
        const configKeys = Object.keys(config)
        /// Remove undesireables
        configKeys.forEach((key) => {
            if (key.indexOf('_') === 0 || ignore.indexOf(key) !== -1) {
                delete config[key]
            }
        })
        /// Pretty print JSON
        out = JSON.stringify(config, null, 2)
        /// Clean it up for js file presentation
        out = out.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (match) => /"[A-Za-z0-9]*"/gm.test(match) ? match.replace(/"/g, "") : match)
        /// Output to console
        console.log(`module.exports = ${out}`)
    } else {
        console.log(out)
    }
}