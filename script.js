        import { db, auth, doc, setDoc, getDoc, collection, addDoc, onSnapshot, updateDoc, arrayUnion, query, where, getDocs, orderBy, signInAnonymously } from './modules/firebase.js';

        import { QUIZ_TEMPLATES } from './modules/questions.js';
        import { THEMES } from './modules/themes.js';
        import { Sound } from './modules/sound.js';
        import { DEFAULT_STATE, STORAGE_KEY, MODES } from './modules/constants.js';
        import { getFooter, getZodiac, applyTheme, loadScript } from './modules/helpers.js';
        let state = { ...DEFAULT_STATE };
      function loadLocalState() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    state = { ...DEFAULT_STATE, ...parsed, isLoading: false, showTemplateModal: false, showProfileEditor: false, showDashboardConfirm: false };
                }
            } catch (e) { console.error(e); }
        }
        function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }

        // --- RENDERER ---
        function render() {
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
            const soundBtn = `
                <button onclick="toggleSound()" class="fixed top-6 right-6 z-[4000] p-3 glass-panel rounded-full text-rose-400 hover:text-rose-600 hover:scale-110 transition-transform">
                    <i data-lucide="${Sound.enabled ? 'volume-2' : 'volume-x'}" size="20"></i>
                </button>
            `;

            let html = '';

            switch(state.view) {
                                case 'landing':
                    html = `
                    <div class="no-scroll justify-center p-6 text-center">
                        <div class="w-full max-w-sm space-y-8 animate-enter">
                            <div class="relative inline-block animate-float-slow">
                                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl transform rotate-3 border-2 border-white">
                                    <span class="text-7xl">🍬</span>
                                </div>
                                <div class="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg animate-bounce text-2xl">✨</div>
                            </div>
                            
                            <div class="space-y-4">
                                <h1 class="text-5xl font-black text-slate-800 leading-[0.9] tracking-tight">
                                    How well do your<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500 italic pr-2">pookies</span><br/>know you?
                                </h1>
                                <p class="text-slate-500 font-bold text-sm">Create your own pookie quiz to test your real ones. 🎀</p>
                            </div>

                            <button onclick="handleStartOwnQuiz()" class="w-full py-4 text-lg btn-primary rounded-pookie font-bold tracking-wide shadow-xl group relative overflow-hidden">
                                <span class="relative z-10 flex items-center justify-center gap-2">Let's Start <i data-lucide="arrow-right" size="18"></i></span>
                            </button>
                        </div>

                            <div class="pt-8 opacity-50 animate-pulse">
                                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Scroll for Tea</p>
                                <i data-lucide="chevron-down" class="mx-auto text-slate-400"></i>
                            </div>
                        </div>

                        <div class="w-full max-w-md mx-auto space-y-12 pb-10 text-left">
                            
                            <div class="space-y-2 px-2">
                                <h2 class="text-2xl font-black text-slate-800">Stop Guessing. <span class="text-rose-400">Start Testing.</span></h2>
                                <p class="text-sm font-bold text-slate-500 leading-relaxed">
                                    Friendships and relationships are built on understanding. But do they actually remember your favorite food? Or your biggest fear? 
                                    <span class="text-slate-800">KnowMe Pookie Edition</span> reveals the truth.
                                </p>
                            </div>

                            <div class="grid grid-cols-1 gap-4">
                                <div class="glass-panel p-6 rounded-[2rem] flex items-start gap-4 border-2 border-white hover:scale-[1.02] transition-transform">
                                    <div class="bg-rose-100 text-rose-500 p-3 rounded-2xl">
                                        <i data-lucide="siren" size="24"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black text-slate-800 text-lg">Panic Mode 🚨</h3>
                                        <p class="text-xs font-bold text-slate-500 mt-1">
                                            Our unique algorithm detects hesitation. If they take too long to answer, we roast them. Instantly.
                                        </p>
                                    </div>
                                </div>

                                <div class="glass-panel p-6 rounded-[2rem] flex items-start gap-4 border-2 border-white hover:scale-[1.02] transition-transform">
                                    <div class="bg-purple-100 text-purple-500 p-3 rounded-2xl">
                                        <i data-lucide="sparkles" size="24"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black text-slate-800 text-lg">Vibe Check ✨</h3>
                                        <p class="text-xs font-bold text-slate-500 mt-1">
                                            Are you soulmates or just acquaintances? Get a precise compatibility score based on real data.
                                        </p>
                                    </div>
                                </div>

                                <div class="glass-panel p-6 rounded-[2rem] flex items-start gap-4 border-2 border-white hover:scale-[1.02] transition-transform">
                                    <div class="bg-emerald-100 text-emerald-500 p-3 rounded-2xl">
                                        <i data-lucide="lock" size="24"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black text-slate-800 text-lg">Secret Rewards 🔒</h3>
                                        <p class="text-xs font-bold text-slate-500 mt-1">
                                            Hide a secret message that only unlocks if they get a high score. Make them earn it.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="px-4">
                                <h2 class="text-xl font-black text-slate-800 mb-6 text-center">How It Works 🛠️</h2>
                                <div class="space-y-6 relative">
                                    <div class="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-rose-200 to-purple-200"></div>

                                    <div class="relative flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-full bg-white border-4 border-rose-200 relative z-10 flex items-center justify-center font-black text-xs text-rose-500">1</div>
                                        <p class="text-sm font-bold text-slate-600">Create your custom quiz profile.</p>
                                    </div>
                                    <div class="relative flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-full bg-white border-4 border-purple-200 relative z-10 flex items-center justify-center font-black text-xs text-purple-500">2</div>
                                        <p class="text-sm font-bold text-slate-600">Share the link on your Story or Chat.</p>
                                    </div>
                                    <div class="relative flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-full bg-white border-4 border-emerald-200 relative z-10 flex items-center justify-center font-black text-xs text-emerald-500">3</div>
                                        <p class="text-sm font-bold text-slate-600">See the results & who knows you best.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="text-center pt-4">
                                <button onclick="handleStartOwnQuiz()" class="px-8 py-3 bg-slate-800 text-white rounded-full font-black text-sm hover:scale-105 transition-transform shadow-lg">
                                    Create My Quiz Now
                                </button>
                            </div>

                        </div>
                ${getFooter()} 
                        ${soundBtn}
                    </div>`;
                    break;


                case 'auth':
    html = `
    <div class="no-scroll justify-center p-6">
        <div class="w-full max-w-sm animate-enter">
            <div class="text-center mb-8">
                <div class="inline-flex p-4 glass-panel rounded-full mb-4 text-rose-400">
                    <i data-lucide="sparkles" size="32"></i>
                </div>
                <h2 class="text-3xl font-black text-slate-800">Welcome Back 🧸</h2>
            </div>
            
            <div class="relative group">
                <div class="absolute inset-0 z-20 flex items-center justify-center">
                    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl transform -rotate-6 border-4 border-slate-800 text-center max-w-[200px]">
                        <div class="text-4xl mb-2">🚧</div>
                        <p class="font-black text-slate-800 text-lg leading-tight">Login Machine under construction</p>
                        <p class="text-xs font-bold text-slate-500 mt-1">Dev is napping. Use guest mode!</p>
                    </div>
                </div>

                <div class="glass-panel p-8 rounded-pookie space-y-5 blur-[4px] opacity-60 pointer-events-none grayscale select-none">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Email</label>
                        <input type="email" value="pookie@sleepy.com" class="w-full p-4 bg-white/50 rounded-2xl border-2 border-transparent outline-none font-bold text-slate-700">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Password</label>
                        <input type="password" value="********" class="w-full p-4 bg-white/50 rounded-2xl border-2 border-transparent outline-none font-bold text-slate-700">
                    </div>
                    <button class="w-full py-4 bg-slate-200 text-slate-400 rounded-2xl font-bold text-lg shadow-none">Login ✨</button>
                </div>
            </div>

            <div class="mt-8 space-y-4">
                <button onclick="handleGuestMode()" class="w-full py-5 bg-sky-100 text-sky-500 border-4 border-dashed border-sky-300 rounded-[2.5rem] font-black text-xl shadow-lg hover:scale-105 hover:rotate-1 transition-all flex items-center justify-center gap-3 animate-pulse group">
                    <span class="group-hover:scale-125 transition-transform">👻</span> 
                    <span>Continue as Guest</span>
                    <span class="group-hover:scale-125 transition-transform">👻</span>
                </button>
                
                <button onclick="handleNewProfile()" class="w-full py-4 btn-secondary rounded-2xl font-bold text-rose-400 text-sm">
                    Or start fresh (New Profile) 🎀
                </button>
            </div>
        </div>
        ${soundBtn}
    </div>`;
    break;


                                case 'profile':
                    html = `
                    <div class="no-scroll justify-center p-6">
                        <div class="w-full max-w-md">
                            
                            <div class="flex items-center gap-3 mb-6">
                                <button onclick="setView('auth')" class="p-3 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 shadow-sm hover:text-rose-500 hover:scale-110 transition-all border-2 border-transparent hover:border-rose-100">
                                    <i data-lucide="arrow-left" size="24"></i>
                                </button>
                                <div>
                                    <h2 class="text-3xl font-black text-slate-800 leading-none">Your Era ✨</h2>
                                    <p class="text-slate-500 font-bold text-sm mt-1">Let's personalize your vibe.</p>
                                </div>
                            </div>
                            
                            <div class="glass-panel p-6 rounded-pookie space-y-5">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">what do your pookies call you?🧸</label>
                                    <input type="text" id="prof-name" value="${state.profile.name}" oninput="setProfileName(this.value)" class="w-full p-4 bg-white/50 rounded-2xl border border-white focus:border-rose-300 outline-none font-bold text-slate-700 text-lg" placeholder="e.g. Star Girl">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Birthday</label>
                                    <input type="date" id="prof-dob" value="${state.profile.dob}" onchange="handleZodiacCalc(this.value)" class="w-full p-4 bg-white/50 rounded-2xl border border-white focus:border-rose-300 outline-none font-bold text-slate-700">
                                    ${state.profile.zodiac ? `
                                        <div class="animate-bounce mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-rose-100 text-slate-600 rounded-full text-xs font-black border border-white">
                                            <span>${state.profile.zodiac}</span> <span class="opacity-50">•</span> <span>${state.profile.element} Baby</span>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Current Vibe</label>
                                    <div class="grid grid-cols-3 gap-2">
                                        ${['🌙 Soft', '☀️ Glow', '🌸 Cozy', '🔥 Spicy', '🦋 Free', '🫧 Clean'].map(v => `
                                            <button onclick="updateVibe('${v}')" class="py-3 px-1 text-[10px] font-bold rounded-xl transition-all ${state.profile.vibe === v ? 'bg-rose-400 text-white shadow-md scale-105' : 'bg-white/50 text-slate-400 hover:bg-white'}">${v}</button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            <button onclick="saveProfile()" class="w-full py-5 btn-primary rounded-pookie font-bold text-xl shadow-xl mt-6">Continue 🎀</button>
                        </div>
                        ${soundBtn}
                    </div>`;
                    break;


                case 'create':
                    html = `
                    <div class="no-scroll p-4 items-center">
                        <div class="w-full max-w-md flex flex-col h-full relative z-10 pb-28">
                            <div class="glass-panel p-4 rounded-[2rem] flex items-center justify-between mb-6">
                                <div class="flex items-center space-x-3 cursor-pointer" onclick="openProfileEditor()">
                                    <div class="w-12 h-12 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white">
                                        ${state.profile.emoji || '🧸'}
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black text-rose-400 uppercase tracking-wider">Creator</p>
                                        <p class="text-lg font-black text-slate-800 leading-none">${state.profile.name}</p>
                                    </div>
                                </div>
                               <div class="flex gap-2">
    <button onclick="openVibePicker()" class="p-2.5 bg-white/50 hover:bg-white rounded-full text-rose-400 transition-colors animate-pulse"><i data-lucide="palette" size="20"></i></button>
    
    <button onclick="openDashboardConfirm()" class="p-2.5 bg-white/50 hover:bg-white rounded-full text-rose-400 transition-colors"><i data-lucide="layout-dashboard" size="20"></i></button>
    <button onclick="handleLogout()" class="p-2.5 bg-white/50 hover:bg-white rounded-full text-rose-400 transition-colors"><i data-lucide="log-out" size="20"></i></button>
</div>

                            </div>

                            <div class="grid grid-cols-3 gap-3 mb-8">
                                ${Object.keys(MODES).map(key => `
                                    <button onclick="setMode('${key}')" 
                                        class="p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${state.selectedMode === key ? 'glass-panel border-rose-300 ring-2 ring-rose-200 ring-offset-2 scale-105' : 'bg-white/30 hover:bg-white/50 border border-transparent'}">
                                        <div class="text-2xl mb-1">${MODES[key].emoji}</div>
                                        <span class="text-[10px] font-black uppercase text-slate-600">${MODES[key].label}</span>
                                    </button>
                                `).join('')}
                            </div>

                                                        <div class="flex-1 space-y-5">
                                

                                <div class="text-center px-4">

                                    <h2 class="text-2xl font-black text-slate-800">Spill the Tea ☕️</h2>
                                    <p class="text-slate-500 text-xs font-bold">What should your ${MODES[state.selectedMode].label} know?</p>
                                </div>
                                                
                                
                                <div id="questionsList" class="space-y-4">
                                    ${state.questions.length === 0 ? `
                                        <div class="py-10 text-center opacity-40">
                                            <i data-lucide="sparkles" class="mx-auto mb-2 text-rose-300" size="32"></i>
                                            <p class="text-sm font-bold text-rose-900">It's empty here...<br>Add some drama!</p>
                                        </div>
                                    ` : ''}
                                    ${state.questions.map((q, idx) => `
                                        <div class="glass-panel p-5 rounded-[1.5rem] relative group transition-all hover:scale-[1.01]">
                                            <button onclick="removeQuestion(${idx})" class="absolute top-3 right-3 text-rose-300 hover:text-rose-500 p-1"><i data-lucide="x" size="18"></i></button>
                                            
                                            <div class="flex justify-between items-center pr-8 mb-2">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-black text-rose-500 border border-rose-200">${idx + 1}</div>
                                                    <button onclick="openTemplatePicker(${idx})" class="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-400 text-[9px] font-black rounded-full border border-indigo-100 hover:scale-105 transition-transform">✨ TEMPLATES</button>
                                                </div>
                                                <label class="flex items-center cursor-pointer gap-2">
                                                    <span class="text-[9px] font-black text-slate-400 uppercase">Multi Choice</span>
                                                    <div class="w-8 h-4 rounded-full ${q.isMultipleChoice ? 'bg-rose-400' : 'bg-slate-200'} relative transition-colors">
                                                        <div class="w-2 h-2 bg-white rounded-full absolute top-1 transition-all ${q.isMultipleChoice ? 'left-5' : 'left-1'}"></div>
                                                    </div>
                                                    <input type="checkbox" ${q.isMultipleChoice ? 'checked' : ''} onchange="toggleMultipleChoice(${idx})" class="hidden">
                                                </label>
                                            </div>

                                            <input type="text" placeholder="e.g. My toxic trait? 💀" value="${q.question || ''}" 
                                                oninput="updateQuestion(${idx}, 'question', this.value)"
                                                class="w-full font-bold text-slate-800 placeholder-slate-300 outline-none bg-transparent text-lg border-b-2 border-slate-100 focus:border-rose-300 py-2 transition-colors">
                                            
                                            ${!q.isMultipleChoice ? `
                                                <input type="text" placeholder="The correct answer..." value="${q.correctAnswer || ''}"
                                                    oninput="updateQuestion(${idx}, 'correctAnswer', this.value)"
                                                    class="w-full mt-3 p-3 bg-white/60 rounded-xl text-sm font-bold text-rose-600 outline-none border border-transparent focus:border-rose-200 focus:bg-white transition-all">
                                            ` : `
                                                <div class="space-y-2 mt-3 pl-1">
                                                    ${q.options.map((opt, optIdx) => `
                                                        <div class="flex gap-2 items-center">
                                                            <div onclick="setCorrectAnswer(${idx}, '${opt}')" class="w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${q.correctAnswer === opt && opt !== '' ? 'border-rose-500 bg-rose-500' : 'border-slate-300 bg-white'}">
                                                                ${q.correctAnswer === opt && opt !== '' ? '<div class="w-2 h-2 bg-white rounded-full"></div>' : ''}
                                                            </div>
                                                            <input type="text" placeholder="Option ${optIdx + 1}" value="${opt}"
                                                                oninput="updateOption(${idx}, ${optIdx}, this.value)"
                                                                class="flex-1 p-2 bg-white/40 rounded-lg text-xs font-bold text-slate-600 outline-none border border-transparent focus:bg-white focus:border-rose-200 transition-all">
                                                            ${q.options.length > 2 ? `<button onclick="removeOption(${idx}, ${optIdx})" class="text-slate-300 hover:text-rose-400"><i data-lucide="minus" size="14"></i></button>` : ''}
                                                        </div>
                                                    `).join('')}
                                                    ${q.options.length < 4 ? `
                                                        <button onclick="addOption(${idx})" class="text-[10px] font-black text-rose-400 flex items-center gap-1 mt-2 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors w-fit border border-rose-100 bg-white/50">
                                                            <i data-lucide="plus" size="10"></i> Add Option
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            `}
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <button onclick="addQuestion()" class="w-full py-4 border-2 border-dashed border-rose-200 rounded-[2rem] text-rose-400 font-bold flex items-center justify-center gap-2 hover:bg-rose-50/50 hover:border-rose-300 transition-all group">
                                    <div class="bg-rose-100 p-1 rounded-full group-hover:rotate-90 transition-transform"><i data-lucide="plus" size="16"></i></div>
                                    <span>Add Question</span>
                                </button>
                            </div>

                            <div class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/90 via-white/50 to-transparent z-20 flex justify-center pointer-events-none">
                                <button onclick="handleShowPreview()" class="pointer-events-auto w-full max-w-md py-4 btn-primary rounded-full font-bold text-lg shadow-xl transform transition active:scale-95 flex items-center justify-center gap-2">
                                    Create Link 🪄
                                </button>
                            </div>
                        </div>
                        ${soundBtn}
                    </div>`;
                    break;

                                case 'preview':
                    html = `
                    <div class="no-scroll items-center p-6">
                        <div class="w-full max-w-md space-y-6 pb-32">

                            <div class="flex items-center gap-3 mb-4">
                                <button onclick="setView('create')" class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500 transition-colors"><i data-lucide="arrow-left" size="20"></i></button>
                                <h2 class="text-2xl font-black text-slate-800">Final Look ✨</h2>
                            </div>
                
                                            <div class="glass-panel p-4 rounded-[1.5rem] flex items-center justify-between mb-4 border-2 ${state.lieDetector ? 'border-rose-400 bg-rose-50/50' : 'border-transparent'} transition-all">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full ${state.lieDetector ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'} flex items-center justify-center transition-colors">
                                        <i data-lucide="siren" size="20"></i>
                                    </div>
                                    <div class="text-left">
                                        <h3 class="font-black text-slate-800 text-sm">Panic Mode 🚨</h3>
                                        <p class="text-[10px] font-bold text-slate-400 max-w-[180px] leading-tight">Detects hesitation. If they slow down, they get roasted! 😈</p>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" onchange="toggleLieDetector()" ${state.lieDetector ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                </label>
                            </div>

                            
                            <div class="space-y-3">
                                ${state.questions.map((q, idx) => `
                                    <div class="glass-panel p-4 rounded-[1.5rem] flex justify-between items-center">
                                        <div class="overflow-hidden">
                                            <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Q${idx + 1}</p>
                                            <p class="font-bold text-slate-700 truncate">${q.question || '...'}</p>
                                        </div>
                                        <button onclick="editQuestion(${idx})" class="text-slate-300 p-2 hover:text-rose-500"><i data-lucide="pencil" size="16"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="glass-panel p-5 rounded-[1.5rem] mb-3">
                                <label class="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-2 ml-1">
                                    <i data-lucide="message-circle-heart" size="14"></i>
                                    Intro Message (Public)
                                </label>
                                <input type="text" 
                                    oninput="updateQuizConfig('message', this.value)" 
                                    class="w-full bg-white/60 p-3 rounded-xl font-bold text-slate-700 outline-none text-sm placeholder:text-slate-300 focus:bg-white transition-all border border-transparent focus:border-rose-200"
                                    placeholder="e.g. Good luck pookie! Don't embarrass me. 💅"
                                    value="${state.message || ''}">
                            </div>

                
                            <div class="glass-panel p-5 rounded-[1.5rem] border-2 border-dashed border-purple-200 bg-purple-50/50">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center gap-2">
                                        <div class="bg-purple-100 text-purple-500 p-1.5 rounded-lg"><i data-lucide="lock" size="16"></i></div>
                                        <div>
                                            <h3 class="font-black text-slate-700 text-sm uppercase tracking-wide">Locked Tea 🔒</h3>
                                            <p class="text-[10px] font-bold text-purple-400">Unlock at: <span id="lock-display-final">${Math.min(state.secretCount || state.questions.length, state.questions.length)}</span>/${state.questions.length} correct</p>
                                        </div>
                                    </div>
                                    <input type="range" min="1" max="${Math.max(1, state.questions.length)}" step="1" 
                                        value="${Math.min(state.secretCount || state.questions.length, state.questions.length)}" 
                                        oninput="document.getElementById('lock-display-final').innerText = this.value; updateQuizConfig('secretCount', this.value)"
                                        class="w-24 accent-purple-500 cursor-pointer">
                                </div>
                                <textarea oninput="updateQuizConfig('secretMessage', this.value)" 
                                    class="w-full p-4 rounded-xl border-none font-bold text-slate-700 text-sm bg-white/60 focus:bg-white focus:ring-2 ring-purple-200 outline-none transition-all placeholder:text-slate-300" 
                                    rows="3" placeholder="e.g. If you get ${state.secretCount || state.questions.length} right, I'll tell you my top secret... 🤫">${state.secretMessage || ''}</textarea>
                            </div>
                            
                            <div class="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-30">
                                <button onclick="confirmFinalCreation()" class="w-full py-5 btn-primary rounded-full font-bold text-xl shadow-xl">Confirm & Share 🚀</button>
                            </div>
                        </div>
                        ${soundBtn}
                    </div>`;
                    break;


                case 'share':
                    html = `
                    <div class="no-scroll items-center justify-center p-6 text-center">
                        <div class="w-full max-w-sm relative mt-8 animate-enter">
                            <div class="glass-panel p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
                                <div class="absolute -top-10 -right-10 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-50"></div>
                                <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
                                
                                <div class="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-full mx-auto flex items-center justify-center shadow-lg animate-bounce">
                                    <i data-lucide="heart-handshake" size="40"></i>
                                </div>
                                
                                <div class="space-y-2">
                                    <h2 class="text-3xl font-black text-slate-800">It's Ready! 🎀</h2>
                                    <p class="text-slate-500 font-bold text-sm">Send this to the group chat & watch the chaos unfold.</p>
                                </div>
                                
                                <div class="bg-white/60 p-2 rounded-2xl border border-white flex items-center gap-2 pr-2">
                                    <div class="flex-1 overflow-hidden px-3 py-2">
                                        <p class="text-xs font-bold truncate text-rose-500 select-all opacity-80">${window.location.origin}${window.location.pathname}?q=${state.quizId}</p>
                                    </div>
                                    <button onclick="copyLink()" class="p-3 bg-slate-800 text-white rounded-xl shadow-md hover:scale-105 transition-transform"><i data-lucide="copy" size="16"></i></button>
                                </div>
                            </div>
                            
                            <div class="flex gap-3 mt-6 justify-center">
                                <button onclick="openDashboardConfirm()" class="py-3 px-6 bg-white/70 backdrop-blur text-slate-600 rounded-2xl font-black text-xs shadow-sm border border-white hover:bg-white transition-all">View Dashboard</button>
                                <button onclick="handleStartOwnQuiz()" class="py-3 px-6 bg-rose-400 text-white rounded-2xl font-black text-xs shadow-md hover:bg-rose-500 transition-all">New Quiz</button>
                            </div>
                        </div>
                        ${soundBtn}
                    </div>`;
                    break;

                               case 'attempt':
                    if (state.attemptResult) {
                        // --- RESULT SCREEN (Unchanged) ---
                        const score = state.attemptResult.score;
                        const total = state.attemptResult.total;
                        const percent = (score/total)*100;
                        const reaction = percent === 100 ? "Soulmates! 💍" : percent > 50 ? "Bestie Vibes ✨" : "Fake Friend? 💀";
                        
                                               const reviewHtml = state.activeQuiz.questions.map((q, i) => {
                            const userAns = state.friendAnswers[i] || "Skipped";
                            const isCorrect = userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                            
                            // --- NEW BADGE LOGIC ---
                            let badge = '';
                            // Check if timers exist (backward compatibility)
                            if(state.attemptResult.timers && state.attemptResult.timers[i]) {
                                const t = state.attemptResult.timers[i];
                                if(t > 8) badge = `<span class="ml-2 bg-red-100 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200">🐢 ${Math.round(t)}s SUS!</span>`;
                                else if(t < 1.5) badge = `<span class="ml-2 bg-purple-100 text-purple-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-200">⚡ INSTANT</span>`;
                            }
                            // -----------------------

                            return `
                            <div class="glass-panel p-4 rounded-2xl mb-3 border-l-4 ${isCorrect ? 'border-emerald-400 bg-emerald-50/40' : 'border-rose-400 bg-rose-50/40'}">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="pr-2">
                                        <p class="font-bold text-slate-700 text-sm leading-tight">${q.question}</p>
                                    </div>
                                    ${isCorrect ? '<div class="bg-emerald-100 text-emerald-600 p-1 rounded-full"><i data-lucide="check" size="14"></i></div>' : '<div class="bg-rose-100 text-rose-500 p-1 rounded-full"><i data-lucide="x" size="14"></i></div>'}
                                </div>
                                <div class="space-y-1 bg-white/50 p-2 rounded-lg">
                                    <div class="text-xs font-bold text-slate-500 flex items-center justify-between flex-wrap gap-2">
                                        <div class="flex items-center">
                                            <span>You said:</span> <span class="${isCorrect ? 'text-emerald-600' : 'text-rose-500 line-through'} ml-1">${userAns}</span>
                                        </div>
                                        ${badge} </div>
                                    ${!isCorrect ? `<div class="text-xs font-black text-emerald-600 flex items-center justify-between border-t border-slate-100 pt-1 mt-1"><span>Correct:</span><span>${q.correctAnswer}</span></div>` : ''}
                                </div>
                            </div>`;
                        }).join('');


                        html = `
                        <div class="no-scroll items-center justify-center p-6 text-center">
                            <div class="w-full max-w-sm space-y-6 animate-enter relative z-10 pb-10">
                                <div class="glass-panel p-8 rounded-[3rem] shadow-2xl border-2 border-white relative mt-8">
                                    <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg whitespace-nowrap">The Tea 🍵</div>
                                    <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-purple-600 mb-2">${score}/${total}</h1>
                                    <h2 class="text-xl font-black text-slate-800 mb-2">${reaction}</h2>
                                    <p class="text-slate-500 font-bold text-xs">Results for ${state.friendName}</p>
                                </div>
                        
                                                                                        ${state.activeQuiz.secretMessage ? `
                                <div class="mx-4 mb-6 p-1 rounded-2xl bg-gradient-to-br from-purple-100 to-rose-100 relative overflow-hidden group">
                                    <div class="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-white/50 relative z-10">
                                        <div class="flex justify-between items-center mb-3">
                                            <div class="flex items-center gap-2">
                                                <i data-lucide="${score >= (state.activeQuiz.secretCount || total) ? 'unlock' : 'lock'}" class="${score >= (state.activeQuiz.secretCount || total) ? 'text-emerald-500' : 'text-purple-400'}" size="16"></i>
                                                <span class="text-xs font-black uppercase tracking-widest text-slate-500">Secret Tea</span>
                                            </div>
                                            <span class="text-[10px] font-black ${score >= (state.activeQuiz.secretCount || total) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'} px-2 py-1 rounded-lg">
                                                ${score >= (state.activeQuiz.secretCount || total) ? 'UNLOCKED' : `LOCKED (Need ${state.activeQuiz.secretCount || total} Correct)`}
                                            </span>
                                        </div>
                                        
                                        <div class="relative">
                                            <p class="font-bold text-slate-700 text-sm leading-relaxed ${score >= (state.activeQuiz.secretCount || total) ? '' : 'blur-sm select-none opacity-60'}">
                                                ${score >= (state.activeQuiz.secretCount || total) ? state.activeQuiz.secretMessage : 'This message is locked! Get more correct answers to read the tea. 💅'}
                                            </p>
                                            
                                            ${score < (state.activeQuiz.secretCount || total) ? `
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg transform rotate-3">
                                                    Top Secret 🤫
                                                </div>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                                ` : ''}

                        
                                <div class="text-left space-y-4">
                                    <h3 class="font-black text-slate-400 text-xs uppercase tracking-widest ml-4 flex items-center gap-2">Receipts 🧾 <span class="text-[10px] opacity-50">(Only you see this)</span></h3>
                                    <div class="space-y-3 pb-4">${reviewHtml}</div>
                                </div>
                                <button onclick="resetAttempt()" class="w-full py-4 bg-white text-rose-400 rounded-full font-bold text-lg shadow-sm border-2 border-rose-100 mb-3 hover:bg-rose-50 transition-colors">Next Person Plays 🔄</button>
                                 <button onclick="handleStartOwnQuiz()" class="w-full py-4 btn-primary rounded-full font-bold text-lg shadow-xl sticky bottom-6 flex items-center justify-center gap-2 group">
                                    <span>${percent < 50 ? `Get Revenge on ${state.activeQuiz.creatorName} 😈` : `Test ${state.activeQuiz.creatorName} Back ✨`}</span>
                                    <i data-lucide="arrow-right" class="group-hover:translate-x-1 transition-transform" size="20"></i>
                                </button>
                                     </div>
                            ${soundBtn}
                        </div>`;

                    } else if (!state.friendName) {
                        // --- ENTER NAME SCREEN (Unchanged) ---
                        html = `
                        <div class="no-scroll items-center justify-center p-6">
                            <div class="w-full max-w-md animate-enter space-y-8 text-center">
                                <div class="inline-block p-6 glass-panel rounded-full mb-4 shadow-lg animate-float-slow"><i data-lucide="heart" class="text-rose-400" fill="currentColor" size="48"></i></div>
                                <div class="space-y-2">
                                    <h1 class="text-3xl font-black text-slate-800">Do you know<br/><span class="text-rose-500">${state.activeQuiz.creatorName}</span>?</h1>
                                    ${state.activeQuiz.message ? `<div class="bg-white/50 inline-block px-4 py-2 rounded-xl text-slate-500 text-sm font-bold italic border border-white">"${state.activeQuiz.message}"</div>` : ''}
                                </div>
                        
                                                        ${state.activeQuiz.secretMessage ? `
                                <div class="mt-4 animate-bounce">
                                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-rose-100 rounded-full border-2 border-white shadow-sm transform -rotate-1">
                                        <div class="bg-white p-1 rounded-full text-purple-500">
                                            <i data-lucide="lock" size="12"></i>
                                        </div>
                                        <span class="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                                            Secret waiting: Need ${state.activeQuiz.secretCount || state.activeQuiz.questions.length} Correct
                                        </span>
                                    </div>
                                </div>
                                ` : ''}

                        
                                <div class="glass-panel p-2 rounded-[2rem] shadow-xl flex items-center">
                                    <input type="text" id="friendNameInput" placeholder="Enter your name... 💕" class="w-full p-4 bg-transparent text-center font-bold text-xl text-slate-800 outline-none placeholder:text-slate-300">
                                </div>
                                <button onclick="startAttempt()" class="w-full py-4 btn-primary rounded-full font-bold text-lg shadow-xl">I'm Ready! ✨</button>
                            </div>
                            ${soundBtn}
                        </div>`;
                    } else {
                        // --- PLAYING THE QUIZ ---
                        
                        // NEW LOGIC: CHECK FOR PANIC MODE
                        if (state.activeQuiz.lieDetector) {
                            // === MODE A: PANIC (One by One) ===
                            const q = state.activeQuiz.questions[state.currentQuestionIndex];
                            const currentNum = state.currentQuestionIndex + 1;
                            const totalNum = state.activeQuiz.questions.length;
                            
                            // Start timer if not running
                            if (!state.panicInterval) startPanicTimer();

                            html = `
                            <div class="min-h-screen flex flex-col p-6 relative">
                                <div class="flex items-center mb-8 relative z-30 h-10">
    <button onclick="handleExitQuiz()" class="px-4 py-2 bg-white/50 text-slate-500 rounded-full text-xs font-black hover:bg-rose-100 hover:text-rose-500 transition-colors border border-white z-20">EXIT ⚠️</button>
    
    <div class="absolute left-0 right-0 flex justify-center pointer-events-none">
        <div class="px-6 py-2 bg-slate-800 text-white rounded-full text-xs font-black tracking-widest shadow-xl border-2 border-white/20">
            ${currentNum} / ${totalNum}
        </div>
    </div>
</div>


                                <div class="flex-1 flex flex-col justify-center pb-20">
                                    <div class="glass-panel p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-2 border-white">
                                        <div class="absolute top-0 left-0 h-1 bg-rose-500 transition-all duration-500" style="width: ${(currentNum/totalNum)*100}%"></div>
                                        <h3 class="text-2xl font-black text-slate-800 mb-8 leading-tight">${q.question}</h3>
                                        <div class="space-y-3">
                                             ${q.isMultipleChoice ? q.options.filter(o=>o).map(opt => `
                                                <button onclick="handleOptionSelect(${state.currentQuestionIndex}, '${opt}')" 
                                                    class="w-full p-4 rounded-xl text-left font-bold transition-all border-2 flex items-center justify-between group ${state.friendAnswers[state.currentQuestionIndex] === opt ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-white/50 border-white text-slate-600 hover:bg-white hover:scale-[1.02]'}">
                                                    <span>${opt}</span>
                                                </button>
                                            `).join('') : `
                                                <input type="text" value="${state.friendAnswers[state.currentQuestionIndex] || ''}" oninput="updateFriendAnswer(${state.currentQuestionIndex}, this.value)" placeholder="Type answer here..." class="w-full p-5 bg-white border-2 border-rose-100 focus:border-rose-400 rounded-2xl text-lg font-bold outline-none text-slate-800 placeholder:text-slate-300 shadow-inner">
                                            `}
                                        </div>
                                    </div>
                                </div>

                                <div class="fixed bottom-8 left-0 right-0 px-6 z-20">
                                    <button onclick="handleNextQuestion()" class="w-full py-5 btn-primary rounded-full font-black text-xl shadow-2xl flex items-center justify-center gap-2 transform active:scale-95 transition-all">
                                        ${currentNum === totalNum ? 'FINISH & SUBMIT ✨' : 'NEXT QUESTION ➜'}
                                    </button>
                                </div>
                                ${soundBtn}
                            </div>`;

                        } else {
                            // === MODE B: CHILL (List View) ===
                            html = `
                            <div class="no-scroll p-6">
                                <div class="w-full max-w-md mx-auto space-y-6 pb-32">
                                    <div class="flex items-center justify-between pb-4 border-b border-rose-200/50">
                                        <div class="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full">Quiz by ${state.activeQuiz.creatorName}</div>
                                        <div class="text-[10px] font-black text-slate-500 bg-white/50 px-3 py-1 rounded-full">Player: ${state.friendName}</div>
                                    </div>
                                    <div class="space-y-8">
                                        ${state.activeQuiz.questions.map((q, idx) => `
                                            <div class="space-y-4">
                                                <div class="flex items-start gap-3">
                                                    <span class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-xs shadow-lg">${idx + 1}</span>
                                                    <h3 class="text-xl font-black text-slate-800 leading-snug">${q.question}</h3>
                                                </div>
                                                <div class="pl-11 space-y-3">
                                                    ${q.isMultipleChoice ? q.options.filter(o=>o).map(opt => `
                                                        <button onclick="handleOptionSelect(${idx}, '${opt}')" 
                                                            class="w-full p-4 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between group ${state.friendAnswers[idx] === opt ? 'bg-rose-500 border-rose-500 text-white shadow-lg scale-[1.02]' : 'bg-white/60 border-transparent text-slate-600 hover:bg-white hover:scale-[1.01]'}">
                                                            <span>${opt}</span>
                                                            ${state.friendAnswers[idx] === opt ? '<i data-lucide="check" size="16"></i>' : '<div class="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-rose-300"></div>'}
                                                        </button>
                                                    `).join('') : `
                                                        <input type="text" onchange="updateFriendAnswer(${idx}, this.value)" placeholder="Type answer..." class="w-full p-4 bg-white/60 border-2 border-transparent focus:border-rose-300 focus:bg-white rounded-2xl text-slate-800 font-bold outline-none transition-all shadow-sm">
                                                    `}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-rose-50 via-rose-50/90 to-transparent flex justify-center z-20">
                                        <button onclick="handleSubmitAttempt()" class="w-full max-w-md py-4 btn-primary rounded-full font-bold text-xl shadow-xl">Submit! 🍬</button>
                                    </div>
                                </div>
                                ${soundBtn}
                            </div>`;
                        }
                    }
                    break;


                                case 'dashboard':
                    // Prepare data helpers
                    const sortedByScore = [...state.attempts].sort((a, b) => b.score - a.score);
                const allQuizzes = [...state.quizHistory];
                    const sortedByDate = [...state.attempts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp || 0));
                    const topThree = sortedByScore.slice(0, 3);
                    const maxScore = state.attempts.length ? sortedByScore[0].score : 0;

                    html = `
                    <div class="no-scroll p-6">
                        <div class="w-full max-w-md mx-auto space-y-6 ${state.skipAnim ? '' : 'animate-enter'} pb-10">
                            
                            <header class="flex items-center justify-between relative z-30">
                                <div class="flex items-center gap-3">
                                    <button onclick="setView('${state.dashboardOrigin || 'landing'}')" class="p-3 bg-white rounded-full shadow-sm text-slate-400 hover:text-rose-500 hover:scale-110 transition-transform">
                                        <i data-lucide="arrow-left" size="20"></i>
                                    </button>
                                    <div>
                                        <h1 class="text-3xl font-black text-slate-800">The Tea 🍵</h1>
                                        <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">${state.attempts.length} people played</p>
                                    </div>
                                </div>
                                ${state.quizId ? 
    `<button onclick="setView('share')" class="p-3 bg-white rounded-full shadow-sm text-rose-400 hover:scale-110 transition-transform"><i data-lucide="share-2" size="20"></i></button>` 
    : '<div class="w-10"></div>'}
                            </header>
                                              <div class="grid grid-cols-2 gap-4 relative z-20">
                                <button onclick="toggleDashboardTab('plays')" class="glass-panel p-6 rounded-[2rem] text-center transition-all ${state.activeDashboardTab === 'plays' ? 'ring-4 ring-rose-200 bg-white scale-[1.02]' : 'hover:bg-white hover:scale-[1.02]'}">
                                    <div class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500">${state.attempts.length}</div>
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                                        Plays ${state.activeDashboardTab === 'plays' ? '<i data-lucide="chevron-up" size="12"></i>' : '<i data-lucide="chevron-down" size="12"></i>'}
                                    </div>
                                </button>
                                
                                <button onclick="toggleDashboardTab('top')" class="p-6 rounded-[2rem] text-center shadow-xl transition-all ${state.activeDashboardTab === 'top' ? 'bg-slate-900 ring-4 ring-slate-200 scale-[1.02]' : 'bg-slate-800 hover:bg-slate-700 hover:scale-[1.02]'}">
                                    <div class="text-4xl font-black text-white">${maxScore}</div>
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                                        Top Score ${state.activeDashboardTab === 'top' ? '<i data-lucide="chevron-up" size="12"></i>' : '<i data-lucide="chevron-down" size="12"></i>'}
                                    </div>
                                </button>
                            </div>

                            ${state.activeDashboardTab ? `
                                <div class="bg-white/80 backdrop-blur-md rounded-[2rem] p-4 shadow-lg border-2 border-white animate-fade-in -mt-2 pt-6">
                                    
                                    ${state.activeDashboardTab === 'plays' ? `
                                        <h3 class="text-xs font-black text-rose-400 uppercase tracking-widest mb-3 ml-2">Recent Visitors</h3>
                                        <div class="space-y-2 max-h-60 overflow-y-auto pr-2 hide-scroll">
                                            ${state.attempts.length === 0 ? `
                                                <div class="text-center py-6 opacity-60">
                                                    <p class="text-xl">🦗</p>
                                                    <p class="text-sm font-bold text-slate-400">It's quiet... too quiet.<br/>Send the link!</p>
                                                </div>
                                            ` : sortedByDate.map(a => `
                                                <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-50">
                                                    <span class="font-bold text-slate-700 text-sm">${a.friendName}</span>
                                                    <span class="text-[10px] font-black text-slate-300 uppercase">${new Date(a.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}

                                    ${state.activeDashboardTab === 'top' ? `
                                        <h3 class="text-xs font-black text-yellow-500 uppercase tracking-widest mb-3 ml-2">The Elite Pookies</h3>
                                        <div class="space-y-2">
                                            ${state.attempts.length === 0 ? `
                                                <div class="text-center py-6 opacity-60">
                                                    <p class="text-xl">👻</p>
                                                    <p class="text-sm font-bold text-slate-400">No winners yet...<br/>Be the first!</p>
                                                </div>
                                            ` : topThree.map((a, i) => `
                                                <div class="flex items-center justify-between p-3 rounded-xl border-l-4 ${i === 0 ? 'bg-yellow-50 border-yellow-400' : i === 1 ? 'bg-slate-50 border-slate-300' : 'bg-orange-50 border-orange-300'}">
                                                    <div class="flex items-center gap-3">
                                                        <div class="font-black text-lg w-6 text-center ${i===0?'text-yellow-500':'text-slate-400'}">#${i + 1}</div>
                                                        <span class="font-bold text-slate-700 text-sm">${a.friendName}</span>
                                                    </div>
                                                    <div class="font-black text-rose-500">${a.score}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}

                ${allQuizzes.length > 0 ? `
    <div class="mb-6 relative z-20">
        <button onclick="toggleMemoryDropdown()" class="w-full glass-panel p-4 rounded-2xl flex items-center justify-between hover:bg-white transition-all group">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center border border-rose-100">
                    <i data-lucide="archive" size="18"></i>
                </div>
                <div class="text-left">
                    <h3 class="font-black text-slate-700 text-sm">Memory Box</h3>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${allQuizzes.length} Past Quizzes</p>
                </div>
            </div>
            <div class="bg-rose-50 p-2 rounded-full text-rose-400 transition-transform ${state.showMemoryDropdown ? 'rotate-180' : ''}">
                <i data-lucide="chevron-down" size="16"></i>
            </div>
        </button>

        ${state.showMemoryDropdown ? `
            <div class="mt-3 space-y-2 animate-enter">
                ${allQuizzes.map((env, i) => `
                    <button onclick="openEnvelope(${i})" class="w-full p-3 bg-white/60 hover:bg-white rounded-xl flex items-center justify-between border border-transparent hover:border-rose-100 transition-all group">
                        <div class="flex items-center gap-3">
                            <span class="text-lg opacity-80 grayscale group-hover:grayscale-0 transition-all">${MODES[env.mode||'friends'].emoji}</span>
                            <div class="text-left">
                                <div class="text-xs font-bold text-slate-700">Quiz #${i+1} ${env === state.pendingArchive ? '(Recent)' : ''}</div>
                                <div class="text-[9px] font-bold text-slate-400">${new Date(env.timestamp).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <i data-lucide="arrow-right" size="14" class="text-slate-300 group-hover:text-rose-400"></i>
                    </button>
                `).reverse().join('')}
            </div>
        ` : ''}
    </div>
` : ''}


                
                            <div class="space-y-4 pt-4 border-t border-rose-100/50">
                                <h3 class="font-black text-slate-700 text-sm ml-2 flex items-center gap-2"><i data-lucide="list" size="16" class="text-rose-300"></i> All Results</h3>
                                ${sortedByScore.length === 0 ? `
                                    <div class="py-8 text-center opacity-50 border-2 border-dashed border-slate-300 rounded-[2rem]">
                                        <p class="text-sm font-bold text-slate-400">Waiting for data... 📡</p>
                                    </div>
                                ` : `
                                    <div class="space-y-3">
                                        ${sortedByScore.map((a, i) => {
                                            const realIndex = state.attempts.indexOf(a);
                                            return `
                                            <button onclick="openAttemptDetail(${realIndex})" class="w-full glass-panel p-4 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform text-left group">
                                                <div class="flex items-center gap-4">
                                                    <div class="w-6 text-center font-bold text-slate-300 text-xs">${i+1}</div>
                                                    <div>
                                                        <h4 class="font-bold text-slate-800 text-sm">${a.friendName}</h4>
                                                        <p class="text-[10px] font-bold text-slate-400">Tap to see answers 🧾</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <div class="bg-white/80 px-3 py-1 rounded-lg shadow-sm">
                                                        <span class="font-black text-rose-500">${a.score}</span><span class="text-xs font-bold text-slate-300">/${state.attempts.length > 0 ? state.attempts[0].total : 0}</span>
                                                    </div>
                                                    <i data-lucide="chevron-right" class="text-rose-300 group-hover:text-rose-500" size="16"></i>
                                                </div>
                                            </button>
                                        `}).join('')}
                                    </div>
                                `}
                            </div>
                        </div>
                ${getFooter()} 
                        ${soundBtn}
                    </div>`;
                    break;
                            // --- NEW LEGAL & INFO PAGES ---
            case 'about':
                html = `
                <div class="no-scroll p-6 items-center">
                    <div class="w-full max-w-md animate-enter pb-10">
                        <div class="flex items-center gap-3 mb-6">
                            <button onclick="setView('${state.previousView || 'landing'}')"
 class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500"><i data-lucide="arrow-left" size="20"></i></button>
                            <h2 class="text-3xl font-black text-slate-800">About Us 🏔️</h2>
                        </div>

                        <div class="glass-panel p-8 rounded-[2rem] space-y-6 text-center relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-purple-400"></div>
                            
                            <div class="w-24 h-24 bg-slate-800 text-white rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl animate-float-slow">
                                👨‍💻
                            </div>
                            
                            <div class="space-y-2">
                                <h3 class="text-xl font-black text-slate-800">Hi, I'm Lone Suhaib!</h3>
                                <p class="text-xs font-bold text-rose-500 uppercase tracking-widest">Indie Developer</p>
                            </div>

                            <p class="text-slate-600 font-bold leading-relaxed">
                                I developed <span class="text-rose-500">KnowMe Pookie Edition</span> as a lighthearted interactive platform that helps friends discover how well they know each other in a fun and engaging way.
                            </p>

                            <div class="bg-white/50 p-4 rounded-xl text-xs font-bold text-slate-500 border border-white">
                                Crafted with care in the valleys of Kashmir.
                            </div>
                        </div>
                    </div>
                    ${soundBtn}
                </div>`;
                break;

            case 'terms':
                html = `
                <div class="no-scroll p-6 items-center">
                    <div class="w-full max-w-md animate-enter pb-10">
                        <div class="flex items-center gap-3 mb-6">
                            <button onclick="setView('${state.previousView || 'landing'}')"
 class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500"><i data-lucide="arrow-left" size="20"></i></button>
                            <h2 class="text-2xl font-black text-slate-800">Terms of Service 📜</h2>
                        </div>

                        <div class="glass-panel p-6 rounded-[2rem] space-y-6 text-sm font-bold text-slate-600">
                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">1. Community Standards</h3>
                                <p>By using this application, you agree to maintain respectful and responsible behavior. Content that includes bullying, hate speech, harassment, or harmful language is strictly prohibited. We reserve the right to remove any content that violates these guidelines.</p>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">2. Use of the Platform</h3>
                                <p>KnowMe – Pookie Edition is intended solely for entertainment and self-expression. The platform <span class="underline">does not take responsibility</span> for any personal disagreements or misunderstandings that may arise from the use of quizzes or results.</p>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">3. Age Requirement</h3>
                                <p>Users must be at least 14 years old to use this application. If you are under the required age, please refrain from using the platform.</p>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">4. Jurisdiction</h3>
                                <p>These Terms and Conditions shall be governed and interpreted in accordance with the laws applicable in <strong>Kashmir</strong> (Indian Administered). Any disputes will be subject to local jurisdiction.</p>
                            </div>
                        </div>
                    </div>
                    ${soundBtn}
                </div>`;
                break;

            case 'privacy':
                html = `
                <div class="no-scroll p-6 items-center">
                    <div class="w-full max-w-md animate-enter pb-10">
                        <div class="flex items-center gap-3 mb-6">
                            <button onclick="setView('${state.previousView || 'landing'}')"
 class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500"><i data-lucide="arrow-left" size="20"></i></button>
                            <h2 class="text-2xl font-black text-slate-800">Privacy Policy 🔒</h2>
                        </div>

                        <div class="glass-panel p-6 rounded-[2rem] space-y-6 text-sm font-bold text-slate-600">
                            <p class="opacity-70 text-xs">Last Updated: Jan 2026</p>
                            
                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">1. Information We Collect</h3>
                                <p>We collect basic information such as the name, date of birth (for zodiac-related features), and quiz content voluntarily provided by users. This data is securely stored using Google Firebase services.</p>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">2. Cookies and Advertising</h3>
                                <p>The platform may use cookies and display advertisements in the future to support development and maintenance. By continuing to use the service, you consent to such use.</p>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">3. Your Rights</h3>
                                <p>Users may request deletion of their personal data by contacting us at <strong>hellopookiequiz@gmail.com</strong> .Upon verification, we will remove the requested information.</p>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-rose-500 font-black uppercase text-xs">4. Service Location and Compliance</h3>
                                <p>This service operates from Kashmir (Indian Administered) and strives to follow applicable local and international data protection and privacy regulations.</p>
                            </div>
                        </div>
                    </div>
                    ${soundBtn}
                </div>`;
                break;

            case 'contact':
                html = `
                <div class="no-scroll p-6 items-center">
                    <div class="w-full max-w-md animate-enter pb-10">
                        <div class="flex items-center gap-3 mb-6">
                            <button onclick="setView('${state.previousView || 'landing'}')"
 class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500"><i data-lucide="arrow-left" size="20"></i></button>
                            <h2 class="text-3xl font-black text-slate-800">Contact Us 💌</h2>
                        </div>

                        <div class="glass-panel p-8 rounded-[2rem] space-y-6 text-center">
                            <div class="w-20 h-20 bg-rose-100 text-rose-500 rounded-full mx-auto flex items-center justify-center animate-bounce">
                                <i data-lucide="mail" size="32"></i>
                            </div>
                            
                            <div class="space-y-2">
                                <h3 class="text-xl font-black text-slate-800">Got Feedback?</h3>
                                <p class="text-slate-500 font-bold text-sm">Found a bug or just want to say hi?</p>
                            </div>

                            <a href="mailto:hellopookiequiz@gmail.com" class="block w-full py-4 btn-primary rounded-xl font-bold text-lg shadow-xl">
                                Email Us
                            </a>
                            
                            <p class="text-xs font-bold text-slate-400 pt-4">
                                hellopookiequiz@gmail.com<br>
                                Based in Kashmir 🏔️
                            </p>
                        </div>
                    </div>
                    ${soundBtn}
                </div>`;
                break;


            }

            root.innerHTML = html;
            renderModals(root);
            lucide.createIcons();
        }

        function renderModals(root) {
            // --- NEW: Attempt Detail Popup ---
                 if (state.viewingAttempt) {
                const attempt = state.viewingAttempt;
                
                // Generate the list of answers
                const reviewList = state.questions.map((q, i) => {
                    const userAns = attempt.answers[i] || "Skipped";
                    const isCorrect = userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                    
                    // --- BADGE LOGIC FOR DASHBOARD ---
                    let badge = '';
                    if(attempt.timers && attempt.timers[i]) {
                        const t = attempt.timers[i];
                        if(t > 8) badge = `<span class="ml-2 bg-red-100 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200">🐢 ${Math.round(t)}s SUS!</span>`;
                        else if(t < 1.5) badge = `<span class="ml-2 bg-purple-100 text-purple-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-200">⚡ INSTANT</span>`;
                    }
                    // ---------------------------------

                    return `
                    <div class="glass-panel p-4 rounded-2xl mb-3 border-l-4 ${isCorrect ? 'border-emerald-400 bg-emerald-50/50' : 'border-rose-400 bg-rose-50/50'}">
                        <div class="flex justify-between items-start mb-2">
                            <div class="pr-2">
                                <p class="font-bold text-slate-700 text-sm leading-tight">${q.question}</p>
                            </div>
                            ${isCorrect ? '<div class="bg-emerald-100 text-emerald-600 p-1 rounded-full"><i data-lucide="check" size="14"></i></div>' : '<div class="bg-rose-100 text-rose-500 p-1 rounded-full"><i data-lucide="x" size="14"></i></div>'}
                        </div>
                        <div class="space-y-1 bg-white/60 p-2 rounded-lg">
                            <div class="text-xs font-bold text-slate-500 flex items-center justify-between flex-wrap gap-2">
                                <div class="flex items-center">
                                    <span>They said:</span>
                                    <span class="${isCorrect ? 'text-emerald-600' : 'text-rose-500 line-through'} ml-1">${userAns}</span>
                                </div>
                                ${badge} </div>
                            ${!isCorrect ? `<div class="text-xs font-black text-emerald-600 flex items-center justify-between border-t border-slate-200/50 pt-1 mt-1"><span>Correct:</span><span>${q.correctAnswer}</span></div>` : ''}
                        </div>
                    </div>`;
                }).join('');

                const modal = document.createElement('div');
                modal.className = "fixed inset-0 z-[7000] bg-slate-50/95 backdrop-blur-xl overflow-y-auto no-scroll";
                modal.innerHTML = `
                    <div class="w-full max-w-md mx-auto p-6 pb-20 animate-enter">
                        <div class="flex items-center gap-3 mb-6 sticky top-0 bg-slate-50/95 backdrop-blur-md py-4 z-20 -mx-6 px-6 border-b border-rose-100">
                            <button onclick="closeAttemptDetail()" class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500 border border-slate-100"><i data-lucide="arrow-left" size="20"></i></button>
                            <div>
                                <h2 class="text-2xl font-black text-slate-800">${attempt.friendName}'s Tea 🍵</h2>
                                <p class="text-xs font-bold text-slate-400">Score: ${attempt.score}/${attempt.total}</p>
                            </div>
                        </div>
                        <div class="space-y-2">${reviewList}</div>
                        <div class="mt-8 mb-4 space-y-3">
                            <button onclick="shareFromDashboard()" class="w-full py-4 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-full font-black text-lg shadow-xl flex items-center justify-center gap-2 transform transition active:scale-95 group">
                                <i data-lucide="instagram" size="20" class="group-hover:scale-110 transition-transform"></i> 
                                <span>Share Result 📸</span>
                            </button>
                            <button onclick="closeAttemptDetail()" class="w-full py-4 bg-slate-100 text-slate-500 rounded-full font-bold hover:bg-slate-200 transition-colors">Close</button>
                        </div>
                    </div>`;
                root.appendChild(modal);
            }

            // Re-used modal logic with better styling
            if (state.showDashboardConfirm) {
                const modal = document.createElement('div');
                modal.className = "fixed inset-0 z-[6000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6";
                modal.innerHTML = `
                <div class="glass-panel rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl animate-enter">
                    <div class="text-5xl mb-4 animate-bounce">🫣</div>
                    <h2 class="text-2xl font-black text-slate-800 mb-2">Ready for the tea?</h2>
                    <p class="text-slate-500 font-bold text-sm mb-6">Results might shock you...</p>
                    <div class="space-y-3">
                        <button onclick="confirmDashboard()" class="w-full py-3 btn-primary rounded-xl font-bold shadow-lg">Show me ✨</button>
                        <button onclick="cancelDashboard()" class="w-full py-3 bg-white text-slate-400 rounded-xl font-bold hover:bg-slate-50">Not yet</button>
                    </div>
                </div>`;
                root.appendChild(modal);
            }
            // Template Modal
            if (state.showTemplateModal) {
                const templates = QUIZ_TEMPLATES[state.selectedMode] || [];
                const modal = document.createElement('div');
                modal.className = "fixed inset-0 z-[6000] bg-slate-900/20 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4";
                modal.innerHTML = `
                    <div class="bg-white w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-enter max-h-[80vh] flex flex-col">
                        <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                            <h2 class="text-lg font-black text-slate-800">Pick a Secret 🤫</h2>
                            <button onclick="closeTemplateModal()" class="bg-slate-100 p-2 rounded-full text-slate-400"><i data-lucide="x" size="18"></i></button>
                        </div>
                        <div class="space-y-2 overflow-y-auto pt-4 flex-1 hide-scroll">
                            ${templates.map((t, i) => `
                                <button onclick="applyTemplate(${i})" class="w-full text-left p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-rose-50 hover:border-rose-200 transition-all group">
                                    <p class="text-sm font-bold text-slate-700 group-hover:text-rose-600">${t.q}</p>
                                    <div class="flex gap-2 mt-2">
                                        ${t.options && t.options.length > 0 ? 
                                            '<span class="text-[9px] font-black bg-white px-2 py-1 rounded-md text-slate-400 border">MULTI CHOICE</span>' : 
                                            '<span class="text-[9px] font-black bg-white px-2 py-1 rounded-md text-slate-400 border">TEXT</span>'}
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>`;
                root.appendChild(modal);
                lucide.createIcons();
            }
            // Profile Editor Modal
            if (state.showProfileEditor) {
                const modal = document.createElement('div');
                modal.className = "fixed inset-0 z-[6000] bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-6";
                modal.innerHTML = `
                <div class="bg-white p-6 rounded-[2rem] w-full max-w-xs shadow-2xl relative animate-enter">
                    <button onclick="closeProfileEditor()" class="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-400"><i data-lucide="x" size="16"></i></button>
                    <h2 class="text-xl font-black text-slate-800 text-center mb-6">Edit Profile 🧸</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">Nickname</label>
                            <input oninput="handleProfileInput('name', this.value)" value="${state.editDraft.name}" class="w-full p-3 rounded-2xl font-bold bg-slate-50 border-2 border-transparent focus:border-rose-300 outline-none text-slate-700">
                        </div>
                         <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">Birthday</label>
                
                            <input type="date" oninput="handleProfileInput('dob', this.value)" value="${state.editDraft.dob || ''}" class="w-full p-3 rounded-2xl font-bold bg-slate-50 border-2 border-transparent focus:border-rose-300 outline-none text-slate-700">
                        </div>
                    </div>
                    <button onclick="saveProfileEdits()" class="w-full py-3 mt-6 btn-primary rounded-xl font-bold shadow-lg">Save Changes ✨</button>
                </div>`;
                root.appendChild(modal);
                lucide.createIcons();
            }
         

if (state.viewingEnvelope) {
    const env = state.viewingEnvelope;
    const questionsHtml = env.questions.map((q, i) => `
        <div class="text-xs text-slate-500 mb-1 border-b border-slate-100 pb-1 last:border-0">
            <span class="font-black text-rose-400 mr-1">${i+1}.</span> ${q.question}
        </div>`).join('');

    const resultsHtml = env.attempts.length === 0 ? 
        `<div class="text-center py-8 opacity-50 text-sm font-bold text-slate-400">No receipts found inside 🕸️</div>` :
        env.attempts.map((a, i) => `
            <button onclick="openEnvelopeReceipt(${i})" class="w-full glass-panel p-3 rounded-xl flex items-center justify-between mb-2 hover:bg-white transition-colors">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">${i+1}</div>
                    <div class="text-left">
                        <div class="font-bold text-slate-700 text-sm">${a.friendName}</div>
                        <div class="text-[9px] font-bold text-slate-400">Score: ${a.score}/${env.questions.length}</div>
                    </div>
                </div>
                <i data-lucide="eye" size="14" class="text-rose-300"></i>
            </button>`).join('');

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-[7000] bg-slate-50/95 backdrop-blur-xl overflow-y-auto no-scroll";
    modal.innerHTML = `
        <div class="w-full max-w-md mx-auto p-6 pb-20 animate-enter">
            <div class="flex items-center gap-3 mb-6 sticky top-0 bg-slate-50/95 py-4 z-20 border-b border-rose-100">
                <div class="flex items-center gap-2">
                     <button onclick="closeEnvelope()" class="p-3 bg-white rounded-full text-slate-400 shadow-sm hover:text-rose-500"><i data-lucide="x" size="20"></i></button>
                     <button onclick="navigator.clipboard.writeText('${window.location.origin}${window.location.pathname}?q=${env.id}').then(() => pookieAlert('Old link copied! 💌', 'success'))" class="p-3 bg-rose-100 text-rose-500 rounded-full font-bold shadow-sm hover:scale-110 transition-transform"><i data-lucide="link" size="20"></i></button>
                </div>
                <div><h2 class="text-2xl font-black text-slate-800">Opened Memory 💌</h2><p class="text-xs font-bold text-slate-400">${new Date(env.timestamp).toLocaleDateString()}</p></div>
            </div>
            <div class="mb-6"><h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">The Questions</h3><div class="bg-white/60 p-4 rounded-2xl border border-white">${questionsHtml}</div></div>
            <div><h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">The Results</h3><div class="space-y-1">${resultsHtml}</div></div>
        </div>`;
    root.appendChild(modal);
}

            if (state.viewingEnvelopeAttempt) {
                const attempt = state.viewingEnvelopeAttempt;
                const reviewHtml = state.viewingEnvelope.questions.map((q, i) => {
                    const userAns = attempt.answers[i] || "Skipped";
                    const isCorrect = userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                    return `
                    <div class="glass-panel p-4 rounded-2xl mb-3 border-l-4 ${isCorrect ? 'border-emerald-400 bg-emerald-50/50' : 'border-rose-400 bg-rose-50/50'}">
                        <div class="flex justify-between items-start mb-2"><p class="font-bold text-slate-700 text-sm pr-2 leading-tight">${q.question}</p>${isCorrect ? '<i data-lucide="check" size="14" class="text-emerald-500"></i>' : '<i data-lucide="x" size="14" class="text-rose-500"></i>'}</div>
                        <div class="text-xs font-bold text-slate-500"><span class="${isCorrect ? 'text-emerald-600' : 'text-rose-500 line-through'}">${userAns}</span>${!isCorrect ? `<span class="text-emerald-600 ml-2">Correct: ${q.correctAnswer}</span>` : ''}</div>
                    </div>`;
                }).join('');

                const modal = document.createElement('div');
                modal.className = "fixed inset-0 z-[8000] bg-white/95 backdrop-blur-xl overflow-y-auto no-scroll";
                
                modal.innerHTML = `
                    <div class="w-full max-w-md mx-auto p-6 pb-20 animate-enter">
                        <div class="flex items-center gap-3 mb-6 sticky top-0 bg-white/95 backdrop-blur-md py-4 z-20 -mx-6 px-6 border-b border-slate-100">
                            <button onclick="closeEnvelopeReceipt()" class="p-3 bg-slate-50 rounded-full text-slate-400 border border-slate-200 hover:text-rose-500 hover:border-rose-200 transition-colors"><i data-lucide="arrow-left" size="20"></i></button>
                            <div>
                                <h2 class="text-xl font-black text-slate-800">${attempt.friendName}'s Memory</h2>
                                <p class="text-xs font-bold text-slate-400">Score: ${attempt.score}/${state.viewingEnvelope.questions.length}</p>
                            </div>
                        </div>
                        
                        <div class="space-y-2 mb-8">${reviewHtml}</div>

                        <button onclick="shareFromMemory()" class="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:border-rose-300 hover:text-rose-500 hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200 group-hover:border-rose-200 transition-colors">
                                <i data-lucide="camera" size="16"></i>
                            </div>
                            <span>Capture Memory</span>
                        </button>
                    </div>`;
                root.appendChild(modal);
            }

            // --- NEW: Instagram Share Card Modal ---
if (state.showShareCard && state.attemptResult) {

    const score = state.attemptResult.score;
    const total = state.attemptResult.total;
    const percent = (score/total)*100;
    
    // Dynamic vibe check text
        // --- ROAST LOGIC START ---
    let vibeText = "";
    let roastText = "";

    if (percent === 100) {
        vibeText = "SOULMATE STATUS 💍";
        roastText = "Is this obsession? (Yes)";
    } else if (percent >= 80) {
        vibeText = "BESTIE TIER 💖";
        roastText = "You actually listen to me 🥹";
    } else if (percent >= 50) {
        vibeText = "MID TIER POOKIE 😐";
        roastText = "Do better next time 💅";
    } else if (percent >= 20) {
        vibeText = "FAKE FRIEND 🚨";
        roastText = "The audacity to score this low 💀";
    } else {
        vibeText = "TOTAL STRANGER 🤡";
        roastText = "Who even are you?";
    }
    // --- ROAST LOGIC END ---
    
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-[9000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6";
    
    modal.innerHTML = `
        <div class="w-full max-w-sm flex flex-col items-center animate-enter">
            
            <div id="capture-card" class="w-full aspect-[9/16] ${state.cardBg || 'bg-gradient-to-br from-rose-100 to-purple-100'} relative rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border-4 border-white">
                
                <div class="absolute top-0 left-0 w-full h-full opacity-50">
                    <div class="absolute top-[-10%] left-[-10%] w-64 h-64 bg-rose-300 rounded-full opacity-20"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-300 rounded-full opacity-20"></div>
     </div>

                <div class="relative z-10 flex-1 flex flex-col p-6 items-center justify-between text-center">
                    
                    <div class="w-full flex justify-between items-center opacity-60">
    <span class="text-[10px] font-black uppercase tracking-[0.2em] ${state.cardSubText}">KnowMe App</span>
    <span class="text-[10px] font-black uppercase tracking-widest ${state.cardSubText}">${new Date().toLocaleDateString()}</span>
</div>


                    <div class="flex-1 flex flex-col items-center justify-center gap-4">
                        <div class="px-6 py-2 rounded-full border border-white/50 bg-white/90 shadow-sm">
                            <span class="text-xs font-black uppercase tracking-widest text-rose-500">The Connection Report</span>
                        </div>
                        
                        <div class="relative">
                            <h1 class="text-8xl font-black ${state.cardText || 'text-slate-800'} leading-none tracking-tighter drop-shadow-sm">${score}/${total}</h1>
                            <div class="absolute -top-6 -right-8 bg-white text-rose-500 text-xs font-black px-2 py-1 rounded-lg transform rotate-12 shadow-sm border border-rose-100">
                                ${Math.round(percent)}% MATCH
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-1">
                            <h2 class="text-2xl font-black text-slate-700 uppercase tracking-tight leading-none">${vibeText}</h2>
                            
                            <div class="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg transform -rotate-2 mb-2 mt-1 shadow-sm">
                                <p class="text-[10px] font-black text-rose-500 uppercase tracking-wide leading-tight">${roastText}</p>
                            </div>

                            <p class="text-sm font-bold text-slate-500">
                                ${state.friendName} <span class="text-rose-400">×</span> 
                                ${state.tempCreatorName || (state.activeQuiz ? state.activeQuiz.creatorName : 'Creator')}
                            </p>
                        </div>
                       

                   </div>

                    <div class="w-full p-4 rounded-3xl flex items-center justify-between bg-white/90 border border-white shadow-sm">
                        <div class="text-left">
    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Play this quiz</p>
    <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <p class="text-xs font-black ${state.cardSubText}">Scan to beat my score</p>
    </div>
</div>

                        <div id="share-qr" class="p-1 bg-white rounded-lg shadow-sm"></div>
                    </div>

                </div>
            </div>

            <div class="flex gap-3 mt-6 w-full">
                <button onclick="downloadShareCard()" id="download-btn" class="flex-1 py-4 btn-primary rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
                    Save Image ⬇️
                </button>
                <button onclick="closeShareCard()" class="px-5 py-4 bg-white text-slate-400 rounded-2xl font-bold shadow-lg hover:text-rose-500">
                    <i data-lucide="x" size="24"></i>
                </button>
            </div>
            
            <p class="mt-4 text-[10px] font-bold text-white/60">Tip: Post this to your story & add the link! 🔗</p>
        </div>`;
    root.appendChild(modal);
}
// --- NEW: Vibe Picker Modal ---
if (state.showVibePicker) {
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6";
    modal.innerHTML = `
    <div class="bg-white p-6 rounded-[2rem] w-full max-w-xs shadow-2xl ${state.skipAnim ? '' : 'animate-enter'}">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black text-slate-800">Choose Vibe ✨</h2>
            <button onclick="closeVibePicker()" class="bg-slate-100 p-2 rounded-full text-slate-400"><i data-lucide="x" size="18"></i></button>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
            ${Object.keys(THEMES).map(key => `
                <button onclick="selectVibe('${key}')" class="p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${state.profile.vibe === key ? 'border-rose-400 bg-rose-50 scale-105' : 'border-slate-100 hover:border-rose-200'}">
                    <div class="w-full h-8 rounded-xl shadow-sm" style="background: ${THEMES[key].accent}"></div>
                    <span class="text-xs font-bold text-slate-600">${key}</span>
                </button>
            `).join('')}
        </div>
    </div>`;
    root.appendChild(modal);
    lucide.createIcons();
}


        }

        // --- ACTIONS ---
                window.openLegal = (v) => {
            if (!['about', 'terms', 'privacy', 'contact'].includes(state.view)) {
                state.previousView = state.view; 
            }
            setView(v);
        };

                        window.setView = (v) => {
            // 1. Clear Panic Timer if leaving the quiz
            if (state.panicInterval) {
                clearInterval(state.panicInterval);
                state.panicInterval = null;
            }

            // 2. Clear Database Listener (Existing logic)
            if (state.view === 'dashboard' && v !== 'dashboard' && state.unsubscribe) {
                state.unsubscribe();
                state.unsubscribe = null;
            }

            // 3. NEW: Save to browser history so "Back" button works
            if (state.view !== v) {
                // This adds a "history entry" to the browser
                window.history.pushState({ view: v }, null, `?mode=${v}`);
            }

            state.view = v; 
            render(); 
        };



        window.toggleSound = () => { if(Sound.toggle()) Sound.play('pop'); render(); };
        window.pookieAlert = (msg, type='default') => {
            const c = document.getElementById('toast-container');
            const t = document.createElement('div');
            const bg = type === 'error' ? 'bg-red-500' : 'bg-slate-800';
            const icon = type === 'error' ? 'alert-circle' : type === 'success' ? 'heart' : 'sparkles';
            if(type==='error') Sound.play('error'); else Sound.play('pop');
            
            t.className = `pookie-toast flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white border border-white/20 ${bg}`;
            t.innerHTML = `<i data-lucide="${icon}" size="18"></i><span class="text-xs font-black tracking-wide">${msg}</span>`;
            c.appendChild(t);
            lucide.createIcons();
            setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 300); }, 2500);
        };
    
            // --- NEW: SAFE ZONE STICKERS (Non-Overlapping) ---
        window.showPanicSticker = (text, type='sus') => {
            const el = document.createElement('div');
            
            // 1. Define Vertical Safe Zones (Away from buttons)
            // Spot A: Below the header (Top 24)
            // Spot B: Above the Next button (Bottom 32)
            const positions = [
                'top-24 left-1/2 -translate-x-1/2', 
                'bottom-32 left-1/2 -translate-x-1/2'
            ];
            
            // Pick a random safe spot
            const randomPos = positions[Math.floor(Math.random() * positions.length)];
            
            // Random Tilt (Wild rotation)
            const rotate = Math.random() * 30 - 15; 

            // Colors
            const styles = type === 'sus' 
                ? 'bg-rose-500 text-white border-rose-700' 
                : 'bg-emerald-400 text-white border-emerald-600';
            
            const icon = type === 'sus' ? '👀' : '⚡';

            // Apply Safe Position & High Z-Index
            el.className = `fixed ${randomPos} z-[9999] pointer-events-none`;
            
            el.innerHTML = `
                <div class="${styles} px-6 py-2 rounded-full border-b-4 font-black text-sm shadow-xl flex items-center gap-2 whitespace-nowrap animate-sticker-pop origin-center" style="transform: rotate(${rotate}deg)">
                    <span class="text-xl">${icon}</span>
                    <span class="uppercase tracking-widest drop-shadow-sm">${text}</span>
                </div>
                <style>
                    @keyframes sticker-pop {
                        0% { transform: scale(0) rotate(${rotate - 45}deg); opacity: 0; }
                        60% { transform: scale(1.1) rotate(${rotate}deg); opacity: 1; }
                        80% { transform: scale(0.95) rotate(${rotate}deg); }
                        100% { transform: scale(1) rotate(${rotate}deg); }
                    }
                </style>
            `;

            document.body.appendChild(el);
            
            // Sound Effect
            if(type === 'sus') Sound.play('error'); else Sound.play('success');

            // Remove quickly (1.5s) to keep screen clean
            setTimeout(() => {
                el.style.transition = "all 0.3s ease-in";
                el.style.opacity = "0";
                el.style.transform = `scale(0.5) rotate(${rotate}deg)`; 
                setTimeout(() => el.remove(), 300);
            }, 1500); 
        };

    
            // --- NEW: PANIC MODE LOGIC ---
        window.toggleLieDetector = () => {
            state.lieDetector = !state.lieDetector;
            saveState();
            render();
        };

        window.startPanicTimer = () => {
            if (state.panicInterval) clearInterval(state.panicInterval);
            state.questionStartTime = Date.now();
            state.hasPanicked = false;

            state.panicInterval = setInterval(() => {
                const elapsed = (Date.now() - state.questionStartTime) / 1000;
                // If they take longer than 8 seconds... PANIC!
                if (elapsed > 8 && !state.hasPanicked) {
                    const msgs = ["Brain freeze? 🥶", "Why the hesitation? 🤨", "Sweating? 💦", "Calculating the lie... 🧮"];
                                     showPanicSticker(msgs[Math.floor(Math.random() * msgs.length)], "sus"); 
                    state.hasPanicked = true; 
                    
                }
            }, 1000);
        };

                window.handleNextQuestion = () => {
            const idx = state.currentQuestionIndex;
            
            // 1. Check if answered
            if (!state.friendAnswers[idx]) {
                pookieAlert("Answer first bestie! 😤", "error");
                return;
            }

            // --- NEW: CALCULATE & SAVE TIME ---
            const elapsed = (Date.now() - state.questionStartTime) / 1000;
            state.attemptTimers[idx] = elapsed; // Save the time!

            // 2. Check for "Instantly Sus" behavior (< 1.5s)
            if (elapsed < 1.5) {
                 showPanicSticker("STALKER SPEED!", "fast"); 
            }

            // 3. Move to next or Submit
            if (idx < state.activeQuiz.questions.length - 1) {
                state.currentQuestionIndex++;
                Sound.play('pop');
                render(); 
                startPanicTimer(); 
            } else {
                handleSubmitAttempt();
            }
        };


        window.handleExitQuiz = () => {
            if(confirm("Exit? You'll lose your progress! 🥺")) {
                setView('landing');
            }
        };


        // --- LOGIC ---
        window.handleLogin = () => {
            const e = document.getElementById('login-email').value;
            const p = document.getElementById('login-pass').value;
            if(!e || !p) { pookieAlert("Fill it out bestie! 🥺", "error"); return; }
            state.isLoading = true; state.loadingText = "Checking vibes..."; render();
            setTimeout(() => {
                state.isLoggedIn = true; state.userEmail = e; state.isLoading = false;
                Sound.play('success');
                if(state.profileCompleted) setView('create'); else setView('profile');
            }, 800);
        };
        window.handleGuestMode = async () => { 
    state.isLoading = true;
    state.loadingText = "Starting Guest Mode... 👻";
    render();
    
    try {
        // This is the magic line that fixes the "Permission Denied" error
        await signInAnonymously(auth);
        
        state.isLoggedIn = false; 
        state.isGuest = true; 
        state.isLoading = false;
        setView('profile');
    } catch (e) {
        console.error(e);
        state.isLoading = false;
        render();
        pookieAlert("Connection failed! Check internet ☁️", "error");
    }
};

        window.handleLogout = () => { 
    // FIX: Warn guests that logout = delete data
    const msg = state.userEmail ? "Really log out? 🥺" : "⚠️ WAIT! As a Guest, logging out will DELETE your history & quizzes forever.\n\nAre you sure?";
    
    if(confirm(msg)) { 
        localStorage.removeItem(STORAGE_KEY); 
        location.reload(); 
    }
};
        
        window.handleNewProfile = () => { state.profile = {...DEFAULT_STATE.profile}; state.profileCompleted=false; setView('profile'); };
    
        window.updateVibe = (v) => {
    // 1. Update State & Save
    state.profile.vibe = v;
    saveState();

    // 2. Apply Theme Colors Instantly
    applyTheme(v);

    // 3. Update Button Styles Manually to avoid "The Jump"
    const buttons = document.querySelectorAll('button[onclick^="updateVibe"]');
    buttons.forEach(btn => {
        // Check if this button matches the clicked vibe
        if (btn.getAttribute('onclick').includes(`'${v}'`)) {
            // Active Style
            btn.className = "py-3 px-1 text-[10px] font-bold rounded-xl transition-all bg-rose-400 text-white shadow-md scale-105";
        } else {
            // Inactive Style
            btn.className = "py-3 px-1 text-[10px] font-bold rounded-xl transition-all bg-white/50 text-slate-400 hover:bg-white";
        }
    });
};

        window.toggleDashboardTab = (tab) => {
    // 1. Remember where we are
    state.skipAnim = true;
    const y = window.scrollY;

    // 2. Toggle the tab
    if (state.activeDashboardTab === tab) {
        state.activeDashboardTab = null;
    } else {
        state.activeDashboardTab = tab;
    }
    
    // 3. Update screen
    Sound.play('pop');
    render();
    
    // 4. Put us back exactly where we were
    window.scrollTo(0, y);
    state.skipAnim = false;
};


        window.handleZodiacCalc = (d) => { 
    // 1. Save Scroll Position
    state.skipAnim = true;
    const y = window.scrollY;

    const nameInput = document.getElementById('prof-name');
    if(nameInput) state.profile.name = nameInput.value; 
    
    state.profile.dob = d; 
    const z = getZodiac(d); 
    state.profile.zodiac = z.n; 
    state.profile.element = z.e; 
    
    render(); 
    
    // 2. Restore Scroll Position
    window.scrollTo(0, y);
    state.skipAnim = false;
};

    window.setProfileName = (val) => {
    state.profile.name = val;
    saveState();
};

        window.saveProfile = () => {
    const nameEl = document.getElementById('prof-name');
    if (nameEl && nameEl.value) {
        state.profile.name = nameEl.value.trim();
    }

    if(!state.profile.name) { 
        pookieAlert("Name required! 🥺", "error"); 
        return; 
    }
    
    // NEW: Check for birthday
    if(!state.profile.dob) {
        pookieAlert("When's your bday? 🎂", "error");
        return;
    }
    
    state.profileCompleted = true; 
    Sound.play('success'); 
    setView('create');
};



        window.openProfileEditor = () => { state.editDraft = {...state.profile}; state.showProfileEditor=true; render(); };
        window.closeProfileEditor = () => { state.showProfileEditor=false; render(); };
        window.handleProfileInput = (k,v) => { state.editDraft[k]=v; };
        window.saveProfileEdits = () => { state.profile={...state.editDraft}; state.showProfileEditor=false; pookieAlert("Glow up successful! 💅", "success"); render(); };

        window.setMode = (m) => { state.selectedMode = m; Sound.play('pop'); render(); };
        window.addQuestion = () => {
    // 1. Lock Scroll
    state.skipAnim = true;
    const y = window.scrollY;

    // 2. Add Data
    state.questions.push({ question: '', correctAnswer: '', isMultipleChoice: false, options: ['', ''] });
    Sound.play('pop');
    
    // 3. Render & Instant Restore
    render(); 
    window.scrollTo(0, y);
    
    // 4. Double-Lock & Smooth Scroll
    requestAnimationFrame(() => {
        window.scrollTo(0, y); // Force position again
        state.skipAnim = false;
        
        // Wait 50ms for layout to settle, THEN scroll to new card
        setTimeout(() => {
            const list = document.getElementById('questionsList');
            if(list && list.lastElementChild) {
                list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    });
};


        window.removeQuestion = (i) => { 
    // 1. Lock Scroll
    state.skipAnim = true;
    const y = window.scrollY;
    
    // 2. Remove Data
    state.questions.splice(i, 1); 
    Sound.play('pop'); 
    
    // 3. Render & Instant Restore
    render(); 
    window.scrollTo(0, y);
    
    // 4. Double-Lock
    requestAnimationFrame(() => {
        window.scrollTo(0, y);
        state.skipAnim = false;
    });
};


    window.updateQuestion = (i,f,v) => { state.questions[i][f]=v; saveState(); };
        window.setCorrectAnswer = (i, v) => {
    state.skipAnim = true;
    const y = window.scrollY;

    state.questions[i].correctAnswer = v;
    saveState();
    render(); 
    
    window.scrollTo(0, y);
    state.skipAnim = false;
};

        window.toggleMultipleChoice = (i) => { 
    // 1. Lock Scroll
    state.skipAnim = true;
    const y = window.scrollY;

    // 2. Logic
    const isNowMulti = !state.questions[i].isMultipleChoice;
    state.questions[i].isMultipleChoice = isNowMulti;
    state.questions[i].correctAnswer = ''; 
    if (isNowMulti && state.questions[i].options.length < 2) {
        state.questions[i].options = ['', ''];
    }
    
    // 3. Render & Instant Restore
    render(); 
    window.scrollTo(0, y);
    
    // 4. THE DOUBLE-LOCK: Force it again in the next frame to kill the browser jump
    requestAnimationFrame(() => {
        window.scrollTo(0, y);
        state.skipAnim = false;
    });
};


                window.addOption = (qi) => { 
            if(state.questions[qi].options.length < 4) { 
                state.skipAnim = true;
                const y = window.scrollY;

                state.questions[qi].options.push(''); 
                render(); 

                // --- FIX: Auto-focus the new option input ---
                // We wait 50ms for the screen to update, then find the new input
                setTimeout(() => {
                    // This finds all inputs that belong to this specific question
                    const inputs = document.querySelectorAll(`input[oninput^="updateOption(${qi}"]`);
                    // If we found them, focus on the LAST one (the new one)
                    if(inputs.length > 0) inputs[inputs.length - 1].focus();
                }, 50);

                window.scrollTo(0, y);
                state.skipAnim = false;
            }
        };



        window.removeOption = (qi, oi) => {
    state.skipAnim = true;
    const y = window.scrollY;

    const valToRemove = state.questions[qi].options[oi];
    
    if (state.questions[qi].correctAnswer === valToRemove) {
        state.questions[qi].correctAnswer = '';
    }
    
    state.questions[qi].options.splice(oi, 1);
    saveState();
    render();

    window.scrollTo(0, y);
    state.skipAnim = false;
};


        window.updateOption = (qi, oi, val) => {
    // 1. Get the old text before we change it
    const oldVal = state.questions[qi].options[oi];
    
    // 2. Update the option text
    state.questions[qi].options[oi] = val;
    
    // 3. If this option was marked as the correct answer, update that too!
    if (state.questions[qi].correctAnswer === oldVal) {
        state.questions[qi].correctAnswer = val;
    }
    
    saveState();
};
    // --- FIX FOR PREVIEW INPUTS ---
window.updateQuizConfig = (key, value) => {
    if (key === 'secretCount') {
        state.secretCount = Number(value);
    } else {
        state[key] = value;
    }
    saveState();
};


        window.editQuestion = (i) => {
    setView('create');
    // Wait for the DOM to render the list, then scroll
    setTimeout(() => {
        const questionCards = document.getElementById('questionsList').children;
        if (questionCards[i]) {
            questionCards[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optional: Add a flash effect to show which one is being edited
            questionCards[i].classList.add('ring-4', 'ring-rose-300');
            setTimeout(() => questionCards[i].classList.remove('ring-4', 'ring-rose-300'), 1500);
        }
    }, 100);
};


        window.openTemplatePicker = (i) => { state.activeTemplateIndex=i; state.showTemplateModal=true; render(); };
        window.closeTemplateModal = () => { state.showTemplateModal=false; render(); };
        window.applyTemplate = (ti) => {
            const t = QUIZ_TEMPLATES[state.selectedMode][ti];
            const q = state.questions[state.activeTemplateIndex];
            q.question = t.q;
            q.isMultipleChoice = t.options.length > 0;
            q.options = t.options.length > 0 ? [...t.options] : ['', ''];
            q.correctAnswer = '';
            state.showTemplateModal = false;
            Sound.play('pop'); render();
        };

        window.handleShowPreview = () => {
            if(state.questions.length === 0) { pookieAlert("Add a question first! 🥺", "error"); return; }
            let valid = true;
            state.questions.forEach(q => {
                if(!q.question.trim()) valid=false;
                if(q.isMultipleChoice && (!q.correctAnswer || q.options.some(o=>!o.trim()))) valid=false;
                if(!q.isMultipleChoice && !q.correctAnswer.trim()) valid=false;
            });
            if(!valid) { pookieAlert("Fill in all answers! 🙈", "error"); return; }
            setView('preview');
        };

        window.confirmFinalCreation = async () => {
    state.isLoading = true; 
    state.loadingText = "Manifesting link... 🔮"; 
    render();

    try {
        // --- 1. SECURE CONNECTION CHECK ---
        // We create a local variable 'user' to ensure stability
        let user = auth.currentUser;
        
        if (!user) {
            console.log("Connection lost. Re-establishing...");
            const userCredential = await signInAnonymously(auth);
            user = userCredential.user;
        }

        // --- 2. DATA CLEANING (The "Sanitizer") ---
        // This forces every single field to be a valid String/Boolean
        // Firestore creates errors if you accidentally send 'undefined'
        const cleanQuestions = state.questions.map(q => ({
            question: String(q.question || '').trim(), 
            correctAnswer: String(q.correctAnswer || '').trim(),
            isMultipleChoice: Boolean(q.isMultipleChoice),
            options: Array.isArray(q.options) ? q.options.map(o => String(o || '').trim()) : []
        }));

        const data = {
            creatorId: user.uid,   // Use the safe 'user' variable
            creatorName: String(state.profile.name || 'Anonymous'),
            questions: cleanQuestions, 
            mode: String(state.selectedMode || 'friends'), 
            lieDetector: state.lieDetector,
            message: String(state.message || ''),
            secretMessage: String(state.secretMessage || ''),
            secretCount: Math.min(Number(state.secretCount || state.questions.length), cleanQuestions.length),

            timestamp: new Date().toISOString()
        };

        
        if (!state.quizId && state.pendingArchive) {
             state.quizHistory.push(state.pendingArchive);
             state.pendingArchive = null;
        }
        
        
        // --- 3. DATABASE SAVE ---
        if (state.quizId) {
            // Updating an existing quiz
            await setDoc(doc(db, "quizzes", state.quizId), data, { merge: true });
            pookieAlert("Quiz updated! 💅", "success");
        } else {
            // Creating a NEW quiz
            data.attempts = []; 
            const ref = await addDoc(collection(db, "quizzes"), data);
            state.quizId = ref.id;
        }

        // --- 4. SUCCESS ---
        state.isLoading = false; 
        Sound.play('success'); 
try {
            await loadScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch(e) { console.log("Confetti skipped"); }

        state.isLoading = false; 
        Sound.play('success'); 
        setView('share');

    } catch(e) { 
        console.error("SAVE ERROR:", e); 
        state.isLoading = false; 
        render(); 
        alert("Error details: " + e.message); 
    }
};



        window.copyLink = () => {
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?q=${state.quizId}`).then(() => pookieAlert("Link copied! 💌", "success"));
        };

        window.handleStartOwnQuiz = () => {
    // FIX: Only archive if WE created this quiz (userEmail matches creatorId)
    // Or if we are in Guest mode, check if we just made it.
    const isMyQuiz = state.view === 'share'; 

    if (state.quizId && state.questions.length > 0 && isMyQuiz) {
        const alreadySaved = state.quizHistory.some(q => q.id === state.quizId);
        
        if (!alreadySaved) {
            // --- FIX: Store in pendingArchive instead of history immediately ---
            // We only move this to "Memory" if they actually finish the new quiz.
            state.pendingArchive = {
                id: state.quizId,
                timestamp: new Date().toISOString(),
                questions: JSON.parse(JSON.stringify(state.questions)), 
                mode: state.selectedMode
            };
            saveState(); 
        }
    }

    // Reset state for the new quiz
    state.questions = []; 
    state.friendAnswers = []; 
    state.attemptResult = null; 
    state.activeQuiz = null;
    state.quizId = null; 
    state.secretMessage = '';
    state.secretCount = null;
    state.message = '';

    // Auto-fill profile name if they just played as a guest
    if (state.friendName) {
        state.profile.name = state.friendName;
    }
            
    // Routing Logic
    if(state.profile.name && state.profile.dob) {
        setView('create'); 
    } else {
        setView('auth'); 
    }
    window.history.pushState({}, document.title, window.location.pathname);
};



        window.openDashboardConfirm = () => { 
            state.showDashboardConfirm = true; render(); };
        window.cancelDashboard = () => { state.showDashboardConfirm = false; render(); };
        
                               window.confirmDashboard = async () => {
            state.showDashboardConfirm = false;
            const originView = state.view;
            state.isLoading = true; 
            state.loadingText = "Retrieving your tea... ☕️"; 
            render();
            
            // --- FIX: Fetch Permanent History from Database ---
            try {
                const user = auth.currentUser;
                if (user) {
                    // Ask database: "Give me ALL quizzes made by this user, newest first"
                    const historyQuery = query(
                        collection(db, "quizzes"), 
                        where("creatorId", "==", user.uid),
                        orderBy("timestamp", "desc")
                    );
                    
                    const historySnapshot = await getDocs(historyQuery);
                    
                    // Update the "Memory Box" with real data from the database
                    state.quizHistory = historySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                }
            } catch (e) {
                console.error("History fetch failed:", e);
                // We don't stop the app here, we just rely on local storage as a backup
            }
            // ------------------------------------------------

            // Clear previous listener
            if (state.unsubscribe) {
                state.unsubscribe();
                state.unsubscribe = null;
            }
            
            const displayId = state.quizId || (state.pendingArchive ? state.pendingArchive.id : null);

            if (displayId) {
                try {
                    state.unsubscribe = onSnapshot(doc(db, "quizzes", displayId), (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            state.attempts = data.attempts || [];
                            
                            if (data.questions) {
                                state.questions = data.questions;
                            }
                            
                            state.isLoading = false;
                            state.dashboardOrigin = originView;
                            setView('dashboard');
                        }
                    }, (error) => {
                        state.isLoading = false;
                        console.error(error);
                        pookieAlert("Could not load results", "error");
                    });
                } catch(e) {
                    state.isLoading = false;
                    pookieAlert("Setup error", "error");
                }
            } else {
                state.attempts = []; 
                state.isLoading = false;
                state.dashboardOrigin = originView;
                setView('dashboard');
            }
        };



window.toggleMemoryDropdown = () => { 
    state.skipAnim = true;
    const y = window.scrollY;
    
    state.showMemoryDropdown = !state.showMemoryDropdown; 
    Sound.play('pop'); 
    render();
    
    window.scrollTo(0, y);
    state.skipAnim = false;
};



        // --- RESPONDER LOGIC ---
        window.startAttempt = () => {
            const el = document.getElementById('friendNameInput');
            if(!el || !el.value.trim()) { pookieAlert("Name pls! 🥺", "error"); return; }
            state.friendName = el.value.trim();
            state.friendAnswers = new Array(state.activeQuiz.questions.length).fill('');
            state.attemptTimers = [];
            Sound.play('pop'); render();
        };

        window.updateFriendAnswer = (i, v) => { state.friendAnswers[i] = v; };
        
                window.handleOptionSelect = (i, v) => {
            // Lock the screen so it doesn't jump
            state.skipAnim = true;
            const y = window.scrollY;

            state.friendAnswers[i] = v;
            Sound.play('pop');
            render();
            
            // Restore position instantly
            window.scrollTo(0, y);
            state.skipAnim = false;
        };

    window.resetAttempt = () => {
    state.friendName = '';
    state.friendAnswers = [];
    state.attemptResult = null;
    Sound.play('pop');
    render();
    window.scrollTo(0,0);
};


        window.handleSubmitAttempt = async () => {
            if (state.panicInterval) {
        clearInterval(state.panicInterval);
        state.panicInterval = null;
    }
    if(state.friendAnswers.some(a => a === '')) { pookieAlert("Don't leave blanks! 🫣", "error"); return; }
    
    state.isLoading = true; state.loadingText = "Calculating vibe check... 📐"; render();
    
    let score = 0;
    const total = state.activeQuiz.questions.length;
    
    state.activeQuiz.questions.forEach((q, i) => {
        const ans = state.friendAnswers[i].toLowerCase().trim();
        const corr = q.correctAnswer.toLowerCase().trim();
        if(ans === corr) score++;
    });

    const result = {
        friendName: state.friendName,
        score: score, total: total,
        timestamp: new Date().toISOString(),
        answers: state.friendAnswers,
        timers: state.attemptTimers || []
    };

    try {
        const ref = doc(db, "quizzes", state.quizId);
        // Use arrayUnion to safely add to the list without reading it first
        await updateDoc(ref, {
            attempts: arrayUnion(result)
        });
        
        state.attemptResult = result;
        state.isLoading = false;
        if(score === total) {
            Sound.play('success');
            confetti({ particleCount: 150, spread: 100 });
        } else {
            Sound.play('pop');
        }
        render();
    } catch(e) {
        console.error(e);
        state.isLoading = false;
        pookieAlert("Error submitting 😭", "error");
    }
};
         window.openEnvelope = async (index) => {
    // 1. Save Scroll
    state.skipAnim = true;
    state.lastScrollY = window.scrollY; // Save to a state variable since we leave the view

                // --- Standard Access ---
            const archive = state.quizHistory[index];

    
             state.isLoading = true; state.loadingText = "Unsealing memory... 💌"; render();
    try {
        const docSnap = await getDoc(doc(db, "quizzes", archive.id));
        if (docSnap.exists()) {
            state.viewingEnvelope = { ...archive, attempts: docSnap.data().attempts || [] };
            Sound.play('pop');
        } else {
            pookieAlert("This memory is lost 🍂", "error");
        }
    } catch (e) { console.error(e); pookieAlert("Could not open envelope", "error"); } 
    finally { 
        state.isLoading = false; 
        render(); 
    }
};

window.closeEnvelope = () => { 
    state.viewingEnvelope = null; 
    
    // 2. Restore Scroll
    state.skipAnim = true;
    render(); 
    
    if(state.lastScrollY) window.scrollTo(0, state.lastScrollY);
    state.skipAnim = false;
};


window.openEnvelopeReceipt = (attemptIndex) => {
    state.viewingEnvelopeAttempt = state.viewingEnvelope.attempts[attemptIndex];
    render();
};

window.closeEnvelopeReceipt = () => { state.viewingEnvelopeAttempt = null; render(); };

        // --- SHARE CARD LOGIC ---
window.openShareCard = async () => {
    // FIX: Set dynamic card colors
    // Inside window.openShareCard...
const isDark = state.profile.vibe === '🔥 Spicy';
state.cardBg = isDark ? 'bg-zinc-900' : 'bg-gradient-to-br from-rose-100 to-purple-100';
state.cardText = isDark ? 'text-white' : 'text-slate-800';
// NEW: Add a color for small text
state.cardSubText = isDark ? 'text-slate-400' : 'text-slate-600';

    state.showShareCard = true;
    Sound.play('pop');
    render();
    
    // 2. Show a loading state inside the QR box while we download scripts
    const qrContainer = document.getElementById('share-qr');
    if (qrContainer) qrContainer.innerHTML = '<div class="animate-spin text-rose-400">⌛</div>';

    // 3. --- NEW: LAZY LOAD SCRIPTS ---
    try {
        await Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js')
        ]);

        // 4. Generate QR (Now safe because scripts are loaded)
        qrContainer.innerHTML = ''; 
        new QRCode(qrContainer, {
            text: `${window.location.origin}${window.location.pathname}?q=${state.quizId}`,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        
        // CSS Fix for visual size
        const qrCanvas = qrContainer.querySelector('canvas');
        if(qrCanvas) { qrCanvas.style.width = '60px'; qrCanvas.style.height = '60px'; }
        const qrImg = qrContainer.querySelector('img');
        if(qrImg) { qrImg.style.width = '60px'; qrImg.style.height = '60px'; }

    } catch (e) {
        console.error("Share scripts failed", e);
        pookieAlert("Could not load QR tools ☁️", "error");
    }
};


window.closeShareCard = () => { state.showShareCard = false; render(); };

window.downloadShareCard = () => {
    const card = document.getElementById('capture-card');
    const btn = document.getElementById('download-btn');
    
    // 1. Visual Feedback
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" size="20"></i> Saving...`;
    
    // 2. Capture
    html2canvas(card, {
        scale: 3, // High resolution for Retina screens
        backgroundColor: null, // Transparent corners
        useCORS: true,
        logging: false
    }).then(canvas => {
        // 3. Download
        const link = document.createElement('a');
        link.download = `pookie-receipt-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // 4. Reset
        btn.innerHTML = `Save Image ⬇️`;
        pookieAlert("Saved to photos! 🎀", "success");
        Sound.play('success');
    });
};
    
window.shareFromDashboard = () => {
    // 1. Prepare the data for the card
    // We use your profile name because YOU are the creator viewing the dashboard
    state.tempCreatorName = state.profile.name; 
    state.attemptResult = state.viewingAttempt;
    state.friendName = state.viewingAttempt.friendName;
    
    // 2. Close the detail popup
    state.viewingAttempt = null;
    
    // 3. Open the Share Card
    openShareCard();
};

window.shareFromMemory = () => {
    // 1. Prepare data from the archive
    state.tempCreatorName = state.profile.name; 
    state.attemptResult = state.viewingEnvelopeAttempt;
    state.friendName = state.viewingEnvelopeAttempt.friendName;
    
    // 2. Close the memory modal so the card can show
    state.viewingEnvelopeAttempt = null;
    
    // 3. Open the Share Card
    openShareCard();
};


               // --- UTILITIES ---
                window.openAttemptDetail = (index) => {
            state.viewingAttempt = state.attempts[index];
            Sound.play('pop');
            render();
        };

        window.closeAttemptDetail = () => {
            state.viewingAttempt = null;
            render();
        };
    

    window.openVibePicker = () => { state.showVibePicker = true; render(); };
window.closeVibePicker = () => { state.showVibePicker = false; render(); };

    window.selectVibe = (v) => {
    // 1. Update State
    state.profile.vibe = v;
    saveState();
    Sound.play('pop');

    // 2. Apply Theme Colors Instantly
    applyTheme(v);

    // 3. Update Button Styles Manually (Keeps modal stable)
    const buttons = document.querySelectorAll('button[onclick^="selectVibe"]');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${v}'`)) {
            // Active Style
            btn.className = "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 border-rose-400 bg-rose-50 scale-105";
        } else {
            // Inactive Style
            btn.className = "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 border-slate-100 hover:border-rose-200";
        }
    });
};
            
        async function initApp() {
            loadLocalState();
                        // --- NEW: Handle Browser Back Button ---
            window.onpopstate = (event) => {
                if (event.state && event.state.view) {
                    // Go back to the view stored in history
                    state.view = event.state.view;
                    render();
                } else {
                    // If no history, default to landing page
                    state.view = 'landing';
                    render();
                }
            };

            const urlParams = new URLSearchParams(window.location.search);
            const quizId = urlParams.get('q');

            if (quizId) {
                state.isLoading = true; state.loadingText = "Loading Quiz... 🧸"; render();
                try {
                    const docSnap = await getDoc(doc(db, "quizzes", quizId));
                    if (docSnap.exists()) {
                        state.activeQuiz = docSnap.data();
                        state.quizId = quizId;
                        state.view = 'attempt';
                        state.friendName = '';
                        state.friendAnswers = [];
                        state.attemptResult = null;
                    } else {
                        pookieAlert("Quiz expired or deleted 💔", "error");
                        state.view = 'landing';
                    }
                } catch(e) {
                    console.error(e);
                    pookieAlert("Connection failed ☁️", "error");
                    state.view = 'landing';
                } finally {
                    state.isLoading = false;
                    render();
                }
      } else {
                // FIX: Intelligent Redirect on Reload
                if (state.profileCompleted) {
                    // 1. If we have a finished quiz (ID exists), default to SHARE to hide old questions
                    if (state.quizId && !['create', 'share', 'dashboard'].includes(state.view)) {
                        state.view = 'share';
                    }
                    // 2. Otherwise, default to CREATE (for drafts)
                    else if (!['create', 'share', 'dashboard'].includes(state.view)) {
                        state.view = 'create';
                    }
                }

                render();
            }

            
            // Interaction listener for AudioContext
           //  both click and touchstart to ensure mobile users hear the pop!
const unlockAudio = () => {
    if(Sound.ctx && Sound.ctx.state === 'suspended') {
        Sound.ctx.resume();
    }
    // Remove listeners once unlocked so we don't drain battery checking every tap
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
};

document.addEventListener('click', unlockAudio);
document.addEventListener('touchstart', unlockAudio);

        }

        initApp();

