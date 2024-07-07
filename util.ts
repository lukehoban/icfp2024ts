
const order = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`|~ \n";

export const decodeString = (s: string): string => {
    
    return [...s].map(c => order[c.charCodeAt(0) - 33]).join('');
};

export const fromBase94 = (s: string): number =>
    [...s].reduce((acc, c) => acc * 94 + c.charCodeAt(0) - 33, 0);

export const toBase94 = (num: number): string => {
    const div = Math.floor(num / 94);
    const rem = num % 94;
    return (div ? toBase94(div) : "") + order[rem];
}

console.log(toBase94(15818151));