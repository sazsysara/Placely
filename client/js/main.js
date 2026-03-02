// Runtime data
let students = [];
let liveInternships = [];

const recentlyPlaced = [
  { name: "Priya Sharma", package: 18.5, company: "Google", position: "Software Engineer", graduationYear: 2024, date: "2026-01-25" },
  { name: "Aarav Kumar", package: 16.8, company: "Microsoft", position: "SDE-2", graduationYear: 2024, date: "2026-01-20" },
  { name: "Sneha Reddy", package: 15.2, company: "Amazon", position: "Associate Engineer", graduationYear: 2025, date: "2026-01-18" }
];

const upcomingCompanies = [
  { name: "Microsoft", visitDate: "Feb 5, 2026", position: "Software Engineer", salary: "20-24 LPA", ctc: "22 LPA" },
  { name: "ServiceNow", visitDate: "Feb 7, 2026", position: "Developer", salary: "18-22 LPA", ctc: "20 LPA" },
  { name: "Autodesk", visitDate: "Feb 9, 2026", position: "Software Developer", salary: "19-23 LPA", ctc: "21 LPA" },
  { name: "Amazon", visitDate: "Feb 11, 2026", position: "SDE I", salary: "17-21 LPA", ctc: "19 LPA" },
  { name: "Commvault Cloud", visitDate: "Feb 13, 2026", position: "Engineer", salary: "16-20 LPA", ctc: "18 LPA" },
  { name: "JustPay", visitDate: "Feb 15, 2026", position: "Backend Engineer", salary: "12-16 LPA", ctc: "14 LPA" },
  { name: "Wells Fargo", visitDate: "Feb 17, 2026", position: "Technology Analyst", salary: "15-18 LPA", ctc: "16.5 LPA" },
  { name: "Global Knowledge", visitDate: "Feb 19, 2026", position: "Associate", salary: "8-10 LPA", ctc: "9 LPA" },
  { name: "ThoughtWorks", visitDate: "Feb 21, 2026", position: "Developer", salary: "14-18 LPA", ctc: "16 LPA" },
  { name: "Akaike", visitDate: "Feb 23, 2026", position: "Software Engineer", salary: "12-15 LPA", ctc: "13.5 LPA" },
  { name: "Informatica", visitDate: "Feb 25, 2026", position: "Data Engineer", salary: "16-20 LPA", ctc: "18 LPA" },
  { name: "ShopUp", visitDate: "Feb 27, 2026", position: "Full Stack Developer", salary: "10-13 LPA", ctc: "11.5 LPA" },
  { name: "Cyware", visitDate: "Mar 1, 2026", position: "Security Engineer", salary: "15-19 LPA", ctc: "17 LPA" },
  { name: "Dell Technologies", visitDate: "Mar 3, 2026", position: "Senior Engineer", salary: "18-22 LPA", ctc: "20 LPA" },
  { name: "Quinbay", visitDate: "Mar 5, 2026", position: "Backend Developer", salary: "11-14 LPA", ctc: "12.5 LPA" },
  { name: "Sahaj", visitDate: "Mar 7, 2026", position: "Engineer", salary: "9-11 LPA", ctc: "10 LPA" },
  { name: "Casa Retail AI", visitDate: "Mar 9, 2026", position: "ML Engineer", salary: "13-16 LPA", ctc: "14.5 LPA" },
  { name: "Cooper", visitDate: "Mar 11, 2026", position: "Developer", salary: "10-12 LPA", ctc: "11 LPA" },
  { name: "nference", visitDate: "Mar 13, 2026", position: "AI Engineer", salary: "14-18 LPA", ctc: "16 LPA" },
  { name: "GUVI", visitDate: "Mar 15, 2026", position: "Content Engineer", salary: "7-9 LPA", ctc: "8 LPA" },
  { name: "Digital Back Office", visitDate: "Mar 17, 2026", position: "Process Associate", salary: "4-5 LPA", ctc: "4.5 LPA" },
  { name: "Light & Wonder", visitDate: "Mar 19, 2026", position: "Software Engineer", salary: "15-19 LPA", ctc: "17 LPA" },
  { name: "Presidio", visitDate: "Mar 21, 2026", position: "Systems Engineer", salary: "11-14 LPA", ctc: "12.5 LPA" },
  { name: "1CloudHub", visitDate: "Mar 23, 2026", position: "Cloud Engineer", salary: "13-17 LPA", ctc: "15 LPA" },
  { name: "FundsIndia", visitDate: "Mar 25, 2026", position: "Full Stack Developer", salary: "11-15 LPA", ctc: "13 LPA" },
  { name: "Persistent", visitDate: "Mar 27, 2026", position: "Software Developer", salary: "12-16 LPA", ctc: "14 LPA" },
  { name: "Mahindra Rise", visitDate: "Mar 29, 2026", position: "Engineer", salary: "10-13 LPA", ctc: "11.5 LPA" },
  { name: "Eunimart", visitDate: "Mar 31, 2026", position: "Backend Developer", salary: "10-12 LPA", ctc: "11 LPA" },
  { name: "TeleSoft", visitDate: "Apr 2, 2026", position: "Software Engineer", salary: "9-11 LPA", ctc: "10 LPA" },
  { name: "LINARC", visitDate: "Apr 4, 2026", position: "Developer", salary: "12-15 LPA", ctc: "13.5 LPA" }
];

const companyLogoDomains = {
  "Microsoft": "microsoft.com",
  "ServiceNow": "servicenow.com",
  "Autodesk": "autodesk.com",
  "Amazon": "amazon.com",
  "Commvault Cloud": "commvault.com",
  "JustPay": "justpay.to",
  "Wells Fargo": "wellsfargo.com",
  "Global Knowledge": "globalknowledge.com",
  "ThoughtWorks": "thoughtworks.com",
  "Akaike": "akaike.ai",
  "Informatica": "informatica.com",
  "ShopUp": "shopup.com",
  "Cyware": "cyware.com",
  "Dell Technologies": "dell.com",
  "Quinbay": "quinbay.com",
  "Sahaj": "sahaj.ai",
  "Casa Retail AI": "casa.ai",
  "Cooper": "cooper.com",
  "nference": "nference.ai",
  "GUVI": "guvi.in",
  "Digital Back Office": "digitalbackoffice.com",
  "Light & Wonder": "lightandwonder.com",
  "Presidio": "presidio.com",
  "1CloudHub": "1cloudhub.com",
  "FundsIndia": "fundsindia.com",
  "Persistent": "persistent.com",
  "Mahindra Rise": "mahindra.com",
  "Eunimart": "eunimart.com",
  "TeleSoft": "telesoft.com",
  "LINARC": "linarc.com"
};

const notifications = [{ msg: 'Welcome to Placely!', date: '2026-01-27' }];

if (typeof Chart !== 'undefined' && Chart.Tooltip?.positioners && !Chart.Tooltip.positioners.aboveSegment) {
  Chart.Tooltip.positioners.aboveSegment = function aboveSegmentPositioner(elements, eventPosition) {
    const first = elements?.[0];
    if (!first?.element) {
      return eventPosition || false;
    }

    const barElement = first.element;
    const segmentHeight = Number(barElement.height || 0);
    const topEdgeY = Number(barElement.y || 0) - (segmentHeight / 2);

    return {
      x: Number(barElement.x || eventPosition?.x || 0),
      y: topEdgeY - 36
    };
  };
}

let currentUser = null;
let isStaff = false;
let currentLoginTab = 'student';
let dashboardFilteredStudents = [];
let dashboardSearchQuery = '';
let analyticsProfileFilteredIds = [];
let analyticsProfileCurrentIndex = -1;
let analyticsProfileEditMode = false;
let studentProfileEditMode = false;
let currentDashboardSortKey = 'leetcodeSolvedAll';
const dashboardMetricOrder = [
  'dept',
  'year',
  'gradePoints',
  'leetcodeSolvedAll',
  'interest',
  'placementStatus',
  'resumeLink',
  'certifications',
  'internships',
  'achievements',
  'registerNo',
  'rollNo',
  'collegeMail',
  'personalMail',
  'residencyType',
  'gender',
  'preferredRoles',
  'tenthPercentage',
  'twelfthPercentage',
  'diplomaPercentage',
  'contactNo',
  'address',
  'travelPriority'
];
const dashboardMetricLabels = {
  dept: 'Dept',
  leetcodeSolvedAll: 'LeetCode Solved',
  internships: 'Internships',
  certifications: 'Certificates',
  gradePoints: 'CGPA',
  tenthPercentage: '10th %',
  twelfthPercentage: '12th %',
  diplomaPercentage: 'Diploma %',
  placementStatus: 'Placement Status',
  year: 'Year',
  interest: 'Interest',
  rollNo: 'Roll No',
  registerNo: 'Register No',
  section: 'Section',
  gender: 'Gender',
  residencyType: 'Dayscholar/Hostel',
  personalMail: 'Personal Mail',
  collegeMail: 'College Mail',
  contactNo: 'Contact No',
  address: 'Address',
  resumeLink: 'Resume Link',
  preferredRoles: 'Gender Specific Roles',
  preferredShift: 'Shift Priority',
  travelPriority: 'Travel Priority',
  achievements: 'Achievements'
};
const defaultDashboardVisibleMetricKeys = [
  'dept',
  'year',
  'gradePoints',
  'leetcodeSolvedAll',
  'interest',
  'placementStatus'
];
let dashboardVisibleMetrics = new Set(defaultDashboardVisibleMetricKeys);

const dashboardInterestOptions = ['Placements', 'Higher Studies', 'Entrepreneurship'];
const dashboardEditableFieldOrder = ['name', ...dashboardMetricOrder];
const dashboardEditableFieldConfigs = {
  name: { type: 'text' },
  dept: { type: 'text' },
  year: { type: 'number', min: 1, max: 4, step: 1 },
  gradePoints: { type: 'number', min: 0, max: 10, step: 0.1 },
  leetcodeSolvedAll: { type: 'number', min: 0, step: 1 },
  internships: { type: 'number', min: 0, step: 1 },
  certifications: { type: 'number', min: 0, step: 1 },
  interest: { type: 'select', options: dashboardInterestOptions },
  resumeLink: { type: 'text' },
  leetcodeUsername: { type: 'text' },
  email: { type: 'text' },
  placementStatus: { type: 'text' },
  registerNo: { type: 'text' },
  rollNo: { type: 'text' },
  section: { type: 'text' },
  collegeMail: { type: 'text' },
  personalMail: { type: 'text' },
  residencyType: { type: 'text' },
  gender: { type: 'text' },
  preferredRoles: { type: 'text' },
  preferredShift: { type: 'text' },
  tenthPercentage: { type: 'number', step: 0.1 },
  twelfthPercentage: { type: 'number', step: 0.1 },
  diplomaPercentage: { type: 'number', step: 0.1 },
  contactNo: { type: 'text' },
  address: { type: 'text' },
  travelPriority: { type: 'text' },
  achievements: { type: 'text' }
};

const analyticsProfileEditableFields = [
  'name', 'dept', 'year', 'interest', 'placementStatus',
  'leetcodeSolvedAll', 'gradePoints', 'internships', 'certifications',
  'rollNo', 'registerNo', 'section', 'gender', 'residencyType',
  'tenthPercentage', 'twelfthPercentage', 'diplomaPercentage',
  'collegeMail', 'personalMail', 'email', 'contactNo', 'address',
  'resumeLink', 'preferredRoles', 'preferredShift', 'travelPriority',
  'achievements', 'leetcodeUsername'
];

const profileEditFieldEntries = [
  ['name', 'Name'], ['dept', 'Department'], ['year', 'Year'], ['interest', 'Interest'], ['placementStatus', 'Placement Status'],
  ['leetcodeSolvedAll', 'LeetCode Solved'], ['gradePoints', 'CGPA'], ['internships', 'Internships'], ['certifications', 'Certifications'],
  ['rollNo', 'Roll No'], ['registerNo', 'Register No'], ['section', 'Section'], ['gender', 'Gender'], ['residencyType', 'Dayscholar/Hostel'],
  ['tenthPercentage', '10th %'], ['twelfthPercentage', '12th %'], ['diplomaPercentage', 'Diploma %'],
  ['collegeMail', 'College Mail'], ['personalMail', 'Personal Mail'], ['email', 'Email'], ['contactNo', 'Contact No'], ['address', 'Address'],
  ['resumeLink', 'Resume Link'], ['preferredRoles', 'Gender Specific Roles'], ['preferredShift', 'Shift Priority'], ['travelPriority', 'Travel Priority'],
  ['achievements', 'Achievements'], ['leetcodeUsername', 'LeetCode Username']
];

