// initialize ui elements
const cartBtn = document.querySelector('.cart-btn');
const closeCart = document.querySelector('.close-cart');
const clearCart = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center')

// cart
let cart = [];
let buttonsDOM = [];
// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('./js/products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const {title, price} = item.fields;
                const id = item.sys.id;
                const image = item.fields.image.fields.file.url;
                return {id, title, price, image}
            })
            return products;
        } catch(error) {
            console.log(error);
        }
    }
}

// display products
class UI {
    displayProduct(products) {
        let result = "";
        products.forEach(product => {
            result += `
                <!-- single product -->
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} alt="product" class="product-img">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fa fa-shopping-cart"></i>
                            add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>${product.price}</h4>
                </article>
                <!-- end single product -->
            `
        });
        productsDOM.innerHTML = result;
    }

    getBagBtn() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            const id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart) {
                button.innerHTML = 'In Cart';
                button.disabled = true;
            }
            button.addEventListener('click', (event)=>{
                event.target.innerHTML = 'In Cart';
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount: 1};
                
                // add product to the cart
                cart = [...cart, cartItem];

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValue(cart);

                // display cart items
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            });
            
        });
    }
    setCartValue(cart) {
        let tempTotal = 0;
        let itemTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemTotal;
    }
    addCartItem(item) {
        let div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="product">
            <div>
                <h4>${item.title}</h4>
                <h5>${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fa fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fa fa-chevron-down" data-id=${item.id}></i>
            </div>
        `
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    setupApp() {
        cart = Storage.getCart();
        this.setCartValue(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCart.addEventListener('click', this.hideCart);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    cartLogic() {
        clearCart.addEventListener('click', ()=>{
            this.clearCart();
        });
        cartContent.addEventListener('click', event=> {
            if(event.target.classList.contains('remove-item')) {
               let removeItem = event.target;
               let id = removeItem.dataset.id;
               this.removeItem(id);
               cartContent.removeChild(removeItem.parentElement.parentElement);
            } else if(event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempCart = cart.find(item => item.id === id);
                tempCart.amount += 1;
                Storage.saveCart(cart);
                this.setCartValue(cart);
                addAmount.nextElementSibling.innerText = tempCart.amount;
            } else if(event.target.classList.contains('fa-chevron-down')) {
                let subtractAmount = event.target;
                let id = subtractAmount.dataset.id;
                let tempCart = cart.find(item => item.id === id);
                tempCart.amount -= 1;
                if(tempCart.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValue(cart);
                    subtractAmount.previousElementSibling.innerText = tempCart.amount;
                } else {
                    cartContent.removeChild(subtractAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id=>{
            this.removeItem(id);
        })
        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item=>item.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fa fa-shopping-cart"></i>
        add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
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

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();

    // setup app
    ui.setupApp();
    ui.cartLogic();
    // get all products
    products.getProducts().then(products => {
        ui.displayProduct(products),
        Storage.saveProducts(products)
    }).then(()=>ui.getBagBtn());
});