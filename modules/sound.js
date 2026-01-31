          // --- SOUND & HAPTICS (NEW: ASMR EDITION 🎧) ---
       export const Sound = {
            ctx: null,
            enabled: true,
            init: function() {
                if (!this.ctx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContext();
                }
            },
            play: function(type) {
                if (!this.enabled) return;
                if (!this.ctx) this.init();
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const now = this.ctx.currentTime;

                if (type === 'pop') {
                    // NEW: Satisfying "Water Drop" Bloop 💧
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    
                    osc.type = 'sine'; // Sine is smooth (no buzz)
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
                    
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    
                    osc.start(now); 
                    osc.stop(now + 0.15);
                } else if (type === 'success') {
                    // NEW: Dreamy Cloud Chord ☁️
                    // A soft C Major 7th chord (C4, E4, G4, B4)
                    [261.63, 329.63, 392.00, 493.88].forEach((freq, i) => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        
                        osc.type = 'sine';
                        osc.frequency.value = freq;
                        
                        // Stagger the notes slightly for a "strum" effect
                        const start = now + (i * 0.05); 
                        
                        gain.gain.setValueAtTime(0, start);
                        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
                        
                        osc.start(start);
                        osc.stop(start + 0.9);
                    });
                } else if (type === 'error') {
                    // NEW: Low "Bonk" (Gentle thud) 🛑
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    
                    osc.type = 'triangle'; // Slightly textured but low
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.15);
                    
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    
                    osc.start(now);
                    osc.stop(now + 0.15);
                }
            },
            toggle: function() { this.enabled = !this.enabled; return this.enabled; }
        };
