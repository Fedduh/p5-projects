import { STREET_COLOR, BLOCKS, BLOCK_W, BLOCK_GAP, BLOCK_H, BLOCK_RADIUS, HOUSES, CANV_H, CANV_W, HOUSE_H, HOUSE_W, TREE_NR_STEPS } from "./constants";
import { drawHouse } from "./house";

type Direction = 'n' | 'e' | 's' | 'w';

interface RandomBlock {
    x: number;
    y: number;
    trees: {
        direction: Direction;
        steps: {
            index: number;
            color: string;
            diameter: number;
        }[]
    }[];
}

export const barcelona = (p5: p5) => {
    let frame = 0;
    let blocks: RandomBlock[] = [];

    const getRandomTrees = () => {
        const trees: RandomBlock["trees"] = [];

        (["n", "e", "s", "w"] as Direction[]).forEach((direction) => {
            if (p5.random(0, 1) < 0.75) {
                // skip random sides of a block
                trees.push({ direction, steps: [] });
            }
        });

        trees.forEach((tree) => {
            for (let i = 1; i < TREE_NR_STEPS; i++) {
                // skip randomnly
                if (p5.random(0, 1) < 0.4) {
                    continue;
                }

                tree.steps.push({
                    index: i,
                    color: `hsl(${"" + Math.floor(p5.random(75, 150))},80%, 30%)`,
                    diameter: Math.floor(p5.random(6, 16))
                });
            }
        });

        return trees;
    }

    const getRandomBlockOrder = () => {
        const randomBlocks: RandomBlock[] = [];
        for (let bx = 0; bx < BLOCKS; bx++) {
            for (let by = 0; by < BLOCKS; by++) {
                // add in random place in randomBlocks
                randomBlocks.splice(Math.floor(p5.random(randomBlocks.length)), 0, {
                    x: bx, y: by,
                    trees: getRandomTrees()
                });
            }
        }
        return randomBlocks;
    }

    p5.setup = () => {
        p5.createCanvas(600, 600);
        p5.frameRate(2);
        p5.colorMode(p5.HSL);
        blocks = getRandomBlockOrder();
    }

    p5.draw = () => {
        p5.background(STREET_COLOR);

        // draw BLOCKS
        blocks.forEach((block, index) => {
            // draw incrementally
            if (frame < index) {
                return;
            }

            const startBlockX = block.x * BLOCK_W + BLOCK_GAP + BLOCK_GAP * block.x;
            const startBlockY = block.y * BLOCK_H + BLOCK_GAP + BLOCK_GAP * block.y;

            drawBlockTrees(block.trees, startBlockX, startBlockY);

            // BLOCK
            p5.fill("rgb(226,226,226)");
            // stroke("white");
            p5.noStroke();
            p5.rect(startBlockX, startBlockY, BLOCK_W, BLOCK_H, BLOCK_RADIUS);

            let isInner;

            // HOUSES within BLOCK
            for (let x = 0; x < HOUSES; x++) {
                for (let y = 0; y < HOUSES; y++) {
                    isInner = false;
                    if (x > 0 && y > 0 && x < HOUSES - 1 && y < HOUSES - 1) {
                        isInner = true;
                    }
                    drawHouse(p5, startBlockX + x * HOUSE_W, startBlockY + y * HOUSE_H, x, y, isInner);
                }
            }
        });
        // draw streets accross, over all blocks
        // drawCrossStreets();

        if (frame > 7) {
            p5.noLoop();
        }
        frame++;
    }

    const drawBlockTrees = (trees: RandomBlock["trees"], startBlockX: number, startBlockY: number) => {
        p5.noStroke();

        const stepX = BLOCK_W / TREE_NR_STEPS;
        const stepY = BLOCK_H / TREE_NR_STEPS;

        trees.forEach((tree) => {
            // 0 - 20 tree steps
            tree.steps.forEach((step) => {
                p5.fill(step.color);
                let startX = startBlockX;
                if (tree.direction === "e") {
                    startX += BLOCK_W;
                }

                let startY = startBlockY;
                if (tree.direction === "s") {
                    startY += BLOCK_H;
                }
                p5.circle(
                    startX + stepX * (["n", "s"].includes(tree.direction) ? step.index : 0),
                    startY + stepY * (["e", "w"].includes(tree.direction) ? step.index : 0),
                    step.diameter
                );
            });
        });
    };

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