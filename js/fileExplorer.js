const documentsModules = import.meta.glob('../documents/**/*.pdf', { eager: true, query: '?url', import: 'default' });
const rootPdfModules = import.meta.glob('../*.pdf', { eager: true, query: '?url', import: 'default' });

function buildDocumentsFolder() {
    const entries = { ...documentsModules, ...rootPdfModules };
    const children = Object.entries(entries).map(([path, url]) => {
        const parts = path.split('/');
        const fileName = parts[parts.length - 1];
        return {
            name: fileName,
            type: 'file',
            icon: 'codicon-file-pdf',
            iconColor: '',
            language: 'pdf',
            contentId: `doc:${fileName}`,
            url
        };
    }).sort((a, b) => a.name.localeCompare(b.name));
    
    return {
        name: 'documents',
        type: 'folder',
        icon: 'codicon-folder',
        iconColor: 'folder-icon',
        expanded: false,
        children
    };
}
export class FileExplorer {
    constructor() {
        this.files = [
            {
                name: 'about.md',
                type: 'file',
                icon: 'codicon-markdown',
                iconColor: 'file-icon-md',
                language: 'markdown',
                contentId: 'about'
            },
            buildDocumentsFolder(),
            {
                name: 'projects',
                type: 'folder',
                icon: 'codicon-folder',
                iconColor: 'folder-icon',
                expanded: false,
                children: [
                    {
                        name: 'web-server.go',
                        type: 'file',
                        icon: 'codicon-file-code',
                        iconColor: 'file-icon-go',
                        language: 'go',
                        contentId: 'projects/web-server.go'
                    }
                ]
            },
            {
                name: 'skills',
                type: 'folder',
                icon: 'codicon-folder',
                iconColor: 'folder-icon',
                expanded: false,
                children: [
                    {
                        name: 'backend.rs',
                        type: 'file',
                        icon: 'codicon-file-code',
                        iconColor: 'file-icon-rs',
                        language: 'rust',
                        contentId: 'skills/backend.rs'
                    }
                ]
            },
            {
                name: 'experience.md',
                type: 'file',
                icon: 'codicon-markdown',
                iconColor: 'file-icon-md',
                language: 'markdown',
                contentId: 'experience'
            },
            {
                name: 'contacts.go',
                type: 'file',
                icon: 'codicon-file-code',
                iconColor: 'file-icon-go',
                language: 'go',
                contentId: 'contact'
            }
        ];
        
        this.activeFile = null;
        this.treeElement = document.getElementById('fileTree');
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
    }
    
    render() {
        if (!this.treeElement) {
            console.error('Tree element not found!');
            return;
        }
        
        this.treeElement.innerHTML = '';
        this.files.forEach((item, index) => {
            this.renderItem(item, this.treeElement, 0);
        });
    }
    
    renderItem(item, parent, level) {
        if (item.type === 'folder') {
            this.renderFolder(item, parent, level);
        } else {
            this.renderFile(item, parent, level);
        }
    }
    
    renderFolder(folder, parent, level) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder-wrapper';
        
        const folderItem = document.createElement('div');
        folderItem.className = `folder-item ${folder.expanded ? '' : 'collapsed'}`;
        folderItem.style.paddingLeft = `${level * 12 + 12}px`;
        folderItem.dataset.path = folder.name;
        
        folderItem.innerHTML = `
            <i class="codicon codicon-chevron-${folder.expanded ? 'down' : 'right'} toggle-icon"></i>
            <i class="codicon ${folder.icon} ${folder.iconColor}"></i>
            <span class="file-name">${folder.name}</span>
        `;
        
        folderDiv.appendChild(folderItem);
        
        if (folder.children && folder.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'folder-children';
            
            if (folder.expanded) {
                let maxHeight = folder.children.length * 30;
                childrenContainer.style.maxHeight = `${maxHeight}px`;
            } else {
                childrenContainer.style.maxHeight = '0';
            }
            
            folder.children.forEach(child => {
                this.renderItem(child, childrenContainer, level + 1);
            });
            
            folderDiv.appendChild(childrenContainer);
        }
        
