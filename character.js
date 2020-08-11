const hairIDList = [
  // male
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  // female
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
];

const validTorsoIDs = [
  // male
  [0, 0, 2, 14, 14, 5, 14, 14, 8, 0, 14, 15, 12, 12, 12, 15],
  // female
  [0, 5, 2, 3, 4, 4, 5, 5, 5, 0]
];

let characterSaved = false;

mp.events.add('entityStreamIn', (entity) => {
  if (entity.type !== 'player') {
    return;
  }

  if (entity.getVariable('PROP_0') !== undefined) {
    const prop = entity.getVariable('PROP_0');
    entity.setPropIndex(0, prop[0], prop[1], true);
  }

  if (entity.getVariable('PROP_1') !== undefined) {
    const prop = entity.getVariable('PROP_1');
    entity.setPropIndex(1, prop[0], prop[1], true);
  }

  if (entity.getVariable('PROP_6') !== undefined) {
    const prop = entity.getVariable('PROP_6');
    entity.setPropIndex(6, prop[0], prop[1], true);
  }

  if (entity.getVariable('PROP_7') !== undefined) {
    const prop = entity.getVariable('PROP_7');
    entity.setPropIndex(7, prop[0], prop[1], true);
  }
});

const thisInfo = {
  activeCreator: false,
  polarAngleDeg: -116,
  azimuthAngleDeg: 90,
  activeMovementCamera: false,
  movementRadius: 0.54,
  azimutMax: 160,
  azimutMin: 80,
  posistionPoint: new mp.Vector3(),
  character: {
    gender: 0,
    outClothes: 15,
    pants: 0,
    shoes: 1,
    appearance: new Array(11).fill(1).map(() => 255),
    features: new Array(20).fill(1).map(() => 0),
    hair: 0,
    hairColor: 0,
    eyeColor: 0,
    father: 0,
    mother: 21,
    similarity: 0.5,
    skin: 0.5,
    blemishes: 0,
    ageing: 255,
    makeup: 255,
    blush: 255,
    complexion: 255,
    sundamage: 255,
    lipstick: 255,
    freckles: 255,
    chesthair: 255,
    bodyblemishes: 255
  }
};

const localPlayer = mp.players.local;

const characterCreatorCamera = mp.cameras.new('default', new mp.Vector3(402.8664, -996.4108, -99.00027), new mp.Vector3(0, 0, 0), 50);

mp.events.add('characterCreator.client.init', (data) => {
  data = typeof data === 'string' ? JSON.parse(data) : data;

  const { heading, position } = data;

  thisInfo.activeCreator = true;

  mp.game.ui.displayHud(false);

  localPlayer.freezePosition(true);
  localPlayer.setHeading(heading);
  localPlayer.setCoordsNoOffset(position.x, position.y, position.z, true, true, true);

  characterCreatorCamera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 500, true, false);

  thisInfo.polarAngleDeg = 90;
  thisInfo.azimuthAngleDeg = 90;

  thisInfo.posistionPoint = localPlayer.getBoneCoords(12844, 0, 0, 0);

  const polarAngleRad = thisInfo.polarAngleDeg * Math.PI / 180.0;
  const azimuthAngleRad = thisInfo.azimuthAngleDeg * Math.PI / 180.0;

  const nextCamLocation = new mp.Vector3(
    thisInfo.posistionPoint.x + thisInfo.movementRadius * (Math.sin(azimuthAngleRad) * Math.cos(polarAngleRad)),
    thisInfo.posistionPoint.y - thisInfo.movementRadius * (Math.sin(azimuthAngleRad) * Math.sin(polarAngleRad)),
    thisInfo.posistionPoint.z - thisInfo.movementRadius * Math.cos(azimuthAngleRad)
  );

  characterCreatorCamera.setCoord(nextCamLocation.x - 0.15, nextCamLocation.y, nextCamLocation.z);
  characterCreatorCamera.pointAtCoord(thisInfo.posistionPoint.x - 0.15, thisInfo.posistionPoint.y, thisInfo.posistionPoint.z);
  
  /*localPlayer.model = mp.game.joaat('mp_f_freemode_01');
  localPlayer.model = mp.game.joaat('mp_m_freemode_01');*/
  
  updateCharacterParents();

  for (var i = 0; i < 20; i++) {
    localPlayer.setFaceFeature(i, 0.0);
  }

  updateCharacterHairAndColors();
  updateAppearance();
  updateClothes();

  Browser.character = mp.browsers.new("package://ui/character.html");
  mp.gui.cursor.show(true, true);

  /*mp.game.streaming.requestAnimDict('amb@world_human_guard_patrol@male@base');

  const timer = setInterval(() => {
    if (mp.game.streaming.hasAnimDictLoaded('amb@world_human_guard_patrol@male@base')) {
      clearInterval(timer);
      localPlayer.taskPlayAnim('amb@world_human_guard_patrol@male@base', 'base', 2.0, -2.0, -1, 1, 0, true, false, true);
    }
  }, 50);*/

  characterSaved = false;
});
/*
mp.keys.bind(0x12, false, () => {
  if (thisInfo.activeMovementCamera) {
    //mainBrowser.emit('characterCreator.interface.toggleControl', false);
    thisInfo.activeMovementCamera = false;
  }
});

mp.keys.bind(0x12, true, () => {
  if (!thisInfo.activeMovementCamera) {
    //mainBrowser.emit('characterCreator.interface.toggleControl', true);
    thisInfo.activeMovementCamera = true;
  }
});
*/
function updateCharacterParents() {
  localPlayer.setHeadBlendData(
    thisInfo.character.mother,
    thisInfo.character.father,
    0,

    thisInfo.character.mother,
    thisInfo.character.father,
    0,

    thisInfo.character.similarity,
    thisInfo.character.skin,
    0.0,

    true
  );
}