function escapeHtmlAttribute(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeExternalUrl(value) {
  const url = String(value || '').trim();
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return '#';
}

function showToast(message, type = 'info') {
  const existingContainer = document.getElementById('app-toast-container');
  const container = existingContainer || (() => {
    const newContainer = document.createElement('div');
    newContainer.id = 'app-toast-container';
    newContainer.className = 'app-toast-container';
    document.body.appendChild(newContainer);
    return newContainer;
  })();

  const toast = document.createElement('div');
  toast.className = `app-toast app-toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
      if (!container.childElementCount) {
        container.remove();
      }
    }, 220);
  }, 2600);
}

function getDashboardFieldRawValue(student, fieldKey) {
  const fieldMap = {
    name: student.name,
    dept: student.dept,
    leetcodeSolvedAll: student.leetcodeSolvedAll,
    internships: student.internships,
    certifications: student.certifications,
    gradePoints: student.gradePoints,
    tenthPercentage: student.tenthPercentage,
    twelfthPercentage: student.twelfthPercentage,
    diplomaPercentage: student.diplomaPercentage,
    year: getYearNumber(student.year) || '',
    interest: student.interest,
    placementStatus: student.placementStatus || getPlacementStatusLabel(student),
    leetcodeUsername: student.leetcodeUsername,
    email: student.email,
    rollNo: student.rollNo,
    registerNo: student.registerNo,
    section: student.section,
    gender: student.gender,
    residencyType: student.residencyType,
    personalMail: student.personalMail,
    collegeMail: student.collegeMail || student.email,
    contactNo: student.contactNo,
    address: student.address,
    resumeLink: student.resumeLink,
    preferredRoles: student.preferredRoles,
    preferredShift: student.preferredShift,
    travelPriority: student.travelPriority,
    achievements: student.achievements
  };

  const value = fieldMap[fieldKey];
  return value ?? '';
}

function getDashboardFieldDisplayValue(student, fieldKey, staffView = false) {
  if (fieldKey === 'year') {
    return getYearLabel(student.year);
  }

  if (fieldKey === 'resumeLink') {
    const resumeLink = student.resumeLink || '';
    if (!resumeLink) {
      return 'N/A';
    }
    return staffView
      ? `<a href="${resumeLink}" target="_blank" rel="noopener noreferrer">Resume</a>`
      : `<a href="${resumeLink}" target="_blank" rel="noopener noreferrer">Resume</a>`;
  }

  if (fieldKey === 'collegeMail') {
    return student.collegeMail || student.email || 'N/A';
  }

  const rawValue = getDashboardFieldRawValue(student, fieldKey);
  return rawValue === '' ? 'N/A' : `${rawValue}`;
}

function parseDashboardEditableValue(fieldKey, value) {
  const config = dashboardEditableFieldConfigs[fieldKey] || { type: 'text' };
  if (config.type === 'number') {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  }
  return String(value ?? '').trim();
}

function getYearNumber(value) {
  const numericValue = Number(value);
  if (Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 4) {
    return numericValue;
  }

  const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const map = {
    '1': 1,
    'first': 1,
    'first year': 1,
    '2': 2,
    'second': 2,
    'second year': 2,
    '3': 3,
    'third': 3,
    'third year': 3,
    '4': 4,
    'fourth': 4,
    'fourth year': 4
  };

  return map[normalized] || 0;
}

function getYearLabel(value) {
  const yearNumber = getYearNumber(value);
  if (yearNumber === 1) return 'First';
  if (yearNumber === 2) return 'Second';
  if (yearNumber === 3) return 'Third';
  if (yearNumber === 4) return 'Fourth';
  return String(value || 'N/A');
}

function isStaffDemoMode() {
  return isStaff && !document.getElementById('login-section');
}

function updateRoleBasedNav() {
  const analyticsLink = document.querySelector("#navbar a[onclick*='showSection(\"dashboard-section\")'], #navbar a[onclick*=\"showSection('dashboard-section')\"]");
  const profileLink = document.querySelector("#navbar a[onclick*='showSection(\"profile-section\")'], #navbar a[onclick*=\"showSection('profile-section')\"]");
  const profileSection = document.getElementById('profile-section');
  const profileContent = document.getElementById('profile-content');
  if (analyticsLink && analyticsLink.parentElement) {
    analyticsLink.parentElement.style.display = isStaff ? '' : 'none';
  }
  if (profileLink && profileLink.parentElement) {
    profileLink.parentElement.style.display = isStaff ? 'none' : '';
  }
  if (profileSection) {
    profileSection.style.display = isStaff ? 'none' : '';
  }
  if (isStaff && profileContent) {
    profileContent.innerHTML = '';
  }
}

function isLoginUiDisabled() {
  return !document.getElementById('login-section');
}

function applyDemoViewMode(mode) {
  const normalized = mode === 'student' ? 'student' : 'staff';
  isStaff = normalized === 'staff';
  if (isStaff) {
    currentUser = null;
  } else if (!currentUser && Array.isArray(students) && students.length) {
    currentUser = students[0];
  }
  return normalized;
}

function ensureDemoModeToggle() {
  const navList = document.querySelector('#navbar ul');
  if (!navList || !isLoginUiDisabled()) {
    return;
  }

  let container = document.getElementById('demo-mode-toggle-container');
  if (!container) {
    container = document.createElement('li');
    container.id = 'demo-mode-toggle-container';
    container.innerHTML = `
      <label class="demo-mode-toggle-label" for="demo-mode-toggle">Mode</label>
      <select id="demo-mode-toggle" class="demo-mode-toggle-select" aria-label="Select view mode">
        <option value="staff">Staff</option>
        <option value="student">Student</option>
      </select>
    `;

    const darkModeLi = document.getElementById('darkmode-toggle')?.parentElement;
    if (darkModeLi && darkModeLi.parentElement === navList) {
      navList.insertBefore(container, darkModeLi);
    } else {
      navList.appendChild(container);
    }

    const modeSelect = document.getElementById('demo-mode-toggle');
    if (modeSelect) {
      modeSelect.addEventListener('change', () => {
        const selectedMode = applyDemoViewMode(modeSelect.value);
        localStorage.setItem('demoViewMode', selectedMode);
        updateRoleBasedNav();
        showSection(isStaff ? 'dashboard-section' : 'home-section');
      });
    }
  }

  const modeSelect = document.getElementById('demo-mode-toggle');
  if (modeSelect) {
    modeSelect.value = isStaff ? 'staff' : 'student';
  }
}

function initializeDemoModeIfNeeded() {
  if (!isLoginUiDisabled()) {
    return false;
  }

  const savedMode = localStorage.getItem('demoViewMode');
  const resolvedMode = applyDemoViewMode(savedMode === 'student' ? 'student' : 'staff');
  localStorage.setItem('demoViewMode', resolvedMode);
  initializeApp();
  ensureDemoModeToggle();
  showSection('dashboard-section');
  return true;
}

const sectionIds = ['login-section', 'home-section', 'dashboard-section', 'profile-section', 'notifications-section', 'leaderboard-section'];

// Google Login Function
async function loginWithGoogle() {
  try {
    const response = await fetch('/auth/google');
    const data = await response.json();
    if (data.auth_url) {
      window.location.href = data.auth_url;
    } else {
      showToast('Failed to initiate Google login. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Google login error:', error);
    showToast('Failed to initiate Google login. Please try again.', 'error');
  }
}

async function connectLinkedIn() {
  try {
    console.log("Calling /api/connect-linkedin...");
    const response = await fetch('/api/connect-linkedin');
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      showToast(`Error: ${data.message || 'Failed to authenticate. Please log in and try again.'}`, 'error');
      return;
    }

    if (data.auth_url) {
      console.log("Redirecting to LinkedIn...");
      window.open(data.auth_url, '_blank', 'noopener,noreferrer');
    } else {
      showToast(data.message || 'Failed to initiate LinkedIn connection. Please try again.', 'error');
    }
  } catch (error) {
    console.error('LinkedIn connect error:', error);
    showToast('Failed to connect LinkedIn. Please try again.', 'error');
  }
}

// Check for existing session on page load
async function checkSession() {
  try {
    const response = await fetch('/api/check-session');
    const data = await response.json();
    if (data.logged_in) {
      currentUser = data.user;
      isStaff = data.is_staff;
      await refreshStudentsData();
      initializeApp();
      showSection('home-section');
      renderHome();
    }
  } catch (error) {
    console.error('Session check error:', error);
  }
}

async function refreshStudentsData() {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      students = data;
      if (currentUser && !isStaff) {
        const matchedStudent = students.find((student) =>
          (currentUser.id && student.id === currentUser.id) ||
          (currentUser.email && student.email === currentUser.email)
        );
        if (matchedStudent) {
          currentUser = { ...currentUser, ...matchedStudent };
        }
      }
    }
  } catch (error) {
    console.error('Students fetch error:', error);
  }
}

// Check URL parameters for login status
function checkLoginStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const loginStatus = urlParams.get('login');
  const msg = urlParams.get('msg');

  if (loginStatus === 'success') {
    checkSession(); // Reload user session after successful Google login
    // Clean URL
    window.history.replaceState({}, document.title, '/');
  } else if (loginStatus === 'error') {
    showToast(msg || 'Login failed. Please try again.', 'error');
    // Clean URL
    window.history.replaceState({}, document.title, '/');
  }
}

function showSection(sectionId) {
  if (sectionId === 'dashboard-section' && !isStaff) {
    sectionId = 'home-section';
  }
  if (sectionId === 'profile-section' && isStaff) {
    sectionId = 'dashboard-section';
  }
  sectionIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
  const el = document.getElementById(sectionId);
  if (el) el.classList.add('active');

  // Active nav highlighting
  document.querySelectorAll('#navbar ul li a').forEach(link => link.classList.remove('nav-active'));
  const sectionNavMap = {
    'home-section': "showSection('home-section')",
    'dashboard-section': "showSection('dashboard-section')",
    'profile-section': "showSection('profile-section')",
    'notifications-section': "showSection('notifications-section')",
    'leaderboard-section': "showSection('leaderboard-section')"
  };
  const onclickMatch = sectionNavMap[sectionId];
  if (onclickMatch) {
    const navLink = document.querySelector(`#navbar a[onclick*="${onclickMatch.replace(/'/g, "\\'")}"]`);
    if (navLink) navLink.classList.add('nav-active');
  }

  if (sectionId === 'home-section') renderHome();
  if (sectionId === 'dashboard-section') renderDashboard();
  if (sectionId === 'profile-section') renderProfile();
  if (sectionId === 'notifications-section') renderNotifications();
  if (sectionId === 'leaderboard-section') renderLeaderboard();
}

function switchLoginTab(tab, triggerElement) {
  currentLoginTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  if (triggerElement) {
    triggerElement.classList.add('active');
  }
  document.getElementById(tab + '-login').classList.add('active');
}

async function loginUser(e) {
  e.preventDefault();
  const loginType = currentLoginTab === 'student' ? 'student' : 'staff';

  const email = document.getElementById(loginType === 'student' ? 'student-email' : 'staff-email').value.trim();
  const password = document.getElementById(loginType === 'student' ? 'student-password' : 'staff-password').value.trim();

  if (!email || !password) {
    showToast('Please enter email and password.', 'info');
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: loginType, email, password })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      showToast(data.message || 'Login failed', 'error');
      return;
    }

    isStaff = !!data.is_staff;
    currentUser = isStaff ? null : data.user;
    studentProfileEditMode = false;
    await refreshStudentsData();
    initializeApp();
    showSection('dashboard-section');
    renderDashboard();
  } catch (error) {
    console.error('Login error:', error);
    showToast('Unable to login right now. Please try again.', 'error');
  }
}

function initializeApp() {
  const loginSection = document.getElementById('login-section');
  const navbar = document.getElementById('navbar');
  if (loginSection) loginSection.style.display = 'none';
  if (navbar) navbar.style.display = 'flex';
  updateRoleBasedNav();
}

function logout() {
  fetch('/logout', { method: 'POST' }).catch(() => null);
  currentUser = null;
  isStaff = false;
  studentProfileEditMode = false;
  const navbar = document.getElementById('navbar');
  const loginSection = document.getElementById('login-section');
  if (loginSection) {
    if (navbar) navbar.style.display = 'none';
    loginSection.style.display = 'block';
  } else {
    if (navbar) navbar.style.display = 'flex';
  }
  updateRoleBasedNav();

  const studentEmail = document.getElementById('student-email');
  const studentPassword = document.getElementById('student-password');
  const staffEmail = document.getElementById('staff-email');
  const staffPassword = document.getElementById('staff-password');
  if (studentEmail) studentEmail.value = '';
  if (studentPassword) studentPassword.value = '';
  if (staffEmail) staffEmail.value = '';
  if (staffPassword) staffPassword.value = '';

  sectionIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
  if (loginSection) {
    loginSection.classList.add('active');
  } else {
    showSection('home-section');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const darkModeToggle = document.getElementById('darkmode-toggle');

  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function (e) { e.preventDefault(); toggleDarkMode(); });
  }

  if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-mode'); document.getElementById('darkmode-toggle').textContent = '☀️'; }

  const demoModeEnabled = initializeDemoModeIfNeeded();

  // Check for login callback or existing session
  refreshStudentsData().then(() => {
    if (demoModeEnabled) {
      applyDemoViewMode(localStorage.getItem('demoViewMode') === 'student' ? 'student' : 'staff');
      ensureDemoModeToggle();
      renderDashboard();
    }
  });

  if (!demoModeEnabled) {
    checkLoginStatus();
    checkSession();
  }
});

// Dark/Light Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  document.getElementById('darkmode-toggle').textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';

  const activeSectionId = document.querySelector('section.active')?.id;
  if (activeSectionId === 'dashboard-section') renderDashboard();
  if (activeSectionId === 'profile-section') renderProfile();
  if (activeSectionId === 'notifications-section') renderNotifications();
  if (activeSectionId === 'home-section') renderHome();
  if (activeSectionId === 'leaderboard-section') renderLeaderboard();
}

function getChartThemeColors() {
  const isLightMode = document.body.classList.contains('light-mode');
  return {
    axisTickColor: isLightMode ? '#334155' : '#f5f5f5',
    axisGridColor: isLightMode ? 'rgba(30, 58, 138, 0.18)' : 'rgba(255,255,255,0.08)',
    radarGridColor: isLightMode ? 'rgba(30, 58, 138, 0.26)' : 'rgba(255,255,255,0.15)',
    radarPointLabelColor: isLightMode ? '#1e293b' : '#f5f5f5',
    legendColor: isLightMode ? '#334155' : '#f5f5f5',
    radarTickBackdrop: isLightMode ? 'rgba(255,255,255,0.75)' : 'transparent'
  };
}

function renderBanner(container) {
  const topPlaced = recentlyPlaced[0]; // Highest package
  const bannerHtml = `
    <div class="banner-card">
      <div class="banner-content">
        <div class="banner-icon">🎉</div>
        <div class="banner-info">
          <h2 style="margin: 0 0 0.5rem 0;">Recently Placed - Highest Package!</h2>
          <div class="banner-student">
            <h3 style="margin: 0.5rem 0;">${topPlaced.name}</h3>
            <p style="margin: 0.3rem 0; font-size: 1.1rem;"><strong>Package: ₹${topPlaced.package} LPA</strong></p>
            <p style="margin: 0.3rem 0;"><strong>Company:</strong> ${topPlaced.company}</p>
            <p style="margin: 0.3rem 0;"><strong>Position:</strong> ${topPlaced.position}</p>
            <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #999;">Placed on ${topPlaced.date}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = bannerHtml;
}

function getCountdownBadge(visitDateStr) {
  try {
    const visitDate = new Date(visitDateStr + ' 00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffMs = visitDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return '<span class="countdown-badge countdown-past">Completed</span>';
    if (diffDays === 0) return '<span class="countdown-badge countdown-today">Today!</span>';
    if (diffDays === 1) return '<span class="countdown-badge countdown-soon">Tomorrow</span>';
    if (diffDays <= 7) return `<span class="countdown-badge countdown-soon">${diffDays} days left</span>`;
    return `<span class="countdown-badge countdown-later">${diffDays} days left</span>`;
  } catch (e) {
    return '';
  }
}

function renderCompaniesList(container) {
  const companiesHtml = `
    <div class="companies-section">
      <h3 style="margin-top: 0;">Companies Coming Soon 📅</h3>
      <div class="companies-scroll">
        ${upcomingCompanies.map(company => `
          <div class="company-card company-card--interactive" data-company="${company.name}" role="button" tabindex="0" aria-label="View details for ${company.name}">
            <div class="company-header">
              <h4 style="margin: 0 0 0.5rem 0;">${company.name}</h4>
              <span class="company-date">📍 ${company.visitDate}</span>
            </div>
            ${getCountdownBadge(company.visitDate)}
            <p style="margin: 0.3rem 0;"><strong>Position:</strong> ${company.position}</p>
            <p style="margin: 0.3rem 0;"><strong>Salary Range:</strong> ${company.salary}</p>
            <p style="margin: 0.3rem 0;"><strong>CTC:</strong> ${company.ctc}</p>
            <p style="margin: 0.55rem 0 0 0; color: #FEC524; font-size: 0.85rem;">Tap to view application details →</p>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="companies-section" style="margin-top: 1rem;">
      <h3 style="margin-top: 0;">Upcoming Internships (Second Year Onwards) 🎓</h3>
      <div id="internships-scroll" class="companies-scroll">
        <div class="company-card"><p style="margin: 0; color: #999;">Loading live internships...</p></div>
      </div>
    </div>
  `;
  container.innerHTML = companiesHtml;

  container.querySelectorAll('.company-card--interactive').forEach((card) => {
    const openDetails = () => openCompanyDetailsModal(card.dataset.company || '');
    card.addEventListener('click', openDetails);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetails();
      }
    });
  });

  const internshipsContainer = container.querySelector('#internships-scroll');
  if (internshipsContainer) {
    renderLiveInternships(internshipsContainer);
  }
}

async function fetchUpcomingInternshipsData() {
  const response = await fetch('/api/upcoming-internships');
  if (!response.ok) {
    throw new Error('Failed to fetch live internships.');
  }
  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}

