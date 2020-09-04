var open_inv;
var inv_browser;
mp.keys.bind(0x49, true, () => {
    if(open_inv) { 
        inv_browser.destroy();
        mp.gui.cursor.show(false, false);
        open_inv = false;
    } else {
        inv_browser = mp.browsers.new("package://ui/index.html");
        mp.gui.cursor.show(true, true);
        open_inv = true;
    }
});

mp.events.add("client.additem", (item) => {
    item = JSON.parse(item);
    inv_browser.execute("add_item(2, 1, " + item.ID + ");");
});

mp.events.add("client.inventory.update", (items) => {
    mp.events.callRemote("server.inventory.update", items)
})