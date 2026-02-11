// Utilitários
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Atualizar ano no footer
const anoEl = $('#ano');
if (anoEl) {
  anoEl.textContent = new Date().getFullYear();
}

// Header scroll
const header = $('#header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ========================================
// MENU MOBILE HAMBÚRGUER
// ========================================
const mobileMenuBtn = $('#mobileMenuBtn');
const mainNav = $('#mainNav');
let menuOverlay = null;

if (mobileMenuBtn && mainNav) {
  // Criar overlay para fechar menu ao clicar fora
  function createMenuOverlay() {
    if (!menuOverlay) {
      menuOverlay = document.createElement('div');
      menuOverlay.className = 'menu-overlay';
      document.body.appendChild(menuOverlay);
      
      menuOverlay.addEventListener('click', closeMobileMenu);
    }
  }

  function openMobileMenu() {
    createMenuOverlay();
    mainNav.classList.add('active');
    if (menuOverlay) {
      menuOverlay.classList.add('active');
    }
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mainNav.classList.remove('active');
    if (menuOverlay) {
      menuOverlay.classList.remove('active');
    }
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Fechar menu ao clicar em um link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Fechar menu ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }
  });

  // Fechar menu com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

// Smooth scroll
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ========================================
// TOGGLE DE TEMA DARK/LIGHT
// ========================================
const themeToggle = $('#themeToggle');
if (themeToggle) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Carregar tema salvo ou usar preferência do sistema
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark.matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  loadTheme();

  // Toggle do tema
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ========================================
// WHATSAPP FLUTUANTE
// ========================================
const whatsappBtn = $('#whatsappBtn');
const whatsappChat = $('#whatsappChat');
const chatClose = $('#chatClose');

if (whatsappBtn && whatsappChat) {
  function openWhatsappChat() {
    whatsappChat.classList.add('active');
    whatsappBtn.setAttribute('aria-expanded', 'true');
  }

  function closeWhatsappChat() {
    whatsappChat.classList.remove('active');
    whatsappBtn.setAttribute('aria-expanded', 'false');
  }

  whatsappBtn.addEventListener('click', () => {
    const isExpanded = whatsappBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeWhatsappChat();
    } else {
      openWhatsappChat();
    }
  });

  if (chatClose) {
    chatClose.addEventListener('click', () => {
      closeWhatsappChat();
    });
  }

  // Fechar chat ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.whatsapp-float') && whatsappChat.classList.contains('active')) {
      closeWhatsappChat();
    }
  });

  // Fechar chat com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && whatsappChat.classList.contains('active')) {
      closeWhatsappChat();
    }
  });
}

// ========================================
// CARROSSEL DE IMAGENS (agora é um grid estático)
// ========================================
// O novo design usa um grid ao invés de carrossel
// Mantemos esta função vazia para compatibilidade futura

// ========================================
// TOAST
// ========================================
function showToast(title, msg) {
  const toastTitle = $('#toastTitle');
  const toastMsg = $('#toastMsg');
  const toast = $('#toast');
  
  if (toastTitle) toastTitle.textContent = title;
  if (toastMsg) toastMsg.textContent = msg;
  if (toast) {
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 4000);
  }
}

const toastClose = $('#toastClose');
if (toastClose) {
  toastClose.onclick = () => {
    const toast = $('#toast');
    if (toast) toast.classList.remove('show');
  };
}

// ========================================
// FORMULÁRIO
// ========================================
const form = $('#formContato');
if (form) {
  const validPhone = v => v.replace(/\D/g, '').length >= 10;
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

  function setErr(id, show) {
    const errEl = $(id);
    if (errEl) {
      errEl.classList.toggle('show', show);
    }
  }

  form.onsubmit = async e => {
    e.preventDefault();
    
    const nome = $('#nome');
    const tel = $('#tel');
    const email = $('#email');
    const assunto = $('#assunto');
    const msg = $('#msg');

    if (!nome || !tel || !email || !assunto || !msg) return;

    const nomeVal = nome.value.trim();
    const telVal = tel.value.trim();
    const emailVal = email.value.trim();
    const assuntoVal = assunto.value.trim();
    const msgVal = msg.value.trim();

    const errs = {
      nome: nomeVal.length < 2,
      tel: !validPhone(telVal),
      email: !validEmail(emailVal),
      assunto: assuntoVal.length < 3,
      msg: msgVal.length < 10
    };

    setErr('#errNome', errs.nome);
    setErr('#errTel', errs.tel);
    setErr('#errEmail', errs.email);
    setErr('#errAssunto', errs.assunto);
    setErr('#errMsg', errs.msg);

    if (Object.values(errs).some(Boolean)) {
      showToast('Atenção', 'Verifique os campos destacados');
      return;
    }

    // Configurar URL de retorno para a página atual
    const nextInput = form.querySelector('input[name="_next"]');
    if (nextInput) {
      nextInput.value = window.location.href;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    showToast('Enviando...', 'Aguarde um momento');
    
    // Enviar formulário via fetch para não sair da página
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        form.reset();
        showToast('Mensagem enviada', 'Retornaremos em breve');
      } else {
        showToast('Erro', 'Não foi possível enviar. Tente novamente.');
      }
    } catch (error) {
      showToast('Erro', 'Não foi possível enviar. Tente novamente.');
    }
    
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  };
}