async function renderLiveInternships(container) {
  if (!container) {
    return;
  }

  const userYear = Number(getYearNumber(currentUser?.year || 0));
  if (!isStaff && currentUser && userYear > 0 && userYear < 2) {
    container.innerHTML = `
      <div class="company-card">
        <p style="margin: 0 0 0.4rem 0;"><strong>Available from Second Year</strong></p>
        <p style="margin: 0; color: #999;">Internship opportunities become visible from second year onwards.</p>
      </div>
    `;
    return;
  }

  try {
    liveInternships = await fetchUpcomingInternshipsData();
    if (!liveInternships.length) {
      container.innerHTML = '<div class="company-card"><p style="margin:0; color:#999;">No live internship posts found right now. Please check again shortly.</p></div>';
      return;
    }

    container.innerHTML = liveInternships.map((internship) => {
      const postedText = internship.postedDate ? internship.postedDate : 'Recently posted';
      const safeTitle = escapeHtmlAttribute(internship.title || 'Internship Opportunity');
      const safeSource = escapeHtmlAttribute(internship.source || 'Live Source');
      const safeCompany = escapeHtmlAttribute(internship.company || 'N/A');
      const safeLocation = escapeHtmlAttribute(internship.location || 'Not specified');
      const safeEligibility = escapeHtmlAttribute(internship.eligibility || 'Second Year Onwards');
      const safePostedText = escapeHtmlAttribute(postedText);
      const safeUrl = sanitizeExternalUrl(internship.url);
      return `
        <div class="company-card">
          <div class="company-header">
            <h4 style="margin: 0 0 0.45rem 0;">${safeTitle}</h4>
            <span class="company-date">${safeSource}</span>
          </div>
          <p style="margin: 0.3rem 0;"><strong>Company:</strong> ${safeCompany}</p>
          <p style="margin: 0.3rem 0;"><strong>Location:</strong> ${safeLocation}</p>
          <p style="margin: 0.3rem 0;"><strong>Eligibility:</strong> ${safeEligibility}</p>
          <p style="margin: 0.3rem 0;"><strong>Posted:</strong> ${safePostedText}</p>
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:0.45rem; color:#FEC524; font-weight:600; text-decoration:none;">View Internship ↗</a>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="company-card"><p style="margin:0; color:#999;">Unable to load live internships right now.</p></div>';
  }
}

function animateCountUp(element, target, duration, suffix, decimals) {
  const start = performance.now();
  const isFloat = decimals > 0;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = target * ease(progress);
    element.textContent = (isFloat ? value.toFixed(decimals) : Math.round(value)) + (suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderHome() {
  const title = document.getElementById('home-title');
  const bannerContainer = document.getElementById('home-banner-container');
  const homeContent = document.getElementById('home-content');

  title.textContent = '';

  const totalStudents = students.length;
  const placedStudents = students.filter(s => (s.placementStatus || '').toLowerCase() === 'placed').length;
  const maxLeetcode = Math.max(...students.map(s => Number(s.leetcodeSolvedAll || 0)), 0);
  const avgCgpa = totalStudents > 0
    ? students.reduce((sum, s) => sum + Number(s.gradePoints || 0), 0) / totalStudents
    : 0;
  const recruitingCount = upcomingCompanies.length;

  const statCards = [
    { icon: '🎓', label: 'Total Students', target: totalStudents, suffix: '', decimals: 0 },
    { icon: '✅', label: 'Placed', target: placedStudents, suffix: '', decimals: 0 },
    { icon: '💻', label: 'Top LeetCode', target: maxLeetcode, suffix: '', decimals: 0 },
    { icon: '📊', label: 'Avg CGPA', target: avgCgpa, suffix: '', decimals: 2 },
    { icon: '🏢', label: 'Recruiting Partners', target: recruitingCount, suffix: '', decimals: 0 },
  ];

  bannerContainer.innerHTML = `
    <div class="home-stats-grid">
      ${statCards.map((stat, i) => `
        <div class="home-stat-card" style="animation-delay: ${i * 80}ms">
          <span class="home-stat-icon">${stat.icon}</span>
          <span class="home-stat-value" data-target="${stat.target}" data-suffix="${stat.suffix}" data-decimals="${stat.decimals}">0</span>
          <span class="home-stat-label">${stat.label}</span>
        </div>
      `).join('')}
    </div>
  `;

  bannerContainer.querySelectorAll('.home-stat-value').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    animateCountUp(el, target, 1400, suffix, decimals);
  });

  homeContent.innerHTML = `
    <article class="home-post-card">
      <img
        class="home-post-image"
        src="https://media.licdn.com/dms/image/v2/D5622AQGAluiG297vnA/feedshare-shrink_800/B56ZyUo72FKYAk-/0/1772020285115?e=1773878400&v=beta&t=2VKK-icCkRHDvhtBwqmWHMx7h4p96B4WTeBDKtqrQpA"
        alt="FOSSEE Internship announcement"
      >
      <div class="home-post-content">
        <h3>🔥 FOSSEE Interns Continue the Legacy at Sri Eshwar!</h3>
        <p>Sharukhesh S (II Year – IT) and Poojitha S K (II Year – CSBS) are selected for the Semester-Long FOSSEE Internship 2026 at IIT Bombay.</p>
        <p>This milestone strengthens Sri Eshwar’s growing FOSSEE footprint and highlights the campus culture of innovation, research, and academic excellence.</p>
        <p class="home-post-tags">FOSSEEAtSECE • SriEshwar • SECEPride • IITBombay • FOSSEEInternship</p>
      </div>
    </article>
    <h3 style="margin-top: 2rem; margin-bottom: 1.5rem;">Our Recruiting Partners</h3>
    <div id="companies-grid-container"></div>
  `;

  renderCompaniesGrid(document.getElementById('companies-grid-container'));
}

function renderCompaniesGrid(container) {
  const companiesGridHtml = `
    <div class="companies-grid-section">
      <h4 style="text-align: center; margin-bottom: 1.5rem; color: #FEC524;">IT Product Companies (AI, DS, ML, Cloud, Gaming, Cyber-security, Fintech)</h4>
      <div class="companies-grid">
        ${upcomingCompanies.map(company => {
    const logoUrl = getCompanyLogoUrl(company.name);
    const initials = getCompanyInitials(company.name);
    return `
          <div class="company-grid-card">
            <div class="company-logo-wrap">
              <img class="company-logo-img" src="${logoUrl}" alt="${company.name} logo" ${logoUrl ? '' : 'style="display:none;"'} onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="company-logo-placeholder" ${logoUrl ? 'style="display:none;"' : ''}>${initials}</div>
            </div>
            <p style="margin: 0.5rem 0 0.3rem 0; font-weight: bold; text-align: center;">${company.name}</p>
            <p style="margin: 0; font-size: 0.85rem; text-align: center; color: #999;">${company.position}</p>
          </div>
        `;
  }).join('')}
      </div>
    </div>
  `;
  container.innerHTML = companiesGridHtml;
}

function getCompanyLogoUrl(companyName) {
  const domain = companyLogoDomains[companyName];
  return domain ? `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(domain)}` : '';
}

function getCompanyInitials(companyName) {
  const parts = companyName.split(/[\s&-]+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}

function getTopPercentile(sortedList, studentRecord) {
  if (!sortedList.length || !studentRecord) return 'N/A';

  const index = sortedList.findIndex((entry) => {
    if (studentRecord.id != null && entry.id != null) {
      return Number(entry.id) === Number(studentRecord.id);
    }
    return String(entry.email || '').toLowerCase() === String(studentRecord.email || '').toLowerCase();
  });

  if (index < 0) return 'N/A';

  const rank = index + 1;
  const percentile = (rank / sortedList.length) * 100;
  return percentile.toFixed(1);
}

function getDynamicScoreMeta(studentsData) {
  return {
    maxCodingProblems: Math.max(...studentsData.map((student) => Number(student.leetcodeSolvedAll || 0)), 0),
    maxOfficialCertificates: Math.max(...studentsData.map((student) => Number(student.certifications || 0)), 0),
    maxInternships: Math.max(...studentsData.map((student) => Number(student.internships || 0)), 0)
  };
}

function getDynamicPlacementScore(student, scoreMeta) {
  const clampUnit = (value) => Math.max(0, Math.min(1, Number(value) || 0));
  const cgpa = Number(student.gradePoints || 0);
  const codingProblems = Number(student.leetcodeSolvedAll || 0);
  const officialCertificates = Number(student.certifications || 0);
  const internships = Number(student.internships || 0);

  const cgpaComponent = clampUnit(cgpa / 10) * 30;
  const codingComponent = scoreMeta.maxCodingProblems > 0 ? clampUnit(codingProblems / scoreMeta.maxCodingProblems) * 30 : 0;
  const certificatesComponent = scoreMeta.maxOfficialCertificates > 0 ? clampUnit(officialCertificates / scoreMeta.maxOfficialCertificates) * 15 : 0;
  const internshipsComponent = scoreMeta.maxInternships > 0 ? clampUnit(internships / scoreMeta.maxInternships) * 25 : 0;

  return cgpaComponent + codingComponent + certificatesComponent + internshipsComponent;
}

function formatVisitDateOffset(visitDate, daysOffset) {
  const parsedDate = new Date(visitDate);
  if (Number.isNaN(parsedDate.getTime())) return 'TBA';
  parsedDate.setDate(parsedDate.getDate() + daysOffset);
  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function getCompanyDetailInfo(company) {
  const detailsMap = {
    'Microsoft': { minCgpa: '7.5', eligibleYears: 'Final Year', allowedBacklogs: 'No active backlogs', process: 'Online Assessment, 2 Technical Interviews, HR', keySkills: 'DSA, OOPS, DBMS, System Design', location: 'Bangalore / Hyderabad', applyUrl: 'https://careers.microsoft.com/' },
    'Amazon': { minCgpa: '7.0', eligibleYears: 'Final Year', allowedBacklogs: 'No active backlogs', process: 'OA (Coding), Technical Interview Loop, HR', keySkills: 'DSA, OS, DBMS, CS Fundamentals', location: 'Chennai / Bangalore', applyUrl: 'https://www.amazon.jobs/' },
    'ServiceNow': { minCgpa: '7.0', eligibleYears: 'Final Year', allowedBacklogs: 'Max 1 historical backlog', process: 'OA, 2 Technical Interviews, Managerial', keySkills: 'JavaScript, DSA, SQL, Web Basics', location: 'Hyderabad', applyUrl: 'https://careers.servicenow.com/' },
    'Wells Fargo': { minCgpa: '7.0', eligibleYears: 'Final Year', allowedBacklogs: 'No active backlogs', process: 'Aptitude + Coding, Technical, HR', keySkills: 'Java/Python, SQL, Problem Solving', location: 'Bangalore / Chennai', applyUrl: 'https://www.wellsfargo.com/about/careers/' }
  };

  const specific = detailsMap[company.name] || {};
  const domain = companyLogoDomains[company.name];
  const defaultApplyUrl = domain
    ? `https://www.google.com/search?q=${encodeURIComponent(`${company.name} careers`)}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${company.name} jobs`)}`;
  return {
    applicationClose: specific.applicationClose || formatVisitDateOffset(company.visitDate, -2),
    testDate: specific.testDate || formatVisitDateOffset(company.visitDate, -1),
    minCgpa: specific.minCgpa || '6.5',
    eligibleYears: specific.eligibleYears || 'Final Year',
    allowedBacklogs: specific.allowedBacklogs || 'No active backlogs preferred',
    process: specific.process || 'Aptitude/Coding Round, Technical Round(s), HR',
    keySkills: specific.keySkills || 'Problem Solving, CS Fundamentals, Communication',
    location: specific.location || 'As per business requirement',
    stipendInternship: specific.stipendInternship || 'May include internship-to-PPO track',
    documents: specific.documents || 'Updated Resume, Govt ID, Academic Mark Sheets',
    applyUrl: specific.applyUrl || defaultApplyUrl
  };
}

function ensureCompanyDetailsModal() {
  let modalOverlay = document.getElementById('company-details-modal');
  if (modalOverlay) {
    return modalOverlay;
  }

  const modalMarkup = `
    <div id="company-details-modal" class="company-modal-overlay" aria-hidden="true">
      <div class="company-modal-card" role="dialog" aria-modal="true" aria-label="Company details">
        <button type="button" class="company-modal-close" id="company-modal-close" aria-label="Close company details">×</button>
        <div id="company-modal-content"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  modalOverlay = document.getElementById('company-details-modal');
  const closeBtn = document.getElementById('company-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCompanyDetailsModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeCompanyDetailsModal();
      }
    });
  }

  if (!document.body.dataset.companyModalEscBound) {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeCompanyDetailsModal();
      }
    });
    document.body.dataset.companyModalEscBound = '1';
  }

  return modalOverlay;
}

function openCompanyDetailsModal(companyName) {
  const company = upcomingCompanies.find((entry) => entry.name === companyName);
  if (!company) return;

  const modalOverlay = ensureCompanyDetailsModal();
  const content = document.getElementById('company-modal-content');
  if (!modalOverlay || !content) return;

  const detailInfo = getCompanyDetailInfo(company);
  const logoUrl = getCompanyLogoUrl(company.name);
  const initials = getCompanyInitials(company.name);

  content.innerHTML = `
    <div class="company-modal-header">
      <div class="company-modal-logo-wrap">
        <img class="company-modal-logo" src="${logoUrl}" alt="${company.name} logo" ${logoUrl ? '' : 'style="display:none;"'} onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="company-modal-logo-fallback" ${logoUrl ? 'style="display:none;"' : ''}>${initials}</div>
      </div>
      <div>
        <h3 style="margin: 0 0 0.2rem 0;">${company.name}</h3>
        <p style="margin: 0; color: #999;">${company.position} • Visit: ${company.visitDate}</p>
      </div>
    </div>

    <div class="company-modal-grid">
      <div><strong>Application Closes:</strong> ${detailInfo.applicationClose}</div>
      <div><strong>Assessment Date:</strong> ${detailInfo.testDate}</div>
      <div><strong>Salary Range:</strong> ${company.salary}</div>
      <div><strong>CTC:</strong> ${company.ctc}</div>
      <div><strong>Minimum CGPA:</strong> ${detailInfo.minCgpa}</div>
      <div><strong>Eligible Batch:</strong> ${detailInfo.eligibleYears}</div>
      <div><strong>Backlog Policy:</strong> ${detailInfo.allowedBacklogs}</div>
    </div>

    <div class="company-modal-section">
      <h4>Selection Process</h4>
      <p>${detailInfo.process}</p>
    </div>

    <div class="company-modal-section">
      <h4>Preferred Skills</h4>
      <p>${detailInfo.keySkills}</p>
    </div>

    <div class="company-modal-section">
      <h4>Required Documents</h4>
      <p>${detailInfo.documents}</p>
    </div>

    <div class="company-modal-note">Tip: Keep your resume, coding profile, and latest semester marks ready before applying.</div>

    <div class="company-modal-actions">
      <a class="company-apply-btn" href="${detailInfo.applyUrl}" target="_blank" rel="noopener noreferrer">Apply Now</a>
    </div>
  `;

  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCompanyDetailsModal() {
  const modalOverlay = document.getElementById('company-details-modal');
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function getInterestCategory(interest) {
  const normalized = String(interest || '').trim().toLowerCase();
  if (normalized === 'higher studies') return 'Higher Studies';
  if (normalized === 'entrepreneurship') return 'Entrepreneurship';
  if (normalized === 'placements') return 'Placements';
  return 'Placements';
}

function getPlacementStatusLabel(student) {
  const explicit = String(student?.placementStatus || '').trim().toLowerCase();
  if (explicit) {
    if (explicit.includes('yet')) return 'Yet to be Placed';
    if (explicit.includes('placed')) return 'Placed';
  }
  return 'Yet to be Placed';
}

function getInterestStateKey(category) {
  if (category === 'Higher Studies') return 'higher-studies';
  if (category === 'Entrepreneurship') return 'entrepreneurship';
  return 'placements';
}

function getPlacementPriority(interest) {
  const category = getInterestCategory(interest);
  if (category === 'Placements') return 0;
  if (category === 'Higher Studies') return 1;
  if (category === 'Entrepreneurship') return 2;
  return 3;
}

function getStudentPackage(student) {
  const placedRecord = recentlyPlaced.find((entry) => entry.name === student.name);
  return placedRecord ? Number(placedRecord.package || 0) : 0;
}

function getDefaultAnalyticsSortedStudents() {
  return [...students].sort((a, b) => {
    const placementPriorityDiff = getPlacementPriority(a.interest) - getPlacementPriority(b.interest);
    if (placementPriorityDiff !== 0) {
      return placementPriorityDiff;
    }

    const packageDiff = getStudentPackage(b) - getStudentPackage(a);
    if (packageDiff !== 0) {
      return packageDiff;
    }

    const codingDiff = Number(b.leetcodeSolvedAll || 0) - Number(a.leetcodeSolvedAll || 0);
    if (codingDiff !== 0) {
      return codingDiff;
    }

    return Number(b.gradePoints || 0) - Number(a.gradePoints || 0);
  });
}

function renderAnalyticsInsights(container) {
  if (container) {
    container.innerHTML = '';
  }
}

let analyticsStudentDistributionChart = null;
let analyticsDeptBarChart = null;
let analyticsPlacementBarChart = null;
let analyticsSelectedDepartment = null;

function getYearDistributionBuckets() {
  const map = new Map([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0]
  ]);

  students.forEach((student) => {
    const year = getYearNumber(student.year);
    if (map.has(year)) {
      map.set(year, map.get(year) + 1);
    }
  });

  return {
    labels: ['First', 'Second', 'Third', 'Fourth'],
    values: [map.get(1), map.get(2), map.get(3), map.get(4)]
  };
}

function renderAnalyticsRightPanel(selectedYear) {
  const heading = document.getElementById('analytics-selected-heading');
  const yearData = getYearDistributionBuckets();

  const selectedStudents = Number.isInteger(selectedYear)
    ? students.filter((student) => getYearNumber(student.year) === selectedYear)
    : [...students];

  const selectedLabel = Number.isInteger(selectedYear)
    ? yearData.labels[selectedYear - 1]
    : 'All Years';

  if (heading) {
    heading.textContent = `${selectedLabel} Insights`;
  }

  const deptCounts = {};
  selectedStudents.forEach((student) => {
    const dept = String(student.dept || 'Unknown').trim() || 'Unknown';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const deptLabels = Object.keys(deptCounts);
  const deptValues = Object.values(deptCounts);
  const deptColors = ['#D9FBE8', '#9EE6C2', '#63CF9D', '#2CB777', '#15965F', '#0E754A', '#085638'];

  if (analyticsSelectedDepartment && !deptLabels.includes(analyticsSelectedDepartment)) {
    analyticsSelectedDepartment = null;
  }

  const statusSourceStudents = analyticsSelectedDepartment
    ? selectedStudents.filter((student) => String(student.dept || 'Unknown').trim() === analyticsSelectedDepartment)
    : selectedStudents;

  const placementStatusCounts = { Placed: 0, 'Yet to be Placed': 0 };
  statusSourceStudents.forEach((student) => {
    const status = getPlacementStatusLabel(student);
    if (placementStatusCounts[status] !== undefined) {
      placementStatusCounts[status] += 1;
    }
  });

  const placementLabels = Object.keys(placementStatusCounts);
  const placementValues = Object.values(placementStatusCounts);
  const placementColors = ['#2CB777', '#0E754A'];

  if (analyticsDeptBarChart) {
    analyticsDeptBarChart.destroy();
  }
  if (analyticsPlacementBarChart) {
    analyticsPlacementBarChart.destroy();
  }

  const deptCanvas = document.getElementById('analytics-dept-bar');
  const placementCanvas = document.getElementById('analytics-placement-bar');
  if (!deptCanvas || !placementCanvas) {
    return;
  }

  const chartTheme = getChartThemeColors();

  analyticsDeptBarChart = new Chart(deptCanvas, {
    type: 'bar',
    data: {
      labels: ['Department Count'],
      datasets: deptLabels.map((dept, index) => ({
        label: dept,
        data: [deptValues[index]],
        backgroundColor: deptColors[index % deptColors.length],
        borderColor: analyticsSelectedDepartment === dept ? '#FEC524' : 'transparent',
        borderWidth: analyticsSelectedDepartment === dept ? 2 : 0,
        barThickness: analyticsSelectedDepartment === dept ? 28 : 24,
        stack: 'dept'
      }))
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 42
        }
      },
      plugins: {
        legend: { position: 'bottom', labels: { color: chartTheme.legendColor } },
        tooltip: {
          position: 'aboveSegment',
          xAlign: 'center',
          yAlign: 'bottom',
          caretPadding: 6,
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          ticks: { color: chartTheme.axisTickColor, precision: 0 },
          grid: { color: chartTheme.axisGridColor }
        },
        y: {
          stacked: true,
          ticks: { color: chartTheme.axisTickColor },
          grid: { display: false }
        }
      },
      onClick(event, elements, chart) {
        const clickedElements = chart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          true
        );

        if (!clickedElements.length) {
          if (analyticsSelectedDepartment !== null) {
            analyticsSelectedDepartment = null;
            renderAnalyticsRightPanel(selectedYear);
          }
          return;
        }

        const datasetIndex = clickedElements[0].datasetIndex;
        const clickedDept = deptLabels[datasetIndex];
        analyticsSelectedDepartment = analyticsSelectedDepartment === clickedDept ? null : clickedDept;
        renderAnalyticsRightPanel(selectedYear);
      }
    }
  });

  if (analyticsSelectedDepartment) {
    const selectedDatasetIndex = deptLabels.indexOf(analyticsSelectedDepartment);
    if (selectedDatasetIndex >= 0) {
      const selectedBar = analyticsDeptBarChart.getDatasetMeta(selectedDatasetIndex)?.data?.[0];
      if (selectedBar) {
        const tooltipAnchor = {
          x: Number(selectedBar.x || 0),
          y: Number(selectedBar.y || 0) - (Number(selectedBar.height || 0) / 2) - 36
        };
        const activeElement = [{ datasetIndex: selectedDatasetIndex, index: 0 }];
        analyticsDeptBarChart.setActiveElements(activeElement);
        if (analyticsDeptBarChart.tooltip?.setActiveElements) {
          analyticsDeptBarChart.tooltip.setActiveElements(activeElement, tooltipAnchor);
        }
        analyticsDeptBarChart.update();
      }
    }
  }

  analyticsPlacementBarChart = new Chart(placementCanvas, {
    type: 'bar',
    data: {
      labels: ['Placement Status'],
      datasets: placementLabels.map((label, index) => ({
        label,
        data: [placementValues[index]],
        backgroundColor: placementColors[index % placementColors.length],
        borderWidth: 0,
        barThickness: 24,
        stack: 'placement'
      }))
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: chartTheme.legendColor } },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          ticks: { color: chartTheme.axisTickColor, precision: 0 },
          grid: { color: chartTheme.axisGridColor }
        },
        y: {
          stacked: true,
          ticks: { color: chartTheme.axisTickColor },
          grid: { display: false }
        }
      }
    }
  });
}

function renderUnifiedAnalytics(container) {
  container.style.display = 'block';
  container.style.marginBottom = '2rem';
  analyticsSelectedDepartment = null;
  container.innerHTML = `
    <div class="analytics-single-layout">
      <div class="chart-card analytics-single-donut-card">
        <h3 style="text-align: center; margin-top: 0;">Student Distribution</h3>
        <div class="analytics-single-donut-wrap">
          <canvas id="analytics-student-distribution" class="analytics-single-donut-canvas"></canvas>
        </div>
      </div>
      <div class="chart-card analytics-single-right-card">
        <h4 id="analytics-selected-heading" style="margin: 0 0 0.6rem 0;">All Years Insights</h4>
        <div class="analytics-horizontal-block">
          <h5 style="margin: 0 0 0.45rem 0;">Department Distribution</h5>
          <div class="analytics-bar-canvas-wrap"><canvas id="analytics-dept-bar"></canvas></div>
        </div>
        <div class="analytics-horizontal-block" style="margin-top: 0.85rem;">
          <h5 style="margin: 0 0 0.45rem 0;">Placement Status</h5>
          <div class="analytics-bar-canvas-wrap"><canvas id="analytics-placement-bar"></canvas></div>
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('analytics-student-distribution');
  if (!canvas) {
    return;
  }

  const yearData = getYearDistributionBuckets();
  let selectedIndex = null;
  const colors = ['#D9FBE8', '#7FDDB2', '#2CB777', '#0E754A'];

  if (analyticsStudentDistributionChart) {
    analyticsStudentDistributionChart.destroy();
  }

  const centerTextPlugin = {
    id: 'analyticsCenterText',
    afterDraw(chart) {
      const dataset = chart.data.datasets[0] || { data: [] };
      const total = dataset.data.reduce((sum, value) => sum + Number(value || 0), 0);
      const value = selectedIndex === null ? total : Number(dataset.data[selectedIndex] || 0);
      const label = selectedIndex === null ? 'Total Students' : chart.data.labels[selectedIndex];

      const { ctx, chartArea } = chart;
      if (!chartArea) {
        return;
      }
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = document.body.classList.contains('light-mode') ? '#1e293b' : '#f5f5f5';
      ctx.font = '700 26px Segoe UI';
      ctx.fillText(String(value), x, y - 4);
      ctx.font = '500 12px Segoe UI';
      ctx.fillStyle = document.body.classList.contains('light-mode') ? '#475569' : '#9ca3af';
      ctx.fillText(label, x, y + 18);
      ctx.restore();
    }
  };

  analyticsStudentDistributionChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: yearData.labels,
      datasets: [{
        data: yearData.values,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset(context) {
          return context.dataIndex === selectedIndex ? 18 : 0;
        },
        offset(context) {
          return context.dataIndex === selectedIndex ? 18 : 0;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      cutout: '48%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              const allValues = context.dataset.data || [];
              const total = allValues.reduce((sum, value) => sum + Number(value || 0), 0);
              const value = Number(context.raw || 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      onClick(event, elements, chart) {
        const clickedElements = chart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          true
        );

        if (!clickedElements.length) {
          selectedIndex = null;
          analyticsSelectedDepartment = null;
          chart.update();
          renderAnalyticsRightPanel(null);
          return;
        }
        const index = clickedElements[0].index;
        selectedIndex = selectedIndex === index ? null : index;
        analyticsSelectedDepartment = null;
        chart.update();
        renderAnalyticsRightPanel(selectedIndex === null ? null : (selectedIndex + 1));
      }
    },
    plugins: [centerTextPlugin]
  });

  renderAnalyticsRightPanel(null);
}

function renderDashboard() {
  const dash = document.getElementById('dashboard-content');
  const title = document.getElementById('dashboard-title');
  const chartsContainer = document.getElementById('charts-container');
  const topSortContainer = document.getElementById('sort-buttons');
  const defaultSortedStudents = getDefaultAnalyticsSortedStudents();
  if (topSortContainer) {
    topSortContainer.innerHTML = '';
  }

  if (isStaff) {
    title.textContent = '';
    renderUnifiedAnalytics(chartsContainer);
    dash.innerHTML = `<div id="analytics-insights"></div><div id="dashboard-filter-controls"></div><div id="staff-table"></div>`;
    renderAnalyticsInsights(document.getElementById('analytics-insights'));
    initializeDashboardFilters(true);
    dashboardFilteredStudents = [...defaultSortedStudents];
    renderTable(filterDashboardRowsBySearch(defaultSortedStudents, dashboardSearchQuery), true);
  } else {
    title.textContent = '';
    if (chartsContainer) {
      chartsContainer.innerHTML = '';
    }
    if (dash) {
      dash.innerHTML = '';
    }
  }
}

function initializeDashboardFilters(staffView, highlightId = null) {
  const container = document.getElementById('dashboard-filter-controls');
  if (!container) {
    return;
  }

  const source = Array.isArray(students) ? [...students] : [];
  const years = [...new Set(source.map((student) => getYearNumber(student.year)).filter(Boolean))].sort((a, b) => a - b);
  const departments = [...new Set(source.map((student) => String(student.dept || '').trim()).filter(Boolean))].sort();
  const interests = [...new Set(source.map((student) => getInterestCategory(student.interest)).filter(Boolean))].sort();
  const placementStatuses = ['Placed', 'Yet to be Placed'];

  const getRange = (values, fallbackMin, fallbackMax) => {
    const numericValues = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    if (!numericValues.length) {
      return { min: fallbackMin, max: fallbackMax };
    }
    return {
      min: Math.floor(Math.min(...numericValues)),
      max: Math.ceil(Math.max(...numericValues))
    };
  };

  const codingRange = getRange(source.map((student) => student.leetcodeSolvedAll), 0, 1000);
  const cgpaRange = getRange(source.map((student) => student.gradePoints), 0, 10);
  const tenthRange = getRange(source.map((student) => student.tenthPercentage), 0, 100);
  const twelfthRange = getRange(source.map((student) => student.twelfthPercentage), 0, 100);

  const makeCheckboxes = (name, items, formatter = (item) => item) => items.map((item) => `
    <label class="dashboard-filter-check">
      <input type="checkbox" name="${name}" value="${item}" checked>
      <span>${formatter(item)}</span>
    </label>
  `).join('');

  const makeFilterGroupHeader = (title, checkboxName) => `
    <div class="dashboard-filter-group-header">
      <h4>${title}</h4>
      <label class="dashboard-select-all-check" title="Select all">
        <input type="checkbox" class="dashboard-select-all-toggle" data-target-name="${checkboxName}">
      </label>
    </div>
  `;

  const makeMetricCheckboxes = () => {
    const metricCheckboxes = dashboardMetricOrder.map((key) => `
      <label class="dashboard-filter-check">
        <input type="checkbox" name="dashboard-visible-metric" value="${key}" ${dashboardVisibleMetrics.has(key) ? 'checked' : ''}>
        <span>${dashboardMetricLabels[key]}</span>
      </label>
    `);
    const columnSize = 6;
    const metricColumns = [];
    for (let index = 0; index < metricCheckboxes.length; index += columnSize) {
      metricColumns.push(`
        <div class="dashboard-filter-column">
          ${metricCheckboxes.slice(index, index + columnSize).join('')}
        </div>
      `);
    }
    return metricColumns.join('');
  };

  const formatYearLabel = (year) => getYearLabel(year);

  container.innerHTML = `
    <div class="dashboard-filter-toolbar">
      <button type="button" id="dashboard-filter-toggle" class="dashboard-filter-btn">Filters</button>
      <div class="dashboard-toolbar-search-wrap">
        <input type="search" id="dashboard-search-input" class="dashboard-toolbar-search" placeholder="Search students" value="${dashboardSearchQuery}">
      </div>
      <div class="dashboard-export-actions">
        <button type="button" id="dashboard-fetch-leetcode" class="dashboard-export-btn">Fetch LeetCode</button>
        <button type="button" id="dashboard-export-csv" class="dashboard-export-btn">Export CSV</button>
        <button type="button" id="dashboard-export-excel" class="dashboard-export-btn">Export Excel</button>
      </div>
    </div>
    <div id="dashboard-filter-panel" class="dashboard-filter-panel" style="display:none;">
      <div class="dashboard-filter-dialog">
        <div class="dashboard-filter-dialog-header">
          <h3>Filter Students</h3>
          <div class="dashboard-filter-header-sort">
            <div class="dashboard-filter-header-sort-row">
              <label for="dashboard-sort-key">Sort by</label>
              <select id="dashboard-sort-key">
                <option value="leetcodeSolvedAll">LeetCode Solved</option>
                <option value="gradePoints">CGPA</option>
                <option value="tenthPercentage">10th %</option>
                <option value="twelfthPercentage">12th %</option>
                <option value="internships">Internships</option>
                <option value="certifications">Certifications</option>
                <option value="year">Year</option>
                <option value="interest">Interest</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div class="dashboard-filter-header-sort-row">
              <label for="dashboard-sort-dir">Direction</label>
              <select id="dashboard-sort-dir">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          <button type="button" id="dashboard-filter-close" class="dashboard-filter-close" aria-label="Close filters">×</button>
        </div>
      <div class="dashboard-filter-grid">
        <div class="dashboard-filter-group dashboard-filter-group--year">
          ${makeFilterGroupHeader('Year', 'dashboard-year')}
          <div class="dashboard-filter-list">
            ${makeCheckboxes('dashboard-year', years, formatYearLabel)}
          </div>
        </div>

        <div class="dashboard-filter-group dashboard-filter-group--departments">
          ${makeFilterGroupHeader('Departments', 'dashboard-dept')}
          <div class="dashboard-filter-list dashboard-filter-list--departments">
            ${makeCheckboxes('dashboard-dept', departments)}
          </div>
        </div>

        <div class="dashboard-filter-group dashboard-filter-group--interest">
          ${makeFilterGroupHeader('Interest', 'dashboard-interest')}
          <div class="dashboard-filter-list dashboard-filter-list--interest">
            ${makeCheckboxes('dashboard-interest', interests)}
          </div>
        </div>

        <div class="dashboard-filter-group dashboard-filter-group--placement-status">
          ${makeFilterGroupHeader('Placement Status', 'dashboard-placement-status')}
          <div class="dashboard-filter-list dashboard-filter-list--placement-status">
            ${makeCheckboxes('dashboard-placement-status', placementStatuses, (status) => status === 'Placed' ? 'Placed Students' : 'Yet to be Placed Students')}
          </div>
        </div>
      </div>

      <div class="dashboard-metric-grid">
        <div class="dashboard-filter-group dashboard-filter-group--coding dashboard-filter-group--inline-range">
          <h4>Coding Problems</h4>
          <div class="dashboard-range-wrap">
            <div class="dashboard-number-range">
              <label for="coding-min">Min</label>
              <input type="number" id="coding-min" min="${codingRange.min}" max="${codingRange.max}" value="${codingRange.min}">
            </div>
            <div class="dashboard-number-range">
              <label for="coding-max">Max</label>
              <input type="number" id="coding-max" min="${codingRange.min}" max="${codingRange.max}" value="${codingRange.max}">
            </div>
          </div>
        </div>

        <div class="dashboard-filter-group dashboard-filter-group--cgpa dashboard-filter-group--inline-range">
          <h4>CGPA</h4>
          <div class="dashboard-range-wrap">
            <div class="dashboard-number-range">
              <label for="cgpa-min">Min</label>
              <input type="number" id="cgpa-min" min="${cgpaRange.min}" max="${cgpaRange.max}" step="0.1" value="${cgpaRange.min}">
            </div>
            <div class="dashboard-number-range">
              <label for="cgpa-max">Max</label>
              <input type="number" id="cgpa-max" min="${cgpaRange.min}" max="${cgpaRange.max}" step="0.1" value="${cgpaRange.max}">
            </div>
          </div>
        </div>

        <div class="dashboard-filter-group dashboard-filter-group--tenth dashboard-filter-group--inline-range">
          <h4>10th %</h4>
          <div class="dashboard-range-wrap">
            <div class="dashboard-number-range">
              <label for="tenth-min">Min</label>
              <input type="number" id="tenth-min" min="${tenthRange.min}" max="${tenthRange.max}" step="0.1" value="${tenthRange.min}">
            </div>
            <div class="dashboard-number-range">
              <label for="tenth-max">Max</label>
              <input type="number" id="tenth-max" min="${tenthRange.min}" max="${tenthRange.max}" step="0.1" value="${tenthRange.max}">
            </div>
          </div>
        </div>

        <div class="dashboard-filter-group dashboard-filter-group--twelfth dashboard-filter-group--inline-range">
          <h4>12th %</h4>
          <div class="dashboard-range-wrap">
            <div class="dashboard-number-range">
              <label for="twelfth-min">Min</label>
              <input type="number" id="twelfth-min" min="${twelfthRange.min}" max="${twelfthRange.max}" step="0.1" value="${twelfthRange.min}">
            </div>
            <div class="dashboard-number-range">
              <label for="twelfth-max">Max</label>
              <input type="number" id="twelfth-max" min="${twelfthRange.min}" max="${twelfthRange.max}" step="0.1" value="${twelfthRange.max}">
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard-filter-group dashboard-filter-group--metric-visibility">
        ${makeFilterGroupHeader('Visible Metrics', 'dashboard-visible-metric')}
        <div class="dashboard-filter-list dashboard-filter-list--metric-visibility">
          ${makeMetricCheckboxes()}
        </div>
      </div>
      <div class="dashboard-filter-actions">
        <button type="button" id="dashboard-filter-apply" class="dashboard-filter-action-btn">Apply</button>
        <button type="button" id="dashboard-filter-reset" class="dashboard-filter-action-btn dashboard-filter-action-btn--ghost">Reset</button>
      </div>
      </div>
    </div>
  `;

  const panel = document.getElementById('dashboard-filter-panel');
  const toggleBtn = document.getElementById('dashboard-filter-toggle');
  const closeBtn = document.getElementById('dashboard-filter-close');
  const dialog = panel ? panel.querySelector('.dashboard-filter-dialog') : null;
  const applyBtn = document.getElementById('dashboard-filter-apply');
  const resetBtn = document.getElementById('dashboard-filter-reset');
  const searchInput = document.getElementById('dashboard-search-input');
  const fetchLeetCodeBtn = document.getElementById('dashboard-fetch-leetcode');
  const exportCsvBtn = document.getElementById('dashboard-export-csv');
  const exportExcelBtn = document.getElementById('dashboard-export-excel');
  const selectAllToggles = Array.from(container.querySelectorAll('.dashboard-select-all-toggle'));

  const getGroupCheckboxes = (name) => Array.from(container.querySelectorAll(`input[type="checkbox"][name="${name}"]`));

  const syncSelectAllToggle = (toggle) => {
    const targetName = toggle.dataset.targetName;
    const checkboxes = getGroupCheckboxes(targetName);
    const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
    const total = checkboxes.length;

    if (!total) {
      toggle.checked = false;
      toggle.indeterminate = false;
      return;
    }

    toggle.checked = checkedCount === total;
    toggle.indeterminate = checkedCount > 0 && checkedCount < total;
  };

  selectAllToggles.forEach((toggle) => {
    const targetName = toggle.dataset.targetName;
    const checkboxes = getGroupCheckboxes(targetName);

    toggle.addEventListener('change', () => {
      const shouldCheck = toggle.checked;
      checkboxes.forEach((checkbox) => {
        checkbox.checked = shouldCheck;
      });
      syncSelectAllToggle(toggle);
    });

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        syncSelectAllToggle(toggle);
      });
    });

    syncSelectAllToggle(toggle);
  });

  const closePanel = () => {
    if (panel) {
      panel.style.display = 'none';
    }
  };

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  if (panel) {
    panel.addEventListener('click', (event) => {
      if (event.target === panel) {
        closePanel();
      }
    });
  }

  if (dialog) {
    dialog.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyDashboardFilters(staffView, highlightId);
      closePanel();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      dashboardVisibleMetrics = new Set(defaultDashboardVisibleMetricKeys);
      initializeDashboardFilters(staffView, highlightId);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      dashboardSearchQuery = event.target.value || '';
      renderTable(filterDashboardRowsBySearch(dashboardFilteredStudents, dashboardSearchQuery), staffView, highlightId, currentDashboardSortKey);
    });
  }



  if (fetchLeetCodeBtn) {
    fetchLeetCodeBtn.addEventListener('click', async () => {
      fetchLeetCodeBtn.disabled = true;
      const originalLabel = fetchLeetCodeBtn.textContent;
      fetchLeetCodeBtn.textContent = 'Fetching...';
      try {
        const response = await fetch('/api/sync-leetcode', { method: 'POST' });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch LeetCode stats.');
        }
        await refreshStudentsData();
        applyDashboardFilters(staffView, highlightId);
        showToast(data.message || 'LeetCode stats fetch completed successfully.', 'success');
      } catch (error) {
        showToast(error.message || 'Unable to fetch LeetCode stats right now.', 'error');
      } finally {
        fetchLeetCodeBtn.disabled = false;
        fetchLeetCodeBtn.textContent = originalLabel || 'Fetch LeetCode';
      }
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportFilteredDataAsCsv);
  }

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportFilteredDataAsExcel);
  }
}

