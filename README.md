# vue-i18n-js-loader

With vue-i18n-js-loader loader, you can write any javascript code in the i18n custom block!  
This project is based on [@intlify/vue-i18n-loader](https://github.com/intlify/vue-i18n-loader/tree/master).

And this project is for **Vue2**

Before using this loader, you have to install *[Vue2](https://github.com/vuejs/vue)*, *[vue-loader](https://github.com/vuejs/vue-loader)* and *[vue-i18n](https://github.com/kazupon/vue-i18n)* first.

## Installation
``` shell
$ npm install --save-dev vue-i18n-js-loader
```

### Webpack config
``` js
// in webpack.config.js
const vueI18nJSPlugin = require('vue-i18n-js-loader/lib/plugin.js');

module.exports = {
    plugins: {
        new vueI18nJSPlugin();
    },
    module: {
        rules: [
            {
                resourceQuery: /blockType=i18n/,
                type: 'javascript/auto',
                loader: 'vue-i18n-js-loader',
            },
        ]
    }
}
```

### Vue-loader config
``` js
// in vue.config.js
chainWebpack: config => {
    config.module.rule('vue-i18n-js')
        .resourceQuery(/blockType=i18n/)
        .type('javascript/auto')
        .use("i18n")
            .loader('vue-i18n-js-loader');
    
    config.plugin('vue-i18n-js')
        .use('vue-i18n-js-loader/lib/plugin.js');
}
```

## Usage
### Basic usage
You can use javascript in the i18n custom block now! You have to export a javascript plain object representing the i18n messages by `default`.  
You can still use languages supported by [@intlify/vue-i18n-loader](https://github.com/intlify/vue-i18n-loader/tree/master)

``` html
<template>
    <div>{{ $t('hello') }}</div>
</template>

<i18n lang="js">
export default {
    en: {
        hello: 'Hello',
    },
    zhHans: {
        hello: '你好',
    },
}
</i18n>
```

### Import from other SFCs
You can also import an i18n object from another SFC file.  
But you have to take care of the **circular dependency** problem.

``` html
<!-- a.vue -->
<script>
// import B from './b.vue'; // This will cause the "circular dependency" problem, and will crack the application
export default {
    name: 'A',
    components: {
        // B
    },
}
</script>

<i18n lang="js" locale="en">
export default {
    fromA: 'From a.vue',
}
</i18n>
<i18n locale="zhHans">
{
    "fromA": "来自 a.vue"
}
</i18n>
```

``` html
<!-- b.vue -->
<template>
    <div>{{ $t('combined') }}</div>
</template>

<i18n lang="js">
import { i18n as messagesFromA } from './a.vue';
export default {
    en: {
        combined: 'Hello, ' + messagesFromA.en.fromA,
    },
    zhHans: {
        combined: '你好， ' + messagesFromA.zhHans.fromA,
    }
}
</i18n>
```

### What can be accessed in the i18n block
You can write any js code you want, but you **CANNOT** access the vue component! Because the code in the i18n block is executed before the vue component creation.

``` html
<i18n lang="js">
import { i18n } from './another.vue';
import { upperCase } from 'lodash';
export default {
    en: {
        baz: upperCase(i18n.en.foo),
        // bar: this.something,     // illegal
    },
    // ...
}
</i18n>
```

### Use source file
like this.
``` html
<i18n lang="js" src="./path/to/messages.js">
</i18n>
```