// src/utils/MazeGenerator.js

const ROOM_SIZE = 10;

function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1)
  );

  function divide(x, y, w, h, orientation) {
    if (w < 2 || h < 2) return;

    const horizontal = orientation === 'H';
    let wx = x + (horizontal ? 0 : Math.floor(Math.random() * (w - 2)));
    let wy = y + (horizontal ? Math.floor(Math.random() * (h - 2)) : 0);
    const px = wx + (horizontal ? Math.floor(Math.random() * w) : 0);
    const py = wy + (horizontal ? 0 : Math.floor(Math.random() * h));
    const dx = horizontal ? 1 : 0;
    const dy = horizontal ? 0 : 1;
    const length = horizontal ? w : h;

    for (let i = 0; i < length; i++) {
      if (wx !== px || wy !== py) {
        maze[wy][wx] = 0;
      }
      wx += dx;
      wy += dy;
    }

    const nx = x;
    const ny = y;
    const nw = horizontal ? w : wx - x + 1;
    const nh = horizontal ? wy - y + 1 : h;
    divide(nx, ny, nw, nh, chooseOrientation(nw, nh));

    const nx2 = horizontal ? x : wx + 1;
    const ny2 = horizontal ? wy + 1 : y;
    const nw2 = horizontal ? w : x + w - wx - 1;
    const nh2 = horizontal ? y + h - wy - 1 : h;
    divide(nx2, ny2, nw2, nh2, chooseOrientation(nw2, nh2));
  }

  function chooseOrientation(width, height) {
    if (width < height) {
      return 'H';
    } else if (height < width) {
      return 'V';
    } else {
      return Math.random() > 0.5 ? 'H' : 'V';
    }
  }

  divide(0, 0, width, height, chooseOrientation(width, height));
  return maze;
}

function hasAdjacentRoom(maze, x, y) {
  const height = maze.length;
  const width = maze[0].length;
  if (x > 0 && maze[y][x - 1] === 0) return true;
  if (x < width - 1 && maze[y][x + 1] === 0) return true;
  if (y > 0 && maze[y - 1][x] === 0) return true;
  if (y < height - 1 && maze[y + 1][x] === 0) return true;
  return false;
}

export { generateMaze, hasAdjacentRoom, ROOM_SIZE };
