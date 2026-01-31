import { THEMES } from './themes.js';

// 1. Footer Component
export function getFooter() {
    return `
    <div class="py-12 text-center space-y-4 opacity-80 relative z-10 px-6">
        <div class="max-w-2xl mx-auto text-[10px] text-slate-400 leading-relaxed opacity-50">
            <h2 class="sr-only">About Pookie Quiz</h2>
            <p>
                Welcome to the <strong>Official Pookie Quiz</strong>, the viral <strong>Know Me Quiz</strong> taking over TikTok and Instagram. 
                Whether you want to test your <strong>best friends</strong>, challenge your <strong>besties or partners</strong>, 
                or send a hint to your <strong>crush</strong>, this interactive trivia maker is the perfect <strong>friendship test</strong>.
                Features include our exclusive <strong>Lie Detector Mode</strong>, custom questions, and instant compatibility results.
                Start your <strong>2026 Friendship Quiz</strong> today.
            </p>
        </div>

        <div class="flex justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <button onclick="openLegal('about')" class="hover:text-rose-500 transition-colors">About</button>
            <span>•</span>
            <button onclick="openLegal('terms')" class="hover:text-rose-500 transition-colors">Terms</button>
            <span>•</span>
            <button onclick="openLegal('privacy')" class="hover:text-rose-500 transition-colors">Privacy</button>
            <span>•</span>
            <button onclick="openLegal('contact')" class="hover:text-rose-500 transition-colors">Contact</button>
        </div>
        <p class="text-[10px] text-slate-400">© ${new Date().getFullYear()} KnowMe Pookie Edition. Crafted in Kashmir.</p>
    </div>`;
}

// 2. Zodiac Calculator
export function getZodiac(dateStr) {
    const parts = dateStr.split('-');
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    
    if((m==3 && d>=21)||(m==4 && d<=19)) return {n:'Aries', e:'Fire'};
    if((m==4 && d>=20)||(m==5 && d<=20)) return {n:'Taurus', e:'Earth'};
    if((m==5 && d>=21)||(m==6 && d<=20)) return {n:'Gemini', e:'Air'};
    if((m==6 && d>=21)||(m==7 && d<=22)) return {n:'Cancer', e:'Water'};
    if((m==7 && d>=23)||(m==8 && d<=22)) return {n:'Leo', e:'Fire'};
    if((m==8 && d>=23)||(m==9 && d<=22)) return {n:'Virgo', e:'Earth'};
    if((m==9 && d>=23)||(m==10 && d<=22)) return {n:'Libra', e:'Air'};
    if((m==10 && d>=23)||(m==11 && d<=21)) return {n:'Scorpio', e:'Water'};
    if((m==11 && d>=22)||(m==12 && d<=21)) return {n:'Sagittarius', e:'Fire'};
    if((m==12 && d>=22)||(m==1 && d<=19)) return {n:'Capricorn', e:'Earth'};
    if((m==1 && d>=20)||(m==2 && d<=18)) return {n:'Aquarius', e:'Air'};
    return {n:'Pisces', e:'Water'};
}

// 3. Theme Applicator
export const applyTheme = (vibe) => {
    const t = THEMES[vibe] || THEMES['🌙 Soft'];
    
    // Update Background
    const bgEl = document.querySelector('.animated-bg');
    if(bgEl) bgEl.style.background = t.bg;
    
    document.querySelector('.blob-1').style.background = t.blobs[0];
    document.querySelector('.blob-2').style.background = t.blobs[1];
    document.querySelector('.blob-3').style.background = t.blobs[2];

    // Create/Update Style Tag
    let styleTag = document.getElementById('theme-overrides');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'theme-overrides';
        document.head.appendChild(styleTag);
    }

    const isDark = vibe === '🔥 Spicy';

    styleTag.innerHTML = `
        .bg-slate-50\\/95 { background-color: ${isDark ? '#0f0f0f' : 'rgba(248, 250, 252, 0.95)'} !important; color: ${t.text} !important; }
        .glass-panel { background: ${t.glass} !important; border-color: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)'} !important; }
        .bg-white\\/50 { background-color: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.6)'} !important; border: ${isDark ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.6)'} !important; color: ${isDark ? '#fb7185' : (vibe === '🌙 Soft' ? '#e11d48' : t.text)} !important; backdrop-filter: blur(12px) !important; box-shadow: ${isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(255, 182, 193, 0.1)'} !important; }
        .bg-white\\/50 i, .bg-white\\/50 .lucide { color: ${isDark ? '#fb7185' : (vibe === '🌙 Soft' ? '#e11d48' : t.text)} !important; }
        .bg-slate-100 { background-color: ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#f1f5f9'} !important; color: ${isDark ? '#ffffff' : '#94a3b8'} !important; }
        .bg-white { background-color: ${isDark ? '#1a1a1a' : '#ffffff'} !important; color: ${t.text} !important; }
        .bg-white\\/90 { background-color: ${isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.9)'} !important; }
        .bg-slate-50 { background-color: ${isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} !important; border-color: ${isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9'} !important; }
        .bg-white\\/80 { background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'} !important; border: ${isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid transparent'} !important; color: ${isDark ? '#ffffff' : 'inherit'} !important; }
        .bg-white\\/60 { background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'} !important; border: ${isDark ? '1px solid rgba(255, 255, 255, 0.2)' : 'transparent'} !important; }
        .bg-white\\/40 { background-color: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)'} !important; }
        .text-slate-800, .text-slate-900, .text-slate-700 { color: ${t.text} !important; }
        .text-slate-500, .text-slate-400, .text-slate-600, .text-slate-300 { color: ${t.subtext} !important; }
        .text-rose-300 { color: ${isDark ? '#ffb3c1' : '#fda4af'} !important; }
        input, textarea { color: ${t.text} !important; }
        ::placeholder { color: ${t.subtext} !important; opacity: 0.7; }
        .btn-primary { background: ${t.accent} !important; color: white !important; }
        .group:hover .bg-slate-50 { background-color: ${isDark ? 'rgba(255,255,255,0.15)' : ''} !important; }
    `;
};

// --- NEW: Smart Script Loader (Lazy Loading) ---
export function loadScript(src) {
    return new Promise((resolve, reject) => {
        // 1. Check if it's already on the page
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve(); // Already loaded, good to go!
            return;
        }
        
        // 2. If not, download it now
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        // 3. Resolve the promise when done
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        
        document.body.appendChild(script);
    });
}

