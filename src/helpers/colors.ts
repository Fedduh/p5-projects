export const getRandomOrange = (p5: p5) => {
    return `hsl(${"" + Math.floor(p5.random(10, 40))},100%, 65%)`;
}

export const getRandomGrey = (p5: p5) => {
    return `hsl(${"" + Math.floor(p5.random(0, 60))},20%, 75%)`;
}
