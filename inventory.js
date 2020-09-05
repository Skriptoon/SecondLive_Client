var open_inv;
mp.keys.bind(0x49, true, () => {
    if(open_inv) {
        Browser.index.execute("$('#inventory').css('display', 'none')");
        mp.gui.cursor.show(false, false);
        open_inv = false;
    } else {
        Browser.index.execute("$('#inventory').css('display', 'block')");
        mp.gui.cursor.show(true, true);
        open_inv = true;
    }
});

mp.events.add("client.additem", (item) => {
    item = JSON.parse(item);
    Browser.index.execute("add_item(" + item.Size.x + ", " + item.Size.y + ", " + item.ID + ");");
});

mp.events.add("client.inventory.update", (items, cells) => {
    mp.events.callRemote("server.inventory.update", items, cells)
})