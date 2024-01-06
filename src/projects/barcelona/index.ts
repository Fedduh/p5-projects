import { STREET_COLOR, BLOCKS, BLOCK_W, BLOCK_GAP, BLOCK_H, BLOCK_RADIUS, CANV_H, CANV_W, } from "./constants";
import { drawBlockTrees } from "./elements/blocktrees";
import { drawHouse } from "./elements/house";
import { createRandomizedBlocks } from "./setupBlockData";

export type Direction = 'n' | 'e' | 's' | 'w';

export type HouseFillBlock = {
    index: number;
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}

export type House = {
    index: number;
    startHouseX: number;
    startHouseY: number;
    isInner: boolean;
    corner: string;
    color: string;
    innerFillBlocks: HouseFillBlock[];
}

export interface RandomBlock {
    x: number;
    y: number;
    startBlockX: number;
    startBlockY: number;
    index: number;
    trees: {
        direction: Direction;
        steps: {
            index: number;
            color: string;
            diameter: number;
        }[]
    }[];
    houses: House[];
}

export const barcelona = (p5: p5) => {
    let blocks: RandomBlock[] = [];


    p5.setup = () => {
        p5.createCanvas(CANV_W, CANV_H);
        p5.frameRate(3);
        p5.colorMode(p5.HSL);
        blocks = createRandomizedBlocks(p5);
    }

    p5.draw = () => {
        p5.background(STREET_COLOR);

        // draw BLOCKS
        blocks.forEach((block) => {
            // draw incrementally
            if (p5.frameCount < block.index + 1) {
                return;
            }

            // draw block
            p5.fill("rgb(226,226,226)");
            p5.noStroke();
            p5.rect(block.startBlockX, block.startBlockY, BLOCK_W, BLOCK_H, BLOCK_RADIUS);

            // draw trees
            drawBlockTrees(p5, block);

            // draw houses within block
            block.houses.forEach((house) => {
                drawHouse(p5, house, block.index);
            });

        });
        // draw streets accross, over all blocks
        // drawCrossStreets();

        if (p5.frameCount > 40) {
            p5.noLoop();
        }
    }


    const drawCrossStreets = () => {
        // blockDimension: the Height of Width of the block
        const getRandomStartCoordinate = (blockDimension: number) => {
            const range = blockDimension * 0.5;
            const start = Math.floor(p5.random(range) + blockDimension * 0.25);
            const blockStart = Math.floor(p5.random(BLOCKS));
            const block = blockStart * blockDimension + (blockStart + 1) * BLOCK_GAP;

            return start + block;
        };

        for (let i = 0; i < 2; i++) {
            const thickness = 15;

            // note: GAP / 2 to go over the trees
            p5.fill(STREET_COLOR);
            p5.noStroke();

            // if start === N
            const startX = getRandomStartCoordinate(BLOCK_H);
            const startY =
                BLOCK_GAP / 2 + Math.floor(p5.random(0, BLOCKS - 1)) * (BLOCK_H + BLOCK_GAP);
            const endX = getRandomStartCoordinate(BLOCK_H);
            const endY = CANV_H - BLOCK_GAP / 2;

            const img = p5.createGraphics(CANV_W, CANV_H);
            img.colorMode(p5.HSL);
            img.fill(STREET_COLOR);
            img.noStroke();
            img.quad(
                startX,
                startY,
                startX + thickness,
                startY,
                endX + thickness,
                endY,
                endX,
                endY
            );
            p5.image(img, 0, 0);

            // if start === W
            const startXX =
                BLOCK_GAP / 2 + Math.floor(p5.random(0, BLOCKS - 1)) * (BLOCK_W + BLOCK_GAP);
            const startYY = getRandomStartCoordinate(BLOCK_W);

            const endXX = CANV_W - BLOCK_GAP / 2;
            const endYY = getRandomStartCoordinate(BLOCK_W);

            p5.quad(
                startXX,
                startYY,
                startXX,
                startYY + thickness,
                endXX,
                endYY + thickness,
                endXX,
                endYY
            );
        }
    };
}