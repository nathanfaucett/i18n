var isString = require("is_string"),
    isObject = require("is_object"),
    format = require("format"),
    fastSlice = require("fast_slice"),
    mixin = require("mixin");


var translationCache = {};


module.exports = i18n;


function i18n(locale, key) {
    var translations = i18n.get(locale);

    if (translations === null) {
        throw new Error("i18n(key[, locale]) no translations for " + locale + " locale");
    }
    if (!isString(key)) {
        throw new TypeError("i18n(key[, locale]) key must be a String");
    }

    return translate(locale, key, translations, fastSlice(arguments, 2));
}

i18n.get = function(locale) {

    return translationCache[locale] || null;
};

i18n.set = function(locale, object) {
    if (!isObject(object)) {
        throw new TypeError("i18n.set(locale, object) object must be an Object");
    }

    translationCache[locale] = object;
};

i18n.add = function(locale, object) {
    var translations = translationCache[locale] || (translationCache[locale] = {});

    if (!isObject(object)) {
        throw new TypeError("i18n.add(locale, object) object must be an Object");
    }

    mixin(translations, object);
};

function translate(locale, key, translations, args) {
    var origKey = key,
        keys = key.split("."),
        length = keys.length - 1,
        i = 0,
        value = translations[keys[i]];


    while (i++ < length) {
        key = keys[i];

        if (isObject(value)) {
            value = value[key];

            if (value == null) {
                return "--" + origKey + "--";
            }
        } else {
            return "--" + origKey + "--";
        }
    }

    if (value == null || isObject(value)) {
        return "--" + origKey + "--";
    }

    return args.length !== 0 ? format.args(value, args) : value;
}
