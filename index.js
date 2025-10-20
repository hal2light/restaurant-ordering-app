import { menuArray } from "./data.js";

// Constants
const CLASSES = {
    HIDDEN: 'hidden',
    MENU_ITEM_BTN: 'menu-item-btn',
    REMOVE_BTN: 'remove-btn'
};

// DOM Elements
const menu = document.getElementById("menu");
const order = document.getElementById("order");
const orderItems = document.getElementById('order-items');

// Validate DOM elements
if (!menu || !order || !orderItems) {
    throw new Error("Required DOM elements not found");
}

// Application State
const state = {
    orderList: [],
    nextId: 0
};

function launchMenuList() {
    const menuHtml = menuArray.map(item => `
        <div class="menu-item">
            <div class="menu-item-block">
                <p class="menu-item-emoji">${item.emoji}</p>
                <div class="menu-item-info">
                    <p class="menu-item-info-name">${item.name}</p>
                    <p class="menu-item-info-toppings">${item.ingredients.join(', ')}</p>
                    <p class="menu-item-info-price">$${item.price}</p>
                </div>
            </div>
            <div class="${CLASSES.MENU_ITEM_BTN}">
                +
            </div>
        </div>
    `).join('');
    
    menu.innerHTML = menuHtml;
    launchOrderList();
}

function addOrderBtn(e) {
    const name = e.target.parentElement.querySelector(".menu-item-info-name").textContent;
    const priceText = e.target.parentElement.querySelector(".menu-item-info-price").textContent;
    const price = Number(priceText.replace('$', ''));
    const id = state.nextId++;
    state.orderList.push({name, price, id});
    launchOrderList();
}
function removeOrderBtn(e) {
    const orderItem = e.target.closest('.order-item');
    if (!orderItem) return;

    const id = Number(orderItem.id);
    state.orderList = state.orderList.filter(item => item.id !== id);
    launchOrderList();
}

function updateOrderVisibility() {
    order.classList.toggle(CLASSES.HIDDEN, state.orderList.length === 0);
}

function launchOrderList() {
    const orderHtml = state.orderList.length > 0
        ? state.orderList.map(item => `
            <div id="${item.id}" class="order-item">
                <div class="order-items-name-btn">
                    <p>${item.name}</p>
                    <button class="${CLASSES.REMOVE_BTN}">remove</button>
                </div>
                <p class="order-items-price">$${item.price}</p>
            </div>`).join('')
        : '';
    
    orderItems.innerHTML = orderHtml;
    updateOrderVisibility();
}
menu.addEventListener("click", e => {
    const menuItemBtn = e.target.closest(".menu-item-btn");
    if (menuItemBtn) {
        addOrderBtn(e);
    }
});

order.addEventListener("click", e => {
    const removeBtn = e.target.closest(".remove-btn");
    if (removeBtn) {
        removeOrderBtn(e);
    }
});


launchMenuList()
