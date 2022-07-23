window.addEventListener("click", notifyExtension); 

/* The InstaCart Cart "button" consists of 3 parts: a path, a span, and an svg (the cart icon). This function verifies that the 
"button" was clicked by checking if the target of user click had the attribute of any of these three parts.
*/
function notifyExtension(e) { 
    if (e.target.tagName.toLowerCase() == "button") {
        if (e.target.getAttribute("aria-label").includes("View Cart")) {
            setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
        }
    }
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
    // TODO: Check if it's actually the right page
    console.clear(); // personal preference
    // Previous version: scrape based on class name, yet unstable
    // On Jul 18: 'css-1k4e3ab' stopped working
    // var items = document.querySelectorAll('span[style*="color: rgb(52, 53, 56)"], div[class="rmq-a40185f5"]');
    //      for (i = 0; i < items.length; ++i) {
    //         console.log(items[i].textContent);
    //     }
    var items = document.querySelectorAll('div[aria-label="product"]');
        // TODO: Consider refactor as foreach + callback
        for (i = 0; i < items.length; ++i) {
            item = items[i];

            if (item.childElementCount == 2) { // TODO: Improve logic for failure check
                textNode = item.lastChild.firstChild.firstChild.firstChild  // TODO: Handle situation where this is not true

                nameNode = textNode.firstChild.firstChild
                unitNode = textNode.firstChild.lastChild
                quantityNode = textNode.lastChild

                console.log(nameNode.textContent);
                console.log(unitNode.textContent);
                console.log(quantityNode.textContent);
            }
            else {
                // Alternative logic as a backup
                allTextContent = item.textContent;
                console.log(allTextContent);

                // TODO: Parse text content
                // TODO: Send notification
            }
        }

}