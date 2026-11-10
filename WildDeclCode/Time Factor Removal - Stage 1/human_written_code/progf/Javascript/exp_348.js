/**
 * Constructor for creating Cress stylesheet components
 * @param {String} selector The selector to match nodes that will become instances of the Cress component
 * @param {Object} config The configuration object. See [the README on Github]{@link https://github.com/Heydon/cress/blob/master/README.md}
 * @class
 */
function Cress(selector, config) {
  this.elems = Array.from(document.querySelectorAll(selector));
  this.this = config.this || 'this';
  this.pattern = new RegExp(this.this, 'g');
  this.sharedId = Math.random().toString(36).substr(2, 9);
  this.reset = "" + (this.this) + ", " + (this.this) + " * { all: initial }";

  this.getProps = function elem {
    if (!config.props) {
      return null;
    }
    var props = {};
    for (var prop in config.props) {
      var attr = elem.getAttribute("data-cress-" + (prop) + "");
      props[prop] = attr ? attr : config.props[prop];
    }
    return props;
  }

  this.styleUp = function elem {
    var props = this.getProps(elem);
    var i = !props ? this.sharedId : this.sharedId + '-' + Object.values(props).join('');
    elem.dataset.cress = i;

    var styles = config.reset ? this.reset + config.css(props) : config.css(props);
    var css = styles.replace(this.pattern, '[data-cress="' + (i) + '"]');

    if (!document.getElementById(i)) {
      document.head.innerHTML += '
        <style id="' + (i) + '">' + (css.replace(/\s\s+/g, ' ').trim()) + "</style>
      ";
    }
  }

  this.elems.forEach(function elem {
    config.props && new MutationObserver(() => {
      this.styleUp(elem);
    }).observe(elem, {
      attributes: true,
      attributeFilter: Object.keys(config.props).map(k => "data-" + (k) + "")
    });

    if ('ResizeObserver' in window && config.resize) {
      new ResizeObserver(entries => {
        config.resize(entries[0]);
      }).observe(elem);
    }

    this.styleUp(elem);
  });
}

module.exports.Cress = Cress;
