let iconCart = document.querySelector('.icon__cart');
let body = document.querySelector('body');
let close = document.querySelector('.close');

let listAssembliesPC = document.querySelector(".products__list-assembliesPC")
let listCardsHTML = document.querySelector('.products__list-cards');
let listProcessorsHTML = document.querySelector('.products__list-processor');
let listCasesHTML = document.querySelector('.products__list-cases');
let listPeripheryHTML = document.querySelector('.products__list-periphery');

let fastWatch = document.querySelector('.fastWatch');
let closeBigCard = document.querySelector('.closeBigCard');
let bigCard = document.querySelector('.bigCard');
let hideInfo = document.querySelector('.hideInfo');
let listCartHTML = document.querySelector('.cart__list')
let iconCartSpan = document.querySelector('.icon__cart span');

let listProducts = [];
let carts = [];
let costs = [];


document.getElementById('reviews').addEventListener('click', function() {
  document.querySelector('.vk_comments').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('about').addEventListener('click', function() {
  document.querySelector('.footer').scrollIntoView({ behavior: 'smooth' });
});

iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
})

close.addEventListener('click', () => {
  body.classList.toggle("showCart");
})

const updateCosts = () => {
  costs = carts.map(cart => {
    let product = listProducts.find(p => p.id == cart.product_id);
    return `Товар:${product.name} - Кол-во:${cart.quantity} - ID:${product.id} - Цена:${product.price}`;
  });
  hideInfo.innerText = costs.join(';      ---    ');
}

const addDataToHTML = () => {
  listCardsHTML.innerHTML = '';
  listProcessorsHTML.innerHTML = '';

  if (listProducts.length > 0) {
    listProducts.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('swiper-slide');
      newProduct.classList.add('product__item');

      newProduct.dataset.id = product.id;
      let inCart = carts.some(cart => cart.product_id == product.id);
      newProduct.innerHTML = `
      <img class="" src="${product.image}" alt="">
        <h2>${product.name}</h2>
        <div class="price">${product.price}₽</div>
        <button class="fastWatch">
        Просмотр
        </button>
        <button class="cart__add">
        ${inCart ? "В корзине" : "Корзина"}
        </button>
      `;
      if (product.type == "cards") {
        listCardsHTML.appendChild(newProduct);
      }
      if (product.type == "processor") {
        listProcessorsHTML.appendChild(newProduct);
      }
      if (product.type == "assembliesPC") {
        listAssembliesPC.appendChild(newProduct);
      }
      if (product.type == "cases") {
        listCasesHTML.appendChild(newProduct);
      }
      if (product.type == "periphery") {
        listPeripheryHTML.appendChild(newProduct);
      }

    })
  }
}

listCardsHTML.addEventListener('click', handleClick);
listProcessorsHTML.addEventListener('click', handleClick);
listAssembliesPC.addEventListener('click', handleClick);
listCasesHTML.addEventListener('click', handleClick);
listPeripheryHTML.addEventListener('click', handleClick);

function handleClick(event) {
  let positionClick = event.target;
  let product_id = positionClick.parentElement.dataset.id;
  if (positionClick.classList.contains('cart__add')) {
    addToCart(product_id);
  } if (positionClick.classList.contains('fastWatch')) {
    let bigCard = document.createElement('div');
    bigCard.classList.add('bigCard');

    bigCard.dataset.id = product_id;
    let card = listProducts[product_id - 1]
    bigCard.innerHTML = `
      <img src="${card.image}"></img>
      <h1 class="cardName">${card.name}</h1>
      <p class="cardDescription">${card.description}</p>
      <h3 class="cardPrice">${card.price}₽</h3>
      <button class="closeBigCard">Close</button>

    `
    
    body.appendChild(bigCard);

    bigCard.querySelector('.closeBigCard').addEventListener('click', () => {
      bigCard.remove();
    })
  } 
}

const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
  if(carts.length <= 0 ) {
    carts = [{
      product_id: product_id,
      quantity: 1
    }]
  } else if(positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1
    })
  } else {
    carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
  updateButtonText(product_id, true);
  updateCosts();
}

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  let totalPrice = 0;  // Переменная для общей суммы

  if(carts.length > 0) {
      carts.forEach(cart => {
          totalQuantity += cart.quantity;
          let newCart = document.createElement('div');
          newCart.classList.add('cart__item');
          newCart.dataset.id = cart.product_id;
          let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
          let info = listProducts[positionProduct];
          newCart.innerHTML = `
          <div class="image">
              <img src="${info.image}" alt="">
          </div>
          <div class="name">
              ${info.name}
          </div>
          <div class="totalPrice">
              ${parseInt(info.price.replace(/\s/g, '')) * cart.quantity}₽
          </div>
          <div class="quantity">
              <span class="minus"><</span>
              <span>${cart.quantity}</span>
              <span class="plus">></span>
          </div>
          `;
          listCartHTML.appendChild(newCart);

          // Добавление к общей сумме
          totalPrice += parseInt(info.price.replace(/\s/g, '')) * cart.quantity;
      });
  }

  // Обновление общего количества товаров в корзине
  iconCartSpan.innerText = totalQuantity;

  // Обновление общей суммы в HTML
  document.getElementById('totalPrice').innerText = `${totalPrice}₽`;
  updateCosts();
}

listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if(positionClick.classList.contains('plus')) {
      type = 'plus';
    }
    changeQuantity(product_id, type);
  }
})

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
  if(positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;      
        break;
    
      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if(valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
          updateButtonText(product_id, false);
        }
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
}

const updateButtonText = (product_id, inCart) => {
  let productElement = document.querySelector(`.product__item[data-id="${product_id}"] .cart__add`);
  if (productElement) {
    productElement.innerText = inCart ? 'В корзине' : 'Корзина';
  }
}

const initApp = () => {
  fetch('products.json')
  .then(response => response.json())
  .then(data => {
    listProducts = data;
    addDataToHTML();

    if(localStorage.getItem('cart')) {
      carts = JSON.parse(localStorage.getItem('cart'));
      addCartToHTML();
    }
  })
}


initApp();

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  breakpoints: {
    319: {
      spaceBetween: 24,
      slidesPerView: 1.2
    },
    576: {
      spaceBetween: 30,
      slidesPerView: 2
    },
    868: {
      spaceBetween: 30,
      slidesPerView: 3
    },

    1250: {
      spaceBetween: 40,
      slidesPerView: 4
    },
    1680: {
      spaceBetween: 40,
      slidesPerView: 5

    }
  },
  loop: false,
  freeMode: true,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: false,
  },
});

const swiperTop = new Swiper('.top__swiper', {
  // Optional parameters
  effect: "fade",

  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
        type: "progressbar",
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
