document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('register-form');
  const message   = document.getElementById('register-message');
  const btn       = document.getElementById('register-btn');
  const csrfInput = document.getElementById('csrf-token');

  // Obtener token CSRF del servidor antes de mostrar el form
  fetch('backend/auth/csrf.php')
    .then(r => r.json())
    .then(data => { csrfInput.value = data.csrf_token || ''; })
    .catch(() => {});

  // ── Validación inline ──────────────────────────────────────────────────
  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
    message.textContent = '';
    message.className = 'form-message';
  }

  function showFieldError(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function validateForm(data) {
    let valid = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (data.name.length < 2) {
      showFieldError('name-error', 'El nombre debe tener al menos 2 caracteres.');
      valid = false;
    }

    if (!emailRe.test(data.email)) {
      showFieldError('email-error', 'Ingresá un email válido.');
      valid = false;
    }

    if (data.password.length < 6) {
      showFieldError('password-error', 'La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    }

    return valid;
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      name:       form.name.value.trim(),
      email:      form.email.value.trim().toLowerCase(),
      password:   form.password.value,
      csrf_token: csrfInput.value,
    };

    if (!validateForm(data)) return;

    btn.disabled = true;
    btn.textContent = 'Creando cuenta…';

    try {
      const json = await apiPost('backend/auth/register.php', data);

      message.textContent = json.message;
      message.classList.add('form-message--success');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 900);

    } catch (err) {
      message.textContent = err.message || 'Error al crear la cuenta.';
      message.classList.add('form-message--error');

      fetch('backend/auth/csrf.php')
        .then(r => r.json())
        .then(d => { csrfInput.value = d.csrf_token || ''; })
        .catch(() => {});
    } finally {
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    }
  });
});
