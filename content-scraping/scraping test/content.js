window.addEventListener("click", notifyExtension); 

/* The InstaCart Cart "button" consists of 3 parts: a path, a span, and an svg (the cart icon). This function verifies that the 
"button" was clicked by checking if the target of user click had the attribute of any of these three parts.
*/
function notifyExtension(e) { 
    if (e.target.tagName.toLowerCase() == "path") {
        if (e.target.getAttribute("d").includes("M7")) {
            setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
        }
    }
   if (e.target.tagName.toLowerCase() == "span") {
        if (e.target.getAttribute("class") == "css-pvkn2g") {
            setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
        }
    }
    if (e.target.tagName.toLowerCase() == "svg") {
        if (e.target.getAttribute("size") == "24") {
            setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
        }
    }
}

function printCart() {
    console.clear(); // personal preference
    var items = document.querySelectorAll('span[style*="color: rgb(52, 53, 56)"], div[class="css-1k4e3ab"]');
         for (i = 0; i < items.length; ++i) {
            console.log(items[i].textContent);
        }
}