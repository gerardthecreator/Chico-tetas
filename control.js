/**
 * =================================================================
 *                      CONTROL.JS
 * Este archivo maneja toda la lógica del formulario de citas:
 * - Validación de campos.
 * - Generación dinámica de calendario y horarios disponibles.
 * - Manejo del envío del formulario.
 * =================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
 
 // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
 const form = document.getElementById('appointment-form');
 const studyTypeSelect = document.getElementById('tipo-estudio');
 const calendarPlaceholder = document.getElementById('calendar-placeholder');
 const timeSlotsPlaceholder = document.getElementById('time-slots-placeholder');
 
 // --- DATOS SIMULADOS (Esto vendría de un backend en una app real) ---
 
 // Duración en minutos para cada tipo de estudio
 const studyDurations = {
  abdominal: 20,
  obstetrica: 30,
  mamaria: 25,
  pelvica: 20,
  tiroides: 15,
  musculoesqueletica: 30,
  doppler: 30,
  otra: 20
 };
 
 // Horario de trabajo del doctor (formato 24h)
 const workHours = {
  start: 9, // 9:00 AM
  end: 17, // 5:00 PM
  breakStart: 13, // 1:00 PM
  breakEnd: 14 // 2:00 PM
 };
 
 // Citas ya reservadas (simulación de base de datos)
 const bookedAppointments = [
  // Formato: 'YYYY-MM-DDTHH:mm'
  new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 11) + '10:00',
  new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 11) + '11:30',
  new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().slice(0, 11) + '09:00',
 ];
 
 let selectedDate = null;
 let selectedTime = null;
 
 // --- LÓGICA DE GENERACIÓN DE CALENDARIO Y HORARIOS ---
 
 studyTypeSelect.addEventListener('change', () => {
  calendarPlaceholder.innerHTML = '<p>Seleccione un día disponible:</p>';
  timeSlotsPlaceholder.innerHTML = '';
  selectedDate = null;
  selectedTime = null;
  generateCalendar();
 });
 
 function generateCalendar() {
  const today = new Date();
  const calendarDaysContainer = document.createElement('div');
  calendarDaysContainer.className = 'calendar-days';
  
  for (let i = 0; i < 30; i++) { // Mostrar los próximos 30 días
   const date = new Date();
   date.setDate(today.getDate() + i);
   
   // No mostrar domingos (0 = Domingo)
   if (date.getDay() === 0) continue;
   
   const dayButton = document.createElement('button');
   dayButton.type = 'button';
   dayButton.className = 'neu-button date-button';
   dayButton.textContent = `${date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}`;
   dayButton.dataset.date = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
   calendarDaysContainer.appendChild(dayButton);
  }
  calendarPlaceholder.appendChild(calendarDaysContainer);
 }
 
 calendarPlaceholder.addEventListener('click', (e) => {
  if (e.target.classList.contains('date-button')) {
   // Resaltar el botón seleccionado
   document.querySelectorAll('.date-button.active').forEach(btn => btn.classList.remove('active'));
   e.target.classList.add('active');
   
   selectedDate = e.target.dataset.date;
   selectedTime = null;
   generateTimeSlots(selectedDate, studyTypeSelect.value);
  }
 });
 
 function generateTimeSlots(date, studyType) {
  timeSlotsPlaceholder.innerHTML = '<p>Seleccione una hora disponible:</p>';
  const duration = studyDurations[studyType] || 20;
  const timeSlotsContainer = document.createElement('div');
  timeSlotsContainer.className = 'time-slots';
  
  let availableSlots = 0;
  
  for (let hour = workHours.start; hour < workHours.end; hour++) {
   for (let minute = 0; minute < 60; minute += duration) {
    const slotTime = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    
    // Omitir horarios del almuerzo
    if (slotTime.getHours() >= workHours.breakStart && slotTime.getHours() < workHours.breakEnd) {
     continue;
    }
    
    // Omitir horarios fuera del rango de trabajo
    const endSlotTime = new Date(slotTime.getTime() + duration * 60000);
    if (endSlotTime.getHours() >= workHours.end && endSlotTime.getMinutes() > 0) {
     if (endSlotTime.getHours() > workHours.end) continue;
    }
    
    // Verificar si la cita ya está reservada
    const isBooked = bookedAppointments.some(booked => {
     const bookedTime = new Date(booked);
     return bookedTime.getTime() === slotTime.getTime();
    });
    
    if (!isBooked) {
     const timeButton = document.createElement('button');
     timeButton.type = 'button';
     timeButton.className = 'neu-button time-button';
     timeButton.textContent = slotTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
     timeButton.dataset.time = slotTime.toTimeString().slice(0, 5); // Formato HH:mm
     timeSlotsContainer.appendChild(timeButton);
     availableSlots++;
    }
   }
  }
  
  if (availableSlots === 0) {
   timeSlotsPlaceholder.innerHTML += '<p>No hay horarios disponibles para este día. Por favor, seleccione otra fecha.</p>';
  } else {
   timeSlotsPlaceholder.appendChild(timeSlotsContainer);
  }
 }
 
 timeSlotsPlaceholder.addEventListener('click', (e) => {
  if (e.target.classList.contains('time-button')) {
   document.querySelectorAll('.time-button.active').forEach(btn => btn.classList.remove('active'));
   e.target.classList.add('active');
   selectedTime = e.target.dataset.time;
  }
 });
 
 
 // --- LÓGICA DE VALIDACIÓN DEL FORMULARIO ---
 
 form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevenir el envío real del formulario
  if (validateForm()) {
   // Si la validación es exitosa
   const formData = new FormData(form);
   const data = Object.fromEntries(formData.entries());
   data.fecha_cita = selectedDate;
   data.hora_cita = selectedTime;
   
   console.log('Formulario enviado con éxito. Datos:', data);
   alert(`¡Cita agendada con éxito!\n\nPaciente: ${data.nombre}\nEstudio: ${data.tipo_estudio}\nFecha: ${selectedDate}\nHora: ${selectedTime}\n\nSe enviará una confirmación a ${data.email}.`);
   
   form.reset();
   calendarPlaceholder.innerHTML = '';
   timeSlotsPlaceholder.innerHTML = '';
  } else {
   console.log('El formulario contiene errores.');
  }
 });
 
 function validateForm() {
  let isValid = true;
  const inputs = form.querySelectorAll('[required]');
  
  // Limpiar errores previos
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  inputs.forEach(input => input.classList.remove('invalid'));
  
  inputs.forEach(input => {
   if (!input.value.trim() && input.type !== 'checkbox') {
    showError(input, 'Este campo es obligatorio.');
    isValid = false;
   }
   
   if (input.type === 'email' && !isValidEmail(input.value)) {
    showError(input, 'Por favor, ingrese un correo electrónico válido.');
    isValid = false;
   }
   
   if (input.type === 'checkbox' && !input.checked) {
    showError(input, 'Debe aceptar esta condición para continuar.');
    isValid = false;
   }
  });
  
  // Validar selección de fecha y hora
  if (!selectedDate || !selectedTime) {
   showError(timeSlotsPlaceholder, 'Por favor, seleccione una fecha y una hora.');
   isValid = false;
  }
  
  return isValid;
 }
 
 function showError(element, message) {
  element.classList.add('invalid');
  const error = document.createElement('span');
  error.className = 'error-message';
  error.textContent = message;
  // Insertar después del elemento o de su padre si es un checkbox
  const parent = element.closest('.checkbox-group') || element.parentElement;
  parent.appendChild(error);
 }
 
 function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
 }
 
 // Añadir un poco de CSS para los mensajes de error
 const style = document.createElement('style');
 style.innerHTML = `
        .error-message {
            color: #D93025;
            font-size: 0.8rem;
            display: block;
            margin-top: 5px;
        }
        .invalid {
            border: 1px solid #D93025 !important;
            box-shadow: var(--neu-inset-shadow), 0 0 0 2px rgba(217, 48, 37, 0.3) !important;
        }
    `;
 document.head.appendChild(style);
});