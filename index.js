require('auth.js');
require('character.js');
require('hud.js');
require('inventory.js');

//Отправка уведомлений
mp.events.add("notify", (type, pos, msg, time) => {
        Browser.index.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
});

//Класс данных игрока
class ClientData {
    board = null;
    inventory = null;
}

//Бразеры
const Browser = {
    login: null,
    character: null,
    hud: null,
    index: null
}
setTimeout(() => {
Browser.index = mp.browsers.new("package://ui/index.html");
}, 10);

global.chat = false;

mp.keys.bind(0x0D, true, () => {
    if(global.chat == true)
        global.chat = false;
});

mp.keys.bind(0x54, true, () => {
    if(global.chat == false)
        global.chat = true;
})