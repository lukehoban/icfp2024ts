
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`|~ \n";

export const decodeString = (s: string): string => 
    [...s].map(c => chars[c.charCodeAt(0) - 33]).join('');

export const fromBase94 = (s: string): number =>
    [...s].reduce((acc, c) => acc * 94 + chars.indexOf(c), 0);

export const toBase94 = (num: number): string => {
    const div = Math.floor(num / 94);
    const rem = num % 94;
    return (div ? toBase94(div) : "") + chars[rem];
}
