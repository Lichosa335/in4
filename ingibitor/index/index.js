    // Функция для отображения результатов
    function showResults() {
        const userName = localStorage.getItem('userName');
        const lastScore = localStorage.getItem('lastScore');
        const resultsDiv = document.getElementById('userResults');

        if (userName && lastScore) {
            resultsDiv.innerHTML = `
                <h5>Пользователь: ${userName}</h5>
                <h5>Последний результат: ${lastScore} очков</h5>
                <p class="mt-3">Уровень: ${Math.floor(lastScore / 5) + 1}</p>
            `;
        } else {
            resultsDiv.innerHTML = `
                <p>Нет сохраненных результатов</p>
                <p>Пройдите тестирование сначала</p>
            `;
        }

        // Показываем модальное окно
        const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
        resultsModal.show();
    }

    // Добавляем обработчик для кнопки "Результаты"
    document.addEventListener('DOMContentLoaded', function() {
        const resultsBtn = document.querySelector('.btn-transparent');
        resultsBtn.addEventListener('click', showResults);
    });