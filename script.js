document.addEventListener('DOMContentLoaded', () => {
    // 0a. Name and Phone Validation Constraints
    const ptName = document.getElementById('ptName');
    const ptPhone = document.getElementById('ptPhone');

    if (ptName) {
        ptName.addEventListener('input', (e) => {
            // Keep only alphabet characters and spaces
            e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
        });
    }

    if (ptPhone) {
        ptPhone.addEventListener('input', (e) => {
            // Keep only digits and limit to 10 characters
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    // 0b. Material Design Date Picker Modal Logic
    const ptDateInput = document.getElementById('ptDateInput');
    const ptDateHidden = document.getElementById('ptDate');
    const datePickerModal = document.getElementById('materialDatePickerModal');
    const datepickerHeaderTitle = document.getElementById('datepickerHeaderTitle');
    const datepickerCurrentMonth = document.getElementById('datepickerCurrentMonth');
    const datepickerPrevBtn = document.getElementById('datepickerPrevBtn');
    const datepickerNextBtn = document.getElementById('datepickerNextBtn');
    const datepickerDays = document.getElementById('datepickerDays');
    const datepickerCancelBtn = document.getElementById('datepickerCancelBtn');
    const datepickerOkBtn = document.getElementById('datepickerOkBtn');

    if (ptDateInput && ptDateHidden && datePickerModal) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Calculate min date bounds
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // 1:00 PM local time cut-off
        if (currentHour > 13 || (currentHour === 13 && currentMinute > 0)) {
            now.setDate(now.getDate() + 1);
        }

        const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Calculate max date bounds (exactly 2 months)
        const maxDate = new Date(minDate);
        maxDate.setMonth(maxDate.getMonth() + 2);

        // State trackers
        let activeMonth = minDate.getMonth();
        let activeYear = minDate.getFullYear();
        let selectedDate = null;
        let pendingSelectedDate = null;

        // Format dates helper
        function formatDateYYYYMMDD(date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        // Format date helper for the header (e.g. "Mon, Nov 17")
        function formatHeaderDate(date) {
            const dayName = dayNamesShort[date.getDay()];
            const monthNameShort = monthNames[date.getMonth()].substring(0, 3);
            const dayNum = date.getDate();
            return `${dayName}, ${monthNameShort} ${dayNum}`;
        }

        // Render Calendar Days
        function renderCalendar() {
            // Set header month name
            datepickerCurrentMonth.textContent = monthNames[activeMonth];

            // Disable/enable Month navigation buttons
            if (activeMonth === minDate.getMonth() && activeYear === minDate.getFullYear()) {
                datepickerPrevBtn.disabled = true;
            } else {
                datepickerPrevBtn.disabled = false;
            }

            if (activeMonth === maxDate.getMonth() && activeYear === maxDate.getFullYear()) {
                datepickerNextBtn.disabled = true;
            } else {
                datepickerNextBtn.disabled = false;
            }

            // Clear days grid
            datepickerDays.innerHTML = '';

            // Calculate starting weekday offset
            const startDayIndex = new Date(activeYear, activeMonth, 1).getDay();

            // Calculate number of days in the current month
            const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();

            // Render empty cells for padding
            for (let i = 0; i < startDayIndex; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'datepicker-day-cell disabled';
                datepickerDays.appendChild(emptyCell);
            }

            // Render selectable days
            for (let day = 1; day <= daysInMonth; day++) {
                const cellDate = new Date(activeYear, activeMonth, day);
                const cell = document.createElement('div');
                cell.className = 'datepicker-day-cell';
                cell.textContent = day;

                // Validate boundaries
                const isPastMin = cellDate < minDate;
                const isPostMax = cellDate > maxDate;

                if (isPastMin || isPostMax) {
                    cell.classList.add('disabled');
                } else {
                    // Click listener for day cell
                    cell.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pendingSelectedDate = cellDate;
                        datepickerHeaderTitle.textContent = formatHeaderDate(cellDate);
                        datepickerOkBtn.disabled = false;
                        renderCalendar();
                    });
                }

                // Check today highlight
                const isToday = cellDate.getDate() === now.getDate() && 
                                cellDate.getMonth() === now.getMonth() && 
                                cellDate.getFullYear() === now.getFullYear();
                if (isToday) {
                    cell.classList.add('today');
                }

                // Check selected day highlight
                const checkTarget = pendingSelectedDate || selectedDate;
                if (checkTarget && 
                    cellDate.getDate() === checkTarget.getDate() && 
                    cellDate.getMonth() === checkTarget.getMonth() && 
                    cellDate.getFullYear() === checkTarget.getFullYear()) {
                    cell.classList.add('selected');
                }

                datepickerDays.appendChild(cell);
            }
        }

        // Open Modal
        ptDateInput.addEventListener('click', (e) => {
            e.stopPropagation();
            datePickerModal.style.display = 'flex';
            
            pendingSelectedDate = selectedDate;
            const targetDate = selectedDate || minDate;
            activeMonth = targetDate.getMonth();
            activeYear = targetDate.getFullYear();

            if (pendingSelectedDate) {
                datepickerHeaderTitle.textContent = formatHeaderDate(pendingSelectedDate);
                datepickerOkBtn.disabled = false;
            } else {
                datepickerHeaderTitle.textContent = 'Select Date';
                datepickerOkBtn.disabled = true;
            }

            renderCalendar();
        });

        // Prev Month navigation
        datepickerPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeMonth === 0) {
                activeMonth = 11;
                activeYear--;
            } else {
                activeMonth--;
            }
            renderCalendar();
        });

        // Next Month navigation
        datepickerNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeMonth === 11) {
                activeMonth = 0;
                activeYear++;
            } else {
                activeMonth++;
            }
            renderCalendar();
        });

        // Cancel Selection
        datepickerCancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            datePickerModal.style.display = 'none';
            pendingSelectedDate = null;
        });

        // OK / Confirm Selection
        datepickerOkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!pendingSelectedDate) return;

            selectedDate = pendingSelectedDate;
            ptDateHidden.value = formatDateYYYYMMDD(selectedDate);
            
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            const ptDateText = document.getElementById('ptDateText');
            if (ptDateText) {
                ptDateText.textContent = selectedDate.toLocaleDateString('en-US', options);
                ptDateInput.style.color = 'var(--dark)';
            }

            datePickerModal.style.display = 'none';
        });

        // Close when clicking modal backdrop
        datePickerModal.addEventListener('click', (e) => {
            if (e.target === datePickerModal) {
                datePickerModal.style.display = 'none';
                pendingSelectedDate = null;
            }
        });
    }

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
