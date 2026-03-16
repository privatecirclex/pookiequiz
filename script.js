import { db, doc, getDoc } from './modules/firebase.js';
import { state, loadLocalState } from './modules/state.js';
import { render } from './modules/render.js';
import { Sound } from './modules/sound.js';
import './modules/actions.js'; 
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

