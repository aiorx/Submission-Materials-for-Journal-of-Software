```javascript
function loaderAnimation() {
    jQuery('.loader-animation').html('.');
    setTimeout(function () {
        jQuery('.loader-animation').html('..');
    }, 250);
    setTimeout(function () {
        jQuery('.loader-animation').html('...');
    }, 500);
    setTimeout(function () {
        loaderAnimation();
    }, 750);
}
```