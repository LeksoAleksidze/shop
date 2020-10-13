
// SLIDER
var swiper = new Swiper('.swiper-container', {
      cssMode: true,
      autoplay: { delay: 2000, },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination'
      },
      mousewheel: true,
      keyboard: true,
      loop:true
    });


// SCROLL header

const headerNav = document.querySelector('header');

window.onscroll = function(){
let scrollPos = window.scrollY;

if( scrollPos > 100){
  headerNav.classList.add("fix-pos");
} else {

  headerNav.classList.remove("fix-pos");
}

}







// JSON data
const parentContainerSale = document.querySelector('#parentCont');
const parentContainer = document.querySelector('#parentNew');
const shopCount = document.getElementById('shop');


fetch('db/data.json').then(function(response){
  return response.json();
}).then(function(data){

  data.forEach((item)=>{
    
    let dom;

   // CHOOSE CONTAINER
  if(item.position == "sale"){
     
     dom = child();
     parentContainerSale.append(dom);
     dom.querySelector('#salePrice').innerHTML = item.salePrice + " ₾";

  } else {
    
    dom = copyParent();
    parentContainer.append(dom);

  } 


    dom.id = "product_" + item.id;
    dom.querySelector('#currentNewImage').src = item.image;
    dom.querySelector('#newName').innerHTML = item.product;
    dom.querySelector('#newPrice').innerHTML = item.price + " ₾";
    dom.querySelector('#newCode').innerHTML = item.code;
  
  
    dom.querySelector('a').addEventListener('click', function(dom){
      
      dom.preventDefault();
      window.location.href = "details.html?id=" + item.id;

    });



    // shop
    let itms = [];

    dom.querySelector('button').addEventListener('click', (e)=>{

    if(typeof(Storage) !== 'undefined'){

      let itm = {

           id: item.id,
           name: item.product,
           image: item.image,
           price: item.price,
           no: 1
      }; 
      if( JSON.parse(localStorage.getItem("itms")) === null){

        itms.push(itm);
        localStorage.setItem("itms", JSON.stringify(itms));
        // window.location.reload();
      }  else {

        const localItms = JSON.parse(localStorage.getItem("itms"));
        localItms.map((data)=>{
          if( itm.id == data.id){
            
            itm.no = data.no + 1;

          } else {
            itms.push(data);

          }

        })

        itms.push(itm);
        localStorage.setItem("itms", JSON.stringify(itms));
        // window.location.reload();
      }     

    } else {
      alert('შეცვალეთ ბრაუზერი')
    }

    swal("თქვენ დაამატეთ პროდუქტი კალათაში", "", "success" );
    setTimeout( function(){
      window.location.reload();
    },800);



    })


  });

}).catch(function(error){
  console.error('შეცდომა მონაცემები ვერ ჩაიტვირთა');
  console.log(error);
});




// SHOP ICON
const shopBtn = document.querySelector('#shopBtn span');
let no = 0;

JSON.parse(localStorage.getItem("itms")).map((data)=>{
  no = no + data.no;
});

shopBtn.innerHTML = no;


// SHOP WINDOW
const shopTable = document.querySelector('#shopTable');
const shopBt = document.querySelector('#shopBtn');
const htmlScroll = document.querySelector("html");
const shopClose = document.querySelector('.close-btn');

shopBt.addEventListener('click', ()=>{
  

   shopTable.classList.toggle("show");
   htmlScroll.classList.toggle('stopActive');

})
shopClose.addEventListener("click", ()=>{
   shopTable.classList.remove("show");
   htmlScroll.classList.remove('stopActive');
})


// checkout button
const checkBtn = shopTable.querySelector('.total a');

checkBtn.addEventListener('click', ()=>{

   window.location.href="checkout.html"

})




// SHOP TABLE
const tableBox = shopTable.querySelector('table');
let tableInner = '';

if(JSON.parse(localStorage.getItem("itms"))[0] === null){

  tableInner += '<h3> ცარიელია </h3>';
} else {
  JSON.parse(localStorage.getItem("itms")).map((data)=>{
    tableInner += `
    <tr class="shop-decription p-0 m-0">
      <td class="shop-id">${data.id}</td>
      <td><img src="${data.image}" width="40px" height="40px;"></td>
      <td class="shop-name">${data.name}</td>
      <td><div class="shop-value">
      <input type="button" value="-" class="shop-minus">
      <input type="tel" min="0" class="shop-input" value="${data.no}">
      <input type="button" value="+" class="shop-plus">
      </div></td>
      <td class="shop-price">${data.price} `+` ₾</td>
      <td><a href="#" onclick=Delete(this);><i class="fa fa-times"></i></a></td>
     </tr>
    `
  })

  tableBox.innerHTML = tableInner;
  updateCartTotal();
}

  const shopDecriptions = document.querySelectorAll('.shop-decription');
  
   let counter = 1;

