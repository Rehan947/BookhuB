// ==========================================
// SMOOTH FAQ ACCORDION LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const faqButtons = document.querySelectorAll('.faq-question');

    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other open items gracefully
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current clicked item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// ==========================================
// SILENT SECURITY PROTOCOL
// ==========================================
// Disabling right-click and dev tools silently. 
// No alerts - blocking is handled instantly in the background.

// Block Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

// Block Dev Tools Shortcuts
document.onkeydown = function(e) {
    // Block F12
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    // Block Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { // 'I'
        e.preventDefault();
        return false;
    }
    // Block Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) { // 'C'
        e.preventDefault();
        return false;
    }
    // Block Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { // 'J'
        e.preventDefault();
        return false;
    }
    // Block Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) { // 'U'
        e.preventDefault();
        return false;
    }
};