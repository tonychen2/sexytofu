
window.addEventListener("click", notifyExtension);
console.warn("sexy-tofu extenstion start to inject content.js...");

var OnCartItemsChange = async (array) => {
    //send message or just use storage?
    console.log('current cart items:');
    console.table(array);
    await chrome.storage.sync.set({ items: array });
}

/* The InstaCart Cart "button" consists of 3 parts: a path, a span, and an svg (the cart icon). This function verifies that the 
"button" was clicked by checking if the target of user click had the attribute of any of these three parts.
*/
function notifyExtension(e) {
    let cartUI = document.querySelector('div[aria-label="Cart"]');
    let notInCartUI = cartUI?.hasAttribute('hidden') || cartUI?.style.display == 'none';
    let target = e.target;
    let tagName = target?.tagName?.toLowerCase();

    if (!notInCartUI && tagName == 'img') {
        target = target.parentElement;
        if (target.className == 'RetailerLogo') {
            setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
            return;
        }
    }
    else if (tagName != 'span' && tagName != 'button' && tagName != 'svg' && tagName != 'path') {
        return;
    }

    let max = 3, i = 0;
    while (target?.tagName?.toLowerCase() !== 'button') {
        target = target?.parentElement;
        i++;
        if (target == null || i > 3) {//sometimes, click area remove from UI, so no parent.
            break;
        }
    }
    console.info('Button Clicked: ', target? target.outerHTML: '(button removed.)');
    let ariaLabel = target?.getAttribute("aria-label")?.toLowerCase();
    let btnText = target?.outerText;

    if (notInCartUI) {
        if (ariaLabel?.includes("add") || ariaLabel?.includes("remove")
            || ariaLabel?.includes("increment") || ariaLabel?.includes("decrement")
            || target == null || btnText == 'Add to cart' || btnText == 'Update quantity') {
            //inform need open cart again.
            console.warn('Need reopen the cart again!')
            //document.querySelector('button[class="css-1xkv4c5"]').click()
            //TODO: get message to do?
        }
    }
    //view cart click, before function call, the UI attribute is in cart.
    else if (ariaLabel?.includes("view cart") || ariaLabel?.includes("increment") ||
        ariaLabel?.includes("decrement") || target.outerText == 'remove') {
        setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
    }
}

function printCart() {
    // TODO: Check if it's actually the right page
    //console.clear(); // personal preference
    // Previous version: scrape based on class name, yet unstable
    // On Jul 18: 'css-1k4e3ab' stopped working
    // var items = document.querySelectorAll('span[style*="color: rgb(52, 53, 56)"], div[class="rmq-a40185f5"]');
    //      for (i = 0; i < items.length; ++i) {
    //         console.log(items[i].textContent);
    //     }

    var items = document.querySelectorAll('div[aria-label="product"]');
    // TODO: Consider refactor as foreach + callback
    let cartItems = [];
    for (i = 0; i < items.length; ++i) {
        item = items[i];

        if (item.childElementCount == 2) { // TODO: Improve logic for failure check
            //unit: 6 ct,  3 lb, per lb, each
            textNode = item.firstChild.lastChild.firstChild // TODO: Handle situation where this is not true

            try {
                foodName = textNode.firstChild.firstChild.textContent;
                unit = textNode.firstChild.lastChild.textContent;
                quantity = textNode.firstChild.nextElementSibling.textContent;

                let food = BuildFoodItem(foodName, unit, quantity)
                cartItems.push(food);
            }
            catch {
                console.error('read cart item error:', textNode.outerHTML);
            }
        }
        else {
            // Alternative logic as a backup
            allTextContent = item.textContent;
            console.error("TODO: read cart item failed: ", allTextContent);

            // TODO: Parse text content
            // TODO: Send notification
        }
    }
    OnCartItemsChange(cartItems);
}

function BuildFoodItem(foodName, unit, quantity) {
    if (unit) {
        let numb = parseFloat(unit);
        if (numb) {
            // console.log(`before unit: ${unit}, quantity: ${quantity}`);
            quantity = numb * quantity;
            unit = unit.replace(numb, '').trim();
            if (UNIT_Convert[unit]) {
                unit = UNIT_Convert[unit];
            }

            // console.log(`after unit: ${unit}, quantity: ${quantity}`);
        }
        else if (unit == 'each' || unit.startsWith("per ")) {
            unit = "ea";
        }
    }

    return new TofuItem(foodName, unit, quantity);
}