// Para mi fondo 3D con three.js:
function init3DBackground() {
    const canvas = document.getElementById('bgCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Aquí se crean los elementos tecnológicos flotantes:
    const elements = [];
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    
    for (let i = 0; i < 50; i++) {
        const material = new THREE.MeshPhongMaterial({ 
            color: Math.random() * 0xffffff,
            emissive: 0x072534,
            specular: 0xffffff,
            shininess: 30,
            wireframe: Math.random() > 0.7,
            transparent: true,
            opacity: 0.8
        });
        
        const element = new THREE.Mesh(geometry, material);
        
        // Su posición aleatoria:
        element.position.x = Math.random() * 100 - 50;
        element.position.y = Math.random() * 100 - 50;
        element.position.z = Math.random() * 100 - 50;
        
        // Su tamaño aleatorio:
        const scale = Math.random() * 2 + 0.5;
        element.scale.set(scale, scale, scale);
        
        // Su rotación aleatoria:
        element.rotation.x = Math.random() * Math.PI;
        element.rotation.y = Math.random() * Math.PI;
        
        // S velocidad de rotación:
        element.userData = {
            speed: {
                x: Math.random() * 0.01 - 0.005,
                y: Math.random() * 0.01 - 0.005
            }
        };
        
        scene.add(element);
        elements.push(element);
    }
    
    // Las luces:
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // La gran animación:
    function animate() {
        requestAnimationFrame(animate);
        
        elements.forEach(element => {
            element.rotation.x += element.userData.speed.x;
            element.rotation.y += element.userData.speed.y;
            
            // Su movimiento lento:
            element.position.x += 0.01;
            if (element.position.x > 50) element.position.x = -50;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Ajustar al cambiar el tamaño de la ventana:
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Los efectos de scroll suave:
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Las animaciones al hacer scroll:
function initScrollAnimations() {
    const floatingElements = document.querySelectorAll('.floating');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    floatingElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        const formData = {
          name: this.name.value,
          email: this.email.value,
          phone: this.phone.value,
          subject: this.subject.value,
          message: this.message.value
        };
        
        // URL base del entorno:
        const baseURL = window.location.origin;
        const API_URL = `${baseURL}/api/contact`;
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al enviar el mensaje');
        }
        
        showNotification(data.message, 'success');
        this.reset();
        
      } catch (error) {
        showNotification(error.message, 'error');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Mostrar las notificaciones:
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show ' + type;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// El botón de volver arriba:
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top a');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
    }
}

// Los efectos hover para los elementos super destacados:
function initHoverEffects() {
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseenter', () => {
            highlight.style.transform = 'scale(1.05)';
        });
        
        highlight.addEventListener('mouseleave', () => {
            highlight.style.transform = 'scale(1)';
        });
    });
}

// Inicializar todo cuando el DOM esté listo:
document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initBackToTop();
    initHoverEffects();
    
    // Mostrar el mensaje de bienvenida:
    setTimeout(() => {
        showNotification('Bienvenido a MONTEBYTES - Soluciones Informáticas', 'success');
    }, 1000);
});