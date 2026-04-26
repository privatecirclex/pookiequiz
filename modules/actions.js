import { db, auth, doc, setDoc, getDoc, collection, addDoc, onSnapshot, updateDoc, arrayUnion, query, where, getDocs, orderBy, signInAnonymously } from './firebase.js';
import { state, saveState } from './state.js';
import { render } from './render.js';
import { QUIZ_TEMPLATES } from './questions.js';
import { THEMES } from './themes.js';
import { Sound } from './sound.js';
import { DEFAULT_STATE, STORAGE_KEY, MODES } from './constants.js';
import { getFooter, getZodiac, applyTheme, loadScript } from './helpers.js';



// --- ACTIONS ---
        // ---- Real-Time Creator Notifications ---
        window.startCreatorNotificationListener = () => {
            if (!state.quizId) return; // Only listen if they actually have a published quiz
            if (state.creatorNotifUnsubscribe) return; // Don't run multiple listeners

            state.creatorNotifUnsubscribe = onSnapshot(doc(db, "quizzes", state.quizId), (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const totalAttempts = data.attempts ? data.attempts.length : 0;
                    
                    // Initialize if they've never seen any attempts before
                    if (state.lastSeenAttempts === undefined || state.lastSeenAttempts === null) {
                        state.lastSeenAttempts = totalAttempts;
                    }

                    // Did the number of attempts go up?
                    if (totalAttempts > state.lastSeenAttempts) {
                        
                        // FIX: If they are actively staring at the Dashboard, they see it! No dot needed.
                        if (state.view === 'dashboard') {
                            state.lastSeenAttempts = totalAttempts;
                            state.unreadAttempts = 0;
                            saveState();
                            return; 
                        }

                        state.unreadAttempts = totalAttempts - state.lastSeenAttempts;
                        
                        // Show the Toaster if on 'create' page AND it's their first time seeing the toaster
                        if (state.view === 'create' && !state.hasSeenRealtimeToaster) {
                            state.hasSeenRealtimeToaster = true; // One-time only!
                            
                            // 1. Nuke the old "Quiz Results" tutorial toaster so they don't overlap
                            state.dismissedDashboardToaster = true; 
                            
                            // 2. Show the new dynamic toaster
                            state.showNewAttemptToaster = true;
                            Sound.play('success'); // Satisfying ping!
                            render();
                            
                            // 3. Hide it after 4.5 seconds
                            setTimeout(() => {
                                state.showNewAttemptToaster = false;
                                render();
                            }, 4500);
                        } else {
                            // If they already saw the toaster, just update the red glowing dot
                            render(); 
                        }
                        saveState();
                    }
                }
            });
        };
                        if (state.view === 'create' && !state.hasSeenRealtimeToaster) {
                            state.hasSeenRealtimeToaster = true; // One-time only!
                            
                            // 1. Nuke the old "Quiz Results" tutorial toaster so they don't overlap
                            state.dismissedDashboardToaster = true; 
                            
                            // 2. Show the new dynamic toaster
                            state.showNewAttemptToaster = true;
                            Sound.play('success'); // Satisfying ping!
                            render();
                            
                            // 3. Hide it after 4.5 seconds
                            setTimeout(() => {
                                state.showNewAttemptToaster = false;
                                render();
                            }, 4500);
                        } else {
                            // If they already saw the toaster, just update the red glowing dot
                            render(); 
                        }
                        saveState();
                    }
                }
            });
        };

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

// Variable to hold the rating before they hit submit
let currentTempRating = 0;

window.setTempRating = (rating) => {
    currentTempRating = rating;
    Sound.play('pop');
    
    // Update the hearts visually without re-rendering the whole app
    for (let i = 1; i <= 5; i++) {
        const star = document.getElementById(`star-${i}`);
        if (star) {
            if (i <= rating) {
                star.classList.remove('grayscale', 'opacity-40');
                star.classList.add('scale-110'); // Give it a pop
            } else {
                star.classList.add('grayscale', 'opacity-40');
                star.classList.remove('scale-110');
            }
        }
    }
};

window.submitFeedback = async () => {
    const noteInput = document.getElementById('feedback-note');
    const noteText = noteInput ? noteInput.value.trim() : '';

    // Prevent blank submissions
    if (currentTempRating === 0 && !noteText) {
        pookieAlert("Give us a rating or leave a note first! 🥺", "error");
        return;
    }

    state.isLoading = true; 
    state.loadingText = "Sending your tea... 🕊️"; 
    render(); 

    // 🚨 Review WEBHOOK URL HERE 🚨
 const WEBHOOK_URL = "https://pookie-proxy.suhaibnabilone1.workers.dev/"; 


    // Build the cute message card for Discord
    const discordMessage = {
        embeds: [{
            title: "🎀 New Pookie App Review!",
            color: 16480117, // Pookie Pink
            fields: [
                { name: "User", value: state.profile.name || "Anonymous", inline: true },
                { name: "Rating", value: "💖".repeat(currentTempRating) || "No rating", inline: true },
                { name: "The Tea ☕", value: noteText || "*No written note*" }
            ],
            timestamp: new Date().toISOString()
        }]
    };

        try {
        // Send to Cloudflare proxy
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: "general", payload: discordMessage })
        });

        // Save that they rated it so the card flips to the "Thanks" view
        state.hasRatedApp = true;
        saveState();
        Sound.play('success');

    } catch (error) {
        console.error("Discord error:", error);
        pookieAlert("Couldn't send feedback! Check connection ☁️", "error");
    } finally {
        state.isLoading = false;
        render(); // This officially shows the "Thanks bestie!" message
    }
};

