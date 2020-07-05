module.exports = function (component, i18nObj, locale) {
    component.options.__i18n = component.options.__i18n || [];
    let jsonData = locale ?
        JSON.stringify({ [locale]: i18nObj }) :
        JSON.stringify(i18nObj);
    component.options.__i18n.push(jsonData);
    delete component.options._Ctor;
}