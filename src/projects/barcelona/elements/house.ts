import { House } from "..";
import { HOUSE_W, HOUSE_H, BLOCK_RADIUS, HOUSES } from "../constants";

export const drawHouse = (p5: p5, house: House, blockIndex: number) => {
    if (p5.frameCount < house.index + 2 + blockIndex) {
        return;
    }

    p5.fill(house.color);

    // stroke(getRandomGrey());
    if (house.isInner) {
        p5.noStroke();
    }

    p5.rect(
        house.startHouseX,
        house.startHouseY,
        HOUSE_W,
        HOUSE_H,
        // RADIUS will not be correct (smaller square)
        house.corner === "topleft" ? BLOCK_RADIUS : 0,
        house.corner === "topright" ? BLOCK_RADIUS : 0,
        house.corner === "bottomright" ? BLOCK_RADIUS : 0,
        house.corner === "bottomleft" ? BLOCK_RADIUS : 0
    );

    // start to draw innerFillBlocks after 50% of blocks drawn
    const startAfter = house.index + 2 + blockIndex + HOUSES * HOUSES / 2;
    if (p5.frameCount < startAfter) {
        return;
    }

    p5.noStroke();
    house.innerFillBlocks.forEach((block) => {
        if (p5.frameCount < startAfter + block.index % 4) {
            return;
        }
        p5.fill(block.color);
        p5.rect(block.x, block.y, block.w, block.h);
    });
}
