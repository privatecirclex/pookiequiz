import { QUIZ_TEMPLATES } from './questions.js';
import { THEMES } from './themes.js';
import { MODES } from './constants.js';

export function renderModals(root, state) {
    
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


