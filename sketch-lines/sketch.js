const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const { range, rangeFloor, noise2D, setSeed } = require('canvas-sketch-util/random');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed())

let palette = random.pick(palettes);

palette = random.shuffle(palette);
palette = palette.slice(0, random.rangeFloor(2, palette.length + 1));

const background = palette.shift();

const settings = {
  dimensions: [2048, 2048],
  suffix: random.getSeed()
};

const sketch = () => {

  const colorCount = rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes).slice(0, colorCount))
  const symbols = ['=', '.'];

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        /* Something called UV space */
        /* This returns a number between 0 and 1 and distributes to 0 and 1 */
        /* When the count is very low returns anothe value */
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        /* Push the points of the grid */
        const radius = Math.abs(random.noise2D(u, v) * 0.1)
        //const radius = Math.abs(random.noise2D(0.06, 1) * 0.2);
        points.push({
          /* Random value times random.value() * 0.01 */
          /* Use gaussian with not a grid effect we cannot have a negative 
          radius and for that we use Math.abs() */
          radius,
          symbol: random.pick(symbols),
          rotation: random.noise2D(u, v) * 2,
          position: [u, v],
          color: random.pick(palette),
        })
      }
    }
    return points;
  }

  /* Identifies every generative canvas */
  // random.setSeed(3)

  /* Create the grid */
  /* User filter function to create randomness */
  const points = createGrid().filter(() => random.value() > 0.5)
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      /* Destructure de data that comes from the object*/
      const { position, radius, color, rotation, symbol } = data;
      const [u, v] = position;
      /* To distribute de points around the grid*/
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(`${symbol}`, 0, 0);

      context.restore();

    })
  };
};

canvasSketch(sketch, settings);
