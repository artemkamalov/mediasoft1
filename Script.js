// Массив для хранения контактов 
const contacts = []; 
 
// DOM-элементы 
const contactListEl = document.getElementById('contact-list'); 
const searchEl = document.getElementById('search'); 
const addContactBtn = document.getElementById('add-contact'); 
const addModal = document.getElementById('add-modal'); 
const closeModalBtn = document.getElementById('close-modal'); 
const addContactForm = document.getElementById('add-contact-form'); 
 
// Отображение контактов 
function renderContacts() { 
    contactListEl.innerHTML = ''; // Очищаем список 
    const query = searchEl.value.toLowerCase(); // Получаем текст из поиска 
 
    // Сортировка и фильтрация контактов 
    const sortedContacts = [...contacts] 
        .filter(contact => contact.name.toLowerCase().includes(query)) // Фильтр по имени 
        .sort((a, b) => (b.isFavorite - a.isFavorite) || a.name.localeCompare(b.name)); // Сортировка 
 
    // Создаем карточки контактов 
    sortedContacts.forEach(contact => { 
        const card = document.createElement('div'); 
        card.className = 'contact-card'; 
 
        const contactInfo = document.createElement('div'); 
        contactInfo.className = 'contact-info'; 
        contactInfo.innerHTML = ` 
            <img src="https://via.placeholder.com/50" alt="${contact.name}"> 
            <div> 
                <div>${contact.name}</div> 
                <div>${contact.phone}</div> 
            </div> 
        `; 
 
        const actions = document.createElement('div'); 
        actions.className = 'actions'; 
 
        const favoriteBtn = document.createElement('button'); 
        favoriteBtn.textContent = contact.isFavorite ? '★' : '☆'; 
        favoriteBtn.title = contact.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'; 
        favoriteBtn.addEventListener('click', () => { 
            contact.isFavorite = !contact.isFavorite; // Переключаем состояние 
            renderContacts(); // Перерисовываем список 
        }); 
 
        const deleteBtn = document.createElement('button'); 
        deleteBtn.textContent = '🗑️'; 
        deleteBtn.title = 'Удалить контакт'; 
        deleteBtn.addEventListener('click', () => { 
            const index = contacts.indexOf(contact); 
            contacts.splice(index, 1); // Удаляем контакт из массива 
            renderContacts(); // Перерисовываем список 
        }); 
 
        actions.appendChild(favoriteBtn); 
        actions.appendChild(deleteBtn); 
        card.appendChild(contactInfo); 
        card.appendChild(actions); 
        contactListEl.appendChild(card); 
    }); 
} 
 
// Добавление контакта 
addContactForm.addEventListener('submit', e => { 
    e.preventDefault(); // Отменяем стандартное поведение формы 
 
    const name = document.getElementById('name').value.trim(); 
    const phone = document.getElementById('phone').value.trim(); 
    const isFavorite = document.getElementById('is-favorite').checked; 
 
    // Валидация полей 
    if (!name  !phone  !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) { 
        alert('Введите корректные данные. Телефон должен быть в формате +7 (XXX) XXX-XX-XX'); 
        return; 
    } 
 
    // Добавляем контакт в массив 
    contacts.push({ name, phone, isFavorite }); 
    addModal.classList.remove('active'); // Закрываем модальное окно 
    renderContacts(); // Перерисовываем список 
    addContactForm.reset(); // Сбрасываем форму 
}); 
 
// Открытие/закрытие модального окна 
addContactBtn.addEventListener('click', () => addModal.classList.add('active')); 
closeModalBtn.addEventListener('click', () => addModal.classList.remove('active')); 
 
// Поиск контактов 
searchEl.addEventListener('input', renderContacts); 
 
// Маска для ввода телефона 
document.getElementById('phone').addEventListener('input', e => { 
    let value = e.target.value.replace(/\D/g, ''); // Убираем все нечисловые символы 
    if (value.length > 11) value = value.slice(0, 11); // Ограничиваем длину до 11 цифр 
 
    const formattedValue = value 
        .replace(/^(\d)/, '+7 ($1') // Начало с "+7 (" 
        .replace(/^(\+7\(\d{3})/, '$1) ') // Закрываем первую скобку 
        .replace(/(\d{3})(\d)/, '$1-$2') // Разделяем первую группу 
        .replace(/(\d{2})(\d{2})$/, '$1-$2'); // Разделяем последнюю группу 
 
    e.target.value = formattedValue; 
}); 
 
// Изначальное отображение 
renderContacts();