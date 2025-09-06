const courses = [
    {
        id: 1,
        title: "Advanced React Development",
        description: "Master modern React patterns, hooks, and state management",
        category: "Programming",
        level: "Advanced",
        duration: "8 weeks",
        students: 1247,
        rating: 4.8,
        progress: 0,
        emoji: "🚀",
        colorClass: "react"
    },
    {
        id: 2,
        title: "Machine Learning Fundamentals",
        description: "Introduction to ML algorithms and practical applications",
        category: "Data Science",
        level: "Intermediate",
        duration: "10 weeks",
        students: 2156,
        rating: 4.9,
        progress: 0,
        emoji: "🤖",
        colorClass: "ml"
    },
    {
        id: 3,
        title: "UI/UX Design Principles",
        description: "Create beautiful and user-friendly interfaces",
        category: "Design",
        level: "Beginner",
        duration: "6 weeks",
        students: 1893,
        rating: 4.7,
        progress: 0,
        emoji: "🎨",
        colorClass: "design"
    },
    {
        id: 4,
        title: "Cloud Architecture & DevOps",
        description: "Build scalable applications with modern cloud tools",
        category: "Infrastructure",
        level: "Advanced",
        duration: "12 weeks",
        students: 945,
        rating: 4.8,
        progress: 0,
        emoji: "☁️",
        colorClass: "cloud"
    },
    {
        id: 5,
        title: "Data Structures & Algorithms",
        description: "Master fundamental computer science concepts",
        category: "Programming",
        level: "Intermediate",
        duration: "8 weeks",
        students: 3241,
        rating: 4.9,
        progress: 0,
        emoji: "⚡",
        colorClass: "algo"
    },
    {
        id: 6,
        title: "Digital Marketing Strategy",
        description: "Learn modern marketing techniques and analytics",
        category: "Business",
        level: "Beginner",
        duration: "7 weeks",
        students: 1654,
        rating: 4.6,
        progress: 0,
        emoji: "📈",
        colorClass: "marketing"
    }
];

// State management
let selectedCourses = [];
let studentName = "Student";
let college = "University";
let streak = 5;

// DOM elements
const coursesGrid = document.getElementById('courses-grid');
const startLearningBtn = document.getElementById('start-learning-btn');
const selectedCountSpan = document.getElementById('selected-count');
const activeCoursesStat = document.getElementById('active-courses');
const emptyState = document.getElementById('empty-state');
const studentNameSpan = document.getElementById('student-name');
const collegeInfoSpan = document.getElementById('college-info');
const streakCountSpan = document.getElementById('streak-count');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastDescription = document.getElementById('toast-description');

// Initialize the dashboard
function init() {
    loadUserData();
    loadSelectedCourses();
    renderCourses();
    updateUI();
}

// Load user data from localStorage
function loadUserData() {
    const savedName = localStorage.getItem('studentName');
    const savedCollege = localStorage.getItem('college');
    const savedStreak = localStorage.getItem('streak');
    
    if (savedName) {
        studentName = savedName;
        studentNameSpan.textContent = studentName;
    }
    
    if (savedCollege) {
        college = savedCollege;
        collegeInfoSpan.textContent = college;
    }
    
    if (savedStreak) {
        streak = parseInt(savedStreak);
        streakCountSpan.textContent = streak;
    }
    
    // Update avatar initials
    const avatarFallback = document.querySelector('.avatar-fallback');
    const initials = studentName.split(' ').map(n => n[0]).join('').toUpperCase();
    avatarFallback.textContent = initials;
}

// Load selected courses from localStorage
function loadSelectedCourses() {
    const saved = localStorage.getItem('selectedCourses');
    if (saved) {
        selectedCourses = JSON.parse(saved);
    }
}

// Save selected courses to localStorage
function saveSelectedCourses() {
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
}

// Render course cards
function renderCourses() {
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        const isSelected = selectedCourses.includes(course.id);
        
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${isSelected ? 'selected' : ''}`;
        courseCard.addEventListener('click', () => toggleCourse(course.id));
        
        courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-emoji ${course.colorClass}">
                    ${course.emoji}
                </div>
                ${isSelected ? `
                    <svg class="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                ` : ''}
            </div>
            
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            
            <div class="course-meta">
                <span class="level-badge level-${course.level.toLowerCase()}">${course.level}</span>
                <div class="rating">
                    <svg class="star-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                    </svg>
                    <span>${course.rating}</span>
                </div>
            </div>
            
            <div class="course-details">
                <div class="detail-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    ${course.duration}
                </div>
                <div class="detail-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    ${course.students.toLocaleString()} students
                </div>
            </div>
            
            ${isSelected && course.progress > 0 ? `
                <div class="progress-section">
                    <div class="progress-header">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                </div>
            ` : ''}
        `;
        
        courseCard.classList.add('fade-in');
        coursesGrid.appendChild(courseCard);
    });
}

// Toggle course selection
function toggleCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    const wasSelected = selectedCourses.includes(courseId);
    
    if (wasSelected) {
        selectedCourses = selectedCourses.filter(id => id !== courseId);
        showToast('Course Removed', `Removed ${course.title} from your learning path`);
    } else {
        selectedCourses.push(courseId);
        showToast('Course Added!', `Added ${course.title} to your learning path`);
    }
    
    saveSelectedCourses();
    renderCourses();
    updateUI();
}

// Update UI based on selected courses
function updateUI() {
    const courseCount = selectedCourses.length;
    
    // Update stats
    activeCoursesStat.textContent = courseCount;
    selectedCountSpan.textContent = courseCount;
    
    // Show/hide start learning button
    if (courseCount > 0) {
        startLearningBtn.style.display = 'flex';
        emptyState.style.display = 'none';
    } else {
        startLearningBtn.style.display = 'none';
        emptyState.style.display = 'block';
    }
}

// Start learning function
function startLearning() {
    if (selectedCourses.length === 0) {
        showToast('Select Courses', 'Please select at least one course to start learning!', true);
        return;
    }
    
    // In a real application, this would navigate to the course page
    showToast('Starting Learning Journey!', `Beginning your journey with ${selectedCourses.length} courses`);
    
    // Simulate navigation delay
    setTimeout(() => {
        alert('In a real application, this would navigate to the course learning page!');
    }, 1000);
}

// Navigate to profile
function goToProfile() {
    // In a real application, this would navigate to the profile page
    showToast('Profile', 'Navigating to your profile...');
    setTimeout(() => {
        alert('In a real application, this would navigate to the profile page!');
    }, 1000);
}

// Show toast notification
function showToast(title, description, isError = false) {
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    if (isError) {
        toast.style.borderLeft = '4px solid var(--destructive)';
    } else {
        toast.style.borderLeft = '4px solid var(--success)';
    }
    
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Add any responsive JavaScript logic here if needed
});

// Add some sample data to localStorage for demo purposes
function initSampleData() {
    if (!localStorage.getItem('studentName')) {
        localStorage.setItem('studentName', 'Alex Johnson');
        localStorage.setItem('college', 'MIT Computer Science');
        localStorage.setItem('streak', '7');
    }
}

// Initialize sample data
initSampleData();