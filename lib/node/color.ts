function splitCSSColorFun(str: string): number[] {
    const ret = [];
    for (const { groups } of str.matchAll(/(?<num>\d+([.]\d+)?(?<percent>%)?)/g)) {
        if (groups?.percent != null) {
            const n = parseFloat(groups.num);
            ret.push(n / 100);
        }
        else if (groups?.num != null) {
            ret.push(parseFloat(groups.num));
        }
    }
    return ret;
}

const HSL_EXTRACT = {
    R: 0,
    G: 8,
    B: 4,
} as const;
type HslExtract = (typeof HSL_EXTRACT)[keyof typeof HSL_EXTRACT];

// SEE: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
function HSLtoRGBPart(h: number, s: number, l: number, n: HslExtract): number {
    const k = (n + h / 30 ) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
}

/**
 * A low quality CSS color parser.
 * only supports legacy style rgb(), rgba(), hsl() and hex formatted CSS colors.
 *
 * ISSUE: Does not support exotic units like: turn, deg.
 *        Does not support /.
 *        Definitely does not support from syntax and nested colors.
 *        Does not support LAB, OKLAB, HWB and other modern color functions.
 */
export function cssColorValueToUint32(str: string): number {
    const num = new ArrayBuffer(4);
    const num_view = new DataView(num);
    if (!str) return 0x000000;
    if (str.startsWith('#')) {
        if (str.length === 4 || str.length == 5) {
            // #RGB
            const red = parseInt(str[1], 16);
            num_view.setUint8(0, (red << 4) | red); // red
            const green = parseInt(str[2], 16);
            num_view.setUint8(1, (green << 4) | green); // green
            const blue = parseInt(str[3], 16);
            num_view.setUint8(2, (blue << 4) | blue); // blue
            // #RGBA
            if (str.length === 5) {
                const alpha = parseInt(str[4], 16);
                num_view.setUint8(3, (alpha << 4) | alpha);
            }
            else {
                num_view.setUint8(3, 0xFF | 0); // alpha
            }
        }
        else if (str.length === 7) {
            // #RRGGBB
            num_view.setUint32(0, (parseInt(str.slice(1), 16) << 8) | 0xFF , false);
        }
        else if (str.length === 9) {
            // #RRGGBBAA
            num_view.setUint32(0, parseInt(str.slice(1), 16) | 0, false);
        }
    }
    else if (str.startsWith('rgb')) {
        const [r, g, b, a] = splitCSSColorFun(str);
        num_view.setUint8(0, r | 0);
        num_view.setUint8(1, g | 0);
        num_view.setUint8(2, b | 0);
        if (a !== undefined) {
            num_view.setUint8(3, Math.floor(a * 0xFF) | 0);
        }
        else {
            num_view.setUint8(3, 0xFF | 0);
        }
    }
    else if (str.startsWith('hsl')) {
    // SEE: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
        const [h, s, l, a] = splitCSSColorFun(str);
        const f = HSLtoRGBPart.bind(undefined, h, s, l);
        num_view.setUint8(0, f(HSL_EXTRACT.R) | 0);
        num_view.setUint8(1, f(HSL_EXTRACT.G) | 0);
        num_view.setUint8(2, f(HSL_EXTRACT.B) | 0);
        if (a !== undefined) {
            num_view.setUint8(3, Math.floor(a * 0xFF) | 0);
        }
        else {
            num_view.setUint8(3, 0xFF | 0);
        }
    }
    else if (Object.hasOwnProperty.call(NAMED_COLORS, str)) {
        return NAMED_COLORS[(str as keyof typeof NAMED_COLORS)];
    }
    else {
        throw new Error('unknown style format: ' + str);
    }
    return num_view.getUint32(0, false);
}

