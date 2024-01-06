export const CANV_W = 600;
export const CANV_H = CANV_W;

export const STREET_COLOR = "rgb(45,25,17)";

export const BLOCKS = 4;
export const BLOCK_GAP = 30;
export const BLOCK_W = (CANV_W - BLOCK_GAP * (BLOCKS + 1)) / BLOCKS;
export const BLOCK_H = BLOCK_W;
export const BLOCK_RADIUS = 20;

export const TREE_NR_STEPS = 20;

export const HOUSES = 4;
export const HOUSE_W = BLOCK_W / HOUSES;
export const HOUSE_H = BLOCK_H / HOUSES;