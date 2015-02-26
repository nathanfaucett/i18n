var assert = require("assert"),
    i18n = require("../src/index");


describe("i18n", function() {

    describe("#i18n.add(locale : String, object : Object)", function() {
        it("should add translation to translation hash", function() {
            delete global.__I18N_TRANSLATIONS__.en;

            i18n.add("en", {
                key: "value",
                key2: "value2"
            });
            assert.deepEqual(global.__I18N_TRANSLATIONS__.en, {
                key: "value",
                key2: "value2"
            });
        });

        it("should throw an error when trying to override translations", function() {
            delete global.__I18N_TRANSLATIONS__.en;

            i18n.add("en", {
                key: "value"
            });
            try {
                i18n.add("en", {
                    key: "value2"
                });
            } catch (e) {
                assert.equal(e.message, "i18n.add(locale, object) cannot override en translation with key key");
            }
        });
    });

    describe("#i18n(locale : String, key : String)", function() {
        it("should return value from locale translation hash", function() {
            delete global.__I18N_TRANSLATIONS__.en;

            i18n.add("en", {
                key: "value"
            });
            assert.equal(i18n("en", "key"), "value");
        });
    });
});
