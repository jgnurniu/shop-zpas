document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('login-form');
  const message   = document.getElementById('login-message');
  const btn       = document.getElementById('login-btn');
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
      email:      form.email.value.trim().toLowerCase(),
      password:   form.password.value,
      csrf_token: csrfInput.value,
    };

    if (!validateForm(data)) return;

    btn.disabled = true;
    btn.textContent = 'Ingresando…';
    message.textContent = '';

    try {
      const json = await apiPost('backend/auth/login.php', data);

      message.textContent = json.message;
      message.classList.add('form-message--success');

      setTimeout(() => {
        window.location.href = 'products.html';
      }, 700);

    } catch (err) {
      message.textContent = err.message || 'Error al iniciar sesión.';
      message.classList.add('form-message--error');

      // Renovar token CSRF tras error
      fetch('backend/auth/csrf.php')
        .then(r => r.json())
        .then(d => { csrfInput.value = d.csrf_token || ''; })
        .catch(() => {});
    } finally {
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  });
});
