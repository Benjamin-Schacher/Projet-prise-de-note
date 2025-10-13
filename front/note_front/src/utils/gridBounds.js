// Utilities to compute grid bounds and clamp/random positions for notes

const REM_IN_PX = 16; // standard assumption
const GRID_TOP_PX = 12 * REM_IN_PX; // matches GridCanvas top
const GRID_LEFT_PX = 16 * REM_IN_PX; // matches sidebar width

const DEFAULT_NOTE_W = 200;
const DEFAULT_NOTE_H = 200;

export function getGridBounds(gridSize) {
  const areaWidth = window.innerWidth - GRID_LEFT_PX;
  const areaHeight = window.innerHeight - GRID_TOP_PX;
  const width = gridSize?.width || 800;
  const height = gridSize?.height || 600;
  const originX = GRID_LEFT_PX + Math.max(0, (areaWidth - width) / 2);
  const originY = GRID_TOP_PX + Math.max(0, (areaHeight - height) / 2);
  return { originX, originY, width, height };
}

export function clampToGrid(pos, size, gridSize) {
  const { originX, originY, width, height } = getGridBounds(gridSize);
  const w = size?.w ?? DEFAULT_NOTE_W;
  const h = size?.h ?? DEFAULT_NOTE_H;
  const minX = originX;
  const maxX = originX + Math.max(0, width - w);
  const minY = originY;
  const maxY = originY + Math.max(0, height - h);
  return {
    x: Math.min(Math.max(pos.x, minX), maxX),
    y: Math.min(Math.max(pos.y, minY), maxY),
  };
}

export function randomPosInGrid(size, gridSize) {
  const { originX, originY, width, height } = getGridBounds(gridSize);
  const w = size?.w ?? DEFAULT_NOTE_W;
  const h = size?.h ?? DEFAULT_NOTE_H;
  const spanW = Math.max(1, width - 2 * w);
  const spanH = Math.max(1, height - 2 * h);
  return {
    x: originX + Math.floor(Math.random() * spanW) + w,
    y: originY + Math.floor(Math.random() * spanH) + h,
  };
}
