// alert("Offset");

// window.addEventListener ("load", myMain, false);

// function myMain (evt) {
    var items = document.querySelectorAll('div[id^="cart_item"], div[data-testid="cartItemSizing"]');
    for (i = 0; i < items.length; ++i) {
    console.log(items[i].textContent);
    }
// }
 


// THINGS TO WORK ON:
// program only runs once and then cant run again until reloaded. this poses a problem if user clicks etension before full load
// clicking on cart button instead of extension button (having extension run in bg before user clicks for popup)
// connecting shop item w amount