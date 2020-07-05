"use strict";

let __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const queryString = require("querystring");
const json5 = __importDefault(require("json5"));
const jsYAML = __importDefault(require("js-yaml"));

let loader = function (source, sourceMap) {
    const query = queryString.parse(this.resourceQuery);
    const js = query.lang === 'js' || query.lang === 'javascript';

    if (this.version && Number(this.version) >= 2) {
        try {
            this.cacheable && this.cacheable();
            if (js) {
                this.callback(null, source, sourceMap);
            } else {
                this.callback(null, "module.exports = " + generateCode(source, query), sourceMap);
            }
        }
        catch (err) {
            this.emitError(err.message);
            this.callback(err);
        }
    }
    else {
        let message = 'Only support webpack 2 or later';
        this.emitError(message);
        this.callback(new Error(message));
    }
};

function generateCode(source, query) {
    let data = convert(source, query.lang, query.locale);

    data = data
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
        .replace(/\\/g, '\\\\')
        .replace(/\u0027/g, '\\u0027');
        
    let code =
`function (component) {
    component.options.__i18n = component.options.__i18n || [];
    component.options.__i18n.push('${data}');
    delete component.options._Ctor;
}`;

    return code;
}

function convert(source, lang, locale) {
    let str = Buffer.isBuffer(source) ? source.toString() : source;
    let parsedObj;
    switch (lang) {
        case 'yaml':
        case 'yml':
            parsedObj = jsYAML.default.safeLoad(str);
        case 'json5':
            parsedObj = json5.default.parse(str);
        default:
            parsedObj = JSON.parse(str);
    }

    if (locale) {
        parsedObj = { [locale]: parsedObj };
    }
    return JSON.stringify(parsedObj);
}

exports.default = loader;
