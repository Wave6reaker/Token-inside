// URL для получения данных о топ-10 криптовалютах
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

// Функция для отображения спиннера
function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

// Функция для скрытия спиннера
function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

// Функция для получения данных о топ-100 криптовалютах
async function fetchCryptoData() {
    // Показать спиннер
    showSpinner();

    try {
        // Отправляем запрос к API CoinGecko
        const response = await fetch(apiUrl);

        // Проверяем, успешно ли выполнен запрос
        if (!response.ok) {
            throw new Error('Ошибка при получении данных из CoinGecko API.');
        }

        // Преобразуем ответ в JSON
        const data = await response.json();

        // Отображаем данные в таблице
        displayCryptoData(data);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        // Скрыть спиннер
        hideSpinner();
    }
}

// Функция для отображения данных о топ-100 криптовалютах в таблице
function displayCryptoData(data) {
    const tbody = document.getElementById('crypto-tbody');

    // Очищаем содержимое таблицы
    tbody.innerHTML = '';

    // Добавляем каждую криптовалюту в таблицу
    data.forEach((crypto, index) => {
        const row = document.createElement('tr');

        // Создаем ячейку для порядкового номера
        const indexCell = document.createElement('td');
        indexCell.textContent = index + 1; // Порядковый номер (начинается с 1)

        // Создаем ячейку для названия с иконкой криптовалюты и 3-значного символа
        const nameCell = document.createElement('td');
        
        // Обертка для иконки, названия и символа криптовалюты
        const nameWrapper = document.createElement('div');
        nameWrapper.classList.add('name-wrapper');

        // Иконка криптовалюты
        const icon = document.createElement('img');
        icon.src = crypto.image;
        icon.alt = crypto.name;
        icon.classList.add('crypto-icon');

        // Создаем span для символа криптовалюты серого цвета
        const symbolSpan = document.createElement('span');
        symbolSpan.classList.add('symbol-span');
        symbolSpan.textContent = `(${crypto.symbol.toUpperCase()})`;

        // Добавляем элементы в обертку
        nameWrapper.appendChild(icon);
        nameWrapper.appendChild(document.createTextNode(crypto.name));
        nameWrapper.appendChild(symbolSpan);

        // Добавляем обертку в ячейку названия
        nameCell.appendChild(nameWrapper);

        // Создаем ячейку для цены
        const priceCell = document.createElement('td');
        priceCell.textContent = `${crypto.current_price.toFixed(2)}`;

        // Создаем ячейки для изменений с условным цветом
        const change1hCell = document.createElement('td');
        const change24hCell = document.createElement('td');
        const change7dCell = document.createElement('td');

        const setChangeColor = (change, cell) => {
            if (change !== undefined) {
                const value = change.toFixed(2);
                cell.textContent = `${value}%`;
                if (value > 0) {
                    cell.classList.add('positive');
                } else if (value < 0) {
                    cell.classList.add('negative');
                }
            } else {
                cell.textContent = "--";
            }
        };

        setChangeColor(crypto.price_change_percentage_1h_in_currency, change1hCell);
        setChangeColor(crypto.price_change_percentage_24h, change24hCell);
        setChangeColor(crypto.price_change_percentage_7d_in_currency, change7dCell);

        // Добавляем ячейки для рыночной капитализации, объема и предложения
        const marketCapCell = document.createElement('td');
        marketCapCell.textContent = `${crypto.market_cap?.toFixed(2)}`;

        const volume24hCell = document.createElement('td');
        volume24hCell.textContent = `${crypto.total_volume?.toFixed(2)}`;

        const supplyCell = document.createElement('td');
        supplyCell.textContent = `${crypto.circulating_supply?.toFixed(2)}`;

        // Добавляем ячейки в строку
        row.appendChild(indexCell);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(change1hCell);
        row.appendChild(change24hCell);
        row.appendChild(change7dCell);
        row.appendChild(marketCapCell);
        row.appendChild(volume24hCell);
        row.appendChild(supplyCell);

        // Добавляем строку в таблицу
        tbody.appendChild(row);
    });
}

// Функция, которая запускает обновление данных о криптовалютах вручную при нажатии кнопки
document.getElementById('refresh-btn').addEventListener('click', function() {
    fetchCryptoData();
});


// Выполняем запрос для получения данных о топ-10 криптовалютах при загрузке страницы
window.onload = fetchCryptoData;