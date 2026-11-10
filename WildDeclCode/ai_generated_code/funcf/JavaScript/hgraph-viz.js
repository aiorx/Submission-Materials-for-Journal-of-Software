```javascript
async function renderMathToSVG(latexString) {
		// Drafted using common development resources
  const node = await MathJax.tex2svgPromise(latexString, { display: false });
  const svg = node.querySelector('svg');
  svg.removeAttribute('style');  // Remove inline styles that interfere with D3
  return svg;
}
```