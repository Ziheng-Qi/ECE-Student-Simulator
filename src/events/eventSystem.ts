import { VariableStore } from '../variableStore';
import { GAME_CONFIG } from '../config/gameConfig';

export interface GameEvent {
    name: string;
    description: string;
    probability: number;
    execute: (store: VariableStore) => void;
}

export class EventSystem {
    private store: VariableStore;
    private events: GameEvent[];
    
    constructor(store: VariableStore) {
        this.store = store;
        this.events = this.initializeEvents();
    }
    
    private initializeEvents(): GameEvent[] {
        return [
            // Academic Events
            {
                name: 'Plagiarism Check',
                description: 'Your homework has been flagged for potential plagiarism!',
                probability: GAME_CONFIG.RANDOM_EVENTS.PLAGIARISM_CHANCE,
                execute: (store: VariableStore) => {
                    const gpa = store.getVar('gpa', false) || 0;
                    const stress = store.getVar('stress', false) || 0;
                    store.setVar('gpa', Math.max(0, gpa - 0.5), false);
                    store.setVar('stress', Math.min(100, stress + 30), false);
                }
            },
            {
                name: 'Research Opportunity',
                description: 'A professor has noticed your good work and offered you a research position!',
                probability: GAME_CONFIG.RANDOM_EVENTS.RESEARCH_OPPORTUNITY,
                execute: (store: VariableStore) => {
                    const research = store.getVar('research', false) || 0;
                    const money = store.getVar('money', false) || 0;
                    store.setVar('research', Math.min(100, research + 20), false);
                    store.setVar('money', money + 1000, false);
                }
            },
            {
                name: 'Networking Event',
                description: 'You\'ve been invited to a networking event with industry professionals!',
                probability: GAME_CONFIG.RANDOM_EVENTS.NETWORKING_CHANCE,
                execute: (store: VariableStore) => {
                    const internship = store.getVar('internship', false) || 0;
                    store.setVar('internship', Math.min(100, internship + 15), false);
                }
            },
            {
                name: 'Mentor Found',
                description: 'You\'ve found a great mentor who can guide your career!',
                probability: GAME_CONFIG.RANDOM_EVENTS.MENTOR_CHANCE,
                execute: (store: VariableStore) => {
                    const research = store.getVar('research', false) || 0;
                    const internship = store.getVar('internship', false) || 0;
                    store.setVar('research', Math.min(100, research + 10), false);
                    store.setVar('internship', Math.min(100, internship + 10), false);
                }
            },
            // Exam Events
            {
                name: 'Midterm Exam',
                description: 'Time for midterm exams!',
                probability: 0.25, // Higher probability during exam weeks
                execute: (store: VariableStore) => {
                    const gpa = store.getVar('gpa', false) || 0;
                    const stress = store.getVar('stress', false) || 0;
                    // Random performance between -0.3 and +0.3
                    const performance = (Math.random() * 0.6) - 0.3;
                    store.setVar('gpa', Math.max(0, Math.min(4.0, gpa + performance)), false);
                    store.setVar('stress', Math.min(100, stress + 20), false);
                }
            },
            // Social Events
            {
                name: 'Study Group',
                description: 'Your classmates invite you to join their study group!',
                probability: 0.2,
                execute: (store: VariableStore) => {
                    const gpa = store.getVar('gpa', false) || 0;
                    const stress = store.getVar('stress', false) || 0;
                    store.setVar('gpa', Math.min(4.0, gpa + 0.1), false);
                    store.setVar('stress', Math.max(0, stress - 5), false);
                }
            }
        ];
    }
    
    public checkForEvents(): GameEvent[] {
        const triggeredEvents: GameEvent[] = [];
        
        for (const event of this.events) {
            if (Math.random() < event.probability) {
                triggeredEvents.push(event);
            }
        }
        
        return triggeredEvents;
    }
    
    public executeEvent(event: GameEvent): void {
        event.execute(this.store);
    }
} 