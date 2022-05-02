import * as PIXI from 'pixi.js';
import { resizeStage, STAGE_HEIGHT, STAGE_WIDTH } from '../main';
import createOver from './over';

export const createIngredient = (image: string) => {
  const ingredient = PIXI.Texture.from(`/${image}.png`);
  const sprite = new PIXI.Sprite(ingredient);
  sprite.width = 180;
  sprite.height = 180;

  return sprite;
};

export const createBackground = () => {
  const background = PIXI.Texture.from('/background.png');
  const sprite = new PIXI.Sprite(background);

  return sprite;
};

export const createTube = () => {
  const tube = PIXI.Texture.from('/tube.png');
  const sprite = new PIXI.Sprite(tube);

  return sprite;
};

export const createDesk = () => {
  const desk = PIXI.Texture.from('/desk.png');
  const sprite = new PIXI.Sprite(desk);
  sprite.width = STAGE_WIDTH;
  sprite.height = 250;

  sprite.y = STAGE_HEIGHT - sprite.height;

  return sprite;
};

export const createIngredients = () => {
  const desk = PIXI.Texture.from('/ingredients.png');
  const sprite = new PIXI.Sprite(desk);
  sprite.width = STAGE_WIDTH - 40;
  sprite.x = 20;
  sprite.y = 50;

  return sprite;
};

export const createVolcano = (container: PIXI.Container) => {
  const volcano = PIXI.Texture.from('/volcano.png');
  const sprite = new PIXI.Sprite(volcano);
  sprite.interactive = true;
  sprite.width = STAGE_WIDTH / 3;
  sprite.height = 200;
  sprite.y = STAGE_HEIGHT - 125 - sprite.height;

  let movement = false;
  let oldPointerX = 0;

  sprite.on('pointerdown', (e) => {
    const cursor = container.toLocal(e.data.global);

    movement = true;
    oldPointerX = sprite.x - cursor.x;
  });

  container.on('pointerup', () => {
    movement = false;
  });

  container.on('pointermove', (e) => {
    if (movement) {
      const cursor = container.toLocal(e.data.global);

      sprite.x = cursor.x + oldPointerX;

      if (sprite.x < 0) {
        sprite.x = 0;
      }

      if (sprite.x > 720 - sprite.width) {
        sprite.x = 720 - sprite.width;
      }
    }
  });

  return sprite;
};

const createScene = (app: PIXI.Application) => {
  const container = new PIXI.Container();
  container.interactive = true;
  const bg = createBackground();
  container.addChild(bg);

  const desk = createDesk();
  container.addChild(desk);

  const volcano = createVolcano(container);
  container.addChild(volcano);

  const SPEED_Y = 4;
  const reciept = ['color', 'soda', 'soda', 'lemon', 'lemon', 'water'];
  const ingredients = ['color', 'soda', 'lemon', 'water'];

  const items = new PIXI.Container();
  container.addChild(items);

  const generateIngredients = (currentIngredient: string) => {
    const currentPosition = Math.floor(Math.random() * 1000) % 3;

    const generated = [null, null, null].map((_, index) => {
      let sprite = null;
      if (currentPosition == index) {
        sprite = createIngredient(currentIngredient);
      } else {
        let ingredient = ingredients[Math.floor(Math.random() * 1000) % ingredients.length];
        while (ingredient == currentIngredient) {
          ingredient = ingredients[Math.floor(Math.random() * 1000) % ingredients.length];
        }

        sprite = createIngredient(ingredient);
      }
      
      sprite.x = 30 + (sprite.width + 60) * index;
      sprite.y = 200;

      items.addChild(sprite);

      return sprite;
    });

    return { generated, currentPosition };
  };

  let stage = 0;
  let currentIngredients = generateIngredients(reciept[stage]);

  const update = () => {
    const { currentPosition, generated } = currentIngredients;

    generated.forEach((sprite) => {
      sprite.y += SPEED_Y;
    });
    
    if (generated[0].y > STAGE_HEIGHT - 425) {
      let found = false;
      const volcanoX = volcano.x + volcano.width / 2;
      for (let i = 0; i < generated.length; i++) {
        const sprite = generated[i];
        
        if (sprite.x <= volcanoX && volcanoX <= sprite.x + sprite.width) {
          if (i == currentPosition) {
            found = true;
            break;
          }
        }
      }

      if (found) {
        stage += 1;

        if (stage == reciept.length) {
          app.stage.removeChild(container);
          app.stage.addChild(createOver(app, true));
          app.ticker.remove(update);
          resizeStage();
          return;
        }

        currentIngredients = generateIngredients(reciept[stage]);
      } else {
        app.stage.removeChild(container);
        app.stage.addChild(createOver(app));
        app.ticker.remove(update);
        resizeStage();
      }

      generated.forEach((sprite) => {
        items.removeChild(sprite);
      });
    }
  };

  app.ticker.add(update);

  container.addChild(items);

  [null, null, null].map((_, index) => {
    const tube = createTube();
    tube.width = STAGE_WIDTH / 3 - 40;
    tube.height = 400;
    tube.x = 20 + (tube.width + 40) * index;
    container.addChild(tube);

    return tube;
  });

  const ingredientsElements = createIngredients();
  container.addChild(ingredientsElements);

  return container;
};

export default createScene;