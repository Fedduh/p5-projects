export const barcelona = (p5: p5) => {
    const CANV_W = 600;
    const CANV_H = CANV_W;

    const STREET_COLOR = "rgb(45,25,17)";

    const BLOCKS = 3;
    const BLOCK_GAP = 30;
    const BLOCK_W = (CANV_W - BLOCK_GAP * (BLOCKS + 1)) / BLOCKS;
    const BLOCK_H = BLOCK_W;
    const BLOCK_RADIUS = 20;

    const HOUSES = 4;
    const HOUSE_W = BLOCK_W / HOUSES;
    const HOUSE_H = BLOCK_H / HOUSES;

    let frame = 0;

    p5.setup = () => {
        p5.createCanvas(600, 600);
        p5.frameRate(1);
        p5.colorMode(p5.HSL);
    }

    p5.draw = () => {
        p5.background(STREET_COLOR);
        // draw trees 'below' blocks (though will be covered by cross streets);

        // draw BLOCKS
        for (let bx = 0; bx < BLOCKS; bx++) {
            for (let by = 0; by < BLOCKS; by++) {
                const block_x = bx * BLOCK_W + BLOCK_GAP + BLOCK_GAP * bx;
                const block_y = by * BLOCK_H + BLOCK_GAP + BLOCK_GAP * by;

                drawBlockTrees(block_x, block_y);

                // BLOCK
                p5.fill("rgb(226,226,226)");
                // stroke("white");
                p5.noStroke();
                p5.rect(block_x, block_y, BLOCK_W, BLOCK_H, BLOCK_RADIUS);

                let isInner;

                // HOUSES within BLOCK
                for (let x = 0; x < HOUSES; x++) {
                    for (let y = 0; y < HOUSES; y++) {
                        isInner = false;
                        if (x > 0 && y > 0 && x < HOUSES - 1 && y < HOUSES - 1) {
                            isInner = true;
                        }
                        drawHouse(block_x, block_y, x, y, isInner);
                    }
                }
            }
        }

        // draw streets accross, over all blocks
        drawCrossStreets();

        frame++;
        if (frame === BLOCKS * HOUSES * HOUSES * 2) {
            p5.noLoop();
        }
    }

    const drawBlockTrees = (blockX: number, blockY: number) => {
        p5.noStroke();

        const STEPS = 20;
        const stepX = BLOCK_W / STEPS;
        const stepY = BLOCK_H / STEPS;

        // north, west, south, east
        ["n", "e", "s", "w"].forEach((direction) => {
            if (p5.random(0, 1) < 0.75) {
                for (let x = 1; x < STEPS; x++) {
                    // skip randomnly
                    if (p5.random(0, 1) < 0.4) {
                        continue;
                    }

                    p5.fill(`hsl(${"" + Math.floor(p5.random(75, 150))},80%, 30%)`);
                    const circleD = Math.floor(p5.random(6, 16));
                    let startX = blockX;
                    if (direction === "e") {
                        startX += BLOCK_W;
                    }

                    let startY = blockY;
                    if (direction === "s") {
                        startY += BLOCK_H;
                    }
                    p5.circle(
                        startX + stepX * (["n", "s"].includes(direction) ? x : 0),
                        startY + stepY * (["e", "w"].includes(direction) ? x : 0),
                        circleD
                    );
                }
            }
        });
    };

    const drawHouse = (block_x: number, block_y: number, x: number, y: number, isInner: boolean) => {
        const color = isInner ? getRandomGrey() : getRandomOrange();
        p5.fill(color);
        // noFill();
        // stroke(getRandomGrey());
        if (isInner) {
            p5.noStroke();
        }

        const houseX = block_x + x * HOUSE_W;
        const houseY = block_y + y * HOUSE_H;

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

        p5.rect(
            houseX,
            houseY,
            HOUSE_W,
            HOUSE_H,
            // RADIUS will not be correct (smaller square)
            corner === "topleft" ? BLOCK_RADIUS : 0,
            corner === "topright" ? BLOCK_RADIUS : 0,
            corner === "bottomright" ? BLOCK_RADIUS : 0,
            corner === "bottomleft" ? BLOCK_RADIUS : 0
        );

        drawInHouse(houseX, houseY, HOUSE_W, HOUSE_H, isInner, corner);
    }

    const drawInHouse = (houseX: number, houseY: number, houseW: number, houseH: number, isInner: boolean, corner: string) => {
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
            p5.fill(getRandomHouseFill(isInner));
            p5.rect(x, y, w, h);
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

    const getRandomOrange = () => {
        return `hsl(${"" + Math.floor(p5.random(10, 40))},100%, 65%)`;
    }


    const getRandomGrey = () => {
        return `hsl(${"" + Math.floor(p5.random(0, 60))},20%, 75%)`;
    }

    const getRandomHouseFill = (isInner: boolean) => {
        if (isInner) {
            return `hsl(${"" + Math.floor(p5.random(40, 60))},${"" + Math.floor(p5.random(10, 20))
                }%,${"" + Math.floor(p5.random(60, 80))}%)`;
        }

        return `hsl(${"" + Math.floor(p5.random(0, 60))},${"" + Math.floor(p5.random(30, 100))
            }%,${"" + Math.floor(p5.random(50, 90))}%)`;
    }
}