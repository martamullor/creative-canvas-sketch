const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {

  /* Return the point on the grid */
  const createGrid = () => {
    const points = [];
    /* Count is the grid size */
    const count = 5;
    /* Distribute around the grid count working in two dimensions */
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        /* Something called UV space */
        /* This returns a number between 0 and 1 and distributes to 0 and 1 */
        /* When the count is very low returns anothe value */
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        /* Push the points of the grid */
        points.push([u, v])
      }
    }
    return points;
  }

  /* Create the grid */
  const points = createGrid()

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(([u, v]) => {
      /* To distribute de points around the grid*/
      const x = u * width;
      const y = v * height;

      /* Create a form */
      context.beginPath();
      context.arc(x, y, 200, 0, Math.PI * 2, false);
      context.stroke();

    })
  };
};

canvasSketch(sketch, settings);
