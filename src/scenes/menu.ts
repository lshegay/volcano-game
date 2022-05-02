import * as PIXI from 'pixi.js';
import { resizeStage, STAGE_HEIGHT, STAGE_WIDTH } from '../main';
import createGame, { createBackground, createDesk } from './game';
import { createBoy } from './over';

export const createButton = () => {
  const restart = PIXI.Texture.from('/assets/play.png');
  const sprite = new PIXI.Sprite(restart);
  sprite.interactive = true;
  sprite.width = STAGE_WIDTH - 100;
  sprite.height = 180;
  sprite.x = 50;
  sprite.y = STAGE_HEIGHT - sprite.height - 100;

  return sprite;
};

export const createLogo = () => {
  const restart = PIXI.Texture.from('/assets/logo.png');
  const sprite = new PIXI.Sprite(restart);
  sprite.interactive = true;

  return sprite;
};

const createScene = (app: PIXI.Application) => {
  const container = new PIXI.Container();
  container.interactive = true;
  container.addChild(createBackground());

  container.addChild(createBoy());
  container.addChild(createLogo());
  container.addChild(createDesk());

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