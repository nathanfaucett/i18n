var isArray = require("is_array"),
    isString = require("is_string"),
    isObject = require("is_object"),
    format = require("format"),
    fastSlice = require("fast_slice"),
    mixin = require("mixin");


var translationCache = {},
    flatMode = false,
    throwMissingError = false;


module.exports = i18n;


function i18n(locale, key) {
    return i18n.translate(locale, key, fastSlice(arguments, 2));
}

i18n.translate = function(locale, key, args) {
    var translations = i18n.get(locale);

    if (translations === null) {
        throw new Error("i18n(key[, locale[, ...args]]) no translations for " + locale + " locale");
    }
    if (!isString(key)) {
        throw new TypeError("i18n(key[, locale[, ...args]]) key must be a String");
    }

    args = isArray(args) ? args : [];

    if (flatMode === true) {
        return translateFlat(key, translations, args);
    } else {
        return translate(key, translations, args);
    }
};

i18n.setFlatMode = function(value) {
    flatMode = !!value;
};

i18n.throwMissingError = function(value) {
    throwMissingError = !!value;
};

i18n.reset = function() {
    translationCache = {};
    flatMode = false;
    throwMissingError = false;
};

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

function missingTranslation(key) {
    if (throwMissingError) {
        throw new Error("i18n(locale, key) missing translation for key " + key);
    } else {
        return "--" + key + "--";
    }
}

function translate(key, translations, args) {
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
                return missingTranslation(origKey);
            }
        } else {
            return missingTranslation(origKey);
        }
    }

    if (value == null || isObject(value)) {
        return missingTranslation(origKey);
    }

    return args.length !== 0 ? format.args(value, args) : value;
}

function translateFlat(key, translations, args) {
    var value = translations[key];

    if (value == null || isObject(value)) {
        return missingTranslation(key);
    }

    return args.length !== 0 ? format.args(value, args) : value;
}
