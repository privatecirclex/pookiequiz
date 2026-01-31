// --- STATE ---
        export const DEFAULT_STATE = {
            view: 'landing',
            viewingAttempt: null,
            isLoading: false,
            loadingText: 'Loading...',
            isLoggedIn: false,
            userEmail: '',
            profileCompleted: false,
            profile: { name: '', dob: '', zodiac: '', element: '', vibe: '🌙 Soft', emoji: '🧸' },
            selectedMode: 'friends',
            questions: [],
            activeQuiz: null,
            quizId: null,
            quizHistory: [],
            viewingEnvelope: null,
            viewingEnvelopeAttempt: null,
            friendName: '',
            friendAnswers: [],
            attemptResult: null,
            attempts: [],
            editDraft: {},
            showDashboardConfirm: false,
            showTemplateModal: false,
            showProfileEditor: false,
            activeTemplateIndex: null,
            message: '',
            unsubscribe: null,
            previousView: 'create',
            showMemoryDropdown: false,
            skipAnim: false,
            showShareCard: false,
            lieDetector: false,        //toggle
            currentQuestionIndex: 0,   // Which question is the friend seeing?
            questionStartTime: 0,      // When did this specific question appear?
            panicInterval: null,       // The timer ID for the "Panic" messages
            hasPanicked: false,        // Did we already show a panic message for this Q?
            activeDashboardTab: null,            
            showVibePicker: false
        };
   export const STORAGE_KEY = 'knowme_pookie_v2_lux';

       // 3. Game Modes
       export const MODES = {
            friends: { label: 'Besties', icon: 'users', emoji: '👯‍♀️', color: 'text-blue-400' },
            couple: { label: 'Pookies', icon: 'heart', emoji: '💑', color: 'text-rose-500' },
            crush: { label: 'special someone', icon: 'zap', emoji: '👀', color: 'text-purple-400' }
        };
    
