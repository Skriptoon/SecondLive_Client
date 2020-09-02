require('auth.js');
require('character.js');
require('hud.js');
require('inventory.js');
mp.gui.chat.push('Hello World');
//Отправка уведомлений
mp.events.add("notify", (type, pos, msg, time) => {
    if(loginBrowser.active) {
        loginBrowser.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
    } else {
        hudBrowser.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
    }
})

//Класс данных игрока
class ClientData {
    board = null;
    inventory = null;
}

//Бразеры
const Browser = {
    login,
    character,
    hud
}