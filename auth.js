var loginBrowser;
var SpawnData;

global.loggedin = false;

setTimeout(function () {
    mp.gui.cursor.show(true, true);
    loginBrowser = mp.browsers.new("package://ui/auth.html");
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.gui.chat.activate(false);
    mp.game.cam.setFollowPedCamViewMode(1);
}, 10);

mp.events.add("cef_login", (user, pass) => {
    mp.events.callRemote("client.login", user, pass);
});

mp.events.add("cef_register", (user, email, pass) => {
    mp.events.callRemote("client.register", user, email, pass);
});

mp.events.add("client.login.response", (data) => {
    if(typeof data == "string") {
        loginBrowser.execute("pick_char('" + data + "')");
    } else {
        switch(data) {
            case 1: {
                loginBrowser.execute("sendError('Не верный логин или пароль')");
                break;
            }
            case 2: {
                loginBrowser.execute("sendError('Аккаунт привязан к другому SocialClub')");
                break;
            }
            case 3: {
                loginBrowser.execute("sendError('Ошибка авторизации. Попробуйте позже')");
                break;
            }
        }
    }
});

mp.events.add("client.register.response", (data) => {
    switch(data) {
        case 1: {
            loginBrowser.execute("sendError('Заполните все поля')");
            break;
        }
        case 2: {
            loginBrowser.execute("sendError('Этот SocialClub уже зарегистрирован')");
            break;
        }
        case 3:  {
            loginBrowser.execute("sendError('Логин уже занят')");
            break;
        }
        case 4: {
            loginBrowser.execute("sendError('Этот Email уже зарегистрирован')");
            break;
        }
        case 5: {
            loginBrowser.execute("sendError('Ошибка регистрации. Попробуйте позже')");
            break;
        }
        default: {
            loginBrowser.destroy();
            break;
        }
    }
});

mp.events.add("cef.selectCharacter", (number) => {
    mp.events.callRemote("client.selectCharacter", number);
});

mp.events.add("client.selectCharacter.response", (data) => {
    if(data) {
        SpawnData = JSON.parse(data);
        loginBrowser.execute("SpawnInfo('" + data + "')");
    } else {
        loginBrowser.destroy();
    }
});

mp.events.add("cef.spawn", (number) => {
    switch(number) {
        case 0: {
            var position = SpawnData.spawnMenu.pos;
            break;
        }
        case 1: {
            var position = SpawnData.spawnMenu.startpos;
            break;
        }
    }
    mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, true, true, true);
    mp.players.local.freezePosition(false);
    loginBrowser.destroy();
    mp.gui.cursor.show(false, false);
    //mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(true);
    mp.gui.chat.activate(true);
    mp.events.callRemote("client.spawn")
    global.loggedin = true;
});

mp.events.add("cef.createCharacter", (num) => {
    loginBrowser.destroy();
    mp.events.callRemote("client.createCharacter", num);
});