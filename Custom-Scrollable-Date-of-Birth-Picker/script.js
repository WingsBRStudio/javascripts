class DatePicker {
    constructor() {
        this.dateInput = document.getElementById('dateInput');
        this.pickerModal = document.getElementById('pickerModal');
        this.selectedDate = document.getElementById('selectedDate');
        
        // Wheel elements
        this.dayColumn = document.getElementById('dayColumn');
        this.monthColumn = document.getElementById('monthColumn');
        this.yearColumn = document.getElementById('yearColumn');
        
        this.selectedDay = 1;
        this.selectedMonth = 1;
        this.selectedYear = 2000;
        
        this.itemHeight = 40;
        
        this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateWheels();
        this.setupClickListeners();
        this.scrollToSelected();
        this.updateSelectedDate();
    }
    
    setupEventListeners() {
        this.dateInput.addEventListener('click', () => this.openPicker());
        
        document.getElementById('closeBtn').addEventListener('click', () => this.closePicker());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closePicker());
        document.getElementById('confirmBtn').addEventListener('click', () => this.confirmSelection());
        
        this.pickerModal.addEventListener('click', (e) => {
            if (e.target === this.pickerModal) {
                this.closePicker();
            }
        });
        
        // Wheel scroll listeners
        this.setupWheelListeners();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.pickerModal.classList.contains('active')) return;
            if (e.key === 'Escape') this.closePicker();
            if (e.key === 'Enter') this.confirmSelection();
        });
    }
    
    setupWheelListeners() {
        [this.dayColumn, this.monthColumn, this.yearColumn].forEach((wheel, index) => {
            wheel.addEventListener('scroll', () => {
                const items = wheel.querySelectorAll('.wheel-item');
                const scrollTop = wheel.scrollTop;
                const centerIndex = Math.round(scrollTop / this.itemHeight);
                
                items.forEach((item, i) => {
                    item.classList.toggle('selected', i === centerIndex);
                });
                
                if (items[centerIndex]) {
                    const value = parseInt(items[centerIndex].dataset.value);
                    switch(index) {
                        case 0: this.selectedDay = value; break;
                        case 1: this.selectedMonth = value; break;
                        case 2: this.selectedYear = value; break;
                    }
                    this.updateSelectedDate();
                }
            });
        });
    }
    
    setupClickListeners() {
        [this.dayColumn, this.monthColumn, this.yearColumn].forEach(column => {
            column.addEventListener('click', (e) => {
                if (e.target.classList.contains('wheel-item')) {
                    const value = parseInt(e.target.dataset.value);
                    const type = column.id.replace('Column', '');
                    
                    // Update selection
                    this.updateSelection(type, value);
                    
                    // Calculate scroll position to center the item
                    const itemIndex = Array.from(column.querySelectorAll('.wheel-item')).indexOf(e.target);
                    const targetScroll = itemIndex * this.itemHeight;
                    
                    column.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    updateSelection(type, value) {
        switch(type) {
            case 'day':
                this.selectedDay = value;
                break;
            case 'month':
                this.selectedMonth = value;
                break;
            case 'year':
                this.selectedYear = value;
                break;
        }
        this.updateSelectedDate();
    }
    
    populateWheels() {
        // Add padding for centering
        const padding = document.createElement('div');
        padding.style.height = '80px';
        
        // Populate day wheel
        this.dayColumn.innerHTML = '';
        this.dayColumn.appendChild(padding.cloneNode());
        for (let i = 1; i <= 31; i++) {
            const item = document.createElement('div');
            item.className = 'wheel-item';
            item.textContent = i.toString().padStart(2, '0');
            item.dataset.value = i;
            this.dayColumn.appendChild(item);
        }
        this.dayColumn.appendChild(padding.cloneNode());
        
        // Populate month wheel
        this.monthColumn.innerHTML = '';
        this.monthColumn.appendChild(padding.cloneNode());
        this.months.forEach((month, index) => {
            const item = document.createElement('div');
            item.className = 'wheel-item';
            item.textContent = month;
            item.dataset.value = index + 1;
            this.monthColumn.appendChild(item);
        });
        this.monthColumn.appendChild(padding.cloneNode());
        
        // Populate year wheel
        this.yearColumn.innerHTML = '';
        this.yearColumn.appendChild(padding.cloneNode());
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1900; i--) {
            const item = document.createElement('div');
            item.className = 'wheel-item';
            item.textContent = i;
            item.dataset.value = i;
            this.yearColumn.appendChild(item);
        }
        this.yearColumn.appendChild(padding.cloneNode());
    }
    
    scrollToSelected() {
        setTimeout(() => {
            const dayItems = this.dayColumn.querySelectorAll('.wheel-item');
            const monthItems = this.monthColumn.querySelectorAll('.wheel-item');
            const yearItems = this.yearColumn.querySelectorAll('.wheel-item');
            
            const dayIndex = Array.from(dayItems).findIndex(item => 
                parseInt(item.dataset.value) === this.selectedDay
            );
            const monthIndex = Array.from(monthItems).findIndex(item => 
                parseInt(item.dataset.value) === this.selectedMonth
            );
            const yearIndex = Array.from(yearItems).findIndex(item => 
                parseInt(item.dataset.value) === this.selectedYear
            );
            
            if (dayIndex >= 0) {
                this.dayColumn.scrollTop = dayIndex * this.itemHeight;
                dayItems[dayIndex].classList.add('selected');
            }
            if (monthIndex >= 0) {
                this.monthColumn.scrollTop = monthIndex * this.itemHeight;
                monthItems[monthIndex].classList.add('selected');
            }
            if (yearIndex >= 0) {
                this.yearColumn.scrollTop = yearIndex * this.itemHeight;
                yearItems[yearIndex].classList.add('selected');
            }
        }, 100);
    }
    
    updateSelectedDate() {
        const monthName = this.months[this.selectedMonth - 1];
        this.selectedDate.textContent = `${monthName} ${this.selectedDay}, ${this.selectedYear}`;
    }
    
    openPicker() {
        this.pickerModal.classList.add('active');
        this.scrollToSelected();
    }
    
    closePicker() {
        this.pickerModal.classList.remove('active');
    }
    
    confirmSelection() {
        // Validate date
        const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
        if (this.selectedDay > daysInMonth) {
            this.selectedDay = daysInMonth;
        }
        
        // Format date
        const monthName = this.months[this.selectedMonth - 1];
        const formattedDate = `${monthName} ${this.selectedDay}, ${this.selectedYear}`;
        this.dateInput.value = formattedDate;
        
        this.closePicker();
    }
}

// Initialize the date picker
const datePicker = new DatePicker();