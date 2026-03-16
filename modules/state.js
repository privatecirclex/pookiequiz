import { DEFAULT_STATE, STORAGE_KEY } from './constants.js';

// Using 'const' here is a senior dev trick. 
// It keeps the memory reference stable so other files can update the properties safely.
export const state = { ...DEFAULT_STATE };

export function loadLocalState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Object.assign safely updates the existing state object without overwriting the connection
            Object.assign(state, { 
                ...DEFAULT_STATE, 
                ...parsed, 
                isLoading: false, 
                showTemplateModal: false, 
                showProfileEditor: false, 
                showDashboardConfirm: false 
            });
        }
    } catch (e) { console.error(e); }
}

export function saveState() { 
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} 
}


