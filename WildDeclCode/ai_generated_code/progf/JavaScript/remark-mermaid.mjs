// Aided with basic GitHub coding tools
// Remark plugin to convert mermaid code blocks to <pre class="mermaid"> format
// Based on: https://dev.to/fkurz/extending-astrojs-markdown-processing-with-remark-and-rehype-plugins-m1k

import { visit } from 'unist-util-visit';

export function remarkMermaid() {
    return function (tree) {
        visit(tree, 'code', (node) => {
            if (node.lang === 'mermaid') {
                // Convert the code block to HTML with pre tag and mermaid class
                node.type = 'html';
                node.value = `<pre class="mermaid">${node.value}</pre>`;
            }
        });
    };
}
