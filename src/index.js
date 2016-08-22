var isNull = require("@nathanfaucett/is_null"),
    isArray = require("@nathanfaucett/is_array"),
    isString = require("@nathanfaucett/is_string"),
    isObject = require("@nathanfaucett/is_object"),
    format = require("@nathanfaucett/format"),
    flattenObject = require("@nathanfaucett/flatten_object"),
    fastSlice = require("@nathanfaucett/fast_slice"),
    has = require("@nathanfaucett/has"),
    defineProperty = require("@nathanfaucett/define_property");


var EMPTY_ARRAY = [],
    translationCache = global.__I18N_TRANSLATIONS__;


if (!translationCache) {
    translationCache = {};
    defineProperty(global, "__I18N_TRANSLATIONS__", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: translationCache
    });
}


module.exports = create(false, false);


function create(throwMissingError, throwOverrideError) {

    throwMissingError = !!throwMissingError;
    throwOverrideError = !!throwOverrideError;


    function i18n(locale, key) {
        return i18n.translate(
            locale,
            key,
            arguments.length > 2 ? fastSlice(arguments, 2) : EMPTY_ARRAY
        );
    }

    i18n.create = create;

    i18n.translate = function(locale, key, args) {
        var translations = translationCache[locale] || null;

        if (isNull(translations)) {
            throw new Error(
                "i18n(key[, locale[, ...args]]) no translations for " +
                locale + " locale"
            );
        }
        if (!isString(key)) {
            throw new TypeError(
                "i18n(key[, locale[, ...args]]) key must be a String"
            );
        }

        return translate(key, translations, isArray(args) ? args : EMPTY_ARRAY);
    };

    i18n.throwMissingError = function(value) {
        throwMissingError = !!value;
    };
    i18n.throwOverrideError = function(value) {
        throwOverrideError = !!value;
    };

    i18n.has = function(locale, key) {
        if (has(translationCache[locale], key)) {
            return true;
        } else {
            return false;
        }
    };

    i18n.add = function(locale, object) {
        var translations = (
                translationCache[locale] ||
                (translationCache[locale] = {})
            ),
            localHas = has,
            key, value;

        if (isObject(object)) {
            value = flattenObject(object);

            for (key in value) {
                if (localHas(value, key)) {
                    if (localHas(translations, key)) {
                        if (throwOverrideError) {
                            throw new Error(
                                "i18n.add(locale, object) cannot override " +
                                locale + " translation with key " + key
                            );
                        }
                    } else {
                        translations[key] = value[key];
                    }
                }
            }
        } else {
            throw new TypeError(
                "i18n.add(locale, object) object must be an Object"
            );
        }
    };

    function missingTranslation(key) {
        if (throwMissingError) {
            throw new Error(
                "i18n(locale, key) missing translation for key " + key
            );
        } else {
            return "--" + key + "--";
        }
    }

    function translate(key, translations, args) {
        var value;

        if (has(translations, key)) {
            value = translations[key];
            return args.length !== 0 ? format.array(value, args) : value;
        } else {
            return missingTranslation(key);
        }
    }

    return i18n;
}
