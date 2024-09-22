import petsData from "./pets_data.js";

const width = () => window.innerWidth; // Возвращаем текущее значение ширины окна

//Регулируем количество карточек на странице взависимости от разрешения
const slidesPerPage = () => {
  const currentWidth = width();
  const breakpoints = [
      { width: 1100, slides: 8 },
      { width: 1080, slides: 6 },
      { width: 480, slides: 4 },
      { width: 320, slides: 3 }
  ];
  
  return breakpoints.find(bp => currentWidth >= bp.width).slides;
};


let maxVisibleSlides = slidesPerPage();

const updateMaxVisibleSlides = () => {
    const newMaxVisibleSlides = slidesPerPage(); // Пересчитываем количество слайдов
    if (newMaxVisibleSlides !== maxVisibleSlides) {
        maxVisibleSlides = newMaxVisibleSlides; // Обновляем количество слайдов
        currentSet = getNextSet(); // Получаем новый набор карточек
        updateCards(); // Обновляем слайдер
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
  
  let newSet;
  const maxAttempts = 10; // Максимальное количество попыток
  let attempts = 0;

  while (attempts < maxAttempts) {
      // Получаем новый набор карточек, исключая предыдущий набор
      newSet = petsData.filter(pet => !previousSet.includes(pet.name)).slice(0, maxVisibleSlides);
      
      // Если новый набор достаточен, выходим из цикла
      if (newSet.length >= maxVisibleSlides) {
          break;
      }
      
      // Если не хватает карточек, сбрасываем предыдущий набор
      previousSet = [];
      attempts++;
  }
  
  // Если не удалось получить достаточный набор, можно вернуть предыдущий набор или пустой массив
  if (newSet.length < maxVisibleSlides) {
      console.warn("Не удалось получить достаточное количество карточек.");
      return []; // Или return previousSet; если хотите вернуть предыдущий набор
  }

  // Обновляем предыдущий набор
  previousSet = currentSet;
  currentSet = newSet;
  
  return newSet;
}

// Функция для создания слайда
const createCard = (pet) => {
  const card = document.createElement('div');
  card.classList.add('pets__card');
  card.innerHTML = `
    <img src="${pet.img}" alt="${pet.name}">
    <div class="pets__card-info">
      <h4>${pet.name}</h4>
      <button>Learn more</button>
    </div>
  `;

  // Добавляем обработчик события на карточку
  card.addEventListener('click', () => {
    openPopup(pet); // Передаем объект питомца в openPopup
  });

  return card;
};

// Функция для открытия попапа
const openPopup = (pet) => {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.classList.add('open');
  popup.innerHTML = `
    <div class="popup__button">
      <button class="popup__close"><img src="images/pets/arrows/close.svg" alt="close"></button>
    </div>
    <div class="popup__img">
      <img src="${pet.img}" alt="${pet.name}">
    </div>
    <div class="popup__info">
      <h3>${pet.name}</h3>
      <h4>${pet.type} - ${pet.breed}</h4>
      <p>${pet.description}</p>
      <div class="popup__info-list">
        <ul>
          <li><b>Age:</b> ${pet.age}</li>
          <li><b>Inoculations:</b> ${pet.inoculations}</li>
          <li><b>Diseases:</b> ${pet.diseases}</li>
          <li><b>Parasites:</b> ${pet.parasites}</li>
        </ul>
      </div>
    </div>
  `;

  // Append popup to the body
  document.body.appendChild(popup);
  
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    popup.classList.remove('open');
  }, 300);

  // Add event listener for closing the popup
  const closePopup = (e) => {
    if (e.target === overlay || e.target === popup.querySelector('.popup__close')) {
      popup.classList.add('close');
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        }
      }, 200);
      document.removeEventListener('click', closePopup); // Clean up the event listener
    }
  };

  document.addEventListener('click', closePopup);
}



// Функция для обновления слайдера
const updateCards = () => {
  const petsWrapper = document.getElementById('pets__cards');
  petsWrapper.innerHTML = ''; // Очищаем текущие слайды
  currentSet.forEach(pet => {
    const newSlide = createCard(pet);
    petsWrapper.appendChild(newSlide);
  });
};


const initCards = () => {
    currentSet = getNextSet(); 
    updateCards(); 
}

initCards();