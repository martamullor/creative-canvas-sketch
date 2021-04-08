const canvasSketch = require('canvas-sketch');
/*Linear interpolation function */
const { lerp } = require('canvas-sketch-util/math');
const { range, rangeFloor, noise2D } = require('canvas-sketch-util/random');
/*Random number generation */
const random = require('canvas-sketch-util/random');
/*Random color palettes that appear in array */
const palettes = require('nice-color-palettes');


const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {

  const colorCount = rangeFloor(1, 6)
  /* Return only one array */
  /* With slice we can use only a limited number of colors that we want */
  const palette = random.shuffle(random.pick(palettes).slice(0, colorCount))

  /* Return the point on the grid */
  const createGrid = () => {
    const points = [];
    /* Count is the grid size */
    const count = 30;
    /* Distribute around the grid count working in two dimensions */
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        /* Something called UV space */
        /* This returns a number between 0 and 1 and distributes to 0 and 1 */
        /* When the count is very low returns anothe value */
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        /* Push the points of the grid */
        const radius = Math.abs(random.noise2D(u, v) * 0.03)
        points.push({
          /* Random value times random.value() * 0.01 */
          /* Use gaussian with not a grid effect we cannot have a negative 
          radius and for that we use Math.abs() */
          radius,
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
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      /* Destructure de data that comes from the object*/
      const { position, radius, color } = data;
      const [u, v] = position;
      /* To distribute de points around the grid*/
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      /* Create a form */
      /* Radius relative from the page radius * width */
      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();

    })
  };
};

canvasSketch(sketch, settings);
