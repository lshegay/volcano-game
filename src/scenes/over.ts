import * as PIXI from 'pixi.js';
import { resizeStage, STAGE_HEIGHT, STAGE_WIDTH } from '../main';
import createGame, { createBackground, createDesk } from './game';

export const createBoy = () => {
  const texture = PIXI.Texture.from('/boy.png');
  const boy = new PIXI.Sprite(texture);
  boy.height = 1000;
  boy.width = 550;
  boy.y = STAGE_HEIGHT - boy.height;
  boy.x = STAGE_WIDTH / 2 - boy.width / 2;

  return boy;
};

export const createButton = () => {
  const restart = PIXI.Texture.from('/restart.png');
  const sprite = new PIXI.Sprite(restart);
  sprite.interactive = true;
  sprite.width = STAGE_WIDTH - 100;
  sprite.height = 200;
  sprite.x = 50;
  sprite.y = STAGE_HEIGHT - sprite.height - 100;

  return sprite;
};

const createScene = (app: PIXI.Application, win = false) => {
  const container = new PIXI.Container();
  container.interactive = true;
  container.addChild(createBackground());

  container.addChild(createBoy());
  container.addChild(createDesk());

  const text = new PIXI.Text(win ? 'ВЫ ПОБЕДИЛИ' : 'ИГРА ОКОНЧЕНА', {
    align: 'center',
    fontSize: 100,
    fontWeight: '900',
    wordWrapWidth: STAGE_WIDTH - 40,
    wordWrap: true,
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 10,
  });
  text.anchor.set(0.5, 0);
  text.x = STAGE_WIDTH / 2;
  text.y = 50;
  container.addChild(text);

  const button = createButton();
  button.on('pointerdown', () => {
    app.stage.removeChild(container);
    app.stage.addChild(createGame(app));
    resizeStage();
  });
  container.addChild(button);

  return container;
};

export default createScene;