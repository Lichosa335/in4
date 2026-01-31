        // Игровые переменные
        let startTime;
        let timerInterval;
        let currentNumber = 1;
        let isGameRunning = false;
        let attemptCount = 1;
        let results = [];

        // Загрузка результатов из localStorage
        function loadResults() {
            const savedResults = localStorage.getItem('schulteResults');
            if (savedResults) {
                results = JSON.parse(savedResults);
            }
        }

        // Сохранение результатов в localStorage
        function saveResults() {
            localStorage.setItem('schulteResults', JSON.stringify(results));
        }

        // Генерация сетки Шульте
        function generateGrid() {
            const grid = document.getElementById('schulteGrid');
            grid.innerHTML = '';

            // Создаем массив чисел от 1 до 25 и перемешиваем
            const numbers = Array.from({length: 25}, (_, i) => i + 1);
            shuffleArray(numbers);

            numbers.forEach(number => {
                const cell = document.createElement('div');
                cell.className = 'schulte-cell';
                cell.textContent = number;
                cell.onclick = () => handleCellClick(cell, number);
                grid.appendChild(cell);
            });
        }

        // Перемешивание массива (алгоритм Фишера-Йетса)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Обработка клика по ячейке
        function handleCellClick(cell, number) {
            if (!isGameRunning || number !== currentNumber) return;

            cell.classList.add('active');
            setTimeout(() => {
                cell.classList.remove('active');
                cell.classList.add('completed');
            }, 200);

            currentNumber++;
            document.getElementById('currentNumber').textContent = currentNumber;

            // Проверка завершения игры
            if (currentNumber > 25) {
                endGame();
            }
        }

        // Запуск игры
        function startGame() {
            if (isGameRunning) return;

            isGameRunning = true;
            currentNumber = 1;
            startTime = Date.now();

            document.getElementById('currentNumber').textContent = currentNumber;
            document.getElementById('attemptCount').textContent = attemptCount;

            generateGrid();
            startTimer();
        }

        // Запуск таймера
        function startTimer() {
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 10);
        }

        // Обновление таймера
        function updateTimer() {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000;
            document.getElementById('timer').textContent = elapsedTime.toFixed(2);
        }

        // Завершение игры
        function endGame() {
            isGameRunning = false;
            clearInterval(timerInterval);

            const endTime = Date.now();
            const totalTime = ((endTime - startTime) / 1000).toFixed(2);

            // Сохраняем результат
            const result = {
                attempt: attemptCount,
                time: totalTime,
                date: new Date().toLocaleString()
            };

            results.push(result);
            saveResults();

            // Показываем результат
            alert(` Поздравляем!\nВы завершили тест за ${totalTime} секунд!`);

            attemptCount++;
            showResults();
        }

        // Сброс игры
        function resetGame() {
            isGameRunning = false;
            clearInterval(timerInterval);
            currentNumber = 1;

            document.getElementById('timer').textContent = '00.00';
            document.getElementById('currentNumber').textContent = '1';
            document.getElementById('schulteGrid').innerHTML = '';
        }

        // Показ результатов
        function showResults() {
            const resultsBody = document.getElementById('resultsBody');
            const resultsTable = document.getElementById('resultsTable');

            resultsBody.innerHTML = '';
            results.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.attempt}</td>
                    <td>${result.time} сек</td>
                    <td>${result.date}</td>
                `;
                resultsBody.appendChild(row);
            });

            resultsTable.style.display = 'block';
        }

        // Очистка результатов
        function clearResults() {
            if (confirm('Вы уверены, что хотите очистить историю результатов?')) {
                results = [];
                saveResults();
                document.getElementById('resultsBody').innerHTML = '';
                document.getElementById('resultsTable').style.display = 'none';
            }
        }

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            loadResults();
            if (results.length > 0) {
                showResults();
            }
        });