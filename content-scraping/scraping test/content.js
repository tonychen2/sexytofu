// alert("Offset");

// window.addEventListener ("load", myMain, false);

printCart();

function printCart() {
    var items = document.querySelectorAll('span[style*="color: rgb(52, 53, 56)"], div[class="css-1k4e3ab"]');
        for (i = 0; i < items.length; ++i) {
            console.log(items[i].textContent);
    }
}

//window.addEventListener("click", printCart);
 


// THINGS TO WORK ON:
// program only runs once and then cant run again until reloaded. this poses a problem if user clicks etension before full load
// clicking on cart button instead of extension button (having extension run in bg before user clicks for popup)
// connecting shop item w amount