const api = async (url, options = {}) => {
  const response = await fetch(url, { credentials: 'same-origin', ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
  return data;
};
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const toast = document.querySelector('[data-toast]');
let toastTimer;
const showToast = (message, error = false) => {
  toast.textContent = message;
  toast.classList.toggle('error', error);
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
};
const localDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const initials = (name) => String(name || 'TC').split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
const emptyRoster = (message) => { document.querySelector('[data-roster]').innerHTML = `<tr><td colspan="3" class="empty-state">${escapeHtml(message)}</td></tr>`; };
document.querySelector('[data-date]').value = localDate();
document.querySelector('[data-today]').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

document.querySelector('[data-menu]').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => {
  document.getElementById(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
  document.querySelector('.sidebar').classList.remove('open');
}));

const loadRoster = async () => {
  const classId = document.querySelector('[data-class]').value;
  if (!classId) return showToast('Choose an assigned class first.', true);
  const date = document.querySelector('[data-date]').value;
  try {
    const { records } = await api(`/api/management/attendance?classId=${encodeURIComponent(classId)}&date=${encodeURIComponent(date)}`);
    if (!records.length) {
      emptyRoster('There are no active students in this class.');
      document.querySelector('[data-attendance-form]').dataset.loadedClassId = '';
      return;
    }
    document.querySelector('[data-roster]').innerHTML = records.map((record) => `<tr><td><strong>${escapeHtml(record.name)}</strong></td><td>${escapeHtml(record.studentNumber || '—')}</td><td><select class="table-input" data-student-status="${record.studentId}" aria-label="Attendance for ${escapeHtml(record.name)}"><option value="present" ${record.status === 'present' || !record.status ? 'selected' : ''}>Present</option><option value="absent" ${record.status === 'absent' ? 'selected' : ''}>Absent</option><option value="late" ${record.status === 'late' ? 'selected' : ''}>Late</option></select></td></tr>`).join('');
    const form = document.querySelector('[data-attendance-form]');
    form.dataset.loadedClassId = classId;
    form.dataset.loadedDate = date;
  } catch (error) { showToast(error.message, true); }
};

document.querySelector('[data-load]').addEventListener('click', loadRoster);
document.querySelector('[data-attendance-form]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const entries = Array.from(form.querySelectorAll('[data-student-status]')).map((select) => ({
    studentId: Number(select.dataset.studentStatus), status: select.value
  }));
  if (!form.dataset.loadedClassId || !entries.length) return showToast('Load the class roster before saving attendance.', true);
  try {
    const result = await api('/api/management/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId: Number(form.dataset.loadedClassId), date: form.dataset.loadedDate, entries })
    });
    showToast(`Saved ${result.saved} attendance records.`);
  } catch (error) { showToast(error.message, true); }
});

document.querySelectorAll('[data-logout]').forEach((button) => button.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    if (!response.ok) throw new Error('Could not sign out. Please try again.');
    window.location.assign('login.html');
  } catch (error) { showToast(error.message, true); }
}));

api('/api/management/me').then(async ({ user }) => {
  if (user.role !== 'teacher') {
    window.location.replace(user.role === 'admin' ? 'admin.html' : 'student.html');
    return;
  }
  document.querySelectorAll('[data-name]').forEach((node) => { node.textContent = user.name; });
  document.querySelectorAll('[data-avatar]').forEach((node) => { node.textContent = initials(user.name); });
  const [classData, noticeData] = await Promise.all([api('/api/management/classes'), api('/api/management/notices')]);
  const select = document.querySelector('[data-class]');
  select.innerHTML = `<option value="">Select an assigned class</option>${classData.classes.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} · ${escapeHtml(item.code)}</option>`).join('')}`;
  const notices = document.querySelector('[data-notices]');
  notices.innerHTML = noticeData.notices.length
    ? noticeData.notices.map((notice) => `<article class="notice-card"><div class="notice-top"><h3>${escapeHtml(notice.title)}</h3><span class="notice-audience">${escapeHtml(notice.audience)}</span></div><p>${escapeHtml(notice.body)}</p><small>${escapeHtml(new Date(`${notice.createdAt.replace(' ', 'T')}Z`).toLocaleString())}</small></article>`).join('')
    : '<p class="empty-state">There are no current notices.</p>';
}).catch(() => window.location.replace('login.html'));
