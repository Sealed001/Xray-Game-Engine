const raylib = require("raylib");

class Color {
    static blank = raylib.BLANK;

    static black = raylib.BLACK;

    static white = raylib.WHITE;
    static raywhite = raylib.RAYWHITE;

    static lightgray = raylib.LIGHTGRAY;
    static gray = raylib.GRAY;
    static darkgray = raylib.DARKGRAY;

    static yellow = raylib.YELLOW;
    static gold = raylib.GOLD;

    static orange = raylib.ORANGE;

    static red = raylib.RED;

    static pink = raylib.PINK;
    static magenta = raylib.MAGENTA;
    static violet = raylib.VIOLET;
    static purple = raylib.PURPLE;
    static darkpurple = raylib.DARKPURPLE;

    static skyblue = raylib.SKYBLUE;
    static blue = raylib.BLUE;
    static darkblue = raylib.DARKBLUE;

    static lime = raylib.LIME;
    static green = raylib.GREEN;
    static darkgreen = raylib.DARKGREEN;
    
    static maroon = raylib.MAROON;
    static brown = raylib.BROWN;
    static darkbrown = raylib.DARKBROWN;
    
    static beige = raylib.BEIGE;

    constructor(firstValue, ...values) {
        if (values.length > 0) {
            this.r = Math.min(Math.max(firstValue, 0), 255);
            this.g = Math.min(Math.max((typeof values[0] === "number") ? values[0] : 0, 0), 255);
            this.b = Math.min(Math.max((typeof values[1] === "number") ? values[1] : 0, 0), 255);
            this.a = Math.min(Math.max((typeof values[2] === "number") ? values[2] : 255, 0), 255);
        } else {
            firstValue_switch:
            switch(typeof firstValue) {
                case "string":
                    if (Color.hasOwnProperty(firstValue)) {
                        this.r = Color[firstValue].r;
                        this.g = Color[firstValue].g;
                        this.b = Color[firstValue].b;
                        this.a = Color[firstValue].a;
                        break firstValue_switch;
                    } else if (firstValue.charAt(0) === "#" && firstValue.length >= 4) {
                        let color = firstValue.slice(1);

                        if (color.toLowerCase().split('').every(c => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"].includes(c))) {
                            switch (color.length) {
                                case 3:
                                    color = `${color}f`;
                                case 4:
                                    color = `${color[0].repeat(2)}${color[1].repeat(2)}${color[2].repeat(2)}${color[3].repeat(2)}`;
                                case 6:
                                    color = `${color}ff`;
                                case 8:
                                    this.r = parseInt(Number(`0x${color.slice(0, 2)}`), 10);
                                    this.g = parseInt(Number(`0x${color.slice(2, 4)}`), 10);
                                    this.b = parseInt(Number(`0x${color.slice(4, 6)}`), 10);
                                    this.a = parseInt(Number(`0x${color.slice(6, 8)}`), 10);
                                    break firstValue_switch;
                            }
                        }
                    }
                case "object":
                    if (Array.isArray(firstValue) && firstValue.length >= 3 && firstValue.slice(0, 3).every(v => typeof v === "number")) {
                        this.r = Math.min(Math.max(firstValue[0], 0), 255);
                        this.g = Math.min(Math.max(firstValue[1], 0), 255);
                        this.b = Math.min(Math.max(firstValue[2], 0), 255);
                        this.a = Math.min(Math.max((typeof firstValue[3] === "number") ? firstValue[3] : 255, 0), 255);
                        break firstValue_switch;
                    } else if (firstValue.hasOwnProperty("r") && firstValue.hasOwnProperty("g") && firstValue.hasOwnProperty("b") && [firstValue.r, firstValue.g, firstValue.b].every(v => typeof v === "number")) {
                        this.r = Math.min(Math.max(firstValue.r, 0), 255);
                        this.g = Math.min(Math.max(firstValue.g, 0), 255);
                        this.b = Math.min(Math.max(firstValue.b, 0), 255);
                        this.a = Math.min(Math.max((typeof firstValue.a === "number") ? firstValue.a : 255, 0), 255);
                        break firstValue_switch;
                    } else if (firstValue.hasOwnProperty("h") && firstValue.hasOwnProperty("s") && firstValue.hasOwnProperty("v") && [firstValue.h, firstValue.s, firstValue.v].every(v => typeof v === "number")) {
                        let _h = ((firstValue.h >= 0) ? (firstValue.h % 360) : (360 + firstValue.h % 360)) / 360;
                        let _s = Math.min(Math.max(firstValue.s, 0), 100) / 100;
                        let _v = Math.min(Math.max(firstValue.v, 0), 100) / 100;
                        let _a = Math.min(Math.max((typeof firstValue.a === "number") ? firstValue.a : 255, 0), 255);

                        let c = _s * _v;
                        let x = c * (1 - Math.abs((_h / (1 / 6)) % 2 - 1));
                        let m = _v - c;

                        if (_h < (1 / 6)) {
                            this.r = (c + m) * 255;
                            this.g = (x + m) * 255;
                            this.b = m * 255;
                            this.a = _a;
                        } else if (_h < (2 / 6)) {
                            this.r = (x + m) * 255;
                            this.g = (c + m) * 255;
                            this.b = m * 255;
                            this.a = _a;
                        } else if (_h < (3 / 6)) {
                            this.r = m * 255;
                            this.g = (c + m) * 255;
                            this.b = (x + m) * 255;
                            this.a = _a;
                        } else if (_h < (4 / 6)) {
                            this.r = m * 255;
                            this.g = (x + m) * 255;
                            this.b = (c + m) * 255;
                            this.a = _a;
                        } else if (_h < (5 / 6)) {
                            this.r = (x + m) * 255;
                            this.g = m * 255;
                            this.b = (c + m) * 255;
                            this.a = _a;
                        } else {
                            this.r = (c + m) * 255;
                            this.g = m * 255;
                            this.b = (x + m) * 255;
                            this.a = _a;
                        }
                        break firstValue_switch;
                    }
                default:
                    this.r = 0;
                    this.g = 0;
                    this.b = 0;
                    this.a = 255;
                    break firstValue_switch;
            } 
        }
    }

    static HSV(h, s, v, a = 255) {
        return new Color({h, s, v, a});
    }
}

module.exports = Color;