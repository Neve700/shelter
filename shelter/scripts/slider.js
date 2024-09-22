import petsData from "./pets_data.js";

const width = () => window.innerWidth; // Возвращаем текущее значение ширины окна

const slidesPerPage = () => {
    const currentWidth = width(); // Получаем текущее значение ширины
    return currentWidth >= 1080 ? 3 : currentWidth >= 768 ? 2 : 1; // Определяем количество слайдов
};

let maxVisibleSlides = slidesPerPage();

const updateMaxVisibleSlides = () => {
    const newMaxVisibleSlides = slidesPerPage(); // Пересчитываем количество слайдов
    if (newMaxVisibleSlides !== maxVisibleSlides) {
        maxVisibleSlides = newMaxVisibleSlides; // Обновляем количество слайдов
        currentSet = getNextSet(); // Получаем новый набор карточек
        updateCarousel(); // Обновляем слайдер
    }
};

// Инициализация
updateMaxVisibleSlides();

// Обработчик события изменения размера окна
window.addEventListener('resize', updateMaxVisibleSlides);

let currentIndex = 0;
let previousSet = []; // Массив для хранения предыдущего набора карточек
let currentSet = []; // Массив для хранения текущего набора карточек

// Функция для перемешивания массива
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Функция для получения следующего набора карточек
const getNextSet = () => {
    shuffle(petsData);
    
    // Получаем новый набор карточек, исключая предыдущий набор
    const newSet = petsData.filter(pet => !previousSet.includes(pet.name)).slice(0, maxVisibleSlides);
    
    // Если не хватает карточек, сбрасываем предыдущий набор
    if (newSet.length < maxVisibleSlides) {
        previousSet = [];
        return getNextSet(); // Рекурсивно вызываем, чтобы получить новый набор
    }
    
    // Обновляем предыдущий набор
    previousSet = currentSet;
    currentSet = newSet;
    
    return newSet;
}

// Функция для создания слайда
const createSlide = (pet) => {
    const slide = document.createElement('span');
    slide.classList.add('slide');
    slide.innerHTML = `
        <div class="pets__card">
            <img src="${pet.img}" alt="${pet.name}">
            <div class="pets__card-info">
                <h4>${pet.name}</h4>
                <button>Learn more</button>
            </div>
        </div>
    `;
    return slide;
}

// Функция для обновления слайдера
const updateCarousel = () => {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Очищаем текущие слайды
    currentSet.forEach(pet => {
        const newSlide = createSlide(pet);
        carousel.appendChild(newSlide);
    });
}

// Обработчик события для кнопки "влево"
document.getElementById('arrow-left').addEventListener('click', () => {
    currentSet = getNextSet(); // Получаем новый набор карточек
    updateCarousel(); // Обновляем слайдер
});

// Обработчик события для кнопки "вправо"
document.getElementById('arrow-right').addEventListener('click', () => {
    currentSet = getNextSet();
    updateCarousel(); 
});

// Поддержка свайпа
let startX = 0;
let endX = 0;

const carouselWrapper = document.getElementById('carousel-wrapper');

carouselWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // Запоминаем начальную позицию касания
});

carouselWrapper.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX; // Запоминаем конечную позицию касания
});

carouselWrapper.addEventListener('touchend', () => {
    if (startX > endX + 50) {
        // Свайп влево
        currentSet = getNextSet();
        updateCarousel();
    } else if (startX < endX - 50) {
        // Свайп вправо
        currentSet = getNextSet();
        updateCarousel();
    }
});

// Инициализация слайдера
const initCarousel = () => {
    currentSet = getNextSet(); 
    updateCarousel(); 
}

initCarousel();

/* slide.addEventListener('click', () => {
    window.location.href = `pets.html?petIndex=${index}`;
});

import { petsData } from './pets.js'; // Импортируем данные о питомцах

// Функция для получения параметров URL
const getUrlParams = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
};

// Получаем индекс питомца из параметров URL
const petIndex = getUrlParams('petIndex');
if (petIndex !== null) {
    const pet = petsData[petIndex];
    if (pet) {
        // Здесь вы можете отобразить информацию о питомце на странице
        const petInfoContainer = document.querySelector('.pet-info');
        petInfoContainer.innerHTML = `
            <div class="popup__img">
            <img src="${pet.img}" alt="${pet.name}">
            </div>
            <div class="popup__info">
            <h3>${pet.name}</h3>
            <h4>${pet.type} — ${pet.breed}</h4>
            <p>${pet.description}</p>
            <ul>
                <li><b>Age:</b> ${pet.age}</li>
                <li><b>Inoculations:</b> ${pet.inoculations}</li>
                <li><b>Diseases:</b> ${pet.diseases}</li>
                <li><b>Parasites:</b> ${pet.parasites}</li>
            </ul>
            </div>
        `;
    } else {
        console.error('Питомец не найден');
    }
} else {
    console.error('Не указан индекс питомца в параметрах URL');
}

*/