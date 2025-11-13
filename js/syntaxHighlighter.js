// Syntax Highlighter using Prism.js
import Prism from 'prismjs';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-markdown';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

export class SyntaxHighlighter {
    constructor() {
        // Prism is already imported and ready
        this.prism = Prism;
    }
    
    highlightAll() {
        // Use Prism's built-in highlightAll
        Prism.highlightAll();
    }
    
    highlightBlock(block) {
        // Use Prism's highlightElement
        Prism.highlightElement(block);
    }
}
