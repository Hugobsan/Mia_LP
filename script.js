// Script para abrir e fechar o menu no mobile
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});

// Sistema de animações no scroll mais robusto
const observerOptions = {
  threshold: [0, 0.1, 0.25],
  rootMargin: '0px 0px -50px 0px'
};

// Controle de estado dos elementos
const elementStates = new Map();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const element = entry.target;
    const elementId = element.dataset.elementId || generateElementId(element);
    
    if (!element.dataset.elementId) {
      element.dataset.elementId = elementId;
    }
    
    const currentState = elementStates.get(elementId) || { 
      isVisible: false, 
      hasAnimated: false,
      lastIntersectionTime: 0
    };
    
    const now = Date.now();
    const timeSinceLastIntersection = now - currentState.lastIntersectionTime;
    
    if (entry.isIntersecting) {
      // Só anima se não estiver visível ou se passou tempo suficiente
      if (!currentState.isVisible && timeSinceLastIntersection > 500) {
        element.classList.add('animate');
        elementStates.set(elementId, {
          ...currentState,
          isVisible: true,
          hasAnimated: true,
          lastIntersectionTime: now
        });
      }
    } else {
      // Só remove animação se elemento saiu significativamente da viewport
      if (entry.intersectionRatio === 0 && currentState.isVisible) {
        setTimeout(() => {
          // Verifica novamente após delay para evitar flickering
          const rect = element.getBoundingClientRect();
          if (rect.bottom < -50 || rect.top > window.innerHeight + 50) {
            element.classList.remove('animate');
            elementStates.set(elementId, {
              ...currentState,
              isVisible: false,
              lastIntersectionTime: now
            });
          }
        }, 200);
      }
    }
  });
}, observerOptions);

// Gera ID único para cada elemento
function generateElementId(element) {
  return 'elem_' + Math.random().toString(36).substr(2, 9);
}

// Função para inicializar animações
function initAnimations() {
  // Elementos que devem animar no scroll
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
}

// Animação suave para links de navegação
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Event listeners para navegação suave
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  
  // Links de navegação
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      smoothScroll(target);
      
      // Fechar menu mobile se estiver aberto
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
      }
    });
  });
});

// Efeito parallax mais suave
let parallaxTicking = false;
let lastScrollY = 0;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const heroImg = document.querySelector('.hero-img');
  
  // Só atualiza parallax se scroll mudou significativamente
  if (Math.abs(scrolled - lastScrollY) > 2 && heroImg) {
    const speed = scrolled * 0.2;
    heroImg.style.transform = `translateY(${speed}px)`;
    lastScrollY = scrolled;
  }
  
  parallaxTicking = false;
}

window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
});

