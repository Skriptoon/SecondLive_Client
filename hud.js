const maxDistance = 20 * 20; // Дистанция, с которой будут отображаться ники
const width = 0.03; // Ширина
const height = 0.0050; // Высота
const border = 0.001; // Обвока
const muted = [255, 255, 255, 255]; // Цвета
const speak = [255, 0, 0, 255];

const graphics = mp.game.graphics;
const localPlayer = mp.players.local;

var lonline = 0;

let currentHungerData = 100;

var hudBrowser;


const getMinimapAnchor = (mapState = 0) => {
    const graphics = mp.game.graphics;
    const safezone = graphics.getSafeZoneSize();
    const safezone_x = 1.0 / 20.0;
    const safezone_y = 1.0 / 20.0;
    const aspect_ratio = graphics.getScreenAspectRatio(false);
    const {
        x: res_x,
        y: res_y
    } = graphics.getScreenActiveResolution(0, 0);
    const xscale = 1.0 / res_x;
    const yscale = 1.0 / res_y;

    const Minimap = {};

    Minimap.width = xscale * (res_x / ((mapState === 0 ? 4 : 2.53) * aspect_ratio));
    Minimap.height = yscale * (res_y / (mapState === 0 ? 5.674 : 2.43));
    Minimap.left_x = xscale * (res_x * (safezone_x * ((Math.abs(safezone - 1.0)) * 10)));
    Minimap.bottom_y = 1.0 - yscale * (res_y * (safezone_y * ((Math.abs(safezone - 1.0)) * 10)));
    Minimap.right_x = Minimap.left_x + Minimap.width;
    Minimap.top_y = Minimap.bottom_y - Minimap.height;
    Minimap.x = Minimap.left_x;
    Minimap.y = Minimap.top_y;
    Minimap.xunit = xscale;
    Minimap.yunit = yscale;

    return Minimap;
}

const minimapData = getMinimapAnchor();

const _height = 0.01;
const hungerX = minimapData.x + minimapData.width / 2;
const hungerY = minimapData.y - _height / 2;

