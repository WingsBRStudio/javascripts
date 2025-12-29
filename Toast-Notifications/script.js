function showToast(type) {
    const container = document.getElementById('notificationContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<i class="fas fa-check"></i>',
        error: '<i class="fas fa-times"></i>',
        warning: '<i class="fas fa-exclamation"></i>',
        info: '<i class="fas fa-info"></i>'
    };

    const titles = {
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning!',
        info: 'Information'
    };

    const messages = {
        success: 'Your action was completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'This action requires your attention.',
        info: 'Here is some information for you.'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${messages[type]}</div>
        </div>
        <button class="close-btn" onclick="removeToast(this.parentElement)">×</button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            removeToast(toast);
        }
    }, 5000);
}

function removeToast(toast) {
    toast.style.animation = 'slideOut 0.5s forwards';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 500);
}