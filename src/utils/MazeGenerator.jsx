// src/utils/MazeGenerator.js

const ROOM_SIZE = 10;

function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      isRoom: false,
      doors: { top: false, bottom: false, left: false, right: false },
    }))
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
        maze[wy][wx].isRoom = true;
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

  // Add doors between adjacent rooms
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maze[y][x].isRoom) {
        if (x > 0 && maze[y][x - 1].isRoom) {
          maze[y][x].doors.left = true;
          maze[y][x - 1].doors.right = true;
        }
        if (x < width - 1 && maze[y][x + 1].isRoom) {
          maze[y][x].doors.right = true;
          maze[y][x + 1].doors.left = true;
        }
        if (y > 0 && maze[y - 1][x].isRoom) {
          maze[y][x].doors.top = true;
          maze[y - 1][x].doors.bottom = true;
        }
        if (y < height - 1 && maze[y + 1][x].isRoom) {
          maze[y][x].doors.bottom = true;
          maze[y + 1][x].doors.top = true;
        }
      }
    }
  }

  return maze;
}

export { generateMaze, ROOM_SIZE };
