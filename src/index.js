var type = require("type"),
    utils = require("utils");


var translationCache = {};


module.exports = i18n;


function i18n(key, locale) {
    var translations;

    if (!type.isString(key)) {
        throw new TypeError("i18n(key[, locale]) key must be a String");
    }

    translations = i18n.get(locale);

    if (translations === null) {
        throw new Error("i18n(key[, locale]) no translations for " + locale + " locale");
    }

    return translate(key, locale, translations, slice(arguments, 2));
}

i18n.get = function(locale) {

    return translationCache[locale] || null;
};

i18n.set = function(locale, object) {
    if (!type.isHash(object)) {
        throw new TypeError("i18n.set(locale, object) object must be an Object");
    }

    translationCache[locale] = object;
};

i18n.add = function(locale, object) {
    var translations = translationCache[locale] || (translationCache[locale] = {});

    if (!type.isHash(object)) {
        throw new TypeError("i18n.add(locale, object) object must be an Object");
    }

    utils.mixin(translations, object);
};

function translate(key, locale, translations, args) {
    var keys = key.split("."),
        length = keys.length - 1,
        i = 0,
        value = translations[keys[i]];


    while (i++ < length) {
        key = keys[i];

        if (type.isObject(value)) {
            value = value[key];

            if (value === undefined) {
                throw new Error("i18n(key[, locale]) missing translations for " + locale + " locale, key " + keys.join("."));
            }
        } else {
            throw new Error("i18n(key[, locale]) missing translations for " + locale + " locale, key " + keys.join("."));
        }
    }

    if (type.isObject(value)) {
        throw new TypeError("i18n(key[, locale]) translations for " + locale + " locale, key " + keys.join(".") + " is not a primitive");
    }

    return args.length !== 0 ? utils.formatArgs(value, args) : value;
}

function slice(array, offset) {
    var length, i, il, result, j;

    offset = offset || 0;

    length = array.length;
    i = offset - 1;
    il = length - 1;
    result = new Array(length - offset);
    j = 0;

    while (i++ < il) {
        result[j++] = array[i];
    }

    return result;
}
