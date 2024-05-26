// src/utils/MazeGenerator.js

const ROOM_SIZE = 10;

const generateMaze = (width, height) => {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      isRoom: false,
      doors: { top: false, bottom: false, left: false, right: false },
    }))
  );

  const directions = [
    { x: 0, y: -1, door: 'top', opposite: 'bottom' },
    { x: 0, y: 1, door: 'bottom', opposite: 'top' },
    { x: -1, y: 0, door: 'left', opposite: 'right' },
    { x: 1, y: 0, door: 'right', opposite: 'left' },
  ];

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const createRoom = (x, y) => {
    maze[y][x].isRoom = true;
  };

  const createDoor = (x, y, direction) => {
    maze[y][x].doors[direction.door] = true;
    const nx = x + direction.x;
    const ny = y + direction.y;
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      maze[ny][nx].doors[direction.opposite] = true;
    }
  };

  const dfs = (x, y) => {
    createRoom(x, y);
    shuffle(directions).forEach((direction) => {
      const nx = x + direction.x;
      const ny = y + direction.y;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !maze[ny][nx].isRoom) {
        createDoor(x, y, direction);
        dfs(nx, ny);
      }
    });
  };

  dfs(0, 0); // Start the maze generation from the top-left corner

  return maze;
};

export { generateMaze, ROOM_SIZE };