for( let i = 0; i < shopDecriptions.length; i++ ){

   const plusBtn = shopDecriptions[i].querySelector('.shop-plus');
    const minusBtn = shopDecriptions[i].querySelector('.shop-minus');
    const countValue = shopDecriptions[i].querySelector('.shop-input');


  


    plusBtn.addEventListener('click',()=>{
     
      
      countValue.value = parseFloat(countValue.value) + 1;

     const cvladi = JSON.parse(localStorage.getItem("itms"));

        cvladi.map(data=>{

          data.no = data.no + 1;

          localStorage.setItem('itms', JSON.stringify(cvladi));
          window.location.reload();


        })



    })
      

      minusBtn.addEventListener('click',()=>{

        const cvladi = JSON.parse(localStorage.getItem("itms"));

        cvladi.map(data=>{

          data.no = data.no - 1;

          localStorage.setItem('itms', JSON.stringify(cvladi));
          window.location.reload();


        })




    })
}


// UPDATE CART TOTAL

function updateCartTotal(){

  const tableContainer = document.querySelector('#shopTable');
  const shopTotal = tableContainer.querySelector('#shopTotal');
  const shopDecription = tableContainer.querySelectorAll('.shop-decription');


  let total = 0;
  
  for(let k = 0; k < shopDecription.length; k++){

    let inputVal = shopDecription[k].querySelector('.shop-input');
    let inputValue = inputVal.value;
    let shopPrice = shopDecription[k].querySelector('.shop-price');
    let price = parseFloat(shopPrice.innerHTML.replace('₾', ''));
    total = total + ( price *  inputValue );


    
  }
  total = Math.round( total * 100 ) / 100;
  shopTotal.innerHTML = total + " ₾" ;


}

updateCartTotal();


// DELETE FROM CART

function Delete(e){

  let itms = [];

 JSON.parse(localStorage.getItem("itms")).map((data)=>{

  if(data.id != e.parentElement.parentElement.children[0].innerHTML ){

    itms.push(data);
  }
})
 updateCartTotal();
 localStorage.setItem("itms", JSON.stringify(itms));
 window.location.reload();

}



function copyParent(){

  return document.querySelector('#parentBox').cloneNode(true);

};

function child(){

  return document.querySelector('#child').cloneNode(true);

};



// SEARCH

const searchInput = document.querySelector('#searchInput');
const searched = document.querySelector('.searched-list ul');


searchInput.addEventListener('keyup', ()=>{

  const searchValue = searchInput.value;
  searched.innerHTML = "";

  

 fetch('db/data.json').then(function(respon){
  return respon.json();
}).then(function(data){
    
    const list = data.filter(function(e){

      return e.product.startsWith(searchValue) || e.code.startsWith(searchValue) ;
    })
    
    list.forEach((prod)=>{
   
   const li = document.createElement('li');
   const div = document.createElement('div');
   const divClass = document.createAttribute('class');
   divClass.value = "sugg d-flex justify-content-between flex-wrap align-items-center wow fadeIn";
   const divImg = document.createElement('img');
   divImg.src = prod.image;
   const divP = document.createElement('p');
   divP.innerHTML = prod.product;
  const divSpan = document.createElement('span');
  divSpan.innerHTML = prod.price + " ₾";


  li.append(div);
  div.setAttributeNode(divClass);
  div.append(divImg);
  div.append(divP);
  div.append(divSpan);


      searched.append(li);
   
    li.addEventListener('click', ()=>{

      window.location.href = "details.html?id=" + prod.id;
    })



    })


  if( searchValue === ''){
    
    searched.innerHTML = "";
  }
    
});


});



// MOBILE HUM

const mobileNav = document.querySelector('#mobileNav');
const hum = mobileNav.querySelector('.hum');
const header = document.querySelector('header');

hum.addEventListener('click', ()=>{

  mobileNav.classList.toggle('change');
    header.classList.toggle('change');
     htmlScroll.classList.toggle('stopActive');

});