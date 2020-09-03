var open_inv;
var inv_browser;
mp.keys.bind(0x49, true, () => {
    if(open_inv) { 
        inv_browser.destroy();
        open_inv = false;
    } else {
        inv_browser = mp.browsers.new("package://ui/index.html");
        open_inv = true;
    }
});

mp.events.add("add_item", (item) => {
    item = JSON.parse(item);
    inv_browser.execute("add_item(2, 1, " + item.Type + ");");
});