mp.events.add('render', (nametags) => {
    if (!global.loggedin) {
        return;
    }

    if (mp.players.length != lonline) {
        lonline = mp.players.length;
        var date = new Date();


        hudBrowser.execute('WaterMark.online = ' + lonline + ';\
        HUD.time = ' + date.getHours() + ':' + date.getMinutes() + ';\
        HUD.date = ' + date.getDate()  + '.' + date.getMonth() + '.' + date.getFullYear() + ';');
    }

    /*graphics.drawRect(hungerX, hungerY, minimapData.width, _height, 0, 0, 0, 150);
    graphics.drawRect(hungerX - (minimapData.width - (minimapData.xunit * 2)) * Math.abs(1 - (currentHungerData / 100)) / 2, hungerY, (currentHungerData / 100) * (minimapData.width - minimapData.xunit * 2), _height - (minimapData.yunit * 2), 149, 149, 149, 200);

    const localPlayerHealth = localPlayer.getMaxHealth();
    mp.game.graphics.drawText(`${localPlayerHealth >= 200 ? localPlayerHealth - 100 : localPlayerHealth}`, [minimapData.x + 0.04, minimapData.bottom_y - 0.0175], {
        font: 0,
        color: [255, 255, 255, 200],
        scale: [0.18, 0.18],
        outline: true
    });*/
    
    /*nametags.forEach(nametag => {
        try {
            let [player, x, y, distance] = nametag;*/

            /*player.setMaxHealth(player.getVariable('ADD_HP') || 200);

            const isAimingToPlayer = mp.game.player.isFreeAimingAtEntity(player.handle);

            if (thisInfo.isAdmin && isAimingToPlayer) {
                graphics.drawText(`${player.name} (${player.remoteId}) (${player.getHealth()}/${player.getMaxHealth()})`, [0.5, 0.8], {
                    font: 4,
                    color: [255, 255, 255, 235],
                    scale: [0.5, 0.5],
                    outline: true
                });
            }

            if (player.isVoiceActive) {
                const scaleSprite = thisInfo.textureResolutionRelative;

                if (graphics.hasStreamedTextureDictLoaded('mpleaderboard') === 1) {
                    graphics.drawSprite('mpleaderboard', 'leaderboard_audio_3', x, y + 0.05, scaleSprite.x, scaleSprite.y, 0, 255, 255, 255, 255);
                } else {
                    graphics.requestStreamedTextureDict('mpleaderboard', true);
                }
            }

            if (showNames) {
                const playerFractionId = player.getVariable('fraction');

                if (distance <= maxDistance && player.getVariable('INVISIBLE') != true) {
                    const pos = player.getBoneCoords(12844, 0.5, 0, 0);

                    let passportText = '';
                    if (typeof passports[player.name] !== 'undefined') {
                        passportText = ` | ${passports[player.name]}`;
                    }

                    let text = (
                        thisInfo.isAdmin ||
                        typeof mp.storage.data.friends[player.name] !== 'undefined' ||
                        typeof passports[player.name] !== 'undefined'
                    )
                        ? `\n${player.name} (${player.remoteId}${passportText})`
                        : `ID: ${player.remoteId}`;

                    if (
                        thisInfo.fractionId &&
                        playerFractionId &&
                        thisInfo.fractionId === playerFractionId
                    ) {
                        text = `\n${player.name} (${player.remoteId}${passportText})`;
                    }

                    const color = player.getVariable('REDNAME') === true
                        ? [255, 0, 0, 255]
                        : [255, 255, 255, 255];

                    const scaleText = 0.35;

                    graphics.drawText(text, [pos.x, pos.y, pos.z], {
                        font: 4,
                        color: color,
                        scale: [scaleText, scaleText],
                        outline: true
                    });

                    if (isAimingToPlayer) {
                        let y2 = y + 0.042;
                        let health = player.getHealth();
                        health = (health <= 100) ? (health / 100) : ((health - 100) / 100);

                        let armour = player.getArmour() / 100;

                        graphics.drawRect(x, y2, withWithBorderDouble, heightWithBorderDouble, 0, 0, 0, 200);
                        graphics.drawRect(x, y2, width, height, 150, 150, 150, 255);
                        graphics.drawRect(x - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);

                        if (armour > 0) {
                            y -= 0.007;
                            y2 -= 0.007;

                            graphics.drawRect(x, y2, withWithBorderDouble, heightWithBorderDouble, 0, 0, 0, 200);
                            graphics.drawRect(x, y2, width, height, 41, 66, 78, 255);
                            graphics.drawRect(x - width / 2 * (1 - armour), y2, width * armour, height, 48, 108, 135, 200);
                        }
                    }
                }
            }*/
       /* } catch(e) {
            graphics.notify(`${e.toString()}`);
        }
    });*/

    mp.game.ui.hideHudComponentThisFrame(22);
    mp.game.ui.hideHudComponentThisFrame(19);
    mp.game.ui.hideHudComponentThisFrame(20);
    mp.game.ui.hideHudComponentThisFrame(3);
    mp.game.ui.hideHudComponentThisFrame(2);

    /*if (localplayer.isInAnyVehicle(false)) {
        var veh = localplayer.vehicle;

        if (!inVeh) {
            mainBrowser.emit('account.cef.updateSpeedometer', {
                state: veh.getPedInSeat(-1) === mp.players.local.handle ? 2 : 1
            });
        }

        inVeh = true;

        const fueltTankValue = veh.getVariable('FUELTANK');

        if (typeof fueltTankValue !== 'undefined') {
            graphics.drawText(`Загружено: ${fueltTankValue}/1000л`, [0.93, 0.80], {
                font: 0,
                color: [255, 255, 255, 185],
                scale: [0.4, 0.4],
                outline: true
            });
        }

        const petrolValue = veh.getVariable('PETROL');
        const maxPetrolValue = veh.getVariable('MAXPETROL');

        if (typeof petrolValue !== 'undefined' && typeof maxPetrolValue !== 'undefined') {
            if (fuel != petrolValue && petrolValue >= 0) {
                mainBrowser.emit('account.cef.updateSpeedometer', {
                    fuel: petrolValue
                });

                fuel = petrolValue;

                if (petrolValue <= (maxPetrolValue * 0.2)) {
                    ifuel = 0;
                } else if (petrolValue <= (maxPetrolValue * 0.6)) {
                    ifuel = 1;
                } else {
                    ifuel = 2;
                }
            }
        }

        var engine = veh.getIsEngineRunning();
        if (engine != null && engine !== lengine) {
            mainBrowser.emit('account.cef.updateSpeedometer', {
                engineActive: engine
            });

            lengine = engine;
        }

        const lockedValue = veh.getVariable('LOCKED');

        if (typeof lockedValue !== 'undefined') {
            if (ldoors !== lockedValue) {

                mainBrowser.emit('account.cef.updateSpeedometer', {
                    doorsOpen: !lockedValue
                });

                ldoors = lockedValue;
            }
        }

        let hp = parseInt(veh.getHealth() / 10);
        if (hp !== hpveh) {
            mainBrowser.emit('account.cef.updateSpeedometer', {
                hp
            });

            hpveh = hp;
        }

        if (new Date().getTime() - lcall > 350) {
            let speed = (veh.getSpeed() * 3.6).toFixed();
            mainBrowser.emit('account.cef.updateSpeedometer', {
                speed
            });

            lcall = new Date().getTime();

            if (cruiseSpeed != -1) {// kostyl'
                veh.setMaxSpeed(cruiseSpeed);
            }
        }
    } else {
        if (inVeh) {
            // mp.gui.execute(`HUD.inVeh=0`);

            mainBrowser.emit('account.cef.updateSpeedometer', {
                state: 0
            });
        }

        inVeh = false;
    }*/

    // player's zone showing
    /*if (global.showhud) {
        graphics.drawText(`~y~${thisInfo.realZoneName}`, [0.08, 0.76], {
            font: 4,
            color: [255, 255, 255, 200],
            scale: [0.5, 0.5],
            outline: true
        });
    }*/
});