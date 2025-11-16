/**
 * =================================================================
 *                      ANIMACIONES.JS
 * -----------------------------------------------------------------
 * Este archivo gestiona las animaciones visuales de la página,
 * principalmente las que se activan al hacer scroll.
 *
 * Funcionalidades:
 * 1. Animaciones de entrada para elementos al entrar en el viewport,
 *    utilizando la eficiente Intersection Observer API.
 * 2. Un sutil efecto de parallax en la sección principal (Hero).
 * =================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
 
 /**
  * --------------------------------------
  * 1. ANIMACIONES DE ENTRADA AL HACER SCROLL
  * --------------------------------------
  */
 
 // Seleccionamos todos los elementos que queremos animar.
 // Estos elementos tienen un estado inicial definido en 'diseños.css'.
 const animatedElements = document.querySelectorAll('.neu-container, .neu-card, .about-photo, .about-text, .section-title');
 
 // Verificamos si existen elementos para animar antes de crear el observador.
 if (animatedElements.length > 0) {
  
  // Opciones para el Intersection Observer.
  // La animación se disparará cuando el 10% del elemento sea visible.
  // El 'rootMargin' hace que se active 50px antes de que llegue al fondo de la pantalla.
  const observerOptions = {
   root: null, // Observa en relación al viewport del navegador.
   rootMargin: '0px 0px -50px 0px',
   threshold: 0.1
  };
  
  // La función callback que se ejecuta cuando un elemento observado entra en el viewport.
  const observerCallback = (entries, observer) => {
   entries.forEach(entry => {
    // Si el elemento está intersectando (visible en pantalla)...
    if (entry.isIntersecting) {
     // ...añadimos la clase 'visible' que activa la animación CSS.
     entry.target.classList.add('visible');
     
     // Dejamos de observar el elemento para que la animación no se repita.
     observer.unobserve(entry.target);
    }
   });
  };
  
  // Creamos la instancia del Intersection Observer.
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // Le decimos al observador que empiece a vigilar cada uno de los elementos seleccionados.
  animatedElements.forEach(element => {
   observer.observe(element);
  });
 }
 
 
 /**
  * --------------------------------------
  * 2. EFECTO PARALLAX SUTIL EN LA SECCIÓN HERO
  * --------------------------------------
  */
 const heroSection = document.querySelector('.hero-section');
 
 if (heroSection) {
  let isTicking = false;
  
  const handleParallax = () => {
   // El factor de parallax (0.3) determina qué tan lento se mueve el fondo.
   // Un valor más bajo significa un movimiento más lento y sutil.
   const parallaxFactor = 0.3;
   const scrollPosition = window.scrollY;
   
   // Aplicamos una transformación vertical al fondo de la sección.
   heroSection.style.backgroundPositionY = `${scrollPosition * parallaxFactor}px`;
  };
  
  window.addEventListener('scroll', () => {
   if (!isTicking) {
    window.requestAnimationFrame(() => {
     handleParallax();
     isTicking = false;
    });
    isTicking = true;
   }
  });
 }
 
});