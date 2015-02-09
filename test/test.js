var assert = require("assert"),
    i18n = require("../src/index");


describe("i18n", function() {
    describe("#i18n.get(locale : String)", function() {
        it("should return translation hash if avalable else returns null", function() {
            var translations = {
                key: "value"
            };

            assert.equal(i18n.get("en"), null);

            i18n.set("en", translations);
            assert.equal(i18n.get("en"), translations);

            i18n.reset();
        });
    });

    describe("#i18n.set(locale : String, object : Object)", function() {
        it("should set translation hash if not already set", function() {
            var translations = {
                key: "value"
            };

            i18n.set("en", translations);
            assert.equal(i18n.get("en"), translations);
            i18n.reset();
        });
    });

    describe("#i18n.add(locale : String, object : Object)", function() {
        it("should add translation to translation hash", function() {
            var translations = {
                key: "value"
            };

            i18n.set("en", translations);
            i18n.add("en", {
                key2: "value2"
            });
            assert.deepEqual(i18n.get("en"), {
                key: "value",
                key2: "value2"
            });

            i18n.reset();
        });
    });

    describe("#i18n(locale : String, key : String)", function() {
        it("should return value from locale translation hash", function() {
            var translations = {
                key: "value"
            };

            i18n.set("en", translations);
            assert.equal(i18n("en", "key"), "value");

            i18n.reset();
        });
    });
});
