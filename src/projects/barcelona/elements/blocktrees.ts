import { RandomBlock } from "..";
import { BLOCK_W, TREE_NR_STEPS, BLOCK_H } from "../constants";

export const drawBlockTrees = (p5: p5, block: RandomBlock) => {
    p5.noStroke();

    const stepX = BLOCK_W / TREE_NR_STEPS;
    const stepY = BLOCK_H / TREE_NR_STEPS;

    block.trees.forEach((tree) => {
        // 0 - 20 tree steps
        tree.steps.forEach((step, i) => {
            // draw trees incrementally after block spawn
            if (p5.frameCount < i + block.index + 1) {
                return;
            }

            p5.fill(step.color);
            let startX = block.startBlockX;
            if (tree.direction === "e") {
                startX += BLOCK_W;
            }

            let startY = block.startBlockY;
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