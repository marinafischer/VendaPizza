let cart = []; //criar o carrinho como uma variável vetor, adicionar infos nessa variavel
let modalQt = 1; //definir variável para a quantia de pizza selecionada
let modalKey = 0; //definir qual pizza foi clicada

const c = (el)=>document.querySelector(el);
const cs= (el)=>document.querySelectorAll(el);


//Listagem das pizzas
pizzaJson.map ((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //Preencher as infos em pizza intem (true) pois quer pegar o models e oq tem dentro
   
    pizzaItem.setAttribute('data-key', index); //identificar o pizzaItem para saber de qual elemento está se referindo
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    //dentro de pizza item, na img, vai pegar a src e trocar pela imagem
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
   //dentro do model, no lugar aonde fica o nome, substitui pela informação name do vetor
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    //Evento de clique para abrir modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ //evento para quando 1.clicar no a abrir uma 2.função
        e.preventDefault (); //evita q fique atualizando
        let key = e.target.closest('.pizza-item').getAttribute('data-key');     //identifica qual pizza clicou
        modalQt = 1; //sempre que abrir o modal a quantia inicial de pizzas será 1
        modalKey = key; //para manter a informação de qual pizza clicou salva

        c('.pizzaBig img').src= pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
         
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity= 0; //para abrir a janela de forma animada mudando a opacidade - mesclar com CSS
        c('.pizzaWindowArea').style.display= 'flex'; //vai mudar o tipo de display no pizza área (estava none foi para flex)
        setTimeout  ( () => { //animação pára abrir tela
        c('.pizzaWindowArea').style.opacity=1;
        }, 200);   
    }); 
    c('.pizza-area').append(pizzaItem);
    //aplica o model na pizza-area
});

//Evento do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity= 0;
    setTimeout (()=>{
        c('.pizzaWindowArea').style.display= 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modalQt>1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});


cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e) =>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Adicionar itens no carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //qual o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //criar identificador com sabor e tamanho, caso seleciome mais de uma vez a mesma pizza
    let identifier = pizzaJson[modalKey].id+'@'+size;
    //Verificar se o item já existe no carrinho
    let key = cart.findIndex((item)=> item.identifier == identifier);
    // se achar (ou seja 0) coloca a quantia no carrinho
    if(key > -1) {
        cart[key].qt += modalQt;
    } else { //se não achar, adiciona novo item
        cart.push ({
            identifier,
            id:pizzaJson[modalKey].id,  //qual a pizza?
            size:size, //qual o tamanho?
            qt: modalQt //quantas pizzas?
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', () => {
    if(cart.length >0) {
    c('aside').style.left = '0';
    } 
});

c('.menu-closer').addEventListener('click' , () => {
    c('aside').style.left = '100vw';
});

//Função de atualizar carrinho: abrir o carrinho, mudar valor etc.:
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = " ";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);            
            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0: 
                    pizzaSizeName = 'P';
                    break;
                case 1: 
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;

            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;  //variável para ter info de nome e tamanho
            
            cartItem.querySelector('img').src= pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; //variável para aparecer nome e tamanho
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qt > 1 ) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); //splice é para remover um item
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt++;
                updateCart(); //cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        cs('.subtotal span')[1].innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
} 
