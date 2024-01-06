import { House } from "..";
import { HOUSE_W, HOUSE_H, BLOCK_RADIUS } from "../constants";

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

    // drawInHouse(p5, house.startHouseX, house.startHouseY, HOUSE_W, HOUSE_H, house.isInner, house.corner);
}

const drawInHouse = (p5: p5, houseX: number, houseY: number, houseW: number, houseH: number, isInner: boolean, corner: string) => {
    p5.noStroke();

    const max = isInner ? 5 : Math.floor(p5.random(5, 20));
    for (let i = 0; i < max; i++) {
        const x = p5.random(
            corner.includes("left") ? houseX + houseW / 4 : houseX,
            corner.includes("right") ? houseX + houseW * 0.85 : houseX + houseW
        );
        const y = p5.random(
            corner.includes("top") ? houseY + houseH / 4 : houseY,
            corner.includes("bottom") ? houseY + houseH * 0.85 : houseY + houseH
        );
        const w = p5.random(
            0,
            corner.includes("right")
                ? houseW * 0.85 + houseX - x
                : houseW + houseX - x
        );
        const h = p5.random(
            0,
            corner.includes("bottom")
                ? houseH * 0.85 + houseY - y
                : houseH + houseY - y
        );
        p5.fill(getRandomHouseFill(p5, isInner));
        p5.rect(x, y, w, h);
    }
}

const getRandomHouseFill = (p5: p5, isInner: boolean) => {
    if (isInner) {
        return `hsl(${"" + Math.floor(p5.random(40, 60))},${"" + Math.floor(p5.random(10, 20))
            }%,${"" + Math.floor(p5.random(60, 80))}%)`;
    }

    return `hsl(${"" + Math.floor(p5.random(0, 60))},${"" + Math.floor(p5.random(30, 100))
        }%,${"" + Math.floor(p5.random(50, 90))}%)`;
}