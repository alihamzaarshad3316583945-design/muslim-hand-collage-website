const authForm = document.querySelector('[data-auth-form]');
const formMessage = document.querySelector('[data-form-message]');
const sessionPanel = document.querySelector('[data-session-panel]');
const sessionMessage = document.querySelector('[data-session-message]');

const showMessage = (message, kind = 'error') => {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.dataset.kind = kind;
};

const updateSessionPanel = (user) => {
  if (!sessionPanel || !authForm) return;
  sessionPanel.hidden = !user;
  authForm.hidden = Boolean(user);
  if (user && sessionMessage) {
    sessionMessage.textContent = `You are signed in as ${user.name} (${user.role}).`;
  }
};

if (authForm) {
  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Could not check the current sign-in status.');
      const data = await response.json();
      updateSessionPanel(data.user);
    })
    .catch(() => {
      showMessage('Sign-in status could not be checked. Please refresh and try again.');
    });

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage('');

    const submitButton = authForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Please wait…';

    const formData = new FormData(authForm);
    const body = Object.fromEntries(formData.entries());
    const selectedRole = authForm.querySelector('input[name="role"]:checked');
    if (selectedRole) body.role = selectedRole.value;

    try {
      const response = await fetch(authForm.dataset.endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not complete the request.');
      updateSessionPanel(data.user);
      showMessage('Your account is ready. You are signed in.', 'success');
      window.setTimeout(() => {
        const destination = {
          admin: 'admin.html',
          teacher: 'teacher.html',
          student: 'student.html'
        }[data.user.role];
        if (destination) window.location.assign(destination);
      }, 500);
    } catch (error) {
      showMessage(error.message || 'The server could not be reached. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

document.querySelectorAll('[data-logout]').forEach((button) => {
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not sign out.');
      updateSessionPanel(null);
      showMessage('You have signed out.', 'success');
    } catch (error) {
      showMessage(error.message || 'The server could not be reached. Please try again.');
    } finally {
      button.disabled = false;
    }
  });
});
