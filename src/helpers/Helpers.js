import { Headphones } from '../const/Headphones';

// ------------------------------------ basket logic ------------------------------------

const basketArray = []; // work sample

export function isBasketExist() { // check basket in local storage. create new empty if basket is empty
    if (!getTempBasket()) {
        setTempBasket(basketArray);
    }
}

export function getTempBasket() {
    return JSON.parse(sessionStorage.getItem('basketArray'));
}
  
export function setTempBasket(temp_basket) {
    sessionStorage.setItem('basketArray', JSON.stringify(temp_basket));
}

// ------------------------------------ basket indicator logic ------------------------------------

export function basketIndicatorFunction(){ // show sum of basketArray items in sessionStorage
    if (getTempBasket()){
        return getTempBasket().length;
    } else return 0;
}

export function updateIndicator(){ // show global counts of items in basket
    const indicator = document.getElementById('basket_indicator');
    indicator.innerHTML = basketIndicatorFunction();
}

// ------------------------------------ language hendler logic ------------------------------------

export function getLang() {
    return JSON.parse(sessionStorage.getItem('lang'));
}

export function isRussian() {
    return (getLang() === 'rus')
}
  
export function setLang(lang) { // rus or eng
    sessionStorage.setItem('lang', JSON.stringify(lang));
}

export function checkLang(){
    if(!getLang()){ setLang('eng')}
}

// ------------------------------------ basket items logic ------------------------------------

export function addBasket(id) { // add item to local storage)
    let temp_basket = getTempBasket();
    (temp_basket.length === 0) ? isNotDublicate(id) : ifDublicate(id);
};


export function ifDublicate(id) { // if sessionStorage includes added item
    let foundDublicate = false;
    let temp_basket = getTempBasket();
    temp_basket.forEach(el => { // check on dublicate
        if (el.id === id) {
            el.counts++;
            foundDublicate = true;
        }
    });
    foundDublicate ? setTempBasket(temp_basket) : isNotDublicate(id);
}

export function isNotDublicate(id) { // use if sessionStorage not includes added item
    let temp_basket = getTempBasket();
    temp_basket.push(Headphones[id]);
    setTempBasket(temp_basket);
}

export function deleteItem(id){
    let temp_basket = getTempBasket();
    temp_basket.forEach( el => {
        if(el.id === id){
            let index = temp_basket.indexOf(el);
            temp_basket.splice(index, 1);
        }
    })
    setTempBasket(temp_basket);
}

export function plusItem(id){
    let temp_basket = getTempBasket();
    temp_basket.forEach(el => {
        if(el.id === id){
            el.counts++;
            updateSum(id, el);
        }
    })
    setTempBasket(temp_basket);
}

export function minusItem(id){
    let temp_basket = getTempBasket();
    temp_basket.forEach(el => {
        if(el.id === id){
            if(el.counts <= 1){
                return;
            }
            el.counts--;
            updateSum(id, el);
        }
    })
    setTempBasket(temp_basket);
}

export function updateSum(){
    let totalSum = 0;
    let temp_basket = getTempBasket();
    temp_basket?.forEach(el =>(
        totalSum += (el.counts * el.price)
    ))
    return totalSum;
}

// ------------------------------------ basket card logic ------------------------------------

export function findElements(id){
    return getTempBasket().find(el => el.id === id);
}

export function totalItemSum(id){
    const {counts, price} = findElements(id);
    return counts * price;
}

export function countsOfItem(id){
    return findElements(id).counts;
}

// ------------------------------------ basket card's buttons ------------------------------------


export function clickMinus(props, setSum, setfindElements){
    minusItem(props.id);
    setSum(totalItemSum(props.id));
    setfindElements(countsOfItem(props.id));
}

export function clickPlus(props, setSum, setfindElements){
    plusItem(props.id);
    setSum(totalItemSum(props.id));
    setfindElements(countsOfItem(props.id));
}

export function deleteClick(props, setBasket, setCount){
    deleteItem(props.id);
    setBasket(getTempBasket());
    setCount(basketIndicatorFunction());
}