function filterDashboardRowsBySearch(rows, query) {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) {
    return Array.isArray(rows) ? [...rows] : [];
  }

  return (Array.isArray(rows) ? rows : []).filter((student) => {
    const searchableText = [
      student.name,
      student.dept,
      getYearLabel(student.year),
      student.interest,
      student.rollNo,
      student.registerNo,
      student.gradePoints,
      student.leetcodeSolvedAll,
      student.certifications,
      student.internships,
      student.collegeMail || student.email,
      student.personalMail,
      student.contactNo,
      student.resumeLink,
      getPlacementStatusLabel(student)
    ]
      .map((value) => String(value ?? '').toLowerCase())
      .join(' ');

    return searchableText.includes(normalizedQuery);
  });
}

function applyDashboardFilters(staffView, highlightId = null) {
  const getCheckedValues = (name, asNumber = false) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map((input) => (asNumber ? Number(input.value) : input.value));

  const selectedYears = getCheckedValues('dashboard-year', true);
  const selectedDepts = getCheckedValues('dashboard-dept');
  const selectedInterests = getCheckedValues('dashboard-interest');
  const selectedPlacementStatuses = getCheckedValues('dashboard-placement-status');
  const selectedVisibleMetrics = getCheckedValues('dashboard-visible-metric');

  const codingMin = Number(document.getElementById('coding-min')?.value || 0);
  const codingMax = Number(document.getElementById('coding-max')?.value || Number.MAX_SAFE_INTEGER);
  const cgpaMin = Number(document.getElementById('cgpa-min')?.value || 0);
  const cgpaMax = Number(document.getElementById('cgpa-max')?.value || 10);
  const tenthMin = Number(document.getElementById('tenth-min')?.value || 0);
  const tenthMax = Number(document.getElementById('tenth-max')?.value || 100);
  const twelfthMin = Number(document.getElementById('twelfth-min')?.value || 0);
  const twelfthMax = Number(document.getElementById('twelfth-max')?.value || 100);
  const sortKey = document.getElementById('dashboard-sort-key')?.value || 'leetcodeSolvedAll';
  const sortDir = document.getElementById('dashboard-sort-dir')?.value || 'desc';

  dashboardVisibleMetrics = new Set(selectedVisibleMetrics);

  const inRange = (value, min, max) => value >= min && value <= max;
  const toNumberOrNull = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  let filtered = [...students].filter((student) => {
    const year = getYearNumber(student.year);
    const coding = Number(student.leetcodeSolvedAll || 0);
    const cgpa = Number(student.gradePoints || 0);
    const tenth = toNumberOrNull(student.tenthPercentage);
    const twelfth = toNumberOrNull(student.twelfthPercentage);

    const yearOk = selectedYears.length ? selectedYears.includes(year) : true;
    const deptOk = selectedDepts.length ? selectedDepts.includes(String(student.dept || '')) : true;
    const interestOk = selectedInterests.length ? selectedInterests.includes(getInterestCategory(student.interest)) : true;
    const codingOk = inRange(coding, Math.min(codingMin, codingMax), Math.max(codingMin, codingMax));
    const cgpaOk = inRange(cgpa, Math.min(cgpaMin, cgpaMax), Math.max(cgpaMin, cgpaMax));
    const tenthOk = tenth === null ? true : inRange(tenth, Math.min(tenthMin, tenthMax), Math.max(tenthMin, tenthMax));
    const twelfthOk = twelfth === null ? true : inRange(twelfth, Math.min(twelfthMin, twelfthMax), Math.max(twelfthMin, twelfthMax));
    const statusLabel = getPlacementStatusLabel(student);
    const placementStatusOk = selectedPlacementStatuses.length ? selectedPlacementStatuses.includes(statusLabel) : true;

    return yearOk && deptOk && interestOk && codingOk && cgpaOk && tenthOk && twelfthOk && placementStatusOk;
  });

  const numericSortKeys = new Set(['leetcodeSolvedAll', 'gradePoints', 'tenthPercentage', 'twelfthPercentage', 'internships', 'certifications', 'year']);
  filtered.sort((a, b) => {
    let compare = 0;
    if (numericSortKeys.has(sortKey)) {
      if (sortKey === 'year') {
        compare = getYearNumber(a.year) - getYearNumber(b.year);
      } else {
        compare = Number(a[sortKey] || 0) - Number(b[sortKey] || 0);
      }
    } else {
      compare = String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''));
    }
    return sortDir === 'asc' ? compare : -compare;
  });

  dashboardFilteredStudents = filtered;
  currentDashboardSortKey = sortKey;
  renderTable(filterDashboardRowsBySearch(filtered, dashboardSearchQuery), staffView, highlightId, sortKey);
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function getStudentById(studentId) {
  return students.find((student) => String(student.id) === String(studentId));
}

