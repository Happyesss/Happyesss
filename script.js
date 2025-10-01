// Developer Profile Interactive Features
class DeveloperProfile {
    constructor() {
        this.apiKey = 'AIzaSyDaC0-5goTfVqcKxBJ5UkF2_UNHxt-K5nI';
        this.init();
    }

    init() {
        this.addInteractiveFeatures();
        this.setupEventListeners();
        this.animateElements();
        console.log('🚀 Developer Profile Loaded!');
    }

    addInteractiveFeatures() {
        // Add dynamic typing effect to title
        this.typeWriter();
        
        // Add skill hover effects
        this.enhanceSkills();
        
        // Add project interactions
        this.enhanceProjects();
    }

    typeWriter() {
        const titles = [
            'Senior Software Development Engineer',
            'Full Stack Developer',
            'AI & ML Enthusiast',
            'Open Source Contributor',
            'System Design Expert'
        ];
        
        const titleElement = document.querySelector('.title');
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentTitle = titles[titleIndex];
            
            if (isDeleting) {
                titleElement.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
            } else {
                titleElement.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentTitle.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typeSpeed = 500; // Pause before starting new title
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }

    enhanceSkills() {
        const skills = document.querySelectorAll('.skill');
        skills.forEach((skill, index) => {
            skill.style.animationDelay = `${index * 0.1}s`;
            skill.classList.add('animate-skill');
            
            skill.addEventListener('click', () => {
                this.showSkillDetails(skill.textContent);
            });
        });
    }

    enhanceProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            
            // Add click to expand functionality
            card.addEventListener('click', () => {
                this.expandProject(card);
            });
        });
    }

    async showSkillDetails(skill) {
        const modal = this.createModal(`
            <h3>💡 ${skill}</h3>
            <div class="loading">🤖 AI is analyzing this skill...</div>
        `);

        try {
            const response = await this.askGemini(`Tell me about ${skill} in software development. Keep it concise and practical.`);
            const content = modal.querySelector('.loading');
            content.innerHTML = `
                <div class="ai-response">
                    <strong>🎯 ${skill} Overview:</strong><br>
                    ${response.replace(/\n/g, '<br>')}
                </div>
            `;
        } catch (error) {
            modal.querySelector('.loading').innerHTML = `
                <div class="error">❌ AI temporarily unavailable. 
                ${skill} is one of my core competencies!</div>
            `;
        }
    }

    expandProject(card) {
        const projectName = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        
        const modal = this.createModal(`
            <h3>🚀 ${projectName}</h3>
            <p>${description}</p>
            <div class="project-details">
                <h4>🤖 AI Analysis:</h4>
                <div class="loading">Analyzing project architecture...</div>
            </div>
        `);

        this.analyzeProject(projectName, modal);
    }

    async analyzeProject(projectName, modal) {
        try {
            const prompt = `Analyze the project "${projectName}" and provide insights about its technical challenges, architecture, and impact. Keep it professional and concise.`;
            const response = await this.askGemini(prompt);
            
            const loadingDiv = modal.querySelector('.loading');
            loadingDiv.innerHTML = `
                <div class="ai-response">
                    ${response.replace(/\n/g, '<br>')}
                </div>
                <button class="view-code-btn" onclick="profile.showCodeExample('${projectName}')">
                    👁️ View Code Example
                </button>
            `;
        } catch (error) {
            modal.querySelector('.loading').innerHTML = `
                <div class="error">❌ Analysis unavailable. This project showcases my technical expertise!</div>
            `;
        }
    }

    async showCodeExample(projectName) {
        const modal = this.createModal(`
            <h3>💻 ${projectName} - Code Example</h3>
            <div class="code-container">
                <div class="loading">🤖 Generating code example...</div>
            </div>
        `);

        try {
            const prompt = `Generate a realistic code snippet that could be from the "${projectName}" project. Make it TypeScript/JavaScript, well-commented, and showcase good practices. Keep it under 15 lines.`;
            const response = await this.askGemini(prompt);
            
            const codeContainer = modal.querySelector('.code-container');
            codeContainer.innerHTML = `
                <pre class="code-example">${this.escapeHtml(response)}</pre>
                <button class="copy-btn" onclick="profile.copyCode(this)">📋 Copy Code</button>
            `;
        } catch (error) {
            modal.querySelector('.code-container').innerHTML = `
                <div class="error">❌ Code example unavailable. Check out my GitHub for real examples!</div>
            `;
        }
    }

    async askGemini(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response from AI');
        }
    }

    createModal(content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    copyCode(button) {
        const code = button.previousElementSibling.textContent;
        navigator.clipboard.writeText(code).then(() => {
            button.textContent = '✅ Copied!';
            setTimeout(() => {
                button.textContent = '📋 Copy Code';
            }, 2000);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupEventListeners() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay');
                if (modal) modal.remove();
            }
        });

        // Add scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    animateElements() {
        // Add animation classes to elements
        const style = document.createElement('style');
        style.textContent = `
            .animate-skill {
                animation: bounceIn 0.6s ease-out forwards;
                opacity: 0;
            }
            
            @keyframes bounceIn {
                0% { opacity: 0; transform: scale(0.3); }
                50% { opacity: 1; transform: scale(1.05); }
                100% { opacity: 1; transform: scale(1); }
            }
            
            .animate-in {
                animation: slideUpFade 0.8s ease-out;
            }
            
            @keyframes slideUpFade {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease-out;
            }
            
            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                animation: slideIn 0.3s ease-out;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            
            .ai-response {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
                margin: 10px 0;
            }
            
            .code-example {
                background: #1e1e1e;
                color: #d4d4d4;
                padding: 15px;
                border-radius: 8px;
                overflow-x: auto;
                font-family: 'Fira Code', monospace;
                font-size: 14px;
            }
            
            .copy-btn, .view-code-btn {
                background: #667eea;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin: 10px 5px 0 0;
                transition: background 0.3s;
            }
            
            .copy-btn:hover, .view-code-btn:hover {
                background: #5a67d8;
            }
            
            .loading {
                text-align: center;
                color: #666;
                font-style: italic;
                padding: 20px;
            }
            
            .error {
                color: #e53e3e;
                text-align: center;
                padding: 15px;
                background: #fed7d7;
                border-radius: 8px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-50px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the profile when DOM is loaded
let profile;
document.addEventListener('DOMContentLoaded', () => {
    profile = new DeveloperProfile();
});

// Export for global access
window.profile = profile;