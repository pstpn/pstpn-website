// Contact Page Content
export const contactContent = `
<div class="content-section line-numbers">
    <pre><code class="language-go">package main

import "time"

type ContactInfo struct {
	Email        string
	Location     string
	Online       bool
	ResponseTime time.Duration
}

func GetContactInfo() *ContactInfo {
	return &ContactInfo{
		Email:        "s@pstnv.ru",
		Location:     "Saint-Petersburg, Russia",
		Online:       true,
		ResponseTime: 24 * time.Hour,
	}
}
</code></pre>
</div>

<div class="content-section no-line-numbers">
    <h2 class="section-title">Get in touch</h2>
    <p class="section-description">
        I'm always interested in hearing about new projects and opportunities. 
        Whether you have a question or just want to say hi, feel free to reach out!
    </p>
    
    <div class="social-links">
        <a href="https://github.com/pstpn" target="_blank" rel="noopener" class="social-link">
            <div class="social-icon github">
                <i class="codicon codicon-github"></i>
            </div>
            <div class="social-info">
                <span class="social-title">GitHub</span>
                <span class="social-subtitle">@pstpn</span>
            </div>
        </a>
        
        <a href="mailto:s@pstnv.ru" class="social-link">
            <div class="social-icon email">
                <i class="codicon codicon-mail"></i>
            </div>
            <div class="social-info">
                <span class="social-title">Email</span>
                <span class="social-subtitle">s@pstnv.ru</span>
            </div>
        </a>
        
        <a href="https://career.habr.com/pstpn" target="_blank" rel="noopener" class="social-link">
            <div class="social-icon habr">
                <i class="codicon codicon-link"></i>
            </div>
            <div class="social-info">
                <span class="social-title">Habr career</span>
                <span class="social-subtitle">Stepan Postnov</span>
            </div>
        </a>
    </div>
</div>
`;

window.contactContent = contactContent;