const NAMED_COLORS = {
    transparent: 0x00000000,
    aliceblue: 0xf0f8ffff,
    antiquewhite: 0xfaebd7ff,
    aqua: 0x00ffffff,
    aquamarine: 0x7fffd4ff,
    azure: 0xf0ffffff,
    beige: 0xf5f5dcff,
    bisque: 0xffe4c4ff,
    black: 0x000000ff,
    blanchedalmond: 0xffebcdff,
    blue: 0x0000ffff,
    blueviolet: 0x8a2be2ff,
    brown: 0xa52a2aff,
    burlywood: 0xdeb887ff,
    cadetblue: 0x5f9ea0ff,
    chartreuse: 0x7fff00ff,
    chocolate: 0xd2691eff,
    coral: 0xff7f50ff,
    cornflowerblue: 0x6495edff,
    cornsilk: 0xfff8dcff,
    crimson: 0xdc143cff,
    cyan: 0x00ffffff,
    darkblue: 0x00008bff,
    darkcyan: 0x008b8bff,
    darkgoldenrod: 0xb8860bff,
    darkgray: 0xa9a9a9ff,
    darkgreen: 0x006400ff,
    darkgrey: 0xa9a9a9ff,
    darkkhaki: 0xbdb76bff,
    darkmagenta: 0x8b008bff,
    darkolivegreen: 0x556b2fff,
    darkorange: 0xff8c00ff,
    darkorchid: 0x9932ccff,
    darkred: 0x8b0000ff,
    darksalmon: 0xe9967aff,
    darkseagreen: 0x8fbc8fff,
    darkslateblue: 0x483d8bff,
    darkslategray: 0x2f4f4fff,
    darkslategrey: 0x2f4f4fff,
    darkturquoise: 0x00ced1ff,
    darkviolet: 0x9400d3ff,
    deeppink: 0xff1493ff,
    deepskyblue: 0x00bfffff,
    dimgray: 0x696969ff,
    dimgrey: 0x696969ff,
    dodgerblue: 0x1e90ffff,
    firebrick: 0xb22222ff,
    floralwhite: 0xfffaf0ff,
    forestgreen: 0x228b22ff,
    fuchsia: 0xff00ffff,
    gainsboro: 0xdcdcdcff,
    ghostwhite: 0xf8f8ffff,
    gold: 0xffd700ff,
    goldenrod: 0xdaa520ff,
    gray: 0x808080ff,
    green: 0x008000ff,
    greenyellow: 0xadff2fff,
    grey: 0x808080ff,
    honeydew: 0xf0fff0ff,
    hotpink: 0xff69b4ff,
    indianred: 0xcd5c5cff,
    indigo: 0x4b0082ff,
    ivory: 0xfffff0ff,
    khaki: 0xf0e68cff,
    lavender: 0xe6e6faff,
    lavenderblush: 0xfff0f5ff,
    lawngreen: 0x7cfc00ff,
    lemonchiffon: 0xfffacdff,
    lightblue: 0xadd8e6ff,
    lightcoral: 0xf08080ff,
    lightcyan: 0xe0ffffff,
    lightgoldenrodyellow: 0xfafad2ff,
    lightgray: 0xd3d3d3ff,
    lightgreen: 0x90ee90ff,
    lightgrey: 0xd3d3d3ff,
    lightpink: 0xffb6c1ff,
    lightsalmon: 0xffa07aff,
    lightseagreen: 0x20b2aaff,
    lightskyblue: 0x87cefaff,
    lightslategray: 0x778899ff,
    lightslategrey: 0x778899ff,
    lightsteelblue: 0xb0c4deff,
    lightyellow: 0xffffe0ff,
    lime: 0x00ff00ff,
    limegreen: 0x32cd32ff,
    linen: 0xfaf0e6ff,
    magenta: 0xff00ffff,
    maroon: 0x800000ff,
    mediumaquamarine: 0x66cdaaff,
    mediumblue: 0x0000cdff,
    mediumorchid: 0xba55d3ff,
    mediumpurple: 0x9370dbff,
    mediumseagreen: 0x3cb371ff,
    mediumslateblue: 0x7b68eeff,
    mediumspringgreen: 0x00fa9aff,
    mediumturquoise: 0x48d1ccff,
    mediumvioletred: 0xc71585ff,
    midnightblue: 0x191970ff,
    mintcream: 0xf5fffaff,
    mistyrose: 0xffe4e1ff,
    moccasin: 0xffe4b5ff,
    navajowhite: 0xffdeadff,
    navy: 0x000080ff,
    oldlace: 0xfdf5e6ff,
    olive: 0x808000ff,
    olivedrab: 0x6b8e23ff,
    orange: 0xffa500ff,
    orangered: 0xff4500ff,
    orchid: 0xda70d6ff,
    palegoldenrod: 0xeee8aaff,
    palegreen: 0x98fb98ff,
    paleturquoise: 0xafeeeeff,
    palevioletred: 0xdb7093ff,
    papayawhip: 0xffefd5ff,
    peachpuff: 0xffdab9ff,
    peru: 0xcd853fff,
    pink: 0xffc0cbff,
    plum: 0xdda0ddff,
    powderblue: 0xb0e0e6ff,
    purple: 0x800080ff,
    rebeccapurple: 0x663399ff,
    red: 0xff0000ff,
    rosybrown: 0xbc8f8fff,
    royalblue: 0x4169e1ff,
    saddlebrown: 0x8b4513ff,
    salmon: 0xfa8072ff,
    sandybrown: 0xf4a460ff,
    seagreen: 0x2e8b57ff,
    seashell: 0xfff5eeff,
    sienna: 0xa0522dff,
    silver: 0xc0c0c0ff,
    skyblue: 0x87ceebff,
    slateblue: 0x6a5acdff,
    slategray: 0x708090ff,
    slategrey: 0x708090ff,
    snow: 0xfffafaff,
    springgreen: 0x00ff7fff,
    steelblue: 0x4682b4ff,
    tan: 0xd2b48cff,
    teal: 0x008080ff,
    thistle: 0xd8bfd8ff,
    tomato: 0xff6347ff,
    turquoise: 0x40e0d0ff,
    violet: 0xee82eeff,
    wheat: 0xf5deb3ff,
    white: 0xffffffff,
    whitesmoke: 0xf5f5f5ff,
    yellow: 0xffff00ff,
    yellowgreen: 0x9acd32ff,
} as const;
