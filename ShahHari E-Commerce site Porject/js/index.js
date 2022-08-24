// slider logic
const sliderDom = document.querySelector('#slider');
const rightArrowButton = document.querySelector('.fa-arrow-right');
const leftArrowButton = document.querySelector('.fa-arrow-left');

let counter = 1;

setInterval(() => {
    if (counter < 3) {
        counter++;
        sliderDom.style.backgroundImage = `url("./Assets/BannerImg/${counter}.jpg")`;
    }
    if (counter === 3) counter = 0;
}, 11000);

rightArrowButton.addEventListener('click', () => {
    if (counter === 4) counter = 1;
    if (counter === 3) counter = 0;
    if (counter < 3) {
        counter++;
        sliderDom.style.backgroundImage = `url("./Assets/BannerImg/${counter}.jpg")`;
    }
});

leftArrowButton.addEventListener('click', () => {
    if (counter === 0) counter = 3;
    if (counter === 1) counter = 4;
    if (counter > 1) {
        counter--;
        sliderDom.style.backgroundImage = `url("./Assets/BannerImg/${counter}.jpg")`;
    }
});

// populating dom element and giving functionality to shopping cart
// variables for selecting dom elelments

const cartBtn = document.querySelector('.cart-btn');
const cartItems = document.querySelector('.cart-items');
const cartOverlay = document.querySelector('.cart-overlay');
const CartDom = document.querySelector('.cart');
const cartContent = document.querySelector('.cart-content');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const clearCartBtnAll = document.querySelectorAll('.clear-cart');
const cartTotal = document.querySelector('.cart-total');
const productsDom = document.querySelector('.products-center');
const search = document.querySelector('.searchBar');
const mainHeading = document.querySelector('.section-title h1');
const searchBtn = document.querySelector('.fa-search');

// hide the cart buttons if the cart is empty
function hideCearCartBtns() {
    clearCartBtnAll.forEach(btn => {
        btn.style.visibility = "hidden";
    });
}

// for closing the nav bar if it is opened in a mobile device screen
function navClose() {
    if (navSection.classList.contains('add-to-nav-section')) navSection.classList.remove('add-to-nav-section');
    if (logo.classList.contains('add-to-logo')) logo.classList.remove('add-to-logo');
    if (navSectionUl.classList.contains('add-to-ul')) navSectionUl.classList.remove('add-to-ul');
    if (navForm.classList.contains('add-to-nav-form')) navForm.classList.remove('add-to-nav-form');
}

// cart
let cart = [];

// buttons
let buttonsDom = [];

// getting the product
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        }
        catch (error) {
            console.error(error);
        }
    }
}

// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <article class="product">
                <div class="img-container">
                    <img class="product-img" src=${product.image} alt="${product.title} image">
                    <button class="bag-btn" data-id=${product.id} aria-label="add to cart button for ${product.title}, ${product.price} taka only.">
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>TK.${product.price} only</h4>
            </article>
            `;
        });
        productsDom.innerHTML = result;

        const artElem0 = document.querySelectorAll('article')[0];
        const div0 = document.createElement("div");
        div0.setAttribute('role', 'heading');
        div0.setAttribute('aria-level', '2');
        div0.classList.add('section-specifiq-title1');
        const h20 = document.createElement('h2');
        h20.innerText = "Food Section";
        div0.appendChild(h20);
        productsDom.insertBefore(div0, artElem0);

        const artElem1 = document.querySelectorAll('article')[10];
        const div1 = document.createElement("div");
        div1.setAttribute('role', 'heading');
        div1.setAttribute('aria-level', '2');
        div1.classList.add('section-specifiq-title2');
        const h21 = document.createElement('h2');
        h21.innerText = "Weaving Sarees";
        div1.appendChild(h21);
        productsDom.insertBefore(div1, artElem1);

        const artElem2 = document.querySelectorAll('article')[20];
        const div2 = document.createElement("div");
        div2.setAttribute('role', 'heading');
        div2.setAttribute('aria-level', '2');
        div2.classList.add('section-specifiq-title3');
        const h22 = document.createElement('h2');
        h22.innerText = "Fruits and Veges";
        div2.appendChild(h22);
        productsDom.insertBefore(div2, artElem2);

        search.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.searchProducts(products);
            }
        });

        searchBtn.addEventListener('click', (e)=> {
            e.preventDefault();
            this.searchProducts(products);
        });
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDom = [...buttonsDom, ...buttons];
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true;
            }
            button.addEventListener('click', event => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;

                // get product from products
                let cartItem = { ...Storage.getProduct(id), amount: 1 };

                // add product to the cart array
                cart = [...cart, cartItem];

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValues(cart);

                // add item into the cart
                this.addCartItem(cartItem);

                // show the cart and overlay
                this.showCart();
            });
        });
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image}>
        <div>
            <h4>${item.title}</h4>
            <h5>TK.${item.price} only</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;

        cartContent.appendChild(div);

        clearCartBtnAll.forEach(btn => {
            btn.style.visibility = "visible";
        });
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        CartDom.classList.add('showCart');
    }

    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        CartDom.classList.remove('showCart');
    }

    cartLogic() {
        // clear cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });

        // cart functionality
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);

                    if (cartContent.children.length === 0) {
                        hideCearCartBtns();
                        this.hideCart();
                    }
                }
            }
        });
    }

    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        hideCearCartBtns();
        this.hideCart();

    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart">add to cart`;
    }

    getSingleButton(id) {
        return buttonsDom.find(button => button.dataset.id === id);
    }

    searchProducts(products) {
        let filteredProduct = products.filter(product => product.title.toLowerCase().includes(search.value.toLowerCase()));
        let result = "";
        filteredProduct.forEach(product => {
            result += `
            <article class="product">
                <div class="img-container">
                    <img class="product-img" src=${product.image} alt="${product.title} image">
                    <button class="bag-btn" data-id=${product.id} aria-label="add to cart button for ${product.title}, ${product.price} taka only.">
                                        <i class="fas fa-shopping-cart"></i>
                                add to cart
                                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>TK.${product.price} only</h4>
            </article>
             `;
        });
        productsDom.innerHTML = result;

        if(filteredProduct.length > 1) mainHeading.innerText = "Search Resutls";
        else mainHeading.innerText = "Search Result";

        if(filteredProduct.length === 0) mainHeading.innerText = "No Search Result Found";

        if (filteredProduct.length < 2) productsDom.style.display = "flex";
        if(filteredProduct.length === 2) {
            productsDom.style.display = "grid";
            productsDom.style.width = "50vw";
        }
        if (filteredProduct.length > 2) {
            productsDom.style.display = "grid";
            productsDom.style.width = "90vw";
        }
        this.getBagButtons();
        navClose();
    }
}

// local Storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    // setup app
    ui.setupApp();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});

// responsive navigation bar 
const barButton = document.querySelector('.fa-bars');
const navSection = document.querySelector('nav section');
const logo = document.querySelector('nav section a');
const navSectionUl = document.querySelector('nav section ul');
const navForm = document.querySelector('nav section form');
const navListAll = document.querySelectorAll('nav section ul li');

barButton.addEventListener('click', () => {
    navSection.classList.toggle('add-to-nav-section');
    logo.classList.toggle('add-to-logo');
    navSectionUl.classList.toggle('add-to-ul');
    navForm.classList.toggle('add-to-nav-form');
});

navListAll.forEach(li => {
    li.addEventListener('click', () => {
        navClose();
    });
});