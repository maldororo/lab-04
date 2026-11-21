const selectedDishes = {
    'soup': null,
    'main-dish': null,
    'drink': null
};

const emptyMessages = {
    'soup': 'Блюдо не выбрано',
    'main-dish': 'Блюдо не выбрано',
    'drink': 'Напиток не выбран'
};

const orderForm = document.querySelector('.order-form');
const emptyOrder = document.querySelector('.order-empty');
const orderItems = document.querySelectorAll('.order-item[data-category]');
const orderTotal = document.querySelector('.order-total');
const orderTotalPrice = document.querySelector('.order-total .order-price');

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function createDishCard(dish) {
    const card = createElement('div', 'dish');
    card.dataset.dish = dish.keyword;

    const image = createElement('img', 'dish-image');
    image.src = 'images/' + dish.image + '.jpg';
    image.alt = dish.name;

    const price = createElement('p', 'dish-price', dish.price + '₽');
    const name = createElement('p', 'dish-name', dish.name);
    const weight = createElement('p', 'dish-weight', dish.count);

    const button = createElement('button', 'dish-button', 'Добавить');
    button.type = 'button';

    card.append(image, price, name, weight, button);

    return card;
}

function renderDishes() {
    dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    dishes.forEach(dish => {
        const container = document.querySelector('.dishes[data-category="' + dish.category + '"]');
        container.append(createDishCard(dish));
    });
}

function updateOrder() {
    const chosenDishes = Object.values(selectedDishes).filter(dish => dish !== null);
    const hasChosen = chosenDishes.length > 0;

    emptyOrder.hidden = hasChosen;
    orderTotal.hidden = !hasChosen;

    orderItems.forEach(item => {
        const category = item.dataset.category;
        const dish = selectedDishes[category];

        item.hidden = !hasChosen;
        item.querySelector('.order-dish').textContent = dish
            ? dish.name + ' ' + dish.price + '₽'
            : emptyMessages[category];
        orderForm.elements[category].value = dish ? dish.keyword : '';
    });

    const total = chosenDishes.reduce((sum, dish) => sum + dish.price, 0);
    orderTotalPrice.textContent = total + '₽';
}

function selectDish(card) {
    const dish = dishes.find(item => item.keyword === card.dataset.dish);

    selectedDishes[dish.category] = dish;

    card.parentElement.querySelectorAll('.dish').forEach(item => {
        item.classList.remove('selected');
    });
    card.classList.add('selected');

    updateOrder();
}

function resetOrder() {
    Object.keys(selectedDishes).forEach(category => {
        selectedDishes[category] = null;
    });

    document.querySelectorAll('.dish.selected').forEach(card => {
        card.classList.remove('selected');
    });

    updateOrder();
}

document.querySelector('main').addEventListener('click', event => {
    const button = event.target.closest('.dish-button');

    if (button) {
        selectDish(button.closest('.dish'));
    }
});

orderForm.addEventListener('reset', resetOrder);

renderDishes();
updateOrder();
