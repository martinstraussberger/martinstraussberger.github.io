// Like System using Supabase
class LikeSystem {
    constructor() {
        // Get Supabase config from external file
        const config = window.SupabaseConfig.get();
        this.supabaseUrl = config.url;
        this.supabaseKey = config.anonKey;
        
        this.likeCache = new Map();
        this.userFingerprint = this.generateFingerprint();
        this.init();
    }

    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Like fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        return this.hashCode(fingerprint);
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    async init() {
        await this.loadLikeCounts();
        this.renderLikeButtons();
    }

    async refresh() {
        // Reload like counts from Supabase before rendering buttons
        await this.loadLikeCounts();
        this.renderLikeButtons();
    }

    async apiRequest(endpoint, options = {}) {
        const url = `${this.supabaseUrl}/rest/v1/${endpoint}`;
        const headers = {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Supabase API error:', error);
            return null;
        }
    }

    async loadLikeCounts() {
        console.log('LikeSystem: Loading like counts from Supabase...');
        const result = await this.apiRequest('likes');
        if (result) {
            result.forEach(item => {
                console.log(`LikeSystem: Loaded ${item.item_id}: ${item.like_count} likes`);
                this.likeCache.set(item.item_id, item.like_count);
            });
            console.log(`LikeSystem: Successfully loaded ${result.length} like counts`);
        } else {
            console.log('LikeSystem: Failed to load like counts from Supabase');
        }
    }

    getLikeCount(itemId) {
        return this.likeCache.get(itemId) || 0;
    }

    async hasUserLiked(itemId) {
        const result = await this.apiRequest(
            `user_likes?item_id=eq.${itemId}&user_fingerprint=eq.${this.userFingerprint}`
        );
        return result && result.length > 0;
    }

    async addLike(itemId) {
        if (await this.hasUserLiked(itemId)) return false;

        const userLike = await this.apiRequest('user_likes', {
            method: 'POST',
            body: JSON.stringify({
                item_id: itemId,
                user_fingerprint: this.userFingerprint,
                created_at: new Date().toISOString()
            })
        });

        if (userLike) {
            const currentCount = this.getLikeCount(itemId);
            const newCount = currentCount + 1;
            
            // Update existing record using PATCH
            const updateResult = await this.apiRequest(`likes?item_id=eq.${itemId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    like_count: newCount,
                    updated_at: new Date().toISOString()
                })
            });

            console.log(`LikeSystem: Updated like count for ${itemId} to ${newCount}`);
            // Update cache
            this.likeCache.set(itemId, newCount);
            this.updateLikeButton(itemId, newCount, true);
            return true;
        }
        return false;
    }

    async removeLike(itemId) {
        const result = await this.apiRequest(
            `user_likes?item_id=eq.${itemId}&user_fingerprint=eq.${this.userFingerprint}`,
            { method: 'DELETE' }
        );

        if (result !== null) {
            const currentCount = this.getLikeCount(itemId);
            const newCount = Math.max(0, currentCount - 1);
            
            // Update existing record using PATCH
            await this.apiRequest(`likes?item_id=eq.${itemId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    like_count: newCount,
                    updated_at: new Date().toISOString()
                })
            });

            console.log(`LikeSystem: Updated like count for ${itemId} to ${newCount}`);
            this.likeCache.set(itemId, newCount);
            this.updateLikeButton(itemId, newCount, false);
            return true;
        }
        return false;
    }

    async toggleLike(itemId) {
        const hasLiked = await this.hasUserLiked(itemId);
        return hasLiked ? await this.removeLike(itemId) : await this.addLike(itemId);
    }

    updateLikeButton(itemId, count, isLiked) {
        const button = document.querySelector(`[data-like-id="${itemId}"]`);
        if (button) {
            const heartIcon = button.querySelector('.heart-icon');
            const countSpan = button.querySelector('.like-count');
            
            heartIcon.textContent = isLiked ? '❤️' : '🤍';
            heartIcon.style.color = isLiked ? '#ff6b6b' : '#6b7280';
            countSpan.textContent = count || 0;
            button.classList.toggle('liked', isLiked);
            
            button.style.transform = 'scale(1.1)';
            setTimeout(() => button.style.transform = 'scale(1)', 150);
        }
    }

    async renderLikeButtons() {
        const cards = document.querySelectorAll('[data-item-id]');
        console.log(`LikeSystem: Rendering buttons for ${cards.length} cards`);
        
        for (const card of cards) {
            const itemId = card.dataset.itemId;
            const likeCount = this.getLikeCount(itemId);
            console.log(`LikeSystem: Card ${itemId} - cached count: ${likeCount}`);
            const hasLiked = await this.hasUserLiked(itemId);
            
            const likeButton = this.createLikeButton(itemId, likeCount, hasLiked);
            
            const container = card.querySelector('.like-button-container');
            const footer = card.querySelector('.blog-footer');
            
            if (container && !container.querySelector('.like-button')) {
                container.appendChild(likeButton);
            } else if (footer && !footer.querySelector('.like-button')) {
                footer.appendChild(likeButton);
            }
        }
    }

    createLikeButton(itemId, count, isLiked) {
        const button = document.createElement('button');
        button.className = 'like-button';
        button.setAttribute('data-like-id', itemId);
        button.setAttribute('aria-label', `Like this ${isLiked ? '(liked)' : ''}`);
        
        if (isLiked) button.classList.add('liked');
        
        button.innerHTML = `
            <span class="heart-icon" style="color: ${isLiked ? '#ff6b6b' : '#6b7280'}">
                ${isLiked ? '❤️' : '🤍'}
            </span>
            <span class="like-count">${count || 0}</span>
        `;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleLike(itemId);
        });
        
        return button;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.likeSystem = new LikeSystem(), 100);
    });
} else {
    setTimeout(() => window.likeSystem = new LikeSystem(), 100);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LikeSystem;
}
