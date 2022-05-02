import * as PIXI from 'pixi.js';
import debounce from 'lodash/debounce';
import { POLICY, Size, getScaledRect } from 'adaptive-scale';
import createScene from './scenes/menu';
import './style.css';

const STAGE_WIDTH = 720;
const STAGE_HEIGHT = 1280;

export { STAGE_WIDTH, STAGE_HEIGHT };

const app = new PIXI.Application({ resizeTo: window });
document.getElementById('app')?.appendChild(app.view);

const gameScene = createScene(app);
app.stage.addChild(gameScene);
app.stage.interactive = true;

export const resizeStage = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const sizes = getScaledRect({
    container: new Size(width, height),
    target: new Size(STAGE_WIDTH, STAGE_HEIGHT),
    policy: POLICY.ShowAll,
  });

  (app.stage.children[0] as PIXI.Container).width = sizes.width;
  (app.stage.children[0] as PIXI.Container).height = sizes.height;
  (app.stage.children[0] as PIXI.Container).x = sizes.x;
  (app.stage.children[0] as PIXI.Container).y = sizes.y;
};

window.addEventListener('load', () => {
  resizeStage();
  window.addEventListener('resize', debounce(resizeStage, 500));
});