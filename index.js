require('auth.js');
require('character.js');
require('hud.js');
require('inventory.js');

//Отправка уведомлений
mp.events.add("notify", (type, pos, msg, time) => {
    if(Browser.login.active) {
        Browser.login.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
    } else {
        Browser.hud.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
    }
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
    hud: null
}