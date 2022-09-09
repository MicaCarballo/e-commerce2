class CartItem{
    constructor(name, desc, img, price){
        this.name = name
        this.desc = desc
        this.img=img
        this.price = price
        this.quantity = 1
   }
}

class LocalCart{
    static key = "cartItems"

    static getLocalCartItems(){
        let cartMap = new Map()
     const cart = localStorage.getItem(LocalCart.key)   
     if(cart===null || cart.length===0)  return cartMap
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            mapItem.quantity +=1
            cart.set(id, mapItem)
        }
        else
        cart.set(id, item)
       localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
       updateCartUI()
        
    }

    static removeItemFromCart(id){
    let cart = LocalCart.getLocalCartItems()
    if(cart.has(id)){
        let mapItem = cart.get(id)
        if(mapItem.quantity>1)
       {
        mapItem.quantity -=1
        cart.set(id, mapItem)
       }
       else
       cart.delete(id)
    } 
    if (cart.length===0)
    localStorage.clear()
    else
    localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
       updateCartUI()
    }
}

const cart= document.querySelector('#cart-item');
const cartWindow= document.querySelector('.whole-cart-window');

const addToCartBtns = document.querySelectorAll('#addcart');

addToCartBtns.forEach((btn)=>{
    btn.addEventListener('click', AddItemFunction)
})

function AddItemFunction(e){
    const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
    const img = e.target.parentElement.parentElement.previousSibling.previousSibling.children[0].src;
    const name= e.target.parentElement.parentElement.firstChild.nextSibling.textContent;
    const desc = e.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.textContent;
    let price = e.target.parentElement.previousSibling.previousSibling.textContent;
    price = price.replace("Price: $", parseInt(''));
    const item = new CartItem(name, img,desc, price);
    LocalCart.addItemToLocalCart(id, item);
    console.log(price)
}



cart.addEventListener('mouseover',()=>{
   
    cartWindow.classList.toggle('hide')
})

cartWindow.addEventListener('mouseleave',()=>{
 cartWindow.classList.toggle('hide')
})

function updateCartUI(){
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=""
    const items = LocalCart.getLocalCartItems()
    if(items === null) return
    let count = 0
    let total = 0
    for(const [key, value] of items.entries()){
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price*value.quantity
        price =    parseInt(Math.round(price*100)/100)
        count+=1
        total += price
        total = Math.round(total*100)/100
        cartItem.innerHTML =
        `
        <img src="${value.img}" alt="">
                       <div class="details">
                           <h3>${value.name}</h3>
                           <p>${value.desc}
                            <span class="quantity">Quantity: ${value.quantity}</span>
                               <span class="price">Price: $  ${price}</span>
                           </p>
                       </div>
                       <div class="cancel">
                       <i class='bx bxs-x-circle' ></i>
                   </div>
        `
       cartItem.lastElementChild.addEventListener('click', ()=>{
           LocalCart.removeItemFromCart(key)
       })
        cartWrapper.append(cartItem)
    }

    if(count > 0){
        let cartIcon = document.querySelector('#cart-item')
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `SubTotal: $${total}`
    }
    else
    cartIcon.classList.remove('non-empty')
}
document.addEventListener('DOMContentLoaded', ()=>{updateCartUI()})
    
