document.addEventListener('DOMContentLoaded', () => {
    // 0a. Phone Validation Constraints
    const ptPhone = document.getElementById('ptPhone');

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

        // State trackers (Default to minDate so preferred date is never empty)
        let activeMonth = minDate.getMonth();
        let activeYear = minDate.getFullYear();
        let selectedDate = minDate;
        let pendingSelectedDate = null;

        // Auto-set initial default date in hidden field and display text
        ptDateHidden.value = formatDateYYYYMMDD(selectedDate);
        const initialDateText = document.getElementById('ptDateText');
        if (initialDateText) {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            initialDateText.textContent = selectedDate.toLocaleDateString('en-US', options);
            ptDateInput.style.color = 'var(--dark)';
        }

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
            datePickerModal.classList.add('active');
            
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
            datePickerModal.classList.remove('active');
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

            datePickerModal.classList.remove('active');
        });

        // Close when clicking modal backdrop
        datePickerModal.addEventListener('click', (e) => {
            if (e.target === datePickerModal) {
                datePickerModal.classList.remove('active');
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
    });    // 3. Dynamic Flashcards Toggle (Clean Touch & Click Handler - Zero Lag)
    const flashcards = document.querySelectorAll('.panel-card');

    flashcards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            card.classList.toggle('flipped');
        });
    });

    // 4. Form Submission & Client-Side Validation (Native FormSubmit with Success Modal)
    // 4. Form Submission & Client-Side Validation
const form = document.querySelector('.appointment-form');
const successModal = document.getElementById('appointmentSuccessModal');
const closeSuccessBtn = document.getElementById('closeSuccessModalBtn');

if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameElem = document.getElementById('ptName');
        const phoneElem = document.getElementById('ptPhone');
        const docElem = document.getElementById('ptDoc');
        const dateElem = document.getElementById('ptDate');
        const ptDateText = document.getElementById('ptDateText');

        const name = nameElem ? nameElem.value.trim() : '';
        const phone = phoneElem ? phoneElem.value.trim() : '';
        const doc = docElem ? docElem.value : '';
        let dateVal = dateElem ? dateElem.value.trim() : '';

        if (!name) {
            alert('Please enter your Full Name.');
            if (nameElem) nameElem.focus();
            return;
        }

        if (!phone || phone.length !== 10) {
            alert('Please enter a valid 10-digit Mobile Phone Number.');
            if (phoneElem) phoneElem.focus();
            return;
        }

        if (!dateVal) {
            const today = new Date();
            dateVal =
                today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0');

            if (dateElem) {
                dateElem.value = dateVal;
            }
        }

        const submitBtn = form.querySelector('button[type="submit"]');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';
        }

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch(
                'https://formsubmit.co/ajax/sarlamemorialmaternityhome@gmail.com',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error('Form submission failed');
            }

            const succName = document.getElementById('succName');
            const succPhone = document.getElementById('succPhone');
            const succDoc = document.getElementById('succDoc');
            const succDate = document.getElementById('succDate');

            if (succName) succName.textContent = name;
            if (succPhone) succPhone.textContent = phone;
            if (succDoc) succDoc.textContent = doc;
            if (succDate) {
                succDate.textContent = ptDateText
                    ? ptDateText.textContent
                    : dateVal;
            }

            if (successModal) {
                successModal.style.display = 'flex';
            }

            form.reset();

        } catch (error) {
            console.error('Appointment submission error:', error);

            alert(
                'Unable to submit the appointment request. ' +
                'Please try again or call us directly.'
            );

        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Appointment Request';
                submitBtn.style.opacity = '1';
            }
        }
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
