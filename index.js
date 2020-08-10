require('auth.js');
require('character.js');
require('hud.js')

mp.events.add("notify", (type, pos, msg, time) => {
    if(loginBrowser.active) {
        loginBrowser.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
    } else {
        hudBrowser.execute('notify(' + type + ',' + pos + ',"' + msg + '",' + time + ')')
    }
})