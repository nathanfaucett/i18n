var isArray = require("is_array"),
    isString = require("is_string"),
    isObject = require("is_object"),
    format = require("format"),
    fastSlice = require("fast_slice"),
    has = require("has"),
    defineProperty = require("define_property");


var translationCache = global.__I18N_TRANSLATIONS__,
    flatMode = false,
    throwMissingError = false;


if (!translationCache) {
    translationCache = {};
    defineProperty(global, "__I18N_TRANSLATIONS__", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: translationCache
    });
}


module.exports = i18n;


function i18n(locale, key) {
    return i18n.translate(locale, key, fastSlice(arguments, 2));
}

i18n.translate = function(locale, key, args) {
    var translations = translationCache[locale] || null;

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

i18n.flatMode = function(value) {
    flatMode = !!value;
};

i18n.throwMissingError = function(value) {
    throwMissingError = !!value;
};

i18n.reset = function() {
    flatMode = false;
    throwMissingError = false;
};

i18n.add = function(locale, object) {
    var translations = translationCache[locale] || (translationCache[locale] = {}),
        key;

    if (isObject(object)) {
        for (key in object) {
            if (has(object, key)) {
                if (has(translations, key)) {
                    throw new TypeError("i18n.add(locale, object) cannot override " + locale + " translation with key " + key);
                } else {
                    translations[key] = object[key];
                }
            }
        }
    } else {
        throw new TypeError("i18n.add(locale, object) object must be an Object");
    }
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
    } else {
        return args.length !== 0 ? format.args(value, args) : value;
    }
}

function translateFlat(key, translations, args) {
    var value = translations[key];

    if (value == null || isObject(value)) {
        return missingTranslation(key);
    } else {
        return args.length !== 0 ? format.args(value, args) : value;
    }
}
