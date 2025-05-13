import { VariableStore } from '../variableStore';
import { GAME_CONFIG } from '../config/gameConfig';

export interface Activity {
    name: string;
    description: string;
    execute: (store: VariableStore) => void;
    requirements?: {
        energy: number;
        skills?: Record<string, number>;
    };
}

export class ActivitySystem {
    private store: VariableStore;
    private leetcodeProblemsSolved: number = 0;
    private interviewPrepSessions: number = 0;
    
    constructor(store: VariableStore) {
        this.store = store;
    }
    
    // Academic Activities
    attendClass(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        const gpa = this.store.getVar('gpa', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.CLASS) {
            throw new Error('Not enough energy to attend class!');
        }
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.CLASS, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.CLASS, false);
        // Small GPA boost for attending class
        this.store.setVar('gpa', Math.min(4.0, gpa + 0.01), false);
    }
    
    doHomework(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        const programming = this.store.getVar('programming', false) || 0;
        const gpa = this.store.getVar('gpa', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.HOMEWORK) {
            throw new Error('Not enough energy to do homework!');
        }
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.HOMEWORK, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.HOMEWORK, false);
        this.store.setVar('programming', programming + GAME_CONFIG.SKILL_GAIN_RATE.PROGRAMMING, false);
        // Homework completion affects GPA
        this.store.setVar('gpa', Math.min(4.0, gpa + 0.02), false);
    }
    
    // Internship Preparation Activities
    solveLeetcode(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        const programming = this.store.getVar('programming', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.LEETCODE) {
            throw new Error('Not enough energy to solve LeetCode problems!');
        }
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.LEETCODE, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.LEETCODE, false);
        this.store.setVar('programming', programming + GAME_CONFIG.SKILL_GAIN_RATE.LEETCODE, false);
        this.leetcodeProblemsSolved++;
    }
    
    prepareForInterview(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.INTERVIEW_PREP) {
            throw new Error('Not enough energy to prepare for interviews!');
        }
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.INTERVIEW_PREP, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.INTERVIEW_PREP, false);
        this.interviewPrepSessions++;
    }
    
    applyForJobs(): number {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.APPLY_JOBS) {
            throw new Error('Not enough energy to apply for jobs!');
        }
        
        // Calculate interview success rate based on preparation
        const leetcodeBonus = Math.min(
            GAME_CONFIG.INTERVIEW_SUCCESS.MAX_BONUS,
            (this.leetcodeProblemsSolved / 10) * GAME_CONFIG.INTERVIEW_SUCCESS.LEETCODE_BONUS
        );
        const prepBonus = Math.min(
            GAME_CONFIG.INTERVIEW_SUCCESS.MAX_BONUS - leetcodeBonus,
            this.interviewPrepSessions * GAME_CONFIG.INTERVIEW_SUCCESS.INTERVIEW_PREP_BONUS
        );
        const successRate = GAME_CONFIG.INTERVIEW_SUCCESS.BASE_RATE + leetcodeBonus + prepBonus;
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.APPLY_JOBS, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.APPLY_JOBS, false);
        
        return successRate;
    }
    
    // Research Activities
    doResearch(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        const research = this.store.getVar('research', false) || 0;
        const money = this.store.getVar('money', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.RESEARCH) {
            throw new Error('Not enough energy to do research!');
        }
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.RESEARCH, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.RESEARCH, false);
        this.store.setVar('research', research + GAME_CONFIG.SKILL_GAIN_RATE.RESEARCH, false);
        this.store.setVar('money', money + GAME_CONFIG.MONEY_GAIN.RESEARCH, false);
    }
    
    // Club Activities
    attendClub(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        const timeManagement = this.store.getVar('timeManagement', false) || 0;
        
        if (energy < GAME_CONFIG.ENERGY_COST.CLUB) {
            throw new Error('Not enough energy to attend club!');
        }
        
        this.store.setVar('energy', energy - GAME_CONFIG.ENERGY_COST.CLUB, false);
        this.store.setVar('stress', stress + GAME_CONFIG.STRESS_GAIN.CLUB, false);
        this.store.setVar('timeManagement', timeManagement + GAME_CONFIG.SKILL_GAIN_RATE.TIME_MANAGEMENT, false);
    }
    
    // Rest Activity
    rest(): void {
        const energy = this.store.getVar('energy', false) || 0;
        const stress = this.store.getVar('stress', false) || 0;
        
        this.store.setVar('energy', Math.min(100, energy - GAME_CONFIG.ENERGY_COST.REST), false);
        this.store.setVar('stress', Math.max(0, stress + GAME_CONFIG.STRESS_GAIN.REST), false);
    }
    
    // Get all available activities
    getAvailableActivities(): Activity[] {
        const semester = this.store.getVar('semester', false) || 1;
        const year = this.store.getVar('year', false) || 1;
        
        // Core ECE courses
        const coreCourses = [
            {
                name: "ECE 110 - Introduction to Electronics",
                description: "Learn basic electronics concepts, circuit analysis, and lab skills.",
                requirements: { year: 1, semester: 1 },
                effects: {
                    hardware: 0.3,
                    energy: -0.2,
                    stress: 0.1
                }
            },
            {
                name: "ECE 120 - Introduction to Computing",
                description: "Study digital logic, computer organization, and assembly programming.",
                requirements: { year: 1, semester: 1 },
                effects: {
                    programming: 0.3,
                    energy: -0.2,
                    stress: 0.1
                }
            },
            {
                name: "ECE 210 - Analog Signal Processing",
                description: "Advanced circuit analysis, analog electronics, and signal processing.",
                requirements: { year: 1, semester: 2 },
                effects: {
                    hardware: 0.4,
                    energy: -0.3,
                    stress: 0.2
                }
            },
            {
                name: "ECE 220 - Computer Systems & Programming",
                description: "Computer architecture, C programming, and system design.",
                requirements: { year: 1, semester: 2 },
                effects: {
                    programming: 0.4,
                    energy: -0.3,
                    stress: 0.2
                }
            },
            {
                name: "ECE 310 - Digital Signal Processing",
                description: "Digital signal processing theory and applications.",
                requirements: { year: 2, semester: 1 },
                effects: {
                    hardware: 0.5,
                    programming: 0.3,
                    energy: -0.4,
                    stress: 0.3
                }
            },
            {
                name: "ECE 329 - Fields and Waves",
                description: "Electromagnetic theory and applications.",
                requirements: { year: 2, semester: 1 },
                effects: {
                    hardware: 0.5,
                    energy: -0.4,
                    stress: 0.3
                }
            },
            {
                name: "ECE 385 - Digital Systems Laboratory",
                description: "FPGA design and digital system implementation.",
                requirements: { year: 2, semester: 2 },
                effects: {
                    hardware: 0.6,
                    programming: 0.4,
                    energy: -0.5,
                    stress: 0.4
                }
            },
            {
                name: "ECE 391 - Computer Systems Engineering",
                description: "Operating systems, networking, and system programming.",
                requirements: { year: 2, semester: 2 },
                effects: {
                    programming: 0.6,
                    energy: -0.5,
                    stress: 0.4
                }
            }
        ];

        // Elective courses
        const electiveCourses = [
            {
                name: "ECE 408 - Applied Parallel Programming",
                description: "Learn parallel computing and GPU programming.",
                requirements: { year: 3 },
                effects: {
                    programming: 0.7,
                    energy: -0.4,
                    stress: 0.3
                }
            },
            {
                name: "ECE 445 - Senior Design Project",
                description: "Capstone project course for ECE seniors.",
                requirements: { year: 4 },
                effects: {
                    hardware: 0.8,
                    programming: 0.8,
                    energy: -0.6,
                    stress: 0.5
                }
            },
            {
                name: "ECE 448 - Artificial Intelligence",
                description: "Study AI algorithms and machine learning.",
                requirements: { year: 3 },
                effects: {
                    programming: 0.7,
                    energy: -0.4,
                    stress: 0.3
                }
            }
        ];

        // Research and Internship activities
        const researchActivities = [
            {
                name: "Join Research Lab",
                description: "Work with professors on cutting-edge research projects.",
                requirements: { year: 2 },
                effects: {
                    research: 0.4,
                    energy: -0.3,
                    stress: 0.2
                }
            },
            {
                name: "Summer Research Program",
                description: "Full-time research during summer break.",
                requirements: { year: 2 },
                effects: {
                    research: 0.6,
                    money: 3000,
                    energy: -0.5,
                    stress: 0.3
                }
            }
        ];

        const internshipActivities = [
            {
                name: "Apply for Internships",
                description: "Prepare resumes and interview for tech companies.",
                requirements: { year: 2 },
                effects: {
                    internship: 0.2,
                    energy: -0.2,
                    stress: 0.1
                }
            },
            {
                name: "Summer Internship",
                description: "Work at a tech company during summer break.",
                requirements: { year: 3 },
                effects: {
                    internship: 0.8,
                    money: 8000,
                    energy: -0.4,
                    stress: 0.2
                }
            }
        ];

        // Study and social activities
        const studyActivities = [
            {
                name: "Study for Exams",
                description: "Intensive study session for upcoming exams.",
                effects: {
                    gpa: 0.1,
                    energy: -0.3,
                    stress: 0.2
                }
            },
            {
                name: "Join Study Group",
                description: "Collaborative learning with classmates.",
                effects: {
                    gpa: 0.15,
                    energy: -0.2,
                    stress: -0.1
                }
            }
        ];

        const socialActivities = [
            {
                name: "Attend ECE Social Events",
                description: "Network with peers and professors.",
                effects: {
                    stress: -0.2,
                    energy: -0.1
                }
            },
            {
                name: "Join ECE Student Organizations",
                description: "Participate in IEEE, HKN, or other ECE clubs.",
                effects: {
                    stress: -0.15,
                    energy: -0.1
                }
            }
        ];

        // Combine all activities based on current semester/year
        let availableActivities: Activity[] = [];

        // Add core courses based on semester
        coreCourses.forEach(course => {
            if (course.requirements.year === year && course.requirements.semester === semester) {
                availableActivities.push(this.createCourseActivity(course));
            }
        });

        // Add elective courses
        if (year >= 3) {
            electiveCourses.forEach(course => {
                if (course.requirements.year <= year) {
                    availableActivities.push(this.createCourseActivity(course));
                }
            });
        }

        // Add research activities
        if (year >= 2) {
            researchActivities.forEach(activity => {
                if (activity.requirements.year <= year) {
                    availableActivities.push(this.createActivity(activity));
                }
            });
        }

        // Add internship activities
        if (year >= 2) {
            internshipActivities.forEach(activity => {
                if (activity.requirements.year <= year) {
                    availableActivities.push(this.createActivity(activity));
                }
            });
        }

        // Add study and social activities
        studyActivities.forEach(activity => {
            availableActivities.push(this.createActivity(activity));
        });

        socialActivities.forEach(activity => {
            availableActivities.push(this.createActivity(activity));
        });

        return availableActivities;
    }

    private createCourseActivity(course: any): Activity {
        return {
            name: course.name,
            description: course.description,
            execute: (store: VariableStore) => {
                // Check if student has enough energy
                const energy = store.getVar('energy', false) || 1;
                if (energy < 0.2) {
                    throw new Error("You're too tired to take this course!");
                }

                // Apply course effects
                Object.entries(course.effects).forEach(([key, value]) => {
                    const currentValue = store.getVar(key, false) || 0;
                    store.setVar(key, currentValue + (value as number), false);
                });

                // Update GPA based on performance
                const performance = Math.random() * 0.4 + 0.6; // Random performance between 0.6 and 1.0
                const currentGPA = store.getVar('gpa', false) || 3.0;
                const newGPA = (currentGPA + performance) / 2;
                store.setVar('gpa', newGPA, false);
            }
        };
    }

    private createActivity(activity: any): Activity {
        return {
            name: activity.name,
            description: activity.description,
            execute: (store: VariableStore) => {
                // Check if student has enough energy
                const energy = store.getVar('energy', false) || 1;
                if (energy < 0.2) {
                    throw new Error("You're too tired for this activity!");
                }

                // Apply activity effects
                Object.entries(activity.effects).forEach(([key, value]) => {
                    const currentValue = store.getVar(key, false) || 0;
                    store.setVar(key, currentValue + (value as number), false);
                });
            }
        };
    }
} 