var SpawnData;

global.loggedin = false;

setTimeout(function () {
    mp.gui.cursor.show(true, true);
    Browser.login = mp.browsers.new("package://ui/auth.html");
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
        Browser.login.execute("pick_char('" + data + "')");
    } else {
        switch(data) {
            case 1: {
                Browser.login.execute("sendError('Не верный логин или пароль')");
                break;
            }
            case 2: {
                Browser.login.execute("sendError('Аккаунт привязан к другому SocialClub')");
                break;
            }
            case 3: {
                Browser.login.execute("sendError('Ошибка авторизации. Попробуйте позже')");
                break;
            }
        }
    }
});

mp.events.add("client.register.response", (data) => {
    switch(data) {
        case 1: {
            Browser.login.execute("sendError('Заполните все поля')");
            break;
        }
        case 2: {
            Browser.login.execute("sendError('Этот SocialClub уже зарегистрирован')");
            break;
        }
        case 3:  {
            Browser.login.execute("sendError('Логин уже занят')");
            break;
        }
        case 4: {
            Browser.login.execute("sendError('Этот Email уже зарегистрирован')");
            break;
        }
        case 5: {
            Browser.login.execute("sendError('Ошибка регистрации. Попробуйте позже')");
            break;
        }
        default: {
            Browser.login.destroy();
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
        Browser.login.execute("SpawnInfo('" + data + "')");
    } else {
        Browser.login.destroy();
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
    Browser.login.destroy();
    Browser.hud = mp.browsers.new("package://ui/hud.html");

    mp.gui.cursor.show(false, false);
    //mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(true);
    mp.gui.chat.activate(true);
    mp.events.callRemote("client.spawn")
    global.loggedin = true;
});

mp.events.add("cef.createCharacter", (num) => {
    Browser.login.destroy();
    mp.events.callRemote("client.createCharacter", num);
});