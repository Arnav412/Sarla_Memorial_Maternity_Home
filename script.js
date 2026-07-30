document.addEventListener('DOMContentLoaded', () => {
    // 1. Floating Contact Widget Interactivity
    const floatingContact = document.querySelector('.floating-contact');
    const floatingTrigger = document.querySelector('.floating-trigger');

    if (floatingTrigger && floatingContact) {
        floatingTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingContact.classList.toggle('active');
        });

        // Close floating menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!floatingContact.contains(e.target)) {
                floatingContact.classList.remove('active');
            }
        });
    }

    // 2. Clipboard Copy Functionality
    const copyButtons = document.querySelectorAll('.num-btn-copy');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const numberItem = btn.closest('.floating-number-item') || btn.closest('.footer-contact');
            let numberText = '';
            
            if (numberItem) {
                const valElem = numberItem.querySelector('.number-val');
                numberText = valElem ? valElem.textContent.trim() : '';
            }
            
            if (numberText) {
                navigator.clipboard.writeText(numberText).then(() => {
                    // Show a brief success checkmark
                    const origHtml = btn.innerHTML;
                    btn.innerHTML = '✓';
                    btn.style.backgroundColor = '#0f766e';
                    btn.style.color = '#ffffff';
                    
                    setTimeout(() => {
                        btn.innerHTML = origHtml;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });

    // 3. Dynamic Flashcards Toggle (for Aashnaa Oncology grid)
    const flashcards = document.querySelectorAll('.panel-card');
    flashcards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return;
            card.classList.toggle('flipped');
        });
    });

    // 4. Form Submission & Custom Notification (Formspree Integration)
    const form = document.querySelector('.appointment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values for validation
            const name = document.getElementById('ptName').value;
            const phone = document.getElementById('ptPhone').value;
            const doc = document.getElementById('ptDoc').value;
            const date = document.getElementById('ptDate').value;
            const msg = document.getElementById('ptMessage').value;
            
            if (!name || !phone || !date) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // Set Loading State
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting Request...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Submit via Fetch to Formspree
            const formData = new FormData();
            formData.append('Patient Name', name);
            formData.append('Phone Number', phone);
            formData.append('Requested Specialist', doc);
            formData.append('Preferred Date', date);
            formData.append('Special Notes', msg);

            fetch('https://formsubmit.co/ajax/sarlamemorialmaternityhome99@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';

                if (response.ok) {
                    // Create booking success toast notification
                    const toast = document.createElement('div');
                    toast.style.position = 'fixed';
                    toast.style.bottom = '100px';
                    toast.style.right = '30px';
                    toast.style.backgroundColor = '#0f766e';
                    toast.style.color = '#ffffff';
                    toast.style.padding = '1rem 2rem';
                    toast.style.borderRadius = '12px';
                    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    toast.style.zIndex = '10000';
                    toast.style.fontFamily = 'Outfit, sans-serif';
                    toast.style.transform = 'translateY(100px)';
                    toast.style.opacity = '0';
                    toast.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    toast.innerHTML = `<strong>Booking Requested!</strong><br>Appointment requested with ${doc}. We will contact you soon at ${phone}.<br><span style="font-size:0.8rem;opacity:0.8;">Note: If this is the first submission, check your mail to verify the form.</span>`;
                    
                    document.body.appendChild(toast);
                    
                    // Trigger animation
                    setTimeout(() => {
                        toast.style.transform = 'translateY(0)';
                        toast.style.opacity = '1';
                    }, 100);
                    
                    // Reset form
                    form.reset();
                    
                    // Remove Toast
                    setTimeout(() => {
                        toast.style.transform = 'translateY(100px)';
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            toast.remove();
                        }, 500);
                    }, 6000);
                } else {
                    alert('Submission failed. Please try again or call us directly.');
                }
            })
            .catch(err => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                console.error('Error submitting form:', err);
                alert('Submission failed due to a network error. Please call us directly.');
            });
        });
    }

    // 5. Mobile Navigation Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#ffffff';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '1.5rem';
                navLinks.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                navLinks.style.gap = '1rem';
                navLinks.style.alignItems = 'flex-start';
            } else {
                navLinks.removeAttribute('style');
            }
        });
    }
});
