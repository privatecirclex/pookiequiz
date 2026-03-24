import { state, saveState } from './state.js';
import { getViewHtml } from './views.js';
import { renderModals } from './modals.js';
import { Sound } from './sound.js';
import { applyTheme } from './helpers.js';

// --- RENDERER ---
        export function render() {
            saveState();
            applyTheme(state.profile.vibe);
            const root = document.getElementById('app');
            
            // Loader
            const existingLoader = document.getElementById('loader-overlay');
            if (state.isLoading) {
                if (!existingLoader) {
                    const loader = document.createElement('div');
                    loader.id = 'loader-overlay';
                    loader.className = 'fixed inset-0 z-[9999] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in';
                    loader.innerHTML = `
                        <div class="animate-bounce mb-4 text-rose-500">
                             <i data-lucide="loader-2" class="animate-spin" size="40"></i>
                        </div>
                        <h2 class="text-lg font-bold text-rose-900 tracking-tight animate-pulse">${state.loadingText}</h2>
                    `;
                    document.body.appendChild(loader);
                    lucide.createIcons();
                }
            } else if (existingLoader) existingLoader.remove();

            // Sound Toggle
            const soundBtn = (state.view === 'create' || state.view === 'dashboard') ? '' : `
    <button onclick="toggleSound()" class="fixed top-6 right-6 z-[4000] p-3 glass-panel rounded-full text-rose-400 hover:text-rose-600 hover:scale-110 transition-transform">
        <i data-lucide="${Sound.enabled ? 'volume-2' : 'volume-x'}" size="20"></i>
    </button>
`;

            const html = getViewHtml(state, soundBtn);
            
            root.innerHTML = html;
            renderModals(root, state);
            lucide.createIcons();
        }