function updateCharacterHairAndColors() {
  const currentGender = thisInfo.character.gender;
  localPlayer.setComponentVariation(2, thisInfo.character.hair, 0, 0);
  localPlayer.setHairColor(thisInfo.character.hairColor, 0);

  // appearance colors
  localPlayer.setHeadOverlayColor(2, 1, thisInfo.character.hairColor, 100); // eyebrow
  localPlayer.setHeadOverlayColor(1, 1, thisInfo.character.hairColor, 100); // beard
  localPlayer.setHeadOverlayColor(10, 1, thisInfo.character.hairColor, 100); // chesthair
  /*localPlayer.setHeadOverlay(0, thisInfo.character.blemishes, 100, 0, 0)
  localPlayer.setHeadOverlay(3, thisInfo.character.ageing, 100, 0, 0)
  localPlayer.setHeadOverlay(4, thisInfo.character.makeup, 100, 0, 0)
  localPlayer.setHeadOverlay(5, thisInfo.character.blush, 100, 0, 0)
  localPlayer.setHeadOverlay(6, thisInfo.character.complexion, 100, 0, 0)
  localPlayer.setHeadOverlay(7, thisInfo.character.sundamage, 100, 0, 0)
  localPlayer.setHeadOverlay(8, thisInfo.character.lipstick, 100, 0, 0)
  localPlayer.setHeadOverlay(9, thisInfo.character.freckles, 100, 0, 0)
  localPlayer.setHeadOverlay(11, thisInfo.character.chesthair, 100, 0, 0)
  localPlayer.setHeadOverlay(12, thisInfo.character.bodyblemishes, 100, 0, 0)*/

  // eye color
  localPlayer.setEyeColor(thisInfo.character.eyeColor);
}

function updateAppearance() {
  for (let i = 0; i < 11; i++) {
    localPlayer.setHeadOverlay(i, thisInfo.character.appearance[i], 100, 0, 0);
  }
}

function updateClothes() {
  localPlayer.setComponentVariation(11, thisInfo.character.outClothes, 1, 0);
  localPlayer.setComponentVariation(4, thisInfo.character.pants, 1, 0);
  localPlayer.setComponentVariation(6, thisInfo.character.shoes, 1, 0);
  localPlayer.setComponentVariation(8, 15, 0, 0);

  const currentGender = thisInfo.character.gender;

  localPlayer.setComponentVariation(3, validTorsoIDs[currentGender][thisInfo.character.outClothes], 0, 0);
}

