var open_inv;
mp.keys.bind(0x49, true, () => {
    if(global.chat) return;
    if(open_inv) {
        mp.gui.cursor.show(false, false);
        open_inv = false;
    } else {
        mp.gui.cursor.show(true, true);
        open_inv = true;
    }
    Browser.index.execute("OpenCloseInventory()");
});

mp.events.add("client.additem", (item) => {
    item = JSON.parse(item);
    Browser.index.execute("add_item(" + item.Size.x + ", " + item.Size.y + ", " + item.ID + ", " + item.Count + ", " + item.Stack + ", " + item.Cell + ", '" + item.Data + "');");
});

mp.events.add("client.inventory.update", (items, cells) => {
    mp.events.callRemote("server.inventory.update", items, cells);
});

mp.events.add("client.item.use", (item) => {
    mp.events.callRemote("server.item.use", item);
});

mp.events.add("server.item.use.respose", (response) =>{
    Browser.index.execute("ItemUse(" + response + ")");
});

mp.events.add("client.item.act", (act, item) => {
    mp.events.callRemote("server.item.act", act, item);
})