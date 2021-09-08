const raylib = require("raylib");
const { defaultsDeep } = require("lodash");

const Color = require("../color");

const defaultsProperties = {
    fps: {
        show: false,
        color: "white"
    }
};

class DebuggerProperties {
    fps = {
        show: true,
        get color() {
            return this._color;
        },
        get colorParameter() {
            return this._colorParameter;
        },
        set color(value) {
            this._colorParameter = value;
            this._color = new Color(value);
        }
    }

    constructor(userProperties) {
        let properties = defaultsDeep(userProperties || {}, defaultsProperties);

        this.fps.show = properties.fps.show;
        this.fps.color = properties.fps.color;
    }

    draw() {
        if (this.fps.show) {
            let dt = raylib.GetFrameTime();

            raylib.DrawText(`FPS: ${Math.floor(1 / dt)}`, 10, 10, 20, this.fps._color);
        }
    }
}

module.exports = DebuggerProperties;