// JavaScript para la Hoja de Vida de Yeison Chacon

document.addEventListener('DOMContentLoaded', function() {
    
    // =====================
    // Función de Toast Notification
    // =====================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.style.background = type === 'success' ? '#28a745' : '#dc3545';
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // =====================
    // Manejo de Foto de Perfil
    // =====================
    const photoInput = document.getElementById('photo-input');
    const profilePreview = document.getElementById('profile-preview');
    
    photoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                showToast('Por favor selecciona un archivo de imagen válido.', 'error');
                return;
            }
            
            // Validar tamaño máximo (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('La imagen no debe exceder 5MB.', 'error');
                return;
            }
            
            // Crear URL para previsualizar
            const imageURL = URL.createObjectURL(file);
            profilePreview.src = imageURL;
            
            // Guardar en localStorage para persistencia
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('cv_profile_photo', e.target.result);
            };
            reader.readAsDataURL(file);
            
            showToast('Foto de perfil actualizada');
        }
    });
    
    // Cargar foto guardada si existe
    const savedPhoto = localStorage.getItem('cv_profile_photo');
    if (savedPhoto) {
        profilePreview.src = savedPhoto;
    }
    
    // =====================
    // Manejo de Diploma PDF
    // =====================
    const diplomaInput = document.getElementById('diploma-input');
    const diplomaPreview = document.getElementById('diploma-preview');
    const diplomaInfo = document.getElementById('diploma-info');
    const diplomaName = document.getElementById('diploma-name');
    const diplomaViewer = document.getElementById('diploma-viewer');
    const pdfFrame = document.getElementById('pdf-frame');
    const removeDiplomaBtn = document.getElementById('remove-diploma');
    
    diplomaInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Validar que sea PDF
            if (file.type !== 'application/pdf') {
                showToast('Por favor selecciona un archivo PDF válido.', 'error');
                return;
            }
            
            // Validar tamaño máximo (10MB)
            if (file.size > 10 * 1024 * 1024) {
                showToast('El PDF no debe exceder 10MB.', 'error');
                return;
            }
            
            // Mostrar información del archivo
            const fileName = file.name;
            diplomaName.textContent = fileName;
            diplomaPreview.style.display = 'none';
            diplomaInfo.style.display = 'flex';
            
            // Crear visor de PDF
            const pdfURL = URL.createObjectURL(file);
            pdfFrame.src = pdfURL;
            diplomaViewer.style.display = 'block';
            
            // Guardar en localStorage (base64)
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('cv_diploma_pdf', e.target.result);
                localStorage.setItem('cv_diploma_name', fileName);
            };
            reader.readAsDataURL(file);
            
            showToast('Diploma cargado correctamente');
        }
    });
    
    // Eliminar diploma
    removeDiplomaBtn.addEventListener('click', function() {
        // Limpiar vista previa
        diplomaInput.value = '';
        diplomaPreview.style.display = 'block';
        diplomaInfo.style.display = 'none';
        diplomaViewer.style.display = 'none';
        pdfFrame.src = '';
        
        // Limpiar localStorage
        localStorage.removeItem('cv_diploma_pdf');
        localStorage.removeItem('cv_diploma_name');
        
        showToast('Diploma eliminado');
    });
    
    // Cargar diploma guardado si existe
    const savedDiploma = localStorage.getItem('cv_diploma_pdf');
    const savedDiplomaName = localStorage.getItem('cv_diploma_name');
    
    if (savedDiploma && savedDiplomaName) {
        diplomaName.textContent = savedDiplomaName;
        diplomaPreview.style.display = 'none';
        diplomaInfo.style.display = 'flex';
        
        pdfFrame.src = savedDiploma;
        diplomaViewer.style.display = 'block';
    }
    
    // =====================
    // Funcionalidad de Copiar
    // =====================
    
    // Botones de copiar correo
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Correo copiado al portapapeles');
            }).catch(err => {
                showToast('Error al copiar', 'error');
            });
        });
    });
    
    // Botón de copiar experiencia
    const copyExperienceBtn = document.querySelector('.copy-experience');
    if (copyExperienceBtn) {
        copyExperienceBtn.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Experiencia copiada al portapapeles');
            }).catch(err => {
                showToast('Error al copiar', 'error');
            });
        });
    }
    
    // =====================
    // Botón de Imprimir CV
    // =====================
    const printBtn = document.getElementById('print-cv');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // =====================
    // Botón de Compartir CV
    // =====================
    const shareBtn = document.getElementById('share-cv');
    if (shareBtn) {
        shareBtn.addEventListener('click', async function() {
            const shareData = {
                title: 'Hoja de Vida - Yeison Chacon',
                text: 'Consulta la hoja de vida de Yeison Chacon',
                url: window.location.href
            };
            
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    showToast('Compartido correctamente');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        // Fallback: copiar URL
                        navigator.clipboard.writeText(window.location.href);
                        showToast('URL copiada al portapapeles');
                    }
                }
            } else {
                // Fallback para navegadores sin Web Share API
                navigator.clipboard.writeText(window.location.href);
                showToast('URL copiada al portapapeles');
            }
        });
    }
    
    // =====================
    // Botón de Compartir Experiencia
    // =====================
    const shareExpBtn = document.querySelector('.exp-btn:first-child');
    if (shareExpBtn) {
        shareExpBtn.addEventListener('click', async function() {
            const experienceText = document.querySelector('.experience-content p').textContent;
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Experiencia - Yeison Chacon',
                        text: experienceText
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        navigator.clipboard.writeText(experienceText);
                        showToast('Texto copiado al portapapeles');
                    }
                }
            } else {
                navigator.clipboard.writeText(experienceText);
                showToast('Texto copiado al portapapeles');
            }
        });
    }
    
    // =====================
    // Botón de Descargar Plantilla
    // =====================
    const downloadTemplateBtn = document.getElementById('download-template');
    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', function() {
            showToast('Función de descarga de plantilla');
            // Aquí puedes agregar la funcionalidad de descarga de plantilla
        });
    }
    
    // =====================
    // Efectos Visuales Adicionales
    // =====================
    
    // Efecto de hover en las secciones
    const sections = document.querySelectorAll('.cv-section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Animación de entrada suave
    setTimeout(() => {
        sections.forEach((section, index) => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 100);
    
    // =====================
    // Validación de Teléfono
    // =====================
    const phoneLink = document.querySelector('.info-value a[href^="tel:"]');
    if (phoneLink) {
        phoneLink.addEventListener('click', function(e) {
            console.log('Llamando al número: ' + this.textContent);
            showToast('Iniciando llamada...');
        });
    }
    
    // =====================
    // Validación de Correo
    // =====================
    const emailLink = document.querySelector('.info-value a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            console.log('Abriendo correo: ' + this.textContent);
            showToast('Abriendo cliente de correo...');
        });
    }
    
    // =====================
    // Enlaces de WhatsApp
    // =====================
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Abriendo WhatsApp');
        });
    });
    
    // =====================
    // Smooth Scroll para enlaces internos
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // =====================
    // Efecto de escribir en consola
    // =====================
    console.log('%c🎨 Hoja de Vida - Yeison Chacon', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c✓ Todos los scripts cargados correctamente', 'color: #28a745;');
    console.log('%c📱 Funciones disponibles:', 'color: #764ba2; font-weight: bold;');
    console.log('  • Cargar foto de perfil');
    console.log('  • Cargar diploma PDF');
    console.log('  • Copiar información');
    console.log('  • Imprimir CV');
    console.log('  • Compartir CV');
});

