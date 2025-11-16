/**
 * =================================================================
 *                      MAIN.JS (Versión Mejorada)
 * -----------------------------------------------------------------
 * Este archivo contiene la lógica principal de la interactividad
 * de la página, optimizada para rendimiento, accesibilidad y UX.
 *
 * Funcionalidades:
 * 1. Navegación móvil (Menú Hamburguesa) con cierre mejorado.
 * 2. Componente Acordeón accesible por teclado.
 * 3. Efecto de sombra en el header optimizado para el rendimiento.
 * =================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
 
 /**
  * --------------------------------------
  * 1. LÓGICA PARA LA NAVEGACIÓN MÓVIL
  * --------------------------------------
  */
 const hamburgerMenu = document.querySelector('.hamburger-menu');
 const mainNav = document.querySelector('.main-nav');
 const body = document.body;
 
 // Función para abrir/cerrar el menú
 const toggleNav = () => {
  body.classList.toggle('nav-active');
 };
 
 // Función para cerrar el menú (si está abierto)
 const closeNav = () => {
  if (body.classList.contains('nav-active')) {
   body.classList.remove('nav-active');
  }
 };
 
 if (hamburgerMenu && mainNav) {
  // Abrir/cerrar con el botón de hamburguesa
  hamburgerMenu.addEventListener('click', (e) => {
   e.stopPropagation(); // Evita que el clic se propague al body
   toggleNav();
  });
  
  // Cerrar al hacer clic en un enlace del menú
  mainNav.querySelectorAll('a').forEach(link => {
   link.addEventListener('click', closeNav);
  });
  
  // Cerrar al hacer clic en el fondo del overlay (fuera de los enlaces)
  mainNav.addEventListener('click', (e) => {
   if (e.target === mainNav) {
    closeNav();
   }
  });
 }
 
 // Cerrar el menú con la tecla 'Escape'
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
   closeNav();
  }
 });
 
 
 /**
  * --------------------------------------
  * 2. LÓGICA PARA EL COMPONENTE ACORDEÓN (ACCESIBLE)
  * --------------------------------------
  */
 const accordionItems = document.querySelectorAll('.accordion-item');
 
 if (accordionItems.length > 0) {
  accordionItems.forEach(item => {
   const header = item.querySelector('.accordion-header');
   const content = item.querySelector('.accordion-content');
   
   header.addEventListener('click', () => {
    toggleAccordionItem(item);
   });
   
   // Accesibilidad por teclado
   header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
     e.preventDefault(); // Previene el scroll de la página con la barra espaciadora
     toggleAccordionItem(item);
    }
   });
  });
  
  function toggleAccordionItem(itemToToggle) {
   const content = itemToToggle.querySelector('.accordion-content');
   const header = itemToToggle.querySelector('.accordion-header');
   const isActive = header.classList.contains('active');
   
   // Cerrar todos los demás items
   accordionItems.forEach(item => {
    if (item !== itemToToggle) {
     item.querySelector('.accordion-header').classList.remove('active');
     item.querySelector('.accordion-content').style.maxHeight = null;
    }
   });
   
   // Abrir/cerrar el item seleccionado
   if (!isActive) {
    header.classList.add('active');
    content.style.maxHeight = content.scrollHeight + 'px';
   } else {
    header.classList.remove('active');
    content.style.maxHeight = null;
   }
  }
 }
 
 
 /**
  * --------------------------------------
  * 3. EFECTO DE SOMBRA EN HEADER (OPTIMIZADO)
  * --------------------------------------
  */
 const mainHeader = document.querySelector('.main-header');
 
 if (mainHeader) {
  let isTicking = false; // Flag para controlar la ejecución
  
  const handleScroll = () => {
   const scrollPosition = window.scrollY;
   mainHeader.classList.toggle('header-scrolled', scrollPosition > 50);
  };
  
  window.addEventListener('scroll', () => {
   if (!isTicking) {
    window.requestAnimationFrame(() => {
     handleScroll();
     isTicking = false;
    });
    isTicking = true;
   }
  });
 }
 
});