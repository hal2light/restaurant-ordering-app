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
const orderTotalPrice = document.getElementById('order-total-price')
const payment = document.getElementById('payment')
const paymentForm = document.getElementById('payment-form')
const orderCompleted = document.getElementById('order-completed')
const orderCompletedThanks = document.getElementById('order-completed-thanks')


// Validate DOM elements
if (!menu || !order || !orderItems || !orderTotalPrice || !payment || !paymentForm || !orderCompleted || !orderCompletedThanks) {
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
    calculateCheckout(e)
    launchOrderList();
}
function removeOrderBtn(e) {
    const orderItem = e.target.closest('.order-item');
    if (!orderItem) return;
    const id = Number(orderItem.id);
    state.orderList = state.orderList.filter(item => item.id !== id);
    calculateCheckout(e)
    launchOrderList();
}

function updateOrderVisibility() {
    order.classList.toggle(CLASSES.HIDDEN, state.orderList.length === 0);
}
function updatePaymentVisibility(){
    payment.classList.toggle(CLASSES.HIDDEN)
}
function calculateCheckout(){
    let totalPrice = 0 
    state.orderList.map(item => totalPrice += item.price)
    orderTotalPrice.innerHTML = "$" + totalPrice 
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
    const completeOrderBtn = e.target.closest(".order-complete-order-btn")
    if (removeBtn) {
        removeOrderBtn(e);
    }
    if(completeOrderBtn){
        updatePaymentVisibility();
    }
});

// Payment form handling
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form inputs
    const nameInput = document.getElementById('name');
    const cardInput = document.getElementById('card-num');
    const cvvInput = document.getElementById('cvv');
    
    // Clear previous errors
    [nameInput, cardInput, cvvInput].forEach(input => {
        input.classList.remove('input-error');
    });
    
    // Validate inputs
    let isValid = true;
    const inputs = [
        { element: nameInput, name: 'name' },
        { element: cardInput, name: 'card number' },
        { element: cvvInput, name: 'CVV' }
    ];
    
    inputs.forEach(({ element, name }) => {
        if (!element || !element.value.trim()) {
            element?.classList.add('input-error');
            isValid = false;
            console.log(`${name} is empty`);
        }
    });
    
    if (!isValid) {
        alert('Please fill in all fields.');
        return;
    }

    // Process the order
    const thankYouMessage = `Thanks, ${nameInput.value}! Your order is on its way!`;
    
    // Update UI
    orderCompletedThanks.textContent = thankYouMessage;
    orderCompleted.classList.remove(CLASSES.HIDDEN);
    updatePaymentVisibility(); // Hide payment form
    
    // Clear the order
    state.orderList = [];
    launchOrderList();
    
    // Reset form for next use
    paymentForm.reset();
    
    // Hide thank you message after 3 seconds
    setTimeout(() => {
        orderCompleted.classList.add(CLASSES.HIDDEN);
    }, 3000);
});
document.addEventListener("click", e => {
    if (!payment.classList.contains(CLASSES.HIDDEN)) { // Only check if payment is visible
        const clickedInsidePayment = e.target.closest('.payment');
        const clickedCompleteOrder = e.target.closest('.order-complete-order-btn');
        
        // Close if click was outside payment container and not on the complete order button
        if (!clickedInsidePayment && !clickedCompleteOrder) {
            updatePaymentVisibility();
        }
    }
});


launchMenuList()