window.dismissDashboardToaster = (e) => {
    if (e) e.stopPropagation(); // Stops them from accidentally clicking the dashboard button behind it
    state.dismissedDashboardToaster = true;
    saveState();
    Sound.play('pop'); // A satisfying little click sound
    render();
};


window.dismissFeedback = () => {
    // 1. Tell the state to remember they closed it
    state.dismissedFeedback = true;
    saveState();
    
    // 2. Play a little pop sound for satisfying UX
    Sound.play('pop');
    
    // 3. Re-render the screen to instantly remove the card
    render();
};

window.submitBugReport = async () => {
    const noteInput = document.getElementById('popup-bug-note');
    const noteText = noteInput ? noteInput.value.trim() : '';
    const btn = document.getElementById('bug-submit-btn');

    if (!noteText) {
        pookieAlert("Don't leave it blank bestie! 🥺", "error");
        return;
    }

    // Show a loading state on the button itself
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = `Sending... 🕊️`;
    btn.disabled = true;

    // 🚨 BUG-CHANNEL WEBHOOK URL HERE 🚨
    const BUG_WEBHOOK_URL = "https://pookie-proxy.suhaibnabilone1.workers.dev/"; 


    // Build the message card for Discord (Red color for alerts)
    const discordMessage = {
        embeds: [{
            title: "🚨 New Bug Report!",
            color: 15548997, // Red/Crimson color
            fields: [
                { name: "User", value: state.profile?.name || "Anonymous / Guest", inline: true },
                { name: "The Bug 🐛", value: noteText }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        // Send to Cloudflare proxy as a bug
        await fetch(BUG_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: "bug", payload: discordMessage })
        });

        Sound.play('success');
        pookieAlert("Bug reported! You're a lifesaver 💅", "success");
        
        // Clean up: Clear the box, fade out the popup, and reset the view for next time
        noteInput.value = '';
        const popup = document.getElementById('beta-popup');
        popup.style.opacity = '0';
        
        setTimeout(() => {
            popup.style.display = 'none';
            document.getElementById('beta-bug-view').style.display = 'none';
            document.getElementById('beta-welcome-view').style.display = 'block';
            popup.style.opacity = '1'; // Reset opacity for next reload
        }, 300);

    } catch (error) {
        console.error("Discord error:", error);
        pookieAlert("Couldn't send report! Check connection ☁️", "error");
    } finally {
        // Reset the button
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
    }
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

        // --- NEW: Start listening for incoming attempts immediately! ---
        window.startCreatorNotificationListener();

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
            state.hasCopiedLink = true; // Tell the app they copied it!
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?q=${state.quizId}`).then(() => pookieAlert("Link copied! 💌", "success"));
        };

        // --- NEW: Safe Home Navigation ---
        window.handleHomeClick = () => {
            if (!state.hasCopiedLink && state.quizId) {
                // Show our custom beautifully styled modal instead of the browser alert
                state.showHomeConfirm = true;
                Sound.play('error'); // Play a gentle alert sound
                render();
            } else {
                // If they already copied it, just go home instantly
                window.handleStartOwnQuiz();
            }
        };

        window.confirmHomeAndCopy = () => {
            state.showHomeConfirm = false;
            window.copyLink();
            setTimeout(() => { window.handleStartOwnQuiz(); }, 800);
        };

        window.cancelHome = () => {
            state.showHomeConfirm = false;
            render();
        };
        
        window.forceHomeWithoutCopy = () => {
            state.showHomeConfirm = false;
            window.handleStartOwnQuiz();
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

    // Clean up old listener before resetting
    if (state.creatorNotifUnsubscribe) {
        state.creatorNotifUnsubscribe();
        state.creatorNotifUnsubscribe = null;
    }

            
      state.questions = []; 
    state.friendAnswers = []; 
    state.lastSeenAttempts = 0;
    state.unreadAttempts = 0;
    state.hasSeenRealtimeToaster = false;
    state.hasCopiedLink = false; 
    state.dismissedLiveBanner = false;
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
            
            // --- NEW: Clear Notifications ---
            state.showNewAttemptToaster = false;
            if (state.unreadAttempts > 0) {
                state.lastSeenAttempts += state.unreadAttempts;
                state.unreadAttempts = 0;
                saveState();
            }
            
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
            state.currentQuestionIndex = 0; 
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
    state.currentQuestionIndex = 0; 
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
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js');
                confetti({ particleCount: 150, spread: 100 });
            } catch(e) { console.log("Confetti skipped"); }
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
        
          // DEV GOD MODE PING
        
        sendGodModeAlert("🖼️ Card Downloaded!", `${state.friendName} just saved their results to their photos! 💅`, 15105570);
        
        // 4. Reset
        btn.innerHTML = `Save Image ⬇️`;
        pookieAlert("Saved to photos! 🎀", "success");
        Sound.play('success');
    });
};
    
window.sendGodModeAlert = async (title, message, color = 16480117) => {
    const WEBHOOK_URL = "https://pookie-proxy.suhaibnabilone1.workers.dev/"; 
    
    await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: "general", // Tell Cloudflare to use the general vault
            payload: {
                embeds: [{
                    title: title,
                    description: message,
                    color: color,
                    footer: { text: `Pookie Analytics • ${new Date().toLocaleTimeString()}` }
                }]
            }
        })
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
    
                window.dismissLiveBanner = () => {
            state.dismissedLiveBanner = true;
            saveState();
            Sound.play('pop');
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
            
