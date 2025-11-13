// Content Manager Component
export class ContentManager {
    constructor() {
        this.editorElement = document.getElementById('editor');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.currentContent = null;
    }
    
    loadContent(contentId, language) {
        // Hide welcome screen
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }
        
        // Quick smooth transition without loader
        this.editorElement.style.opacity = '0.5';
        
        // Fast content load with smooth animation
        setTimeout(() => {
            const content = this.getContent(contentId, language);
            
            if (content) {
                this.currentContent = {
                    id: contentId,
                    language: language,
                    content: content
                };
                
                this.renderContent(content, language);
            }
            
            // Fade in quickly
            this.editorElement.style.opacity = '1';
        }, 50);
    }
    
    renderContent(content, language) {
        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'editor-content' + (language === 'pdf' ? ' no-line-numbers' : ' line-numbers');
        contentDiv.innerHTML = content;
        
        // Clear editor and add new content
        this.editorElement.innerHTML = '';
        this.editorElement.appendChild(contentDiv);

        // Ensure Prism line numbers are applied only to code blocks
        // Add 'line-numbers' class to each <pre> that contains a Prism language code block,
        // except those inside a container marked with '.no-line-numbers'.
        const pres = this.editorElement.querySelectorAll('pre');
        pres.forEach((pre) => {
            const insideNoNumbers = pre.closest('.no-line-numbers');
            const hasLanguage = pre.querySelector('code[class*="language-"]');
            if (!insideNoNumbers && hasLanguage) {
                pre.classList.add('line-numbers');
            } else {
                pre.classList.remove('line-numbers');
            }
        });
        
        // Apply syntax highlighting (skip for PDFs)
        if (window.syntaxHighlighter && language !== 'pdf') {
            setTimeout(() => {
                window.syntaxHighlighter.highlightAll();
            }, 10);
        }
        
        // Scroll to top
        this.editorElement.scrollTop = 0;
        
        // Update line count in status bar
        this.updateLineCount();
    }
    
    getContent(contentId, language) {
        // Get content from imported modules
        const contentMap = {
            'about': window.aboutContent,
            'projects': window.projectsContent,
            'skills': window.skillsContent,
            'experience': window.experienceContent,
            'contact': window.contactContent
        };

        // Dynamic PDF viewer
        if (language === 'pdf') {
            const activeTab = window.tabManager?.getActiveTab?.();
            const fileName = activeTab?.label || 'cv.pdf';
            const fileUrl = activeTab?.url || `/${fileName}`;
            return `
                <div class="content-section pdf-viewer">
                    <div class="pdf-toolbar">
                        <div class="pdf-title"><i class="codicon codicon-file-pdf"></i> ${fileName}</div>
                        <div class="pdf-actions">
                            <a class="pdf-button" href="${fileUrl}" download>
                                <i class="codicon codicon-cloud-download"></i>
                                <span>Download</span>
                            </a>
                            <a class="pdf-button" href="${fileUrl}" target="_blank" rel="noopener">
                                <i class="codicon codicon-open-preview"></i>
                                <span>Open in new tab</span>
                            </a>
                        </div>
                    </div>
                    <div class="pdf-frame-wrap">
                        <object data="${fileUrl}#view=FitH" type="application/pdf" class="pdf-frame">
                            <iframe src="${fileUrl}#view=FitH" class="pdf-frame"></iframe>
                        </object>
                    </div>
                </div>
            `;
        }

        // Support contentId with subpath (e.g., "projects/web-server.go")
        const baseId = String(contentId || '').split('/')[0];
        return contentMap[baseId] || '<div class="content-section"><h1>Content not found</h1><p>The requested content could not be loaded.</p></div>';
    }
    
    showWelcomeScreen() {
        this.editorElement.innerHTML = '';
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'flex';
            this.editorElement.appendChild(this.welcomeScreen);
        }
    }
    
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
    
    updateLineCount() {
        const lines = this.editorElement.querySelectorAll('.line').length;
        const statusPosition = document.getElementById('statusPosition');
        
        if (statusPosition && lines > 0) {
            statusPosition.textContent = `Ln 1, Col 1 (${lines} lines)`;
        }
    }
    
    applyTypingEffect(element, text, speed = 30) {
        let index = 0;
        element.textContent = '';
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    search(query) {
        if (!this.currentContent) return [];
        
        const content = this.currentContent.content;
        const results = [];
        
        // Simple search implementation
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    line: index + 1,
                    text: line.trim(),
                    preview: line.trim().substring(0, 100)
                });
            }
        });
        
        return results;
    }
}
