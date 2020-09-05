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