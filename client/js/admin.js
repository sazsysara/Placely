/* ═══════════════════════════════════════════════════
   PLACELY ADMIN PORTAL — admin.js
   ═══════════════════════════════════════════════════ */

'use strict';

// ── State ──────────────────────────────────────────
let allStudents = [];
let filteredStudents = [];
let allDrives = [];
let charts = {};
let currentPage = 'dashboard';

// ── Supabase client (reuse from parent scope or init) ──
const SB_URL = window.__SUPABASE_URL__ || '';
const SB_KEY = window.__SUPABASE_KEY__ || '';

async function sbFetch(table, query = '') {
    const res = await fetch(`${SB_URL}/rest/v1/${table}${query}`, {
        headers: {
            'apikey': SB_KEY,
            'Authorization': `Bearer ${SB_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return res.json();
}

async function sbInsert(table, data) {
    const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function sbUpdate(table, id, data) {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
    });
    return res.json();
}

// ── Toast ───────────────────────────────────────────
function showToast(msg, type = 'info', duration = 3500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), duration);
}

// ── Navigation ──────────────────────────────────────
function adminNav(page) {
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    const navEl  = document.getElementById(`nav-${page}`);
    if (target) target.classList.add('active');
    if (navEl)  navEl.classList.add('active');
    document.getElementById('breadcrumb').textContent = navEl?.querySelector('.nav-label')?.textContent || page;
    currentPage = page;
    // Lazy load page data
    if (page === 'dashboard') loadDashboard();
    if (page === 'students')  loadStudents();
    if (page === 'drives')    loadDrives();
    if (page === 'ats')       loadATS();
    if (page === 'offers')    loadOffers();
    if (page === 'notices')   loadNotices();
}

// ── Sidebar Collapse ────────────────────────────────
document.getElementById('sidebarCollapseBtn').addEventListener('click', () => {
    document.body.classList.toggle('collapsed');
});
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.body.classList.toggle('mobile-open');
});

// ── Nav Clicks ──────────────────────────────────────
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        adminNav(item.dataset.page);
    });
});

// ── Date ────────────────────────────────────────────
const topbarDate = document.getElementById('topbarDate');
if (topbarDate) {
    topbarDate.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

// ══════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════
async function loadDashboard() {
    try {
        const students = await sbFetch('student_profiles', '?select=*');
        allStudents = students || [];
        computeKPIs(allStudents);
        renderRecentPlacements(allStudents);
        renderUpcomingDrives();
        renderCharts(allStudents);
    } catch (err) {
        console.warn('Dashboard using mock data:', err.message);
        allStudents = getMockStudents();
        computeKPIs(allStudents);
        renderRecentPlacements(allStudents);
        renderUpcomingDrives();
        renderCharts(allStudents);
    }
}

function computeKPIs(students) {
    const total   = students.length;
    const placed  = students.filter(s => s.placed || s.placement_status === 'placed').length;
    const unplaced = total - placed;
    setValue('kpiTotal',   total);
    setValue('kpiPlaced',  placed);
    setValue('kpiUnplaced', unplaced);
    setValue('kpiPlacedPct', total ? `${Math.round(placed/total*100)}%` : '0%');
    setValue('kpiUnplacedPct', total ? `${Math.round(unplaced/total*100)}%` : '0%');
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) animateNumber(el, parseInt(String(val)) || 0, String(val));
}

function animateNumber(el, target, display) {
    if (isNaN(target)) { el.textContent = display; return; }
    let start = 0; const step = target / 30;
    const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = display.replace(/\d+/, Math.round(start));
        if (start >= target) clearInterval(timer);
    }, 20);
}

function renderRecentPlacements(students) {
    const placed = students.filter(s => s.placed || s.company_name).slice(0, 6);
    const tbody = document.getElementById('recentPlacedBody');
    if (!tbody) return;
    tbody.innerHTML = placed.length ? placed.map(s => `
        <tr>
            <td><div class="fw-800">${s.full_name || s.name || '—'}</div><div style="font-size:.72rem;color:var(--text-muted)">${s.register_number || ''}</div></td>
            <td>${s.company_name || '—'}</td>
            <td>${s.job_role || '—'}</td>
            <td style="color:var(--accent-green);font-weight:700">${s.ctc ? s.ctc + ' LPA' : '—'}</td>
            <td>${formatDate(s.placed_on || s.created_at)}</td>
        </tr>
    `).join('') : '<tr><td colspan="5" class="loading-row">No placements yet</td></tr>';
}

function renderUpcomingDrives() {
    const mock = getMockDrives().slice(0, 4);
    const el = document.getElementById('upcomingDrivesList');
    if (!el) return;
    el.innerHTML = mock.map(d => `
        <div class="drive-list-item">
            <div class="drive-list-dot"></div>
            <div class="drive-list-info">
                <div class="drive-list-company">${d.company}</div>
                <div class="drive-list-date">📅 ${d.date} | ${d.dept}</div>
            </div>
            <div class="drive-list-ctc">${d.ctc}</div>
        </div>
    `).join('');
}

// ── Charts ──────────────────────────────────────────
function renderCharts(students) {
    const depts = ['CSE','IT','ECE','EEE','ME','CE'];
    const deptData = depts.map(d => {
        const group = students.filter(s => s.department === d);
        const placed = group.filter(s => s.placed).length;
        return { dept: d, total: group.length, placed };
    });

    // Destroy existing charts
    Object.values(charts).forEach(c => { if (c) c.destroy(); });

    // Dept chart (bar)
    const dCtx = document.getElementById('deptChart')?.getContext('2d');
    if (dCtx) {
        charts.dept = new Chart(dCtx, {
            type: 'bar',
            data: {
                labels: depts,
                datasets: [
                    { label: 'Total', data: deptData.map(d => d.total), backgroundColor: 'rgba(79,142,247,0.25)', borderColor: 'rgba(79,142,247,0.8)', borderWidth: 2, borderRadius: 6 },
                    { label: 'Placed', data: deptData.map(d => d.placed), backgroundColor: 'rgba(34,211,163,0.4)', borderColor: 'rgba(34,211,163,0.9)', borderWidth: 2, borderRadius: 6 }
                ]
            },
            options: chartOptions('Placement by Department')
        });
    }

    // Company doughnut
    const cCtx = document.getElementById('companyChart')?.getContext('2d');
    if (cCtx) {
        const companies = {};
        students.filter(s => s.company_name).forEach(s => {
            companies[s.company_name] = (companies[s.company_name] || 0) + 1;
        });
        const labels = Object.keys(companies).slice(0, 6);
        const mockLabels = ['Google','Microsoft','Amazon','Infosys','TCS','Wipro'];
        const mockData   = [12,10,9,23,18,15];
        charts.company = new Chart(cCtx, {
            type: 'doughnut',
            data: {
                labels: labels.length ? labels : mockLabels,
                datasets: [{ data: labels.length ? Object.values(companies).slice(0,6) : mockData, backgroundColor: ['#4f8ef7','#8b5cf6','#22d3a3','#f59e0b','#ec4899','#f43f5e'], borderWidth: 0 }]
            },
            options: { ...chartOptions(), plugins: { legend: { position: 'bottom', labels: { color: '#8b90b8', font: { size: 11 }, boxWidth: 10 } } } }
        });
    }

    // Trend line
    const tCtx = document.getElementById('trendChart')?.getContext('2d');
    if (tCtx) {
        charts.trend = new Chart(tCtx, {
            type: 'line',
            data: {
                labels: ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
                datasets: [{ label: 'Placements', data: [5,18,32,45,60,80,95,104], fill: true, backgroundColor: 'rgba(79,142,247,0.1)', borderColor: '#4f8ef7', borderWidth: 2.5, tension: 0.4, pointBackgroundColor: '#4f8ef7', pointRadius: 4 }]
            },
            options: { ...chartOptions(), plugins: { legend: { display: false } } }
        });
    }
}

function chartOptions(title = '') {
    return {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8b90b8', font: { size: 11 } } }, title: { display: false } },
        scales: {
            x: { ticks: { color: '#8b90b8', font: { size: 11 } }, grid: { color: 'rgba(42,44,69,0.6)' } },
            y: { ticks: { color: '#8b90b8', font: { size: 11 } }, grid: { color: 'rgba(42,44,69,0.6)' } }
        }
    };
}

// ══════════════════════════════════════════════════════
// STUDENTS
// ══════════════════════════════════════════════════════
async function loadStudents() {
    try {
        const data = await sbFetch('student_profiles', '?select=*&order=full_name.asc');
        allStudents = data || [];
    } catch {
        allStudents = getMockStudents();
    }
    filteredStudents = [...allStudents];
    renderStudentTable(filteredStudents);
    renderVerificationQueue(filteredStudents.filter(s => !s.verified).slice(0, 8));
    document.getElementById('stuTableCount').textContent = `${filteredStudents.length} students`;
    document.getElementById('verifBadge').textContent = filteredStudents.filter(s => !s.verified).length;
}

function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    if (!students.length) { tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No students match the filters.</td></tr>'; return; }
    tbody.innerHTML = students.map(s => {
        const name = s.full_name || s.name || '—';
        const rollNo = s.register_number || s.roll_number || '—';
        const dept = s.department || '—';
        const year = s.year || '—';
        const cgpa = s.cgpa != null ? parseFloat(s.cgpa).toFixed(1) : '—';
        const lc = s.leetcode_problems || '—';
        const isPlaced = s.placed || s.placement_status === 'placed';
        const pill = isPlaced ? '<span class="status-pill pill-placed">Placed</span>' : '<span class="status-pill pill-unplaced">Unplaced</span>';
        return `<tr>
            <td><input type="checkbox" class="stu-check" data-id="${s.id}"></td>
            <td><div class="fw-800">${name}</div><div style="font-size:.72rem;color:var(--text-muted)">${rollNo}</div></td>
            <td>${dept} / Y${year}</td>
            <td>${cgpa}</td>
            <td>${lc}</td>
            <td>${pill}</td>
            <td style="display:flex;gap:6px">
                <button class="icon-btn view" onclick="openStudentPanel('${s.id}')">👁 View</button>
                <button class="icon-btn edit">✏️</button>
                <button class="icon-btn delete" onclick="blacklistStudent('${s.id}')">🚫</button>
            </td>
        </tr>`;
    }).join('');
    // Select all
    document.getElementById('selectAllStu').onchange = e => {
        document.querySelectorAll('.stu-check').forEach(c => c.checked = e.target.checked);
        updateBulkActions();
    };
    document.querySelectorAll('.stu-check').forEach(c => c.addEventListener('change', updateBulkActions));
}

function updateBulkActions() {
    const any = document.querySelectorAll('.stu-check:checked').length > 0;
    document.getElementById('bulkActions').style.display = any ? 'flex' : 'none';
}

function renderVerificationQueue(students) {
    const el = document.getElementById('verificationQueue');
    if (!el) return;
    el.innerHTML = students.length ? students.map(s => `
        <div class="verif-card">
            <div class="verif-card-header">
                <div class="verif-avatar">${(s.full_name || s.name || 'S')[0]}</div>
                <div>
                    <div class="verif-name">${s.full_name || s.name || '—'}</div>
                    <div class="verif-roll">${s.register_number || ''} | ${s.department || ''}</div>
                </div>
            </div>
            <div class="verif-info">CGPA: <strong>${s.cgpa || '—'}</strong> &nbsp;|&nbsp; LeetCode: <strong>${s.leetcode_problems || '—'}</strong></div>
            <div class="verif-info">Email: ${s.email || '—'}</div>
            <div class="verif-actions">
                <button class="verif-btn verif-approve" onclick="verifyStudent('${s.id}','approve',this)">✅ Approve</button>
                <button class="verif-btn verif-hold"    onclick="verifyStudent('${s.id}','hold',this)">⏸ Hold</button>
                <button class="verif-btn verif-reject"  onclick="verifyStudent('${s.id}','reject',this)">✕ Reject</button>
            </div>
        </div>
    `).join('') : '<div style="color:var(--text-muted);padding:20px">All profiles verified ✅</div>';
}

async function verifyStudent(id, action, btn) {
    const card = btn.closest('.verif-card');
    card.style.opacity = '0.5'; card.style.pointerEvents = 'none';
    try { await sbUpdate('student_profiles', id, { verified: action === 'approve', verification_status: action }); }
    catch {}
    showToast(`Student ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'held'}.`, action === 'approve' ? 'success' : 'info');
    setTimeout(() => card.remove(), 600);
}

function applyStudentFilters() {
    const search = document.getElementById('stuSearch').value.toLowerCase();
    const dept   = document.getElementById('stuDept').value;
    const yr     = document.getElementById('stuYear').value;
    const placed = document.getElementById('stuPlaced').value;
    const cgpaMin = parseFloat(document.getElementById('stuCgpaMin').value) || 0;
    const backMax = parseInt(document.getElementById('stuBacklogMax').value) ?? Infinity;
    filteredStudents = allStudents.filter(s => {
        if (search && !`${s.full_name}${s.name}${s.register_number}${s.email}`.toLowerCase().includes(search)) return false;
        if (dept && s.department !== dept) return false;
        if (yr && String(s.year) !== yr) return false;
        if (placed === 'placed'   && !(s.placed || s.placement_status === 'placed')) return false;
        if (placed === 'unplaced' && (s.placed || s.placement_status === 'placed'))  return false;
        if (s.cgpa < cgpaMin) return false;
        if (s.active_backlogs > backMax) return false;
        return true;
    });
    renderStudentTable(filteredStudents);
    document.getElementById('stuTableCount').textContent = `${filteredStudents.length} of ${allStudents.length} students`;
}

function resetStudentFilters() {
    ['stuSearch','stuCgpaMin','stuBacklogMax'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['stuDept','stuYear','stuPlaced'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    filteredStudents = [...allStudents];
    renderStudentTable(filteredStudents);
    document.getElementById('stuTableCount').textContent = `${filteredStudents.length} students`;
}

function switchStudentTab(tab, btn) {
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`stuTab${tab.charAt(0).toUpperCase()+tab.slice(1)}`).classList.add('active');
}

// Student side panel
function openStudentPanel(id) {
    const s = allStudents.find(st => String(st.id) === String(id));
    if (!s) return;
    document.getElementById('spStudentName').textContent = s.full_name || s.name || 'Student';
    const isPlaced = s.placed || s.placement_status === 'placed';
    document.getElementById('spBody').innerHTML = `
        <div class="sp-section">
            <div class="sp-section-title">Academic Info</div>
            <div class="sp-row"><span class="sp-lbl">Register No</span><span class="sp-val">${s.register_number || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">Department</span><span class="sp-val">${s.department || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">Year</span><span class="sp-val">${s.year || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">CGPA</span><span class="sp-val">${s.cgpa || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">Backlogs</span><span class="sp-val">${s.active_backlogs ?? '—'}</span></div>
        </div>
        <div class="sp-section">
            <div class="sp-section-title">Skills & Profiles</div>
            <div class="sp-row"><span class="sp-lbl">LeetCode Solved</span><span class="sp-val">${s.leetcode_problems || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">GitHub</span><span class="sp-val">${s.github_url ? `<a href="${s.github_url}" target="_blank" style="color:var(--accent-blue)">${s.github_url}</a>` : '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">LinkedIn</span><span class="sp-val">${s.linkedin_url ? `<a href="${s.linkedin_url}" target="_blank" style="color:var(--accent-blue)">View</a>` : '—'}</span></div>
        </div>
        <div class="sp-section">
            <div class="sp-section-title">Placement Status</div>
            <div class="sp-row"><span class="sp-lbl">Status</span><span class="sp-val">${isPlaced ? '<span class="status-pill pill-placed">Placed</span>' : '<span class="status-pill pill-unplaced">Unplaced</span>'}</span></div>
            ${isPlaced ? `
            <div class="sp-row"><span class="sp-lbl">Company</span><span class="sp-val">${s.company_name || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">Role</span><span class="sp-val">${s.job_role || '—'}</span></div>
            <div class="sp-row"><span class="sp-lbl">CTC</span><span class="sp-val" style="color:var(--accent-green)">${s.ctc ? s.ctc+' LPA' : '—'}</span></div>
            ` : ''}
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="qa-btn qa-secondary small" onclick="showToast('Notification sent','success')">📩 Notify</button>
            <button class="qa-btn qa-outline small" onclick="exportSingleStudent('${id}')">📥 Export</button>
            ${!isPlaced ? `<button class="danger-btn" onclick="blacklistStudent('${id}')">🚫 Blacklist</button>` : ''}
        </div>
    `;
    document.getElementById('studentPanelOverlay').classList.add('open');
    document.getElementById('studentDetailPanel').classList.add('open');
}

function closeSidePanel() {
    document.getElementById('studentPanelOverlay').classList.remove('open');
    document.getElementById('studentDetailPanel').classList.remove('open');
}

function blacklistStudent(id) {
    if (!confirm('Blacklist this student? They will no longer be eligible for any drives.')) return;
    showToast('Student blacklisted.', 'error');
}

function bulkBlacklist() { showToast('Bulk blacklist applied to selected students.', 'error'); }
function bulkNotify()     { showToast('Notification sent to selected students.', 'success'); }

// ══════════════════════════════════════════════════════
// JOB DRIVES
// ══════════════════════════════════════════════════════
async function loadDrives() {
    try {
        const data = await sbFetch('job_drives', '?select=*&order=created_at.desc');
        allDrives = data || [];
    } catch {
        allDrives = getMockDrives();
    }
    renderDrivesGrid(allDrives);
}

function renderDrivesGrid(drives) {
    const grid = document.getElementById('drivesGrid');
    if (!grid) return;
    grid.innerHTML = drives.map((d, i) => {
        const stages = d.stages || ['Aptitude','Tech Interview','HR'];
        const applied = d.applied_count || Math.floor(Math.random() * 80 + 20);
        const seats   = d.seats || 10;
        const pct = Math.min(100, Math.round(applied / (seats * 10) * 100));
        return `
        <div class="drive-card">
            <div class="drive-card-top">
                <div>
                    <div class="drive-title">${d.job_title || d.title || 'Software Engineer'}</div>
                    <div class="drive-company">${d.company_name || d.company || 'Company'}</div>
                </div>
                <div>
                    <div class="drive-ctc">${d.ctc || d.package || '—'} LPA</div>
                    <div style="text-align:right">${getBadge(d.status || 'open')}</div>
                </div>
            </div>
            <div class="drive-meta">
                <span>📅 ${d.drive_date || d.date || 'TBD'}</span>
                <span>📍 ${d.location || 'On-site'}</span>
                <span>💼 ${d.offer_type || 'Full-time'}</span>
            </div>
            <div class="drive-stages">${stages.map(st => `<span class="stage-chip">${st}</span>`).join('')}</div>
            <div class="drive-progress">
                <div class="drive-progress-label"><span>${applied} applied</span><span>${seats} seats</span></div>
                <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
            </div>
            <div class="drive-actions">
                <button class="drive-btn drive-btn-manage" onclick="adminNav('ats')">🔄 Manage ATS</button>
                <button class="drive-btn drive-btn-delete" onclick="deleteDrive(${i})">🗑</button>
            </div>
        </div>`;
    }).join('');
}

function getBadge(status) {
    const map = { open:'badge-green', closed:'badge-red', draft:'badge-yellow', upcoming:'badge-blue' };
    return `<span class="badge ${map[status] || 'badge-blue'}">${status}</span>`;
}

function deleteDrive(i) {
    if (!confirm('Remove this drive?')) return;
    allDrives.splice(i, 1);
    renderDrivesGrid(allDrives);
    showToast('Drive removed.', 'info');
}

// ── Create Job Modal ─────────────────────────────────
function openJobModal() { document.getElementById('jobModal').classList.add('open'); }

function addStage() {
    const list = document.getElementById('workflowStages');
    const n = list.children.length + 1;
    const div = document.createElement('div');
    div.className = 'stage-item';
    div.innerHTML = `<span class="stage-num">${n}</span><input type="text" class="form-input stage-input" placeholder="Round name"><button class="remove-stage" onclick="removeStage(this)">✕</button>`;
    list.appendChild(div);
    renumberStages();
}

function removeStage(btn) {
    btn.closest('.stage-item').remove();
    renumberStages();
}

function renumberStages() {
    document.querySelectorAll('.stage-item').forEach((el, i) => {
        const num = el.querySelector('.stage-num');
        if (num) num.textContent = i + 1;
    });
}

function publishJobProfile() {
    const title   = document.getElementById('jTitle')?.value.trim();
    const company = document.getElementById('jCompany')?.value.trim();
    const ctc     = document.getElementById('jCTC')?.value;
    if (!title || !company || !ctc) { showToast('Please fill required fields (*)', 'error'); return; }
    const stages = [...document.querySelectorAll('.stage-input')].map(i => i.value).filter(Boolean);
    const depts  = [...document.querySelectorAll('#deptCheckboxes input:checked')].map(i => i.value);
    allDrives.unshift({ job_title: title, company_name: company, ctc, drive_date: document.getElementById('jDate')?.value || 'TBD', location: document.getElementById('jLocation')?.value || 'TBD', offer_type: document.getElementById('jOfferType')?.value, stages, departments: depts, status: 'open' });
    closeModal('jobModal');
    if (currentPage === 'drives') renderDrivesGrid(allDrives);
    showToast(`Drive "${title}" at ${company} published!`, 'success');
}

function saveJobDraft() { showToast('Draft saved locally.', 'info'); }

// ══════════════════════════════════════════════════════
// ATS KANBAN
// ══════════════════════════════════════════════════════
function loadATS() {
    // Populate drive select
    const sel = document.getElementById('atsJobSelect');
    if (sel) {
        sel.innerHTML = '<option value="">Select Drive…</option>' +
            getMockDrives().map(d => `<option value="${d.company}">${d.job_title || 'SWE'} — ${d.company}</option>`).join('');
        sel.onchange = () => renderKanban(sel.value);
    }
    renderKanban('');
}

function renderKanban(drive) {
    const stages = ['Applied','Aptitude','Tech Interview','HR Interview','Selected'];
    const students = getMockStudents().slice(0, 15);
    const board = document.getElementById('kanbanBoard');
    if (!board) return;
    board.innerHTML = stages.map((stage, si) => `
        <div class="kanban-col stage-${si}">
            <div class="kanban-col-header">
                ${stage} <span class="count">${Math.max(0, students.length - si * 3)}</span>
            </div>
            <div class="kanban-cards">
                ${students.slice(si, si + Math.max(1, 4 - si)).map(s => `
                    <div class="kanban-card" onclick="openStudentPanel('${s.id}')">
                        <div class="kanban-card-name">${s.full_name || s.name}</div>
                        <div class="kanban-card-roll">${s.register_number || ''} | ${s.department || ''}</div>
                        <div class="kanban-card-actions">
                            <button class="kanban-action advance" onclick="event.stopPropagation();showToast('Moved to next round','success')">▶ Advance</button>
                            <button class="kanban-action reject"  onclick="event.stopPropagation();showToast('Candidate rejected','error')">✕ Reject</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function bulkUploadShortlist() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.csv,.xlsx';
    inp.onchange = () => showToast('Shortlist uploaded and processed.', 'success');
    inp.click();
}

function sendBulkNotification() { showToast('Bulk notifications sent to all filtered students.', 'success'); }

// ══════════════════════════════════════════════════════
// OFFERS
// ══════════════════════════════════════════════════════
function loadOffers() {
    const offers = getMockOffers();
    const tbody = document.getElementById('offerTableBody');
    if (!tbody) return;
    tbody.innerHTML = offers.map(o => {
        const mismatch = Math.abs(o.offered - o.posted) > 0.5;
        return `<tr ${mismatch ? 'style="background:rgba(244,63,94,0.05)"' : ''}>
            <td>${o.student}</td>
            <td>${o.company}</td>
            <td style="color:var(--accent-green);font-weight:700">${o.offered} LPA</td>
            <td>${o.posted} LPA ${mismatch ? '<span class="badge badge-red">Mismatch!</span>' : ''}</td>
            <td><span class="badge badge-green">${o.status}</span></td>
            <td>${o.letter ? `<a href="#" style="color:var(--accent-blue)">📄 View</a>` : '<span style="color:var(--text-muted)">Pending</span>'}</td>
            <td style="display:flex;gap:6px">
                <button class="icon-btn edit" onclick="showToast('Editing offer…','info')">✏️</button>
                <button class="icon-btn delete" onclick="showToast('Offer removed','error')">🗑</button>
            </td>
        </tr>`;
    }).join('');

    // Joinee stats
    const jStats = document.getElementById('joineeStats');
    if (jStats) {
        jStats.innerHTML = [
            { label: 'Offers Issued', num: offers.length, color: 'var(--accent-blue)' },
            { label: 'Confirmed Joinee', num: offers.filter(o => o.status === 'Joined').length, color: 'var(--accent-green)' },
            { label: 'Awaiting Joining', num: offers.filter(o => o.status === 'Accepted').length, color: 'var(--accent-orange)' },
            { label: 'Declined', num: 0, color: 'var(--accent-red)' }
        ].map(s => `<div class="joinee-stat"><div class="joinee-stat-num" style="color:${s.color}">${s.num}</div><div class="joinee-stat-label">${s.label}</div></div>`).join('');
    }

    // Joinee table
    const jBody = document.getElementById('joineeTableBody');
    if (jBody) {
        jBody.innerHTML = offers.slice(0, 4).map(o => `<tr>
            <td>${o.student}</td><td>${o.company}</td><td>SWE</td>
            <td>${o.joiningDate || '2025-07-01'}</td>
            <td>${getBadge(o.status === 'Joined' ? 'open' : 'upcoming')}</td>
            <td><button class="icon-btn view">📩 Send Reminder</button></td>
        </tr>`).join('');
    }
}

function exportJoineeReport() { showToast('Joinee report exported.', 'success'); }

// ══════════════════════════════════════════════════════
// NOTICES & EVENTS
// ══════════════════════════════════════════════════════
let notices = [
    { id: 1, title: 'Google Drive — 28 July', msg: 'Students eligible for Google SWE drive: CSE/IT with CGPA ≥ 8.0. Register by 25 July.', type: 'urgent', date: '2 Jul', audience: 'CSE, IT' },
    { id: 2, title: 'Resume Workshop — 20 July', msg: 'Placement cell is organising a resume workshop. Attendance mandatory for final year students.', type: 'event', date: '5 Jul', audience: 'All' },
    { id: 3, title: 'Ethics Policy Reminder', msg: 'Reminder: Sharing offer details publicly is a policy violation. All offers are confidential.', type: '', date: '1 Jul', audience: 'All' }
];

function loadNotices() {
    renderNoticeBoard();
    renderCalendar();
    renderAttendance();
}

function renderNoticeBoard() {
    const el = document.getElementById('noticeBoard');
    if (!el) return;
    el.innerHTML = notices.map(n => `
        <div class="notice-item">
            <div class="notice-flag ${n.type}"></div>
            <div class="notice-body">
                <div class="notice-title">${n.title}</div>
                <div class="notice-meta">📅 ${n.date} &nbsp;|&nbsp; 👥 ${n.audience}</div>
                <div class="notice-msg">${n.msg}</div>
            </div>
            <div class="notice-actions">
                <button class="notice-del" onclick="deleteNotice(${n.id})">🗑</button>
            </div>
        </div>
    `).join('');
}

function deleteNotice(id) {
    notices = notices.filter(n => n.id !== id);
    renderNoticeBoard();
    showToast('Notice deleted.', 'info');
}

function openNoticeModal() { document.getElementById('noticeModal').classList.add('open'); }

function publishNotice() {
    const title = document.getElementById('noticeTitle')?.value.trim();
    const msg   = document.getElementById('noticeMsg')?.value.trim();
    if (!title || !msg) { showToast('Title and message are required.', 'error'); return; }
    notices.unshift({ id: Date.now(), title, msg, type: '', date: 'Today', audience: document.getElementById('noticeAudience')?.value || 'All' });
    renderNoticeBoard();
    closeModal('noticeModal');
    showToast('Notice published!', 'success');
    document.getElementById('noticeTitle').value = '';
    document.getElementById('noticeMsg').value = '';
}

// Mini Calendar
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
const eventDays = [5, 14, 22, 28];

function renderCalendar() {
    const el = document.getElementById('miniCalendar');
    if (!el) return;
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    let html = `
        <div class="mini-cal-header">
            <button class="mini-cal-nav" onclick="prevMonth()">‹</button>
            <span>${months[calMonth]} ${calYear}</span>
            <button class="mini-cal-nav" onclick="nextMonth()">›</button>
        </div>
        <div class="mini-cal-grid">
            ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<div class="mini-cal-day-name">${d}</div>`).join('')}
            ${Array.from({length: firstDay}, () => '<div class="mini-cal-day other-month"></div>').join('')}
            ${Array.from({length: daysInMonth}, (_, i) => {
                const d = i + 1;
                const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                const hasEvent = eventDays.includes(d);
                return `<div class="mini-cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">${d}</div>`;
            }).join('')}
        </div>`;
    el.innerHTML = html;

    const evEl = document.getElementById('eventList');
    if (evEl) {
        evEl.innerHTML = [
            { day: 14, mon: 'Jul', title: 'Google Drive', time: '9:00 AM' },
            { day: 22, mon: 'Jul', title: 'Resume Workshop', time: '2:00 PM' },
            { day: 28, mon: 'Aug', title: 'Microsoft Virtual Drive', time: '10:00 AM' }
        ].map(e => `
            <div class="event-item">
                <div class="event-date"><div class="event-date-day">${e.day}</div><div class="event-date-mon">${e.mon}</div></div>
                <div class="event-info"><div class="event-info-title">${e.title}</div><div class="event-info-time">🕐 ${e.time}</div></div>
            </div>
        `).join('');
    }
}

function prevMonth() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); }
function nextMonth() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); }

function openEventModal() { showToast('Event creation coming soon.', 'info'); }
function openQRModal()    { showToast('QR scanner integration coming soon.', 'info'); }

function renderAttendance() {
    const tbody = document.getElementById('attendanceBody');
    if (!tbody) return;
    const rows = [
        { student: 'Aditya Kumar', event: 'Resume Workshop', date: '20 Jul', status: '✅ Present', method: 'QR' },
        { student: 'Priya Sharma', event: 'Mock Interview', date: '15 Jul', status: '✅ Present', method: 'Manual' },
        { student: 'Rahul Verma', event: 'Resume Workshop', date: '20 Jul', status: '❌ Absent', method: '—' }
    ];
    tbody.innerHTML = rows.map(r => `<tr><td>${r.student}</td><td>${r.event}</td><td>${r.date}</td><td>${r.status}</td><td>${r.method}</td></tr>`).join('');
}

// ══════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════
function saveSettings() {
    const prefs = {
        maxApps: document.getElementById('maxApps')?.value,
        dreamMultiplier: document.getElementById('dreamMultiplier')?.value,
        reApplyPolicy: document.getElementById('reApplyPolicy')?.value,
        defaultCgpa: document.getElementById('defaultCgpa')?.value,
        defaultBacklogs: document.getElementById('defaultBacklogs')?.value,
        emailNotif: document.getElementById('emailNotif')?.checked,
        smsNotif: document.getElementById('smsNotif')?.checked
    };
    localStorage.setItem('placelyAdminPrefs', JSON.stringify(prefs));
    showToast('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
        localStorage.removeItem('placelyAdminPrefs');
        showToast('Settings reset to defaults.', 'info');
    }
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════
function exportStudents() {
    const headers = 'Name,Roll No,Department,Year,CGPA,LeetCode,Placed,Company,CTC';
    const rows = filteredStudents.map(s =>
        [s.full_name||s.name, s.register_number, s.department, s.year, s.cgpa, s.leetcode_problems, s.placed ? 'Yes':'No', s.company_name||'', s.ctc||''].join(',')
    );
    downloadCSV([headers, ...rows].join('\n'), 'placely_students.csv');
    showToast('Student CSV exported.', 'success');
}

function exportPlacementReport() {
    showToast('Full placement report downloading…', 'info');
    downloadCSV('Report,Data\n"Generated","' + new Date().toLocaleString() + '"', 'placely_report.csv');
}

function exportSingleStudent(id) {
    showToast('Student profile exported.', 'success');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

// ── Modal helpers ────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
});

// ── Global Search ────────────────────────────────────
document.getElementById('globalSearch')?.addEventListener('input', function() {
    const q = this.value.trim();
    if (!q) return;
    if (currentPage !== 'students') { adminNav('students'); setTimeout(() => searchStudents(q), 400); }
    else searchStudents(q);
});

function searchStudents(q) {
    document.getElementById('stuSearch').value = q;
    applyStudentFilters();
}

// ══════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════
function getMockStudents() {
    const depts = ['CSE','IT','ECE','EEE','ME','CE'];
    const names = ['Aditya Kumar','Priya Sharma','Rahul Verma','Ananya Singh','Karan Mehta','Deepika Nair','Vishal Gupta','Sneha Reddy','Arjun Patel','Pooja Iyer','Rohit Das','Kavya Menon','Siddharth Jain','Lakshmi Rao','Varun Shah'];
    return names.map((name, i) => ({
        id: `mock-${i}`, full_name: name,
        register_number: `21CS${String(i+100).padStart(4,'0')}`,
        department: depts[i % depts.length], year: (i % 4) + 1,
        cgpa: (6 + Math.random() * 4).toFixed(1),
        leetcode_problems: Math.floor(Math.random() * 300),
        active_backlogs: i < 3 ? 0 : Math.floor(Math.random() * 2),
        placed: i < 8,
        placement_status: i < 8 ? 'placed' : 'unplaced',
        company_name: i < 8 ? ['Google','Microsoft','Amazon','Infosys','TCS','Wipro','Zoho','Cognizant'][i] : null,
        ctc: i < 8 ? [28,18,25,4.5,3.8,5,7,3.5][i] : null,
        job_role: i < 8 ? 'Software Engineer' : null,
        email: `${name.split(' ')[0].toLowerCase()}@college.edu`,
        verified: i % 3 !== 0,
        created_at: new Date().toISOString()
    }));
}

function getMockDrives() {
    return [
        { company: 'Google', job_title: 'SWE-I', ctc: 28, date: '28 Jul 2025', dept: 'CSE, IT', status: 'open', seats: 5, stages: ['Coding Round','Tech Interview','HR'], location: 'Bangalore', offer_type: 'Full-time' },
        { company: 'Microsoft', job_title: 'SDE Intern', ctc: 80000, date: '15 Aug 2025', dept: 'All', status: 'upcoming', seats: 10, stages: ['OA','Tech-1','Tech-2','HR'], location: 'Hyderabad', offer_type: 'Internship' },
        { company: 'Amazon', job_title: 'Software Dev Engineer', ctc: 25, date: '5 Aug 2025', dept: 'CSE, IT, ECE', status: 'open', seats: 8, stages: ['Aptitude','Tech','Bar Raiser'], location: 'Bangalore', offer_type: 'Full-time' },
        { company: 'Zoho', job_title: 'Product Engineer', ctc: 7, date: '20 Jul 2025', dept: 'All', status: 'closed', seats: 20, stages: ['Written','Tech-1','HR'], location: 'Chennai', offer_type: 'Full-time' },
        { company: 'Infosys', job_title: 'Systems Engineer', ctc: 4.5, date: '10 Sep 2025', dept: 'All', status: 'draft', seats: 50, stages: ['Aptitude','HR'], location: 'Multiple', offer_type: 'Full-time' }
    ];
}

function getMockOffers() {
    return [
        { student: 'Aditya Kumar', company: 'Google', offered: 28, posted: 28, status: 'Joined', letter: true, joiningDate: '2025-07-15' },
        { student: 'Priya Sharma', company: 'Microsoft', offered: 18, posted: 19, status: 'Accepted', letter: true, joiningDate: '2025-08-01' },
        { student: 'Rahul Verma', company: 'Amazon', offered: 25, posted: 25, status: 'Joined', letter: true, joiningDate: '2025-07-01' },
        { student: 'Ananya Singh', company: 'Zoho', offered: 9, posted: 7, status: 'Accepted', letter: false, joiningDate: '2025-09-01' }
    ];
}

// ── Utility ──────────────────────────────────────────
function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Init ─────────────────────────────────────────────
loadDashboard();
