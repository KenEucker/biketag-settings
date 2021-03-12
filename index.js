const config = require('clobfig')()
const package = require('./package.json')

module.exports = config
const outputAsModule = process.argv.indexOf('--mod')
const outputRaw = process.argv.indexOf('--raw')
const outputToConsole = process.argv.indexOf('--out')
const convertToSanity = process.argv.indexOf('--sane')
const addTypeVariable = process.argv.indexOf('--type')

const cleanOutput = (output) => {
    /// Ignore these keys from output
    const ignore = ['AppRoot', 'appRootPath', 'configFilePath', 'configFolderName', 'relativePath']
    /// Get all config keys
    const configKeys = Object.keys(output)
    /// Remove undesireables
    configKeys.forEach((key) => {
        if (key.indexOf('_') === 0 || ignore.indexOf(key) !== -1) {
            delete output[key]
        }
    })

    return output
}

const stringifyOutput = (output, replaceQuotes = false) => {
    /// Pretty print JSON
    let stringified = JSON.stringify(output, null, 2)

    if (replaceQuotes) {
        /// Clean it up for js file presentation
        stringified = stringified.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (match) => /"[A-Za-z0-9]*"/gm.test(match) ? match.replace(/"/g, "") : match)
    }
    return stringified
}

const getDocumentObjectType = (obj) => {
    let type = (typeof obj).toLocaleLowerCase()

    switch(typeof obj) {
        case 'object':
            type = Array.isArray(obj) ? 'array' : 'object'
        break
        case 'undefined':
            type = 'string'
        break
    }

    return type
}

const getDocumentObjects = (obj, name, type, typeOnly = false) => {
    const objType = Array.isArray(obj) ? 'array' : typeof obj
    const doc = {
        name,
        _type: type ? type : getDocumentObjectType(obj),
    }
    
    if (typeOnly) {
        if (objType === 'object') {
            Object.keys(obj).forEach(key => {
                doc[key] = getDocumentObjects(obj[key], key, undefined, true)
            })
        } else {
            doc[name] = getDocumentObjects(obj[key], key, undefined, true)
        }
    } else if (objType === 'object') {
        doc.fields = []
        Object.keys(obj).forEach(key => {
            doc.fields.push(getDocumentObjects(obj[key], key))
        })
    } else if (objType === 'array') {
        doc.of = [
            {
                _type: getDocumentObjectType(obj[0]),
            }
        ]
    }

    return doc
}

let out = cleanOutput(config)

if (addTypeVariable !== -1 || convertToSanity !== -1) {
    out = getDocumentObjects(out, package.name, 'document', addTypeVariable === -1)
}

if (convertToSanity !== -1 || outputAsModule !== -1) {
    out = `export default ${stringifyOutput(out, true)}`
} else {
    out = stringifyOutput(out, !(outputRaw !== -1 || addTypeVariable !== -1))
}

if (outputToConsole !== -1) {
    /// Output to console
    console.log(out)
}