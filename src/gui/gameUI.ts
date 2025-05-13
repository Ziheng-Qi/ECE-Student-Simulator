import { VariableStore } from '../variableStore';
import { ActivitySystem, Activity } from '../activities/activitySystem';
import { EventSystem, GameEvent } from '../events/eventSystem';
import { GAME_CONFIG } from '../config/gameConfig';

export class GameUI {
    private store: VariableStore;
    private activitySystem: ActivitySystem;
    private eventSystem: EventSystem;
    
    constructor() {
        this.store = new VariableStore();
        this.activitySystem = new ActivitySystem(this.store);
        this.eventSystem = new EventSystem(this.store);
        
        // Set up variable change listener
        this.store.onVariableChanged = this.handleVariableChange.bind(this);
        
        // Initialize UI
        this.initializeUI();
    }
    
    private initializeUI(): void {
        // Set up activity cards
        const activitiesGrid = document.getElementById('activities-grid');
        if (activitiesGrid) {
            const activities = this.activitySystem.getAvailableActivities();
            activities.forEach(activity => {
                const card = this.createActivityCard(activity);
                activitiesGrid.appendChild(card);
            });
        }
        
        // Initial status update
        this.updateAllStatus();
    }
    
    private createActivityCard(activity: Activity): HTMLElement {
        const card = document.createElement('div');
        card.className = 'activity-card';
        
        const title = document.createElement('h4');
        title.textContent = activity.name;
        
        const description = document.createElement('p');
        description.textContent = activity.description;
        
        card.appendChild(title);
        card.appendChild(description);
        
        card.addEventListener('click', () => this.handleActivityClick(activity));
        
        return card;
    }
    
    private handleActivityClick(activity: Activity): void {
        try {
            activity.execute(this.store);
            this.addEventToLog(`You chose to ${activity.name.toLowerCase()}`);
            
            // Check for random events
            const events = this.eventSystem.checkForEvents();
            events.forEach(event => {
                this.eventSystem.executeEvent(event);
                this.addEventToLog(event.description);
            });
            
            // Update month
            this.advanceMonth();
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.showMessage(error.message);
            } else {
                this.showMessage('An unexpected error occurred');
            }
        }
    }
    
    private handleVariableChange(sender: VariableStore, event: any): void {
        if (event.clear) {
            this.updateAllStatus();
        } else {
            this.updateStatus(event.varName, event.newValue);
        }
    }
    
    private updateAllStatus(): void {
        const variables = [
            'gpa', 'semester', 'month', 'year',
            'programming', 'hardware', 'research', 'internship',
            'energy', 'stress', 'money'
        ];
        
        variables.forEach(varName => {
            const value = this.store.getVar(varName, false);
            if (value !== undefined) {
                this.updateStatus(varName, value);
            }
        });
    }
    
    private updateStatus(varName: string, value: number): void {
        const element = document.getElementById(varName);
        if (element) {
            if (varName === 'money') {
                element.textContent = `$${Math.floor(value)}`;
            } else {
                element.textContent = value.toFixed(2);
            }
        }
        
        const progressElement = document.getElementById(`${varName}-progress`);
        if (progressElement) {
            const [min, max] = this.store.getVarLimits(varName);
            const percentage = ((value - min) / (max - min)) * 100;
            progressElement.style.width = `${percentage}%`;
        }
    }
    
    private advanceMonth(): void {
        let month = this.store.getVar('month', false) || 1;
        let semester = this.store.getVar('semester', false) || 1;
        let year = this.store.getVar('year', false) || 1;
        
        month++;
        if (month > GAME_CONFIG.SEMESTER_LENGTH) {
            month = 1;
            semester++;
            if (semester > 2) { // 2 semesters per year
                semester = 1;
                year++;
                if (year > 4) { // 4 years total
                    this.showMessage('Congratulations! You have completed your ECE degree!');
                    return;
                }
            }
        }
        
        this.store.setVar('month', month, false);
        this.store.setVar('semester', semester, false);
        this.store.setVar('year', year, false);
        
        this.showMessage(`Starting month ${month} of semester ${semester}, year ${year}`);
    }
    
    private addEventToLog(message: string): void {
        const eventLog = document.getElementById('event-log-content');
        if (eventLog) {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.textContent = message;
            eventLog.insertBefore(eventItem, eventLog.firstChild);
        }
    }
    
    private showMessage(message: string): void {
        const messageBox = document.getElementById('message-box');
        if (messageBox) {
            messageBox.textContent = message;
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new GameUI();
}); 