mp.events.add('characterCreator.client.action', (dataStr) => {
  
  const data = JSON.parse(dataStr);
  const action = data.action;
  const categoryIndex = data.categoryIndex
  const fieldName = data.fieldName;
  const fieldValue = data.fieldValue;
  
  if (action !== 'changeFieldValue') {
    return;
  }

  switch (categoryIndex) {
    case 0: {
      switch (fieldName) {
        case 'gender': {
          
          thisInfo.character.gender = fieldValue;
          
          if (thisInfo.character.gender === 0) {
            localPlayer.model = mp.game.joaat('mp_m_freemode_01');

            thisInfo.character.outClothes = 15;
            thisInfo.character.pants = 0;
            thisInfo.character.shoes = 1;
          } else {
            localPlayer.model = mp.game.joaat('mp_f_freemode_01');

            thisInfo.character.outClothes = 5;
            thisInfo.character.pants = 0;
            thisInfo.character.shoes = 3;
          }

          thisInfo.character.appearance[1] = 255;

          updateCharacterParents();
          updateAppearance();
          updateCharacterHairAndColors();
          updateClothes();

          for (let i = 0; i < 20; i++) {
            localPlayer.setFaceFeature(i, thisInfo.character.features[i]);
          }

          break;
        }
        case 'mother': {
          thisInfo.character.mother = fieldValue;
          updateCharacterParents();
          break;
        }
        case 'father': {
          thisInfo.character.father = fieldValue;
          updateCharacterParents();
          break;
        }
        case 'similarity': {
          thisInfo.character.similarity = (fieldValue * 0.01);
          updateCharacterParents();
          break;
        }
        case 'skin': {
          thisInfo.character.skin = (fieldValue * 0.01);
          updateCharacterParents();
          break;
        }
      }

      break;
    }
    case 1: {
      switch (fieldName) {
        case 'noseWidth': {
          localPlayer.setFaceFeature(0, fieldValue);
          thisInfo.character.features[0] = fieldValue;
          break;
        }
        case 'noseHeight': {
          localPlayer.setFaceFeature(1, fieldValue);
          thisInfo.character.features[1] = fieldValue;
          break;
        }
        case 'noseTipLength': {
          localPlayer.setFaceFeature(2, fieldValue);
          thisInfo.character.features[2] = fieldValue;
          break;
        }
        case 'noseDepth': {
          localPlayer.setFaceFeature(3, fieldValue);
          thisInfo.character.features[3] = fieldValue;
          break;
        }
        case 'noseTipHeight': {
          localPlayer.setFaceFeature(4, fieldValue);
          thisInfo.character.features[4] = fieldValue;
          break;
        }
        case 'noseCurvature': {
          localPlayer.setFaceFeature(5, fieldValue);
          thisInfo.character.features[5] = fieldValue;
          break;
        }
      }
      break;
    }
    case 2: {
      switch (fieldName) {
        case 'eyeScale': {
          localPlayer.setFaceFeature(11, fieldValue);
          thisInfo.character.features[11] = fieldValue;
          break;
        }
        case 'eyebrowHeight': {
          localPlayer.setFaceFeature(6, fieldValue);
          thisInfo.character.features[6] = fieldValue;
          break;
        }
        case 'eyebrowDepth': {
          localPlayer.setFaceFeature(7, fieldValue);
          thisInfo.character.features[7] = fieldValue;
          break;
        }
      }
      break;
    }
    case 3: {
      switch (fieldName) {
        case 'lipThickness': {
          localPlayer.setFaceFeature(12, fieldValue);
          thisInfo.character.features[12] = fieldValue;
          break;
        }
        case 'jawWidth': {
          localPlayer.setFaceFeature(13, fieldValue);
          thisInfo.character.features[13] = fieldValue;
          break;
        }
        case 'jawShape': {
          localPlayer.setFaceFeature(14, fieldValue);
          thisInfo.character.features[14] = fieldValue;
          break;
        }
        case 'cheekboneHeight': {
          localPlayer.setFaceFeature(8, fieldValue);
          thisInfo.character.features[8] = fieldValue;
          break;
        }
        case 'cheekboneWidth': {
          localPlayer.setFaceFeature(9, fieldValue);
          thisInfo.character.features[9] = fieldValue;
          break;
        }
        case 'cheekDepth': {
          localPlayer.setFaceFeature(10, fieldValue);
          thisInfo.character.features[10] = fieldValue;
          break;
        }
        case 'neck': {
          localPlayer.setFaceFeature(19, fieldValue);
          thisInfo.character.features[19] = fieldValue;
          break;
        }
      }
      break;
    }
    case 4: {
      switch (fieldName) {
        case 'chinHeight': {
          localPlayer.setFaceFeature(15, fieldValue);
          thisInfo.character.features[15] = fieldValue;
          break;
        }
        case 'chinDepth': {
          localPlayer.setFaceFeature(16, fieldValue);
          thisInfo.character.features[16] = fieldValue;
          break;
        }
        case 'chinWidth': {
          localPlayer.setFaceFeature(17, fieldValue);
          thisInfo.character.features[17] = fieldValue;
          break;
        }
        case 'chinIndent': {
          localPlayer.setFaceFeature(18, fieldValue);
          thisInfo.character.features[18] = fieldValue;
          break;
        }
      }
      break;
    }
    case 5: {
      switch (fieldName) {
        case 'hair': {
          thisInfo.character.hair = fieldValue;
          updateCharacterHairAndColors();
          break;
        }
        case 'eyebrows': {
          thisInfo.character.appearance[2] = fieldValue;

          updateAppearance();
          break;
        }
        case 'beard': {
          const overlay = (fieldValue === 0)
            ? 255
            : fieldValue;

          thisInfo.character.appearance[1] = overlay;
          updateAppearance();
          break;
        }
        case 'hairColor': {
          thisInfo.character.hairColor = fieldValue;
          updateCharacterHairAndColors();
          break;
        }
        case 'eyeColor': {
          thisInfo.character.eyeColor = fieldValue;
          updateCharacterHairAndColors();
          break;
        }
        case 'blemishes': {
          thisInfo.character.appearance[0] = fieldValue;
          updateAppearance();
          break;
        }
        case 'ageing': {
          thisInfo.character.appearance[3] = fieldValue;
          updateAppearance();
          break;
        }
        case 'makeup': {
          thisInfo.character.appearance[4] = fieldValue;
          updateAppearance();
          break;
        }
        case 'blush': {
          thisInfo.character.appearance[5] = fieldValue;
          updateAppearance();
          break;
        }
        case 'complexion': {
          thisInfo.character.appearance[6] = fieldValue;
          updateAppearance();
          break;
        }
        case 'sundamage': {
          thisInfo.character.appearance[7] = fieldValue;
          updateAppearance();
          break;
        }
        case 'lipstick': {
          thisInfo.character.appearance[8] = fieldValue;
          updateAppearance();
          break;
        }
        case 'freckles': {
          thisInfo.character.appearance[9] = fieldValue;
          updateAppearance();
          break;
        }
        case 'chesthair': {
          thisInfo.character.appearance[10] = fieldValue;
          updateAppearance();
          break;
        }
        case 'bodyblemishes': {
          thisInfo.character.appearance[11] = fieldValue;
          updateAppearance();
          break;
        }
      }
      break;
    }
  }
});

