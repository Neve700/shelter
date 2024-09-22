const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');
const overlayWrapper = document.querySelector('body');

const openMenu = () => {
    offScreenMenu.style.display = 'flex';
    offScreenMenu.classList.add('active');
    hamMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlayWrapper.appendChild(overlay);
}

const closeMenu = () => {
    offScreenMenu.classList.remove('active');
    hamMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    const overlay = overlayWrapper.querySelector('.overlay');
    if (overlay) {
        overlayWrapper.removeChild(overlay);
    }

    setTimeout(() => {
        offScreenMenu.style.display = 'none';
    }, 200);
}

hamMenu.addEventListener('click', () => {
    const isActive = offScreenMenu.classList.contains('active');

    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
});

document.addEventListener('click', (e) => {
    // Проверяем, был ли клик вне меню и бургер-меню
    if (!offScreenMenu.contains(e.target) && !hamMenu.contains(e.target) && offScreenMenu.classList.contains('active') || e.target === offScreenMenu){
        closeMenu();
    }
});