function ensureAnalyticsProfileModal() {
  let modalOverlay = document.getElementById('analytics-profile-modal');
  if (modalOverlay) {
    return modalOverlay;
  }

  const modalMarkup = `
    <div id="analytics-profile-modal" class="company-modal-overlay" aria-hidden="true">
      <div class="company-modal-card analytics-profile-card" role="dialog" aria-modal="true" aria-label="Student profile">
        <button type="button" class="company-modal-close" id="analytics-profile-close" aria-label="Close profile">×</button>
        <div class="analytics-profile-nav">
          <button type="button" id="analytics-profile-prev" class="analytics-profile-nav-btn" aria-label="Previous profile">←</button>
          <div id="analytics-profile-counter" class="analytics-profile-counter"></div>
          <button type="button" id="analytics-profile-edit" class="analytics-profile-action-btn">Edit</button>
          <button type="button" id="analytics-profile-next" class="analytics-profile-nav-btn" aria-label="Next profile">→</button>
        </div>
        <div id="analytics-profile-content"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  modalOverlay = document.getElementById('analytics-profile-modal');
  const closeBtn = document.getElementById('analytics-profile-close');
  const prevBtn = document.getElementById('analytics-profile-prev');
  const nextBtn = document.getElementById('analytics-profile-next');
  const editBtn = document.getElementById('analytics-profile-edit');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeAnalyticsProfileModal);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateAnalyticsProfile(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateAnalyticsProfile(1));
  }
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      analyticsProfileEditMode = !analyticsProfileEditMode;
      updateAnalyticsProfileModal();
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeAnalyticsProfileModal();
      }
    });
  }

  if (!document.body.dataset.analyticsProfileModalKeysBound) {
    document.addEventListener('keydown', (event) => {
      const activeModal = document.getElementById('analytics-profile-modal');
      const isActive = !!(activeModal && activeModal.classList.contains('active'));
      if (!isActive) {
        return;
      }

      if (event.key === 'Escape') {
        closeAnalyticsProfileModal();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateAnalyticsProfile(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateAnalyticsProfile(1);
      }
    });
    document.body.dataset.analyticsProfileModalKeysBound = '1';
  }

  return modalOverlay;
}

function getAnalyticsProfileSelectOptions(fieldKey, currentValue) {
  const normalizedCurrent = String(currentValue ?? '').trim();
  const dynamicFields = new Set(['dept', 'section']);

  if (dynamicFields.has(fieldKey)) {
    const uniqueValues = [...new Set(
      (Array.isArray(students) ? students : [])
        .map((student) => String(getDashboardFieldRawValue(student, fieldKey) ?? '').trim())
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    if (normalizedCurrent && !uniqueValues.includes(normalizedCurrent)) {
      uniqueValues.unshift(normalizedCurrent);
    }

    return uniqueValues;
  }

  const fixedOptions = {
    year: ['1', '2', '3', '4'],
    interest: dashboardInterestOptions,
    placementStatus: ['Placed', 'Yet to be Placed'],
    gender: ['Male', 'Female', 'Other'],
    residencyType: ['Dayscholar', 'Hostel']
  };

  const options = fixedOptions[fieldKey];
  if (!options) {
    return null;
  }

  const normalizedOptions = options.map((option) => String(option));
  if (normalizedCurrent && !normalizedOptions.includes(normalizedCurrent)) {
    normalizedOptions.unshift(normalizedCurrent);
  }
  return normalizedOptions;
}

function buildAnalyticsProfileEditField(student, fieldKey, label) {
  const value = getDashboardFieldRawValue(student, fieldKey);
  const config = dashboardEditableFieldConfigs[fieldKey] || { type: 'text' };

  const selectOptions = getAnalyticsProfileSelectOptions(fieldKey, value);
  if (selectOptions) {
    const options = selectOptions.map((option) => {
      const optionValue = String(option);
      return `
        <option value="${escapeHtmlAttribute(optionValue)}" ${String(value ?? '') === optionValue ? 'selected' : ''}>${optionValue}</option>
      `;
    }).join('');
    return `
      <label class="analytics-profile-edit-item">
        <span>${label}</span>
        <select data-profile-field="${fieldKey}" class="dashboard-inline-edit-control">${options}</select>
      </label>
    `;
  }

  if (config.type === 'select') {
    const options = (config.options || []).map((option) => `
      <option value="${escapeHtmlAttribute(option)}" ${String(value || '') === option ? 'selected' : ''}>${option}</option>
    `).join('');
    return `
      <label class="analytics-profile-edit-item">
        <span>${label}</span>
        <select data-profile-field="${fieldKey}" class="dashboard-inline-edit-control">${options}</select>
      </label>
    `;
  }

  const attributes = [
    `type="${config.type || 'text'}"`,
    `data-profile-field="${fieldKey}"`,
    'class="dashboard-inline-edit-control"',
    `value="${escapeHtmlAttribute(value)}"`
  ];
  if (config.min !== undefined) {
    attributes.push(`min="${config.min}"`);
  }
  if (config.max !== undefined) {
    attributes.push(`max="${config.max}"`);
  }
  if (config.step !== undefined) {
    attributes.push(`step="${config.step}"`);
  }

  return `
    <label class="analytics-profile-edit-item">
      <span>${label}</span>
      <input ${attributes.join(' ')}>
    </label>
  `;
}

function buildProfileViewHtml(student, options = {}) {
  const {
    leetcodeContainerId = 'leetcode-stats-container',
    showLinkedInButton = false,
    inlineProfileEdit = false,
  } = options;

  const interestCategory = getInterestCategory(student.interest);
  const displayName = student.name || 'N/A';
  const displayPhoto = student.linkedinPhotoUrl || '';
  const twelfthPercentage = student.twelfthPercentage ?? 'N/A';
  const tenthPercentage = student.tenthPercentage ?? 'N/A';
  const resumeLink = String(student.resumeLink || '').trim();
  const safeResumeLink = sanitizeExternalUrl(resumeLink);
  const usernameInputId = `${leetcodeContainerId}-username-input`;
  const usernameSaveId = `${leetcodeContainerId}-username-save`;

  const buildInlineFieldControl = (fieldKey, fallbackValue = 'N/A') => {
    const displayValue = fallbackValue;
    if (!inlineProfileEdit) {
      return `${displayValue}`;
    }

    const rawValue = getDashboardFieldRawValue(student, fieldKey);
    const config = dashboardEditableFieldConfigs[fieldKey] || { type: 'text' };
    const attributes = [
      `type="${config.type || 'text'}"`,
      `data-profile-field="${fieldKey}"`,
      'class="dashboard-inline-edit-control profile-inline-edit-control"',
      `value="${escapeHtmlAttribute(rawValue)}"`
    ];

    if (config.min !== undefined) {
      attributes.push(`min="${config.min}"`);
    }
    if (config.max !== undefined) {
      attributes.push(`max="${config.max}"`);
    }
    if (config.step !== undefined) {
      attributes.push(`step="${config.step}"`);
    }

    return `<input ${attributes.join(' ')}>`;
  };

  return `
    <div class="profile-summary-grid" style="margin-bottom: 1rem;">
      <div class="card profile-summary-card profile-summary-card--identity">
        <div class="profile-summary-header" style="flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
          ${displayPhoto
      ? `<img src="${displayPhoto}" alt="${displayName}" class="profile-avatar-medium" style="width: 120px; height: 120px; border-radius: 50%;">`
      : `<div class="profile-avatar-fallback profile-avatar-medium" style="width: 120px; height: 120px;">${(displayName || 'S').charAt(0).toUpperCase()}</div>`}
          <div class="profile-identity-block" style="width: 100%;">
            <h3 style="margin-bottom: 0.25rem;">${displayName}</h3>
            <p style="margin: 0; font-size: 0.9rem; color: #999;">${student.dept || 'Student'} • Year ${student.year || 'N/A'}</p>
          </div>
        </div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333;">
          <p class="profile-meta" style="margin-bottom: 0.75rem;">${student.email || student.collegeMail || 'N/A'}</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div
              id="profile-interest-switch"
              class="profile-interest-switch"
              data-state="${getInterestStateKey(interestCategory)}"
            >
              <div class="profile-interest-labels">
                ${['Placements', 'Higher Studies', 'Entrepreneurship'].map(option => `
                  <label class="profile-interest-option ${interestCategory === option ? 'active' : ''}">
                    <input
                      type="radio"
                      name="profile-interest-radio"
                      value="${option}"
                      disabled
                      ${interestCategory === option ? 'checked' : ''}
                    >
                    <span>${option}</span>
                  </label>
                `).join('')}
              </div>
              <div class="profile-interest-track">
                <div class="profile-interest-thumb"></div>
              </div>
            </div>
            ${showLinkedInButton ? `
              <button class="btn profile-linkedin-btn" onclick="connectLinkedIn()" type="button">
                ${student.linkedinName ? 'Update LinkedIn' : 'Connect LinkedIn'}
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="card profile-summary-card profile-summary-card--leetcode">
        <div class="profile-leetcode-header" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <h4 class="profile-box-title" style="margin-bottom: 0;">LeetCode</h4>
          <div style="text-align: right; font-size: 0.85rem;">
            ${(!inlineProfileEdit && !student.leetcodeUsername)
      ? `
                <div class="leetcode-username-quick-set">
                  <input
                    type="text"
                    id="${usernameInputId}"
                    class="dashboard-inline-edit-control leetcode-username-quick-input"
                    value=""
                  >
                  <button type="button" id="${usernameSaveId}" class="analytics-profile-action-btn leetcode-username-quick-save">Save</button>
                </div>
              `
      : `<div style="color: #999;">@${buildInlineFieldControl('leetcodeUsername', student.leetcodeUsername || 'Not set')}</div>`}
            <div style="color: #666; font-size: 0.8rem;">
              Rank ${student.leetcodeRanking ? '#' + Number(student.leetcodeRanking).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
        <div id="${leetcodeContainerId}"></div>
      </div>

      ${(() => {
        const cgpa = Number(student.gradePoints || 0);
        const leetcode = Number(student.leetcodeSolvedAll || 0);
        const internships = Number(student.internships || 0);
        const certs = Number(student.certifications || 0);
        const cgpaNorm = Math.min(cgpa / 10, 1) * 100;
        const leetcodeNorm = Math.min(leetcode / 300, 1) * 100;
        const internNorm = Math.min(internships / 3, 1) * 100;
        const certNorm = Math.min(certs / 5, 1) * 100;
        const readiness = Math.round(cgpaNorm * 0.28 + leetcodeNorm * 0.33 + internNorm * 0.22 + certNorm * 0.17);
        const scoreColor = readiness >= 75 ? '#34d399' : readiness >= 50 ? '#fbbf24' : readiness >= 30 ? '#fb923c' : '#f87171';
        const scoreLabel = readiness >= 75 ? 'Excellent' : readiness >= 50 ? 'Good' : readiness >= 30 ? 'Fair' : 'Needs Work';
        const areas = [
          { name: 'LeetCode', norm: leetcodeNorm, tip: leetcode < 50 ? 'Start solving LeetCode daily.' : leetcode < 150 ? `Solve ${150 - leetcode} more to cross 150.` : 'Great coding progress!' },
          { name: 'CGPA', norm: cgpaNorm, tip: cgpa < 7 ? 'Focus on improving GPA.' : cgpa < 8.5 ? 'Push for 8.5+ CGPA.' : 'Strong academics!' },
          { name: 'Internships', norm: internNorm, tip: internships === 0 ? 'Apply for 1 internship this break.' : internships < 2 ? 'One more internship helps a lot.' : 'Great experience!' },
          { name: 'Certifications', norm: certNorm, tip: certs === 0 ? 'Get 1-2 certifications (AWS, Google).' : certs < 3 ? `${3 - certs} more cert(s) needed.` : 'Well-certified!' },
        ];
        const weakest = areas.filter(a => a.norm < 75).slice(0, 2);
        const circumference = 2 * Math.PI * 54;
        const dashOffset = circumference - (readiness / 100) * circumference;
        return `
          <div class="card profile-summary-card profile-summary-card--readiness">
            <h4 class="profile-box-title" style="margin-bottom:0.5rem;">🎯 Placement Readiness</h4>
            <div class="readiness-content" style="flex-direction:column;align-items:flex-start;gap:0.75rem;">
              <div style="display:flex;align-items:center;gap:1rem;width:100%;">
                <div class="readiness-chart-wrap">
                  <svg class="readiness-ring" viewBox="0 0 120 120" width="96" height="96">
                    <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.08)" stroke-width="8" fill="none"/>
                    <circle cx="60" cy="60" r="54" stroke="${scoreColor}" stroke-width="8" fill="none"
                      stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"
                      stroke-linecap="round" transform="rotate(-90 60 60)"
                      style="transition:stroke-dashoffset 1s ease-out;"/>
                    <text x="60" y="55" text-anchor="middle" fill="${scoreColor}" font-size="26" font-weight="700">${readiness}</text>
                    <text x="60" y="72" text-anchor="middle" fill="#999" font-size="10">/ 100</text>
                  </svg>
                  <div class="readiness-label" style="color:${scoreColor};font-size:0.78rem;">${scoreLabel}</div>
                </div>
                <div class="readiness-bars" style="flex:1;">
                  ${areas.map(a => `
                    <div class="readiness-bar-row">
                      <span class="readiness-bar-label">${a.name}</span>
                      <div class="readiness-bar-track">
                        <div class="readiness-bar-fill" style="width:${Math.round(a.norm)}%;background:${a.norm >= 75 ? '#34d399' : a.norm >= 50 ? '#fbbf24' : '#f87171'};"></div>
                      </div>
                      <span class="readiness-bar-pct">${Math.round(a.norm)}%</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              ${weakest.length > 0 ? `
                <div class="readiness-tips" style="width:100%;">
                  <strong style="font-size:0.78rem;color:#FEC524;">💡 Tips:</strong>
                  <ul style="margin:0.2rem 0 0 1rem;padding:0;font-size:0.78rem;color:#bbb;">
                    ${weakest.map(a => `<li>${a.tip}</li>`).join('')}
                  </ul>
                </div>
              ` : `<p style="font-size:0.78rem;color:#34d399;margin:0;">✨ You're placement-ready!</p>`}
            </div>
          </div>
        `;
      })()}
    </div>

    <div class="profile-academics-chips">
      <div class="profile-academic-chip">
        <span class="pac-label">CGPA</span>
        <span class="pac-value">${inlineProfileEdit ? buildInlineFieldControl('gradePoints', student.gradePoints || 'N/A') : (student.gradePoints || 'N/A')}</span>
      </div>
      <div class="profile-academic-chip">
        <span class="pac-label">10th %</span>
        <span class="pac-value">${inlineProfileEdit ? buildInlineFieldControl('tenthPercentage', tenthPercentage) : tenthPercentage}</span>
      </div>
      <div class="profile-academic-chip">
        <span class="pac-label">12th %</span>
        <span class="pac-value">${inlineProfileEdit ? buildInlineFieldControl('twelfthPercentage', twelfthPercentage) : twelfthPercentage}</span>
      </div>
      ${(inlineProfileEdit || (student.diplomaPercentage != null && student.diplomaPercentage !== '')) ? `
        <div class="profile-academic-chip">
          <span class="pac-label">Diploma %</span>
          <span class="pac-value">${inlineProfileEdit ? buildInlineFieldControl('diplomaPercentage', student.diplomaPercentage ?? 'N/A') : (student.diplomaPercentage || 'N/A')}</span>
        </div>` : ''}
      ${(inlineProfileEdit || (student.section && student.section !== '')) ? `
        <div class="profile-academic-chip">
          <span class="pac-label">Section</span>
          <span class="pac-value">${inlineProfileEdit ? buildInlineFieldControl('section', student.section || 'N/A') : (student.section || 'N/A')}</span>
        </div>` : ''}
      ${(inlineProfileEdit || (student.gender && student.gender !== '')) ? `
        <div class="profile-academic-chip">
          <span class="pac-label">Gender</span>
          <span class="pac-value">${inlineProfileEdit ? buildInlineFieldControl('gender', student.gender || 'N/A') : (student.gender || 'N/A')}</span>
        </div>` : ''}
    </div>

    <div class="profile-details-row" style="margin-bottom: 1rem;">
      <div class="card profile-percentile-card" style="margin-bottom: 0;">
        <h4 class="profile-box-title" style="margin-bottom: 0.75rem;">Company Preferences & Achievements</h4>
        <div class="profile-percentile-list">
          ${inlineProfileEdit || student.preferredRoles ? `<div class="profile-percentile-item"><strong>Gender Specific Roles:</strong> ${buildInlineFieldControl('preferredRoles', student.preferredRoles || 'N/A')}</div>` : ''}
          ${inlineProfileEdit || student.preferredShift ? `<div class="profile-percentile-item"><strong>Shift Priority:</strong> ${buildInlineFieldControl('preferredShift', student.preferredShift || 'N/A')}</div>` : ''}
          ${inlineProfileEdit || student.travelPriority ? `<div class="profile-percentile-item"><strong>Travel Priority:</strong> ${buildInlineFieldControl('travelPriority', student.travelPriority || 'N/A')}</div>` : ''}
          ${inlineProfileEdit || student.achievements ? `<div class="profile-percentile-item"><strong>Achievements:</strong> ${buildInlineFieldControl('achievements', student.achievements || 'N/A')}</div>` : ''}
        </div>
      </div>

      <div class="card profile-percentile-card" style="margin-bottom: 0;">
        <h4 class="profile-box-title" style="margin-bottom: 0.75rem;">Additional Details</h4>
        <div class="profile-percentile-list">
          <div class="profile-percentile-item"><strong>Placement Status:</strong> ${buildInlineFieldControl('placementStatus', student.placementStatus || getPlacementStatusLabel(student) || 'N/A')}</div>
          <div class="profile-percentile-item"><strong>Internships:</strong> ${buildInlineFieldControl('internships', student.internships ?? 'N/A')}</div>
          <div class="profile-percentile-item"><strong>Certifications:</strong> ${buildInlineFieldControl('certifications', student.certifications ?? 'N/A')}</div>
          ${inlineProfileEdit || student.rollNo ? `<div class="profile-percentile-item"><strong>Roll No:</strong> ${buildInlineFieldControl('rollNo', student.rollNo || 'N/A')}</div>` : ''}
          <div class="profile-percentile-item"><strong>College Mail:</strong> ${buildInlineFieldControl('collegeMail', student.collegeMail || student.email || 'N/A')}</div>
          ${inlineProfileEdit || student.personalMail ? `<div class="profile-percentile-item"><strong>Personal Mail:</strong> ${buildInlineFieldControl('personalMail', student.personalMail || 'N/A')}</div>` : ''}
          ${inlineProfileEdit || student.contactNo ? `<div class="profile-percentile-item"><strong>Contact No:</strong> ${buildInlineFieldControl('contactNo', student.contactNo || 'N/A')}</div>` : ''}
          ${inlineProfileEdit || student.address ? `<div class="profile-percentile-item"><strong>Address:</strong> ${buildInlineFieldControl('address', student.address || 'N/A')}</div>` : ''}
          <div class="profile-percentile-item"><strong>Resume Link:</strong> ${inlineProfileEdit ? buildInlineFieldControl('resumeLink', resumeLink || 'N/A') : (resumeLink ? `<a href="${safeResumeLink}" target="_blank" rel="noopener noreferrer">View Resume</a>` : 'N/A')}</div>
        </div>
      </div>
    </div>
  `;
}

function bindLeetCodeUsernameQuickSet(studentId, containerId = 'leetcode-stats-container') {
  const input = document.getElementById(`${containerId}-username-input`);
  const saveBtn = document.getElementById(`${containerId}-username-save`);

  if (!input || !saveBtn) {
    return;
  }

  const submit = async () => {
    const username = String(input.value || '').trim();
    if (!username) {
      showToast('Enter a LeetCode username first.', 'error');
      return;
    }

    saveBtn.disabled = true;
    const originalLabel = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';

    try {
      const response = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leetcodeUsername: username })
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.student) {
        throw new Error(data.message || 'Failed to save LeetCode username');
      }

      const student = getStudentById(studentId);
      if (student) {
        Object.assign(student, data.student);
      }

      if (currentUser && String(currentUser.id) === String(studentId)) {
        Object.assign(currentUser, data.student);
      }

      showToast('LeetCode username saved to database.', 'success');

      if (containerId === 'analytics-profile-leetcode-stats') {
        updateAnalyticsProfileModal();
      } else {
        renderProfile();
      }
    } catch (error) {
      showToast(error.message || 'Unable to save LeetCode username right now.', 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = originalLabel || 'Save';
    }
  };

  saveBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  });
}