        parent.appendChild(folderDiv);
    }
    
    renderFile(file, parent, level) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.style.paddingLeft = `${level * 12 + 28}px`;
        fileItem.dataset.contentId = file.contentId;
        fileItem.dataset.language = file.language;
        fileItem.dataset.fileName = file.name;
        if (file.url) fileItem.dataset.url = file.url;
        
        fileItem.innerHTML = `
            <i class="codicon ${file.icon} ${file.iconColor}"></i>
            <span class="file-name">${file.name}</span>
        `;
        
        parent.appendChild(fileItem);
    }
    
    attachEventListeners() {
        // Folder toggle
        this.treeElement.addEventListener('click', (e) => {
            const folderItem = e.target.closest('.folder-item');
            if (folderItem) {
                this.toggleFolder(folderItem);
            }
            
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                this.selectFile(fileItem);
            }
        });
    }
    
    toggleFolder(folderElement) {
        const isCollapsed = folderElement.classList.contains('collapsed');
        const folderWrapper = folderElement.parentElement;
        const childrenContainer = folderWrapper.querySelector('.folder-children');
        const toggleIcon = folderElement.querySelector('.toggle-icon');
        
        if (isCollapsed) {
            // Expand
            folderElement.classList.remove('collapsed');
            const toggleIcon = folderElement.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.classList.remove('codicon-chevron-right');
                toggleIcon.classList.add('codicon-chevron-down');
            }
            
            if (childrenContainer) {
                const childCount = childrenContainer.children.length;
                childrenContainer.style.maxHeight = `${childCount * 30}px`;
                childrenContainer.classList.add('expanding');
            }
        } else {
            // Collapse
            folderElement.classList.add('collapsed');
            const toggleIcon = folderElement.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.classList.remove('codicon-chevron-down');
                toggleIcon.classList.add('codicon-chevron-right');
            }
            
            if (childrenContainer) {
                childrenContainer.style.maxHeight = '0';
                childrenContainer.classList.remove('expanding');
            }
        }
    }
    
    selectFile(fileElement) {
        // Remove active class from all files
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected file
        fileElement.classList.add('active');
        this.activeFile = fileElement;
        
        // Get file data
        const contentId = fileElement.dataset.contentId;
        const fileName = fileElement.dataset.fileName;
        const language = fileElement.dataset.language;
        
        // Open tab and load content
        window.tabManager.openTab({
            id: contentId,
            label: fileName,
            language: language,
            contentId: contentId,
            url: fileElement.dataset.url || null
        });
        
        window.contentManager.loadContent(contentId, language);
    }
    
    getActiveFile() {
        return this.activeFile;
    }
    
    getAllFiles() {
        const files = [];
        const extractFiles = (items, parentPath = '') => {
            items.forEach(item => {
                if (item.type === 'file') {
                    files.push({
                        name: item.name,
                        path: `${parentPath}${item.name}`,
                        contentId: item.contentId,
                        language: item.language,
                        url: item.url || null
                    });
                } else if (item.children) {
                    extractFiles(item.children, `${parentPath}${item.name}/`);
                }
            });
        };
        extractFiles(this.files);
        return files;
    }

    highlightFileByContentId(contentId, fileName) {
        const items = document.querySelectorAll('.file-item');
        items.forEach((el) => el.classList.remove('active'));
        let target = Array.from(items).find((el) => el.dataset.contentId === String(contentId));
        if (!target && fileName) {
            target = Array.from(items).find((el) => el.dataset.fileName === String(fileName));
        }
        if (target) {
            target.classList.add('active');
            this.activeFile = target;
        } else {
            this.activeFile = null;
        }
    }

    clearSelection() {
        document.querySelectorAll('.file-item').forEach((el) => el.classList.remove('active'));
        this.activeFile = null;
    }
}
