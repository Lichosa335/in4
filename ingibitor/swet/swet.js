let score = 0;
let level = 1;
let timeLeft = 60;
let gameInterval;
let colorInterval;
let isGameRunning = false;
let isClickBlocked = false;
const totalCells = 30;

// Элементы интерфейса
const scoreElement = document.getElementById('score');
const gameScoreElement = document.getElementById('gameScore');
const levelElement = document.getElementById('level');
const gameLevelElement = document.getElementById('gameLevel');
const timerElement = document.getElementById('timer');
const gameTimerElement = document.getElementById('gameTimer');

// Цвета для ячеек
const colors = [
    { class: 'bg-success', points: 1, text: '✅' },    // Зеленый - +1
    { class: 'bg-danger', points: -1, text: '❌' },    // Красный - -1
    { class: 'bg-warning', points: 0, text: '⚡' }     // Желтый - пропустить
];

function createGameGrid() {
    const container = document.getElementById('gameCellsContainer');
    if (!container) return;

    // Очищаем контейнер
    container.innerHTML = '';

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 500;

    if (isMobile) {
        // Создаем сетку 3x3 (9 ячеек) для мобильных
        for (let i = 0; i < 9; i++) {
            const col = document.createElement('div');
            col.className = 'col-4'; // 3 колонки в ряду (12/4=3)

            const cell = document.createElement('div');
            cell.className = 'cell border border-3 border-warning custom-color p-3 m-1 rounded bg-dark text-center';
            cell.dataset.index = i;

            const span = document.createElement('span');
            span.id = `cell-content-${i}`;
            span.textContent = '⚡';
            span.style.fontSize = '1.8rem';

            cell.appendChild(span);
            col.appendChild(cell);
            container.appendChild(col);
        }
    } else {
        // Создаем 30 ячеек для десктопов
        for (let i = 0; i < totalCells; i++) {
            const col = document.createElement('div');
            col.className = 'col-2'; // 6 колонок в ряду

            const cell = document.createElement('div');
            cell.className = 'cell border border-3 border-warning custom-color p-4 m-1 rounded bg-dark text-center';
            cell.dataset.index = i;

            const span = document.createElement('span');
            span.id = `cell-content-${i}`;
            span.textContent = '⚡';

            cell.appendChild(span);
            col.appendChild(cell);
            container.appendChild(col);
        }
    }

    // После создания ячеек добавляем обработчики событий
    addCellClickHandlers();
}

function addCellClickHandlers() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        // Удаляем старый обработчик
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);

        // Добавляем новый обработчик
        newCell.addEventListener('click', () => handleCellClick(index));
    });
}

// Функция обработки клика по ячейке
function handleCellClick(cellIndex) {
    if (!isGameRunning || isClickBlocked) return;

    isClickBlocked = true;

    const cells = document.querySelectorAll('.cell');
    const cell = cells[cellIndex];
    const currentColorClass = getCurrentColorClass(cell);

    // Проверяем какой цвет у ячейки
    if (currentColorClass === 'bg-success') {
        // Зеленая ячейка - правильный клик
        score += 1;
        cell.classList.add('correct');
        setTimeout(() => cell.classList.remove('correct'), 300);
    } else if (currentColorClass === 'bg-danger') {
        // Красная ячейка - неправильный клик
        score -= 1;
        cell.classList.add('incorrect');
        setTimeout(() => cell.classList.remove('incorrect'), 300);
    }
    // Желтую ячейку игнорируем

    updateScore();

    // Разблокируем через небольшой промежуток
    setTimeout(() => {
        isClickBlocked = false;
    }, 300);
}

// Функция для получения текущего цвета ячейки
function getCurrentColorClass(cell) {
    if (cell.classList.contains('bg-success')) return 'bg-success';
    if (cell.classList.contains('bg-danger')) return 'bg-danger';
    if (cell.classList.contains('bg-warning')) return 'bg-warning';
    return '';
}

// Функция обновления счета
function updateScore() {
    if (scoreElement) scoreElement.textContent = score;
    if (gameScoreElement) gameScoreElement.textContent = score;

    // Обновляем уровень каждые 5 очков
    const newLevel = Math.floor(score / 5) + 1;
    if (newLevel !== level) {
        level = newLevel;
        if (levelElement) levelElement.textContent = level;
        if (gameLevelElement) gameLevelElement.textContent = level;
    }
}

// Функция смены цветов ячеек
function changeColors() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'correct', 'incorrect');

        const random = Math.random();
        let color;

        if (random < 0.4) {
            color = colors[1]; // Красный
        } else if (random < 0.8) {
            color = colors[2]; // Желтый
        } else {
            color = colors[0]; // Зеленый
        }

        cell.classList.add(color.class);
        const span = cell.querySelector('span');
        if (span) span.textContent = color.text;
    });
}

// Функция таймера
function updateTimer() {
    timeLeft--;
    if (timerElement) timerElement.textContent = timeLeft;
    if (gameTimerElement) gameTimerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

// Функция начала игры
function startGame() {
    score = 0;
    level = 1;
    timeLeft = 60;
    isGameRunning = true;

    // Создаем игровое поле
    createGameGrid();

    updateScore();

    // Запускаем интервалы
    clearInterval(gameInterval);
    clearInterval(colorInterval);

    gameInterval = setInterval(updateTimer, 1000);
    colorInterval = setInterval(changeColors, 2000);

    // Начальная смена цветов
    changeColors();
}

// Функция сброса игры
function resetGame() {
    clearInterval(gameInterval);
    clearInterval(colorInterval);
    startGame();
}

// Функция окончания игры
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(colorInterval);

    // Проверяем, существует ли модальное окно "play"
    const playModal = document.getElementById('play');
    if (playModal) {
        const modal = bootstrap.Modal.getInstance(playModal);
        if (modal) {
            modal.hide();
        }
    }

    alert(`Игра окончена!\nВаш счет: ${score}\nВаш уровень: ${level}\n\nНизкий - 10-\nСредний - 11 до 13\nВысокий - 14+`);
}

// Обработчик изменения размера окна
function handleResize() {
    if (isGameRunning) {
        createGameGrid();
        changeColors();
    } else {
        createGameGrid();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateScore();
    createGameGrid();

    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', handleResize);

    // Добавляем обработчики для модального окна
    const playModal = document.getElementById('play');
    if (playModal) {
        playModal.addEventListener('shown.bs.modal', startGame);

        playModal.addEventListener('hidden.bs.modal', function() {
            isGameRunning = false;
            clearInterval(gameInterval);
            clearInterval(colorInterval);
        });
    }
});

// Для отладки - добавляем глобальные функции
window.startGame = startGame;
window.resetGame = resetGame;
window.endGame = endGame;