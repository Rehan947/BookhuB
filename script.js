// script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    // Toggle Sidebar Function
    const toggleMenu = (action) => {
        if (action === 'open') {
            sidebar.classList.add('active');
            body.classList.add('menu-open'); // Prevent background scroll
        } else {
            sidebar.classList.remove('active');
            body.classList.remove('menu-open'); // Restore background scroll
        }
    };

    // Event Listeners for Mobile Menu
    if (menuBtn && sidebar && closeMenuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu('open');
        });

        closeMenuBtn.addEventListener('click', () => {
            toggleMenu('close');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== menuBtn) {
                toggleMenu('close');
            }
        });
    }

    // Interactive Ball Logic
    const redBall = document.getElementById('redBall');
    const overlay = document.getElementById('overlay');
    
    if (redBall && overlay) {
        redBall.addEventListener('click', function() {
            this.classList.add('active');
            overlay.classList.add('show');
            
            const msgDiv = this.querySelector('.msg');
            if (msgDiv) {
                // Read message from data attribute for clean HTML
                msgDiv.textContent = this.getAttribute('data-msg');
            }
        });

        const closeBall = () => {
            redBall.classList.remove('active');
            overlay.classList.remove('show');
        };

        // Close ball on overlay click
        overlay.addEventListener('click', closeBall);

        // Close ball on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeBall();
        });
    }
});