function renderAnalyticsProfileContent(student) {
  const profileContainer = document.getElementById('analytics-profile-content');
  const modalEditBtn = document.getElementById('analytics-profile-edit');
  if (!profileContainer) {
    return;
  }

  if (!student) {
    profileContainer.innerHTML = '<p style="margin: 0; color: #999;">Unable to load profile details.</p>';
    return;
  }

  if (modalEditBtn) {
    modalEditBtn.textContent = analyticsProfileEditMode ? 'Cancel Edit' : 'Edit';
  }

  profileContainer.innerHTML = buildProfileViewHtml(student, {
    leetcodeContainerId: 'analytics-profile-leetcode-stats',
    showLinkedInButton: false,
    inlineProfileEdit: analyticsProfileEditMode,
  });

  if (analyticsProfileEditMode) {
    profileContainer.insertAdjacentHTML('beforeend', `
      <div class="analytics-profile-edit-actions" style="margin-top: 0.5rem; justify-content: flex-end;">
        <button type="button" id="analytics-profile-save" class="dashboard-filter-action-btn">Save</button>
      </div>
    `);

    const saveBtn = document.getElementById('analytics-profile-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => saveAnalyticsProfileEdit(student.id));
    }
  }

  if (student.leetcodeUsername) {
    fetchAndDisplayLeetCodeStats(student.leetcodeUsername, 'analytics-profile-leetcode-stats');
  } else {
    const lcContainer = document.getElementById('analytics-profile-leetcode-stats');
    if (lcContainer) {
      lcContainer.innerHTML = `
        <p style="margin: 0.5rem 0 0.45rem 0; color: #999;">Enter your LeetCode username.</p>
        <img src="/client/leetcode-username-guide.png?v=20260301b" alt="LeetCode username guide" class="leetcode-username-guide-img" onerror="this.style.display='none';">
      `;
    }
  }

  bindLeetCodeUsernameQuickSet(student.id, 'analytics-profile-leetcode-stats');
}

async function saveAnalyticsProfileEdit(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    return;
  }

  const saveBtn = document.getElementById('analytics-profile-save');
  const payload = {};
  analyticsProfileEditableFields.forEach((fieldKey) => {
    const input = document.querySelector(`[data-profile-field="${fieldKey}"]`);
    if (!input) {
      return;
    }
    payload[fieldKey] = parseDashboardEditableValue(fieldKey, input.value);
  });

  if (payload.gradePoints !== null && (payload.gradePoints < 0 || payload.gradePoints > 10)) {
    showToast('Invalid CGPA. Grade must be between 0 and 10.', 'error');
    return;
  }
  if (payload.year !== null && (payload.year < 1 || payload.year > 4)) {
    showToast('Invalid Year. Year must be between 1 and 4.', 'error');
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
  }

  try {
    const response = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.student) {
      throw new Error(data.message || 'Failed to update student profile');
    }

    Object.assign(student, data.student);
    analyticsProfileEditMode = false;
    renderTable(filterDashboardRowsBySearch(dashboardFilteredStudents, dashboardSearchQuery), true, null, currentDashboardSortKey);
    updateAnalyticsProfileModal();
    showToast('Student profile updated successfully!', 'success');
  } catch (error) {
    showToast(error.message || 'Unable to save profile changes right now.', 'error');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  }
}

