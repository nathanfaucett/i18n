var tape = require("tape"),
    i18n = require("../src/index");


tape("i18n.add(locale : String, object : Object)", function(assert) {
    delete global.__I18N_TRANSLATIONS__.en;

    i18n.add("en", {
        key: "value",
        key2: "value2"
    });
    assert.deepEqual(global.__I18N_TRANSLATIONS__.en, {
        key: "value",
        key2: "value2"
    }, "should add translation to translation hash");

    delete global.__I18N_TRANSLATIONS__.en;

    i18n.add("en", {
        key: "value"
    });
    try {
        i18n.add("en", {
            key: "value2"
        });
    } catch (e) {
        assert.equal(e.message, "i18n.add(locale, object) cannot override en translation with key key", "should throw an error when trying to override translations");
    }

    assert.end();
});

tape("i18n(locale : String, key : String)", function(assert) {
    delete global.__I18N_TRANSLATIONS__.en;

    i18n.add("en", {
        key: "value"
    });
    assert.equal(i18n("en", "key"), "value", "should return value from locale translation hash");

    assert.end();
});
