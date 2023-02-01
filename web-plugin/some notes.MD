    product data as:
    https://github.com/ghgindex/ghgi/blob/main/ghgi/datasets/master/products.json

    "bananas": {
        "g": 180,
        "names": [
            "banana",
            "bananas",
            "plantain"
        ],
        "sg": 0.9,
        "super": {}
    },

//below can test in console....
fetch(`https://api.sexytofu.org/api.ghgi.org:443/rate`,
{
method: 'POST',
body: '{"recipe":["1 lb Container of Strawberries"]}'
}).then(res => res.json()).then(json => console.log(json.items[0]))

//below from sexy-tofu front-end code.
const ALL_UNITS = ['ml', 'l', 'g', 'kg', 'cup', 'teaspoon',
'tablespoon', 'ounce', 'pound', 'quart',
'pint', 'dash', 'pinch', 'handful', 'fistful', 'smidgen', 'ea'];

//below from ghgi code.
ENERGY = {
'kcal': 4184,
'cal': 4.184,
'joule': 1.0,
}
MASS = { // to grams
'kg': 1000.0,
'pound': 453.592,
'ounce': 28.3495,
'g': 1.0,
}
VOLUME = { // to milliliters
'gallon': 3785.41,
'l': 1000.0,
'quart': 946.353,
'pint': 473.176,
'cup': 236.588,
'drop': 0.05,
'handful': 118.0,
'fistful': 59.0,
'fluid_oz': 29.5735,
'tablespoon': 14.7868,
'teaspoon': 4.92892,
'ml': 1.0,
'dash': 0.616,
'pinch': 0.308,
'smidgen': 0.154,
}


 View cart item logs in background.js is better.