function renderStudentProfileEditForm(profileContent, student) {
  const buildInlineControl = (fieldKey) => {
    const value = getDashboardFieldRawValue(student, fieldKey);
    const config = dashboardEditableFieldConfigs[fieldKey] || { type: 'text' };
    const selectOptions = getAnalyticsProfileSelectOptions(fieldKey, value);

    if (selectOptions) {
      const options = selectOptions.map((option) => {
        const optionValue = String(option);
        return `<option value="${escapeHtmlAttribute(optionValue)}" ${String(value ?? '') === optionValue ? 'selected' : ''}>${optionValue}</option>`;
      }).join('');
      return `<select data-student-profile-field="${fieldKey}" class="dashboard-inline-edit-control" style="width: 100%;">${options}</select>`;
    }

    const attributes = [
      `type="${config.type || 'text'}"`,
      `data-student-profile-field="${fieldKey}"`,
      'class="dashboard-inline-edit-control"',
      `value="${escapeHtmlAttribute(value)}"`,
      'style="width: 100%;"'
    ];
    if (config.min !== undefined) {
      attributes.push(`min="${config.min}"`);
    }
    if (config.max !== undefined) {
      attributes.push(`max="${config.max}"`);
    }
    if (config.step !== undefined) {
      attributes.push(`step="${config.step}"`);
    }

    return `<input ${attributes.join(' ')}>`;
  };

  const displayName = student.name || 'N/A';
  const displayPhoto = student.linkedinPhotoUrl || '';

  profileContent.innerHTML = `
    <div class="company-modal-header" style="margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div style="display: flex; gap: 0.6rem; align-items: center;">
        <button type="button" id="student-profile-save" class="dashboard-filter-action-btn">Save</button>
        <button type="button" id="student-profile-cancel" class="analytics-profile-action-btn">Cancel</button>
      </div>
      <p style="margin: 0; color: #999;">Edit only the highlighted fields.</p>
    </div>

    <div class="profile-summary-grid" style="margin-bottom: 1rem;">
      <div class="card profile-summary-card profile-summary-card--identity">
        <div class="profile-summary-header" style="flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
          ${displayPhoto
      ? `<img src="${displayPhoto}" alt="${displayName}" class="profile-avatar-medium" style="width: 120px; height: 120px; border-radius: 50%;">`
      : `<div class="profile-avatar-fallback profile-avatar-medium" style="width: 120px; height: 120px;">${(displayName || 'S').charAt(0).toUpperCase()}</div>`}
          <div class="profile-identity-block" style="width: 100%; display: grid; gap: 0.5rem;">
            <span>${student.name || 'N/A'}</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <span>${student.dept || 'N/A'}</span>
              <span>${student.year || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333; display: grid; gap: 0.5rem;">
          <span>${student.email || 'N/A'}</span>
          <span>${student.interest || 'N/A'}</span>
          <button class="btn profile-linkedin-btn" onclick="connectLinkedIn()" type="button">
            ${student.linkedinName ? 'Update LinkedIn' : 'Connect LinkedIn'}
          </button>
        </div>
      </div>

      <div class="card profile-summary-card profile-summary-card--leetcode">
        <div class="profile-leetcode-header" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <h4 class="profile-box-title" style="margin-bottom: 0;">LeetCode</h4>
          <div style="text-align: right; font-size: 0.85rem; color: #999;">
            Rank ${student.leetcodeRanking ? '#' + Number(student.leetcodeRanking).toLocaleString() : 'N/A'}
          </div>
        </div>
        <div style="margin-bottom: 0.6rem;">${buildInlineControl('leetcodeUsername')}</div>
        <div id="leetcode-stats-container"></div>
      </div>

      <div class="card profile-summary-card profile-summary-card--academics">
        <h4 class="profile-box-title">Academics</h4>
        <div class="profile-academics-list" style="display: grid; gap: 0.5rem;">
          <div><strong>CGPA:</strong> <span>${student.gradePoints ?? 'N/A'}</span></div>
          <div><strong>12th %:</strong> <span>${student.twelfthPercentage ?? 'N/A'}</span></div>
          <div><strong>10th %:</strong> <span>${student.tenthPercentage ?? 'N/A'}</span></div>
          <div><strong>Diploma %:</strong> <span>${student.diplomaPercentage ?? 'N/A'}</span></div>
          <div><strong>Register No:</strong> <span>${student.registerNo ?? 'N/A'}</span></div>
          <div><strong>Section:</strong> <span>${student.section ?? 'N/A'}</span></div>
          <div><strong>Gender:</strong> <span>${student.gender ?? 'N/A'}</span></div>
          <div><strong>Roll No:</strong> <span>${student.rollNo ?? 'N/A'}</span></div>
        </div>
      </div>
    </div>

    <div class="card profile-percentile-card" style="margin-bottom: 1rem;">
      <h4 class="profile-box-title" style="margin-bottom: 0.75rem;">Company Preferences & Achievements</h4>
      <div class="profile-percentile-list" style="display: grid; gap: 0.5rem;">
        <div class="profile-percentile-item"><strong>Gender Specific Roles:</strong> ${buildInlineControl('preferredRoles')}</div>
        <div class="profile-percentile-item"><strong>Shift Priority:</strong> ${buildInlineControl('preferredShift')}</div>
        <div class="profile-percentile-item"><strong>Travel Priority:</strong> ${buildInlineControl('travelPriority')}</div>
        <div class="profile-percentile-item"><strong>Achievements:</strong> ${buildInlineControl('achievements')}</div>
      </div>
    </div>
  `;

  const saveBtn = document.getElementById('student-profile-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (isStaff) {
        saveAnalyticsProfileEdit(currentUser.id);
      } else {
        saveStudentProfileEdit();
      }
    });
  }

  const cancelBtn = document.getElementById('student-profile-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (isStaff) {
        analyticsProfileEditMode = false;
      } else {
        studentProfileEditMode = false;
      }
      renderProfile();
    });
  }

  if (student.leetcodeUsername) {
    fetchAndDisplayLeetCodeStats(student.leetcodeUsername, 'leetcode-stats-container');
  } else {
    const leetcodeContainer = document.getElementById('leetcode-stats-container');
    if (leetcodeContainer) {
      leetcodeContainer.innerHTML = '<p style="margin: 0.5rem 0 0 0; color: #999;">LeetCode username not set.</p>';
    }
  }
}

async function saveStudentProfileEdit() {
  if (!currentUser || isStaff) {
    return;
  }

  const saveBtn = document.getElementById('student-profile-save');
  const payload = {};
  analyticsProfileEditableFields.forEach((fieldKey) => {
    const input = document.querySelector(`[data-student-profile-field="${fieldKey}"]`);
    if (!input) {
      return;
    }
    payload[fieldKey] = parseDashboardEditableValue(fieldKey, input.value);
  });

  if (payload.gradePoints !== null && (payload.gradePoints < 0 || payload.gradePoints > 10)) {
    showToast('Invalid CGPA. Grade must be between 0 and 10.', 'error');
    return;
  }
  if (payload.year !== null && (payload.year < 1 || payload.year > 4)) {
    showToast('Invalid Year. Year must be between 1 and 4.', 'error');
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
  }

  try {
    const response = await fetch(`/api/students/${encodeURIComponent(currentUser.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.student) {
      throw new Error(data.message || 'Failed to update profile');
    }

    currentUser = { ...currentUser, ...data.student };
    const studentIndex = students.findIndex((student) => String(student.id) === String(currentUser.id));
    if (studentIndex >= 0) {
      students[studentIndex] = { ...students[studentIndex], ...data.student };
    }
    studentProfileEditMode = false;
    renderProfile();
    showToast('Profile updated successfully!', 'success');
  } catch (error) {
    showToast(error.message || 'Unable to save profile changes right now.', 'error');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  }
}

function updateAnalyticsProfileModal() {
  const total = analyticsProfileFilteredIds.length;
  const counter = document.getElementById('analytics-profile-counter');
  if (!total || analyticsProfileCurrentIndex < 0) {
    if (counter) {
      counter.textContent = '0 / 0';
    }
    renderAnalyticsProfileContent(null);
    return;
  }

  const normalizedIndex = ((analyticsProfileCurrentIndex % total) + total) % total;
  analyticsProfileCurrentIndex = normalizedIndex;
  const studentId = analyticsProfileFilteredIds[normalizedIndex];
  const student = getStudentById(studentId);
  if (counter) {
    counter.textContent = `${normalizedIndex + 1} / ${total}`;
  }
  renderAnalyticsProfileContent(student);
}

function openAnalyticsProfileModal(studentId) {
  const modalOverlay = ensureAnalyticsProfileModal();
  if (!modalOverlay) {
    return;
  }

  if (!analyticsProfileFilteredIds.length) {
    analyticsProfileFilteredIds = (dashboardFilteredStudents || []).map((student) => String(student.id)).filter(Boolean);
  }

  analyticsProfileCurrentIndex = analyticsProfileFilteredIds.indexOf(String(studentId));
  if (analyticsProfileCurrentIndex < 0) {
    analyticsProfileCurrentIndex = 0;
  }

  analyticsProfileEditMode = false;
  updateAnalyticsProfileModal();
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function navigateAnalyticsProfile(step) {
  if (!analyticsProfileFilteredIds.length) {
    return;
  }
  analyticsProfileEditMode = false;
  analyticsProfileCurrentIndex += step;
  updateAnalyticsProfileModal();
}

function closeAnalyticsProfileModal() {
  const modalOverlay = document.getElementById('analytics-profile-modal');
  if (!modalOverlay) {
    return;
  }
  analyticsProfileEditMode = false;
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindAnalyticsProfileRowClicks() {
  document.querySelectorAll('#staff-table tbody tr.analytics-row').forEach((row) => {
    row.addEventListener('click', () => {
      const studentId = row.dataset.studentId;
      if (studentId) {
        openAnalyticsProfileModal(studentId);
      }
    });
  });
}

function getFilteredExportRows() {
  const metricValueMap = {
    dept: (student) => student.dept || '',
    leetcodeSolvedAll: (student) => student.leetcodeSolvedAll || 0,
    internships: (student) => student.internships || 0,
    certifications: (student) => student.certifications || 0,
    gradePoints: (student) => student.gradePoints || '',
    tenthPercentage: (student) => student.tenthPercentage ?? '',
    twelfthPercentage: (student) => student.twelfthPercentage ?? '',
    diplomaPercentage: (student) => student.diplomaPercentage ?? '',
    placementStatus: (student) => getPlacementStatusLabel(student),
    year: (student) => getYearLabel(student.year),
    interest: (student) => student.interest || '',
    rollNo: (student) => student.rollNo || '',
    registerNo: (student) => student.registerNo || '',
    section: (student) => student.section || '',
    gender: (student) => student.gender || '',
    residencyType: (student) => student.residencyType || '',
    personalMail: (student) => student.personalMail || '',
    collegeMail: (student) => student.collegeMail || student.email || '',
    contactNo: (student) => student.contactNo || '',
    address: (student) => student.address || '',
    resumeLink: (student) => student.resumeLink || '',
    preferredRoles: (student) => student.preferredRoles || '',
    preferredShift: (student) => student.preferredShift || '',
    travelPriority: (student) => student.travelPriority || '',
    achievements: (student) => student.achievements || ''
  };

  const visibleMetricKeys = dashboardMetricOrder.filter((key) => dashboardVisibleMetrics.has(key));
  const exportRows = filterDashboardRowsBySearch(dashboardFilteredStudents, dashboardSearchQuery);
  return exportRows.map((student) => {
    const row = {
      Name: student.name || ''
    };

    visibleMetricKeys.forEach((key) => {
      row[dashboardMetricLabels[key]] = metricValueMap[key](student);
    });

    return row;
  });
}

function exportFilteredDataAsCsv() {
  const rows = getFilteredExportRows();
  const headers = Object.keys(rows[0] || {});
  const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))].join('\n');
  downloadBlob(csv, 'filtered_students.csv', 'text/csv;charset=utf-8;');
}

function exportFilteredDataAsExcel() {
  const rows = getFilteredExportRows();
  const headers = Object.keys(rows[0] || {});
  const tableHeader = headers.map((header) => `<th>${header}</th>`).join('');
  const tableRows = rows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ''}</td>`).join('')}</tr>`).join('');
  const html = `<table><thead><tr>${tableHeader}</tr></thead><tbody>${tableRows}</tbody></table>`;
  downloadBlob(html, 'filtered_students.xls', 'application/vnd.ms-excel;charset=utf-8;');
}

function renderTable(data, staffView, highlightId, sortKey = currentDashboardSortKey) {
  const renderEditableCell = (student, fieldKey, displayHtml, inputValue = null) => {
    if (!staffView) {
      return displayHtml;
    }

    const config = dashboardEditableFieldConfigs[fieldKey] || { type: 'text' };
    const value = inputValue ?? getDashboardFieldRawValue(student, fieldKey);
    const displayNode = `<span id="val-${fieldKey}-${student.id}">${displayHtml}</span>`;

    if (config.type === 'select') {
      const options = (config.options || []).map((option) => `<option value="${escapeHtmlAttribute(option)}">${option}</option>`).join('');
      return `${displayNode}<select id="input-${fieldKey}-${student.id}" class="dashboard-inline-edit-control" style="display:none;">${options}</select>`;
    }

    const attributes = [
      `type="${config.type || 'text'}"`,
      `id="input-${fieldKey}-${student.id}"`,
      'class="dashboard-inline-edit-control"',
      `value="${escapeHtmlAttribute(value)}"`,
      'style="display:none;"'
    ];

    if (config.min !== undefined) {
      attributes.push(`min="${config.min}"`);
    }
    if (config.max !== undefined) {
      attributes.push(`max="${config.max}"`);
    }
    if (config.step !== undefined) {
      attributes.push(`step="${config.step}"`);
    }

    return `${displayNode}<input ${attributes.join(' ')}>`;
  };

  const columnDefs = {
    dept: {
      header: 'Dept',
      cell: (s) => renderEditableCell(s, 'dept', getDashboardFieldDisplayValue(s, 'dept', staffView))
    },
    leetcodeSolvedAll: {
      header: 'LeetCode Solved',
      cell: (s) => renderEditableCell(s, 'leetcodeSolvedAll', getDashboardFieldDisplayValue(s, 'leetcodeSolvedAll', staffView))
    },
    internships: {
      header: 'Internships',
      cell: (s) => renderEditableCell(s, 'internships', getDashboardFieldDisplayValue(s, 'internships', staffView))
    },
    certifications: {
      header: 'Certifications',
      cell: (s) => renderEditableCell(s, 'certifications', getDashboardFieldDisplayValue(s, 'certifications', staffView))
    },
    gradePoints: {
      header: 'Grade Points',
      cell: (s) => renderEditableCell(s, 'gradePoints', getDashboardFieldDisplayValue(s, 'gradePoints', staffView))
    },
    tenthPercentage: {
      header: '10th %',
      cell: (s) => renderEditableCell(s, 'tenthPercentage', getDashboardFieldDisplayValue(s, 'tenthPercentage', staffView))
    },
    twelfthPercentage: {
      header: '12th %',
      cell: (s) => renderEditableCell(s, 'twelfthPercentage', getDashboardFieldDisplayValue(s, 'twelfthPercentage', staffView))
    },
    diplomaPercentage: {
      header: 'Diploma %',
      cell: (s) => renderEditableCell(s, 'diplomaPercentage', getDashboardFieldDisplayValue(s, 'diplomaPercentage', staffView))
    },
    placementStatus: {
      header: 'Placement Status',
      cell: (s) => `${getPlacementStatusLabel(s)}`
    },
    year: {
      header: 'Year',
      cell: (s) => renderEditableCell(s, 'year', getDashboardFieldDisplayValue(s, 'year', staffView), getYearNumber(s.year) || '')
    },
    interest: {
      header: 'Interest',
      cell: (s) => renderEditableCell(s, 'interest', getDashboardFieldDisplayValue(s, 'interest', staffView))
    },
    rollNo: {
      header: 'Roll No',
      cell: (s) => renderEditableCell(s, 'rollNo', getDashboardFieldDisplayValue(s, 'rollNo', staffView))
    },
    registerNo: {
      header: 'Register No',
      cell: (s) => renderEditableCell(s, 'registerNo', getDashboardFieldDisplayValue(s, 'registerNo', staffView))
    },
    section: {
      header: 'Section',
      cell: (s) => `${s.section || 'N/A'}`
    },
    gender: {
      header: 'Gender',
      cell: (s) => renderEditableCell(s, 'gender', getDashboardFieldDisplayValue(s, 'gender', staffView))
    },
    residencyType: {
      header: 'Dayscholar/Hostel',
      cell: (s) => renderEditableCell(s, 'residencyType', getDashboardFieldDisplayValue(s, 'residencyType', staffView))
    },
    personalMail: {
      header: 'Personal Mail',
      cell: (s) => renderEditableCell(s, 'personalMail', getDashboardFieldDisplayValue(s, 'personalMail', staffView))
    },
    collegeMail: {
      header: 'College Mail',
      cell: (s) => renderEditableCell(s, 'collegeMail', getDashboardFieldDisplayValue(s, 'collegeMail', staffView), s.collegeMail || s.email || '')
    },
    contactNo: {
      header: 'Contact No',
      cell: (s) => renderEditableCell(s, 'contactNo', getDashboardFieldDisplayValue(s, 'contactNo', staffView))
    },
    address: {
      header: 'Address',
      cell: (s) => renderEditableCell(s, 'address', getDashboardFieldDisplayValue(s, 'address', staffView))
    },
    resumeLink: {
      header: 'Resume Link',
      cell: (s) => renderEditableCell(s, 'resumeLink', getDashboardFieldDisplayValue(s, 'resumeLink', staffView), s.resumeLink || '')
    },
    preferredRoles: {
      header: 'Gender Specific Roles',
      cell: (s) => renderEditableCell(s, 'preferredRoles', getDashboardFieldDisplayValue(s, 'preferredRoles', staffView))
    },
    preferredShift: {
      header: 'Shift Priority',
      cell: (s) => `${s.preferredShift || 'N/A'}`
    },
    travelPriority: {
      header: 'Travel Priority',
      cell: (s) => renderEditableCell(s, 'travelPriority', getDashboardFieldDisplayValue(s, 'travelPriority', staffView))
    },
    achievements: {
      header: 'Achievements',
      cell: (s) => renderEditableCell(s, 'achievements', getDashboardFieldDisplayValue(s, 'achievements', staffView))
    }
  };

  const baseOrder = [...dashboardMetricOrder];
  const visibleColumns = baseOrder.filter((key) => dashboardVisibleMetrics.has(key));
  const orderedColumns = [...visibleColumns];

  const tableHtml = `<table><thead><tr>
    <th>Name</th>
    ${orderedColumns.map((key) => `<th>${columnDefs[key].header}</th>`).join('')}
  </tr></thead><tbody>
    ${data.map(s => `<tr class="${staffView ? 'analytics-row' : ''}" ${staffView ? `data-student-id="${s.id}"` : ''}${!staffView && highlightId === s.id ? ' style="background:rgba(254, 197, 36, 0.15);border-left:3px solid #FEC524;"' : ''}>
      <td>${staffView
      ? `<span id="val-name-${s.id}">${s.name || 'N/A'}</span><input type="text" id="input-name-${s.id}" class="dashboard-inline-edit-control" value="${escapeHtmlAttribute(s.name || '')}" style="display:none;">`
      : (s.name || 'N/A')}
      </td>
      ${orderedColumns.map((key) => `<td>${columnDefs[key].cell(s)}</td>`).join('')}
    </tr>`).join('')}
  </tbody></table>`;
  if (staffView) {
    document.getElementById('staff-table').innerHTML = tableHtml;
    analyticsProfileFilteredIds = (Array.isArray(data) ? data : []).map((student) => String(student.id)).filter(Boolean);
    bindAnalyticsProfileRowClicks();

    const modalOverlay = document.getElementById('analytics-profile-modal');
    if (modalOverlay && modalOverlay.classList.contains('active')) {
      const currentStudentId = analyticsProfileFilteredIds[analyticsProfileCurrentIndex];
      if (!currentStudentId && analyticsProfileFilteredIds.length) {
        analyticsProfileCurrentIndex = 0;
      } else if (currentStudentId) {
        analyticsProfileCurrentIndex = analyticsProfileFilteredIds.indexOf(currentStudentId);
      }
      if (analyticsProfileFilteredIds.length) {
        updateAnalyticsProfileModal();
      } else {
        closeAnalyticsProfileModal();
      }
    }
  } else {
    document.getElementById('student-table').innerHTML = tableHtml;
  }
}

function renderNotifications() {
  const notificationsContent = document.getElementById('notifications-content');
  const companiesContainer = document.getElementById('companies-container');

  renderCompaniesList(companiesContainer);

  notificationsContent.innerHTML = `
    <div style="margin-top: 2rem;">
      <h3>Recent Announcements</h3>
      <div class="notification-item">
        <p><strong>Placement Season 2026:</strong> Welcome to Placely! Track your placement journey with us.</p>
        <p style="color: #999; font-size: 0.9rem;">Jan 27, 2026</p>
      </div>
    </div>
  `;
}

function renderProfile() {
  const profileContent = document.getElementById('profile-content');

  if ((isStaff || !isStaff) && currentUser) {
    if (isStaff) {
      profileContent.innerHTML = `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.8rem;">
          <button type="button" id="student-profile-edit-btn" class="analytics-profile-action-btn">${analyticsProfileEditMode ? 'Cancel Edit' : 'Edit Profile'}</button>
        </div>
        ${buildProfileViewHtml(currentUser, {
        leetcodeContainerId: 'leetcode-stats-container',
        showLinkedInButton: true,
        inlineProfileEdit: analyticsProfileEditMode,
      })}
        ${analyticsProfileEditMode ? `
          <div class="analytics-profile-edit-actions" style="justify-content: flex-end;">
            <button type="button" id="analytics-profile-save" class="dashboard-filter-action-btn">Save</button>
          </div>
        ` : ''}
      `;

      const editBtn = document.getElementById('student-profile-edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          analyticsProfileEditMode = !analyticsProfileEditMode;
          renderProfile();
        });
      }

      const saveBtn = document.getElementById('analytics-profile-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => saveAnalyticsProfileEdit(currentUser.id));
      }

      if (currentUser.leetcodeUsername) {
        fetchAndDisplayLeetCodeStats(currentUser.leetcodeUsername);
      } else {
        const leetcodeContainer = document.getElementById('leetcode-stats-container');
        if (leetcodeContainer) {
          leetcodeContainer.innerHTML = `
            <p style="margin: 0.5rem 0 0.45rem 0; color: #999;">Enter your LeetCode username.</p>
            <img src="/client/leetcode-username-guide.png?v=20260301b" alt="LeetCode username guide" class="leetcode-username-guide-img" onerror="this.style.display='none';">
          `;
        }
      }

      bindLeetCodeUsernameQuickSet(currentUser.id, 'leetcode-stats-container');
      return;
    }

    // Student mode keeps dedicated edit form
    if (studentProfileEditMode) {
      renderStudentProfileEditForm(profileContent, currentUser);
      return;
    }

    profileContent.innerHTML = `
      <div style="display: flex; justify-content: flex-end; margin-bottom: 0.8rem;">
        <button type="button" id="student-profile-edit-btn" class="analytics-profile-action-btn">Edit Profile</button>
      </div>
      ${buildProfileViewHtml(currentUser, {
      leetcodeContainerId: 'leetcode-stats-container',
      showLinkedInButton: true,
    })}
    `;

    const editBtn = document.getElementById('student-profile-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        studentProfileEditMode = true;
        renderProfile();
      });
    }

    // Auto-fetch LeetCode stats if username is set
    if (currentUser.leetcodeUsername) {
      fetchAndDisplayLeetCodeStats(currentUser.leetcodeUsername);
    } else {
      const leetcodeContainer = document.getElementById('leetcode-stats-container');
      if (leetcodeContainer) {
        leetcodeContainer.innerHTML = `
          <p style="margin: 0.5rem 0 0.45rem 0; color: #999;">Enter your LeetCode username.</p>
          <img src="/client/leetcode-username-guide.png?v=20260301b" alt="LeetCode username guide" class="leetcode-username-guide-img" onerror="this.style.display='none';">
        `;
      }
    }

    bindLeetCodeUsernameQuickSet(currentUser.id, 'leetcode-stats-container');
  } else if (!currentUser) {
    profileContent.innerHTML = `<p>Please log in to view your profile.</p>`;
    return;
  }
}

async function fetchAndDisplayLeetCodeStats(username, containerId = 'leetcode-stats-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="card" style="padding: 1rem;"><p>Loading LeetCode stats...</p></div>';

  try {
    const response = await fetch(`/api/leetcode/${encodeURIComponent(username)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      container.innerHTML = `<div class="card" style="padding: 1rem;"><p style="margin: 0; color: #ff6b6b;">⚠️ Unable to fetch LeetCode stats: ${data.message || 'Unknown error'}</p></div>`;
      return;
    }

    container.innerHTML = renderLeetCodeStatsCard(data);
  } catch (error) {
    console.error('LeetCode fetch error:', error);
    container.innerHTML = '<div class="card" style="padding: 1rem;"><p style="margin: 0; color: #ff6b6b;">⚠️ Network error while fetching LeetCode stats.</p></div>';
  }
}

