const queryString = require('query-string');

module.exports = function (source, sourceMap) {
    if (!this.resourceQuery) {
        // insert imports code
        let customBlocks = source.indexOf('/* custom blocks */');
        if (customBlocks > -1) {
            customBlocks += '/* custom blocks */'.length;
            const importsContent = `import { pushI18nObject, genI18nMessages } from "${require.resolve('./runtime').replace(/\\/g, '/')}"\n`;
            source = source.slice(0, customBlocks) + '\n' + importsContent + source.slice(customBlocks);
        }

        let pattern = /import ([a-zA-Z0-9-_]+) from (?:'|")(.+&blockType=i18n.*)(?:'|")/g;
        let match = null;
        let hasI18nBlock = false;

        // Search all <i18n> blocks
        while (match = pattern.exec(source)) {
            hasI18nBlock = true;

            const queries = queryString.parse(match[2]);
            const locale = queries.locale;
            const js = queries.lang;

            if (js) {
                const pushI18nContent = `else if (typeof ${match[1]} === 'object') pushI18nObject(component, ${match[1]}, ${locale ? `'${locale}'` : null})\n`;
                const afterIf = source.indexOf('\n', pattern.lastIndex + 1);
                source = source.slice(0, afterIf) + '\n' + pushI18nContent + source.slice(afterIf);
            }

        }

        if (hasI18nBlock) {
            const exportI18nContent = `export var i18n = genI18nMessages(component.options.__i18n)`;
            // Insert modification before the HMR code
            const hotReload = source.indexOf('/* hot reload */');
            if (hotReload > -1) {
                source = source.slice(0, hotReload) + exportI18nContent + '\n' + source.slice(hotReload);
            } else {
                source += '\n' + exportI18nContent;
            }
        }
    }

    this.callback(null, source, sourceMap);
}