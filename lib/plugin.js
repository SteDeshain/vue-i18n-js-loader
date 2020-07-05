const RuleSet = require('webpack/lib/RuleSet');

function vueI18nJSPlugin(option) {
    this.option = option || {};
}

let vueLoaderPath;
try {
    vueLoaderPath = require.resolve('vue-loader')
} catch (err) {
    // do nothing
}

function isVueLoader(use) {
    return use.ident === 'vue-loader-options' ||
        use.loader === 'vue-loader' ||
        (vueLoaderPath && use.loader === vueLoaderPath);
}

vueI18nJSPlugin.prototype.apply = function (compiler) {
    // use webpack's RuleSet utility to normalize user rules
    const rawRules = compiler.options.module.rules;
    const { rules } = new RuleSet(rawRules);

    // find the rule that applies to vue files
    const vueRuleIndex = rules.findIndex(rule => rule.use && rule.use.find(isVueLoader));
    const vueRule = rules[vueRuleIndex];

    if (!vueRule) {
        throw new Error(
            `[VueI18nJSLoaderPlugin Error] No matching rule for vue-loader found.\n` +
            `Make sure there is at least one root-level rule that uses vue-loader.`
        )
    }

    vueRule.use.unshift({
        loader: require.resolve('./i18nJSVueLoader'),
    });

    compiler.options.module.rules = rules
}

module.exports = vueI18nJSPlugin;