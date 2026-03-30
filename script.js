import { db, doc, getDoc } from './modules/firebase.js';
import { state, loadLocalState } from './modules/state.js';
import { render } from './modules/render.js';
import { Sound } from './modules/sound.js';
import './modules/actions.js'; 
const startTime = Date.now();
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
// --- 🌟 SMART SESSION SUMMARY PING 🌟 ---
let backgroundTimer = null;

const sendSessionSummaryPing = () => {
    // Stop duplicate pings
    if (window.hasSentEndPing) return;

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);
    const WEBHOOK_URL = "https://pookie-proxy.suhaibnabilone1.workers.dev/"; 

    // 🔥 FILTER: Only send a summary if they actually stayed on the site for at least 10 seconds total
    if (durationSeconds > 10) {
        window.hasSentEndPing = true; 
        const durationMinutes = (durationSeconds / 60).toFixed(1); 

        // 1. Package the Unified Data
        const payload = JSON.stringify({
            type: "general", 
            payload: {
                embeds: [{
                    title: "📊 Session Summary",
                    description: `User: **${state.profile?.name || 'Guest'}**\nTotal Time: **${durationMinutes} mins** (${durationSeconds}s)\nStatus: Left the app.`,
                    color: durationSeconds > 120 ? 5763719 : 16711680 
                }]
            }
        });

        // 2. Fire the silent background ping
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(WEBHOOK_URL, blob);
    }
};


// EVENT 1: Desktop - Fire immediately when they completely close the tab
window.addEventListener('beforeunload', () => {
    if (backgroundTimer) clearTimeout(backgroundTimer); // cancel any pending background timers
    sendSessionSummaryPing();
});

// EVENT 2: Mobile/Tablet - The 15-Second Background Rule
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // They swiped away or switched tabs. Start the 15-second countdown.
        backgroundTimer = setTimeout(() => {
            sendSessionSummaryPing();
        }, 15000); 
    } else {
        // They came back to the app! Cancel the countdown.
        if (backgroundTimer) {
            clearTimeout(backgroundTimer); 
            backgroundTimer = null;
        }
    }
});
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

