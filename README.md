i18n
=======

i18n for the browser and node.js


```javacript

var i18n = require("i18n");


i18n.add("en", {
    home: {
        header: {
            value: "Header",
            date: "Hello, it is %s"
        }
    }
});

i18n.add("en", {
    content: {
        btn_name: "BUTTON"
    }
})

console.log(i18n("en", "home.header.date", new Date()));
console.log(i18n("en", "home.header.date.missing")); // will throw an error
console.log(i18n("en", "home.missing")); // will throw an error

```