mp.events.add('characterCreator.client.submit', (firstname, lastname) => {
  const currentGender = thisInfo.character.gender;

  const appearance_values = [];
  for (let i = 0; i < 11; i++) {
    appearance_values.push({
      Value: thisInfo.character.appearance[i],
      Opacity: 100
    });
  }

  const hair_or_colors = [];
  hair_or_colors.push(hairIDList[currentGender][thisInfo.character.hair]);
  hair_or_colors.push(thisInfo.character.hairColor);
  hair_or_colors.push(0);
  hair_or_colors.push(thisInfo.character.hairColor);
  hair_or_colors.push(thisInfo.character.hairColor);
  hair_or_colors.push(thisInfo.character.eyeColor);
  hair_or_colors.push(0);
  hair_or_colors.push(0);
  hair_or_colors.push(thisInfo.character.hairColor);

  if (characterSaved) {
    return;
  }

  characterSaved = true;

  mp.events.callRemote("characterCreator.server.submit",
    currentGender,
    thisInfo.character.father,
    thisInfo.character.mother,
    thisInfo.character.similarity,
    thisInfo.character.skin,
    JSON.stringify(thisInfo.character.features),
    JSON.stringify(appearance_values),
    JSON.stringify(hair_or_colors),
    firstname,
    lastname
  );
});

mp.events.add("characterCreator.client.random", () =>{

})

