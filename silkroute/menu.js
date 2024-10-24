// Handle quantity increment and decrement
const decrementButtons = document.querySelectorAll('.decrement');
const incrementButtons = document.querySelectorAll('.increment');
const itemQuantities = document.querySelectorAll('.item-quantity');

decrementButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        let quantity = parseInt(itemQuantities[index].textContent);
        if (quantity > 1) {
            itemQuantities[index].textContent = quantity - 1;
        }
    });
});

incrementButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        let quantity = parseInt(itemQuantities[index].textContent);
        itemQuantities[index].textContent = quantity + 1;
    });
});
