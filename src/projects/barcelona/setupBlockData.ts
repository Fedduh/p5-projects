import p5 from "p5";
import { Direction, House, HouseFillBlock, RandomBlock } from ".";
import { getRandomGrey, getRandomOrange } from "../../helpers/colors";
import { HOUSES, HOUSE_W, HOUSE_H, TREE_NR_STEPS, BLOCKS, BLOCK_W, BLOCK_GAP, BLOCK_H } from "./constants";

const getCorner = (x: number, y: number): string => {
    let corner = "none";
    if (x === 0 && y === 0) {
        corner = "topleft";
    }
    if (x === HOUSES - 1 && y === 0) {
        corner = "topright";
    }
    if (x === HOUSES - 1 && y === HOUSES - 1) {
        corner = "bottomright";
    }
    if (x === 0 && y === HOUSES - 1) {
        corner = "bottomleft";
    }

    return corner;
};

const getRandomHouseFill = (p5: p5, isInner: boolean) => {
    if (isInner) {
        return `hsl(${"" + Math.floor(p5.random(40, 60))},${"" + Math.floor(p5.random(10, 20))
            }%,${"" + Math.floor(p5.random(60, 80))}%)`;
    }

    return `hsl(${"" + Math.floor(p5.random(0, 60))},${"" + Math.floor(p5.random(30, 100))
        }%,${"" + Math.floor(p5.random(50, 90))}%)`;
}

const getRandomHouseFillBlocks = (p5: p5, house: House) => {
    let blocks: HouseFillBlock[] = [];

    const max = Math.floor(p5.random(5, 20));

    for (let i = 0; i < max; i++) {
        const x = p5.random(
            house.corner.includes("left") ? house.startHouseX + HOUSE_W / 4 : house.startHouseX,
            house.corner.includes("right") ? house.startHouseX + HOUSE_W * 0.85 : house.startHouseX + HOUSE_W
        );
        const y = p5.random(
            house.corner.includes("top") ? house.startHouseY + HOUSE_H / 4 : house.startHouseY,
            house.corner.includes("bottom") ? house.startHouseY + HOUSE_H * 0.85 : house.startHouseY + HOUSE_H
        );
        const w = p5.random(
            0,
            house.corner.includes("right")
                ? HOUSE_W * 0.85 + house.startHouseX - x
                : HOUSE_W + house.startHouseX - x
        );
        const h = p5.random(
            0,
            house.corner.includes("bottom")
                ? HOUSE_H * 0.85 + house.startHouseY - y
                : HOUSE_H + house.startHouseY - y
        );
        blocks.push({ index: 0, x, y, w, h, color: getRandomHouseFill(p5, house.isInner) });
    }

    blocks = blocks.sort(() => Math.random() - 0.5).map((block, index) => {
        return { ...block, ...{ index } };
    });

    return blocks;
}

const getRandomHouses = (p5: p5, blockStartX: number, blockStartY: number) => {
    let houses: House[] = [];

    for (let x = 0; x < HOUSES; x++) {
        for (let y = 0; y < HOUSES; y++) {
            let isInner = false;
            if (x > 0 && y > 0 && x < HOUSES - 1 && y < HOUSES - 1) {
                isInner = true;
            }
            const corner = getCorner(x, y);

            houses.push({
                index: 0, // set later after randomize order
                startHouseX: blockStartX + x * HOUSE_W,
                startHouseY: blockStartY + y * HOUSE_H,
                isInner,
                corner: corner,
                color: isInner ? getRandomGrey(p5) : getRandomOrange(p5),
                innerFillBlocks: []
            });
        }
    }

    houses = houses
        .sort(() => Math.random() - 0.5)
        .map((house, index) => {
            return { ...house, ...{ index, innerFillBlocks: getRandomHouseFillBlocks(p5, house) } };
        });

    return houses;
}

const getRandomTrees = (p5: p5) => {
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
                color: `hsl(${"" + Math.floor(p5.random(75, 150))},80%, ${"" + Math.floor(p5.random(25, 35))}%)`,
                diameter: Math.floor(p5.random(6, 16))
            });
        }
    });

    trees.sort(() => Math.random() - 0.5);

    return trees;
}

export const createRandomizedBlocks = (p5: p5) => {
    let randomBlocks: RandomBlock[] = [];
    for (let bx = 0; bx < BLOCKS; bx++) {
        for (let by = 0; by < BLOCKS; by++) {
            const blockStartX = bx * BLOCK_W + BLOCK_GAP + BLOCK_GAP * bx;
            const blockStartY = by * BLOCK_H + BLOCK_GAP + BLOCK_GAP * by;

            randomBlocks.push({
                index: 0, // set later after randomize order
                x: bx,
                y: by,
                startBlockX: blockStartX,
                startBlockY: blockStartY,
                trees: getRandomTrees(p5),
                houses: getRandomHouses(p5, blockStartX, blockStartY)
            });
        }
    }

    randomBlocks = randomBlocks
        .sort(() => Math.random() - 0.5)
        .map((block, index) => {
            // todo: could randomize the index a bit for fluid / random spawning
            return { ...block, ...{ index } };
        });

    return randomBlocks;
} 