mp.events.add('characterCreator.client.submit.response', (positionStr, isChanging) => {
  const position = JSON.parse(positionStr);

  localPlayer.setCoordsNoOffset(position.x, position.y, position.z, true, true, true);

  if (!isChanging) {
    mp.gui.chat.push(`Добро пожаловать!`);
    mp.gui.chat.push(`Вы приехали в новый штат, чтобы достичь всех своих целей.`);
    mp.gui.chat.push(`У Вас уже есть гражданство, но мало денег, поэтому Вам нужно поехать в мэрию для трудоустройства.`);
    mp.gui.chat.push(`Для получения доп. помощи нажмите кнопку !{#f39c12}F10`);
  }

  thisInfo.activeCreator = false;

  characterCreatorCamera.setActive(false);
  mp.game.cam.renderScriptCams(false, false, 500, true, false);

  //global.menuClose();

  //setTimeout(() => mainBrowser.emit('interface.route.main'), 0);
  Browser.character.destroy();
  mp.gui.cursor.show(false, false);
  localPlayer.freezePosition(false);
  //localPlayer.stopAnim("amb@world_human_guard_patrol@male@base", "base", 0.0);
  mp.game.ui.displayRadar(true);
  mp.gui.chat.activate(true);

  //mp.events.call('camMenu', false);
  //mp.events.call('showHUD', true);
  //mp.events.call('showAltTabHint');

  /*if (global.menu == null) {
    global.loggedin = true;
    global.menu = mp.chars.new('package://cef/menu.html');
    global.helpmenu = mp.browsers.new('package://cef/help.html');
  }*/
});

let lastActiveMenu = mp.game.ui.isPauseMenuActive();
let nextChangeState = false;

mp.events.add('render', () => {
  if (thisInfo.activeCreator) {
    const isPauseMenuActive = mp.game.ui.isPauseMenuActive();

    if (lastActiveMenu !== isPauseMenuActive) {
      lastActiveMenu = isPauseMenuActive;
    }

    if (lastActiveMenu) {
      nextChangeState = true;
    } else if (nextChangeState) {
      mp.gui.cursor.visible = true;
      nextChangeState = false;
    }
  }

  if (thisInfo.activeMovementCamera && thisInfo.activeCreator) {
    mp.game.controls.enableControlAction(0, 238, true);
    if (mp.game.controls.isControlPressed(0, 238)) {
      const xMagnitude = mp.game.controls.getDisabledControlNormal(0, 1);
      const yMagnitude = mp.game.controls.getDisabledControlNormal(0, 2);
      const coords = thisInfo.posistionPoint;
      thisInfo.polarAngleDeg = thisInfo.polarAngleDeg + xMagnitude * 10;

      if (thisInfo.polarAngleDeg >= 360) {
        thisInfo.polarAngleDeg = 0;
      }

      thisInfo.azimuthAngleDeg = thisInfo.azimuthAngleDeg + yMagnitude * 10;

      if (thisInfo.azimuthAngleDeg >= thisInfo.azimutMax) {
        thisInfo.azimuthAngleDeg = thisInfo.azimutMax;
      }

      if (thisInfo.azimuthAngleDeg <= thisInfo.azimutMin) {
        thisInfo.azimuthAngleDeg = thisInfo.azimutMin;
      }

      const polarAngleRad = thisInfo.polarAngleDeg * Math.PI / 180.0;
      const azimuthAngleRad = thisInfo.azimuthAngleDeg * Math.PI / 180.0;

      const nextCamLocation = new mp.Vector3(
        coords.x + thisInfo.movementRadius * (Math.sin(azimuthAngleRad) * Math.cos(polarAngleRad)),
        coords.y - thisInfo.movementRadius * (Math.sin(azimuthAngleRad) * Math.sin(polarAngleRad)),
        coords.z - thisInfo.movementRadius * Math.cos(azimuthAngleRad)
      );

      const result = mp.raycasting.testPointToPoint(coords, nextCamLocation, null, null);
      if (typeof result !== 'undefined') {
        characterCreatorCamera.setCoord((result.position.x + result.surfaceNormal.x * 0.2) - 0.15, result.position.y + result.surfaceNormal.y * 0.2, result.position.z + result.surfaceNormal.z * 0.2);
      } else {
        characterCreatorCamera.setCoord(nextCamLocation.x - 0.15, nextCamLocation.y, nextCamLocation.z);
      }

      characterCreatorCamera.pointAtCoord(coords.x - 0.15, coords.y, coords.z);
    }
  }
});