function renderLeetCodeStatsCard(data) {
  const easySolved = Number(data.solved?.easy || 0);
  const mediumSolved = Number(data.solved?.medium || 0);
  const hardSolved = Number(data.solved?.hard || 0);
  const totalSolved = Math.max(Number(data.solved?.all || (easySolved + mediumSolved + hardSolved)), 0);

  const totalQuestions = Math.max(Number(data.totalQuestions?.all || 3851), 1);
  const defaultDifficultyTotal = totalQuestions / 3;
  const easyTotal = Math.max(Number(data.totalQuestions?.easy || defaultDifficultyTotal), 1);
  const mediumTotal = Math.max(Number(data.totalQuestions?.medium || defaultDifficultyTotal), 1);
  const hardTotal = Math.max(Number(data.totalQuestions?.hard || defaultDifficultyTotal), 1);

  const easyProgress = Math.max(0, Math.min(easySolved / easyTotal, 1));
  const mediumProgress = Math.max(0, Math.min(mediumSolved / mediumTotal, 1));
  const hardProgress = Math.max(0, Math.min(hardSolved / hardTotal, 1));

  const polar = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + (r * Math.cos(rad)),
      y: cy + (r * Math.sin(rad))
    };
  };

  const arcPath = (cx, cy, r, startDeg, endDeg) => {
    const start = polar(cx, cy, r, startDeg);
    const end = polar(cx, cy, r, endDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  };

  const segments = [
    { key: 'easy', color: '#22d3ee', start: 210, end: 310, progress: easyProgress },
    { key: 'medium', color: '#fbbf24', start: 330, end: 430, progress: mediumProgress },
    { key: 'hard', color: '#ef4444', start: 90, end: 190, progress: hardProgress }
  ];

  const trackPaths = segments.map((segment) => `<path d="${arcPath(100, 100, 74, segment.start, segment.end)}" class="leetcode-radial-track" />`).join('');
  const fillPaths = segments.map((segment) => {
    const span = segment.end - segment.start;
    const fillEnd = segment.start + (span * segment.progress);
    return `<path d="${arcPath(100, 100, 74, segment.start, fillEnd)}" class="leetcode-radial-fill leetcode-radial-fill--${segment.key}" style="stroke:${segment.color};" />`;
  }).join('');

  return `
    <div class="leetcode-pie-card">
      <div class="leetcode-radial-wrap">
        <svg class="leetcode-radial-svg" viewBox="0 0 200 200" role="img" aria-label="LeetCode radial progress">
          ${trackPaths}
          ${fillPaths}
        </svg>
        <div class="leetcode-radial-center">
          <div class="leetcode-radial-total">${totalSolved}<span>/${totalQuestions}</span></div>
          <div class="leetcode-radial-label">Questions Solved</div>
        </div>
      </div>
      <div class="leetcode-radial-legend">
        <span class="easy">Easy <strong>${easySolved}/${Math.round(easyTotal)}</strong></span>
        <span class="medium">Medium <strong>${mediumSolved}/${Math.round(mediumTotal)}</strong></span>
        <span class="hard">Hard <strong>${hardSolved}/${Math.round(hardTotal)}</strong></span>
      </div>
    </div>
  `;
}

function renderLeaderboard() {
  const leaderboardContent = document.getElementById('leaderboard-content');
  if (!leaderboardContent) {
    return;
  }

  const studentsData = Array.isArray(students) ? [...students] : [];
  if (!studentsData.length) {
    leaderboardContent.innerHTML = '<p style="color:#999;">No student data available for leaderboard.</p>';
    return;
  }

  const codingRank = [...studentsData]
    .sort((a, b) => Number(b.leetcodeSolvedAll || 0) - Number(a.leetcodeSolvedAll || 0));

  const cgpaRank = [...studentsData]
    .sort((a, b) => Number(b.gradePoints || 0) - Number(a.gradePoints || 0));

  const maxCodingProblems = Math.max(...studentsData.map((student) => Number(student.leetcodeSolvedAll || 0)), 0);
  const maxOfficialCertificates = Math.max(...studentsData.map((student) => Number(student.certifications || 0)), 0);
  const maxInternships = Math.max(...studentsData.map((student) => Number(student.internships || 0)), 0);

  const clampUnit = (value) => Math.max(0, Math.min(1, Number(value) || 0));

  const getDynamicScore = (student) => {
    const cgpa = Number(student.gradePoints || 0);
    const codingProblems = Number(student.leetcodeSolvedAll || 0);
    const officialCertificates = Number(student.certifications || 0);
    const internships = Number(student.internships || 0);

    const cgpaComponent = clampUnit(cgpa / 10) * 30;
    const codingComponent = maxCodingProblems > 0 ? clampUnit(codingProblems / maxCodingProblems) * 30 : 0;
    const certificatesComponent = maxOfficialCertificates > 0 ? clampUnit(officialCertificates / maxOfficialCertificates) * 15 : 0;
    const internshipsComponent = maxInternships > 0 ? clampUnit(internships / maxInternships) * 25 : 0;

    return cgpaComponent + codingComponent + certificatesComponent + internshipsComponent;
  };

  const dynamicRank = [...studentsData]
    .sort((a, b) => getDynamicScore(b) - getDynamicScore(a));

  const rankMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `<span style="color:#999;font-size:0.9rem;">${index + 1}</span>`;
  };

  const avatarInitial = (name) => {
    const initial = (name || 'S').charAt(0).toUpperCase();
    const colors = ['#4F7FFF', '#22d3ee', '#f472b6', '#a78bfa', '#34d399', '#fb923c', '#facc15'];
    const colorIndex = initial.charCodeAt(0) % colors.length;
    return `<span class="lb-avatar" style="background:${colors[colorIndex]};">${initial}</span>`;
  };

  const INITIAL_SHOW = 10;

  const renderRows = (list, valueFn, tableId) => {
    return list.map((student, index) => {
      const isCurrentUser = !isStaff && currentUser && student.id === currentUser.id;
      const rowClass = isCurrentUser ? 'lb-row-current' : '';
      const hiddenClass = index >= INITIAL_SHOW ? 'lb-row-hidden' : '';
      return `
        <tr class="${rowClass} ${hiddenClass}" data-lb-table="${tableId}">
          <td class="lb-rank-cell">${rankMedal(index)}</td>
          <td class="lb-name-cell">${avatarInitial(student.name)} ${student.name || 'N/A'}</td>
          <td>${student.dept || 'N/A'}</td>
          <td class="lb-value-cell">${valueFn(student)}</td>
        </tr>
      `;
    }).join('');
  };

  const showAllButton = (tableId, total) => {
    if (total <= INITIAL_SHOW) return '';
    return `<div style="text-align:center;margin-top:0.5rem;">
      <button type="button" class="lb-show-all-btn" data-lb-target="${tableId}" onclick="
        this.parentElement.parentElement.querySelectorAll('tr.lb-row-hidden[data-lb-table=${tableId}]').forEach(r => r.classList.remove('lb-row-hidden'));
        this.style.display='none';
      ">Show All ${total} Students ▾</button>
    </div>`;
  };

  let lbSearchQuery = '';

  const renderLeaderboardTables = (query) => {
    const q = (query || '').toLowerCase().trim();
    const filterList = (list) => q ? list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.dept || '').toLowerCase().includes(q)) : list;

    const filteredCoding = filterList(codingRank);
    const filteredCgpa = filterList(cgpaRank);
    const filteredDynamic = filterList(dynamicRank);

    const tablesEl = leaderboardContent.querySelector('.lb-tables-grid');
    if (tablesEl) {
      tablesEl.innerHTML = `
        <div class="card lb-card">
          <h3 class="lb-card-title">💻 Coding Problems</h3>
          <table class="lb-table">
            <thead><tr><th style="width:60px;">Rank</th><th>Name</th><th style="width:80px;">Dept</th><th style="width:100px;">Solved</th></tr></thead>
            <tbody>${renderRows(filteredCoding, (student) => `<strong>${Number(student.leetcodeSolvedAll || 0)}</strong>`, 'coding')}</tbody>
          </table>
          ${showAllButton('coding', filteredCoding.length)}
        </div>
        <div class="card lb-card">
          <h3 class="lb-card-title">📚 CGPA</h3>
          <table class="lb-table">
            <thead><tr><th style="width:60px;">Rank</th><th>Name</th><th style="width:80px;">Dept</th><th style="width:100px;">CGPA</th></tr></thead>
            <tbody>${renderRows(filteredCgpa, (student) => `<strong>${Number(student.gradePoints || 0).toFixed(2)}</strong>`, 'cgpa')}</tbody>
          </table>
          ${showAllButton('cgpa', filteredCgpa.length)}
        </div>
        <div class="card lb-card">
          <h3 class="lb-card-title">🏆 Dynamic Score</h3>
          <table class="lb-table">
            <thead><tr><th style="width:60px;">Rank</th><th>Name</th><th style="width:80px;">Dept</th><th style="width:100px;">Score</th></tr></thead>
            <tbody>${renderRows(filteredDynamic, (student) => `<strong>${getDynamicScore(student).toFixed(1)}</strong>`, 'dynamic')}</tbody>
          </table>
          ${showAllButton('dynamic', filteredDynamic.length)}
        </div>
      `;
    }
  };

  leaderboardContent.innerHTML = `
    <div class="lb-search-wrap">
      <input type="search" id="lb-search-input" class="lb-search-input" placeholder="Search by name or department...">
    </div>
    <div class="lb-tables-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
      <div class="card lb-card">
        <h3 class="lb-card-title">💻 Coding Problems</h3>
        <table class="lb-table">
          <thead>
            <tr>
              <th style="width:60px;">Rank</th>
              <th>Name</th>
              <th style="width:80px;">Dept</th>
              <th style="width:100px;">Solved</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(codingRank, (student) => `<strong>${Number(student.leetcodeSolvedAll || 0)}</strong>`, 'coding')}
          </tbody>
        </table>
        ${showAllButton('coding', codingRank.length)}
      </div>

      <div class="card lb-card">
        <h3 class="lb-card-title">📚 CGPA</h3>
        <table class="lb-table">
          <thead>
            <tr>
              <th style="width:60px;">Rank</th>
              <th>Name</th>
              <th style="width:80px;">Dept</th>
              <th style="width:100px;">CGPA</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(cgpaRank, (student) => `<strong>${Number(student.gradePoints || 0).toFixed(2)}</strong>`, 'cgpa')}
          </tbody>
        </table>
        ${showAllButton('cgpa', cgpaRank.length)}
      </div>

      <div class="card lb-card">
        <h3 class="lb-card-title">🏆 Dynamic Score</h3>
        <table class="lb-table">
          <thead>
            <tr>
              <th style="width:60px;">Rank</th>
              <th>Name</th>
              <th style="width:80px;">Dept</th>
              <th style="width:100px;">Score</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(dynamicRank, (student) => `<strong>${getDynamicScore(student).toFixed(1)}</strong>`, 'dynamic')}
          </tbody>
        </table>
        ${showAllButton('dynamic', dynamicRank.length)}
      </div>
    </div>
  `;

  const lbSearchInput = document.getElementById('lb-search-input');
  if (lbSearchInput) {
    lbSearchInput.addEventListener('input', (e) => {
      lbSearchQuery = e.target.value;
      renderLeaderboardTables(lbSearchQuery);
    });
  }
}