## HOW TO USE 
There are some limitations to making this work that I haven't sorted out yet, so everying in this list has to be followed pretty closely at the moment. Also, the code is fairly messy right now because I'm trying so many things but I'll clean it up.

### Setting Up The Extension 
1) In a Chrome window, go to chrome://extensions/ (leave this tab open)
2) In the upper right hand corner, toggle on the developer mode
3) Click "Load Unpacked" and upload the "Scraping Test" folder 
4) Now, go to instacart in a new tab (specfically https://www.instacart.com/store)
5) You should now have a white puzzle-piece icon in the top right hand corner, next to the search bar. Click on it, hit the three little dots next to "Scraping Test", and hover over "This Can Read and Change Site Data". Change it from "on instacart.com" to "When You Click the Extension". This will make it so that you have control over when the extension runs, making debugging easier. 
6) Click on the white puzzle-piece  again, hit the pin next to "Scraping Test". This gives you a little blue puzzle-piece icon that you can click to activate the extension. 

### Using the Extension 

#### Some Notes: 
1) The ability to only work on instacart is hardcoded into the extension, but you still need to click the blue icon for it to work based on the set up above.
2) It's best to wait for the page to finish loading before hitting the blue icon (there's a way to implement an automatic version of this and it's very simple--it should already be in the code--but I've commented it out because it makes debugging more complicated. I'll put it back when I'm done.)
3) Everything prints to the console, so make sure it's open.
4) To run the extension a second time, you need to hit refresh on BOTH the extension itself (in the extensions tab) AND the webpage (this is very frustrating but I've yet to look into how to fix it. 

#### Bugs: 
1) Currently, the code runs properly ONLY when the cart button has already been clicked. The goal is to have part of it run in the background and to "listen" to when the cart button is clicked, THEN run the part that scrapes the cart. This is difficult because content scripts run once--when all elements have loaded and then never again (unless everything is refreshed). However, contents scripts are the only scripts that have access to the DOM elements of the page. 

2) Fix the refresh problem from "Some Notes" #4










