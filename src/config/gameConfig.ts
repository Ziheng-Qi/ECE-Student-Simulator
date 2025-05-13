export const GAME_CONFIG = {
    // Academic Settings
    SEMESTER_LENGTH: 4, // months per semester (1-5, 8-12)
    TOTAL_SEMESTERS: 8, // total semesters in the game
    COURSES_PER_SEMESTER: 4, // typical number of courses per semester
    
    // Skill Settings
    SKILL_GAIN_RATE: {
        PROGRAMMING: 5, // per activity
        HARDWARE: 5,
        RESEARCH: 3,
        INTERNSHIP: 4,
        TIME_MANAGEMENT: 2,
        LEETCODE: 8, // per problem solved
        INTERVIEW_SKILLS: 4
    },
    
    // Resource Settings
    ENERGY_COST: {
        CLASS: 10,
        HOMEWORK: 15,
        RESEARCH: 20,
        INTERNSHIP: 25,
        CLUB: 10,
        LEETCODE: 12,
        INTERVIEW_PREP: 15,
        APPLY_JOBS: 8,
        REST: -20 // negative means recovery
    },
    
    // Stress Settings
    STRESS_GAIN: {
        CLASS: 5,
        HOMEWORK: 10,
        RESEARCH: 8,
        INTERNSHIP: 12,
        CLUB: 3,
        LEETCODE: 8,
        INTERVIEW_PREP: 15,
        APPLY_JOBS: 10,
        REST: -10
    },
    
    // Money Settings
    MONEY_GAIN: {
        INTERNSHIP: 1000, // per month
        RESEARCH: 500, // per month
        CLUB: 0
    },
    
    // GPA Impact
    GPA_IMPACT: {
        CLASS_ATTENDANCE: 0.1,
        HOMEWORK_COMPLETION: 0.2,
        EXAM_PERFORMANCE: 0.7
    },

    // Interview Success Rate
    INTERVIEW_SUCCESS: {
        BASE_RATE: 0.2, // base success rate
        LEETCODE_BONUS: 0.1, // per 10 leetcode problems solved
        INTERVIEW_PREP_BONUS: 0.15, // per interview prep session
        MAX_BONUS: 0.5 // maximum bonus from preparation
    },

    // Random Events
    RANDOM_EVENTS: {
        PLAGIARISM_CHANCE: 0.1, // chance of getting caught for plagiarism
        RESEARCH_OPPORTUNITY: 0.05, // chance of getting research opportunity
        NETWORKING_CHANCE: 0.15, // chance of networking event
        MENTOR_CHANCE: 0.03 // chance of finding a mentor
    }
}; 