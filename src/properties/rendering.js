const raylib = require("raylib");
const { defaultsDeep } = require("lodash");

const Color = require("../color");

const defaultsProperties = {
    targetFPS: 60,
    backgroundColor: "black"
};

class RenderingProperties {
    constructor(userProperties) {
        let properties = defaultsDeep(userProperties || {}, defaultsProperties);

        this.targetFPS = properties.targetFPS;
        this.backgroundColor = properties.backgroundColor;
    }

    clearBackground() {
        raylib.ClearBackground(this._backgroundColor);
    }

    get targetFPS() {
        return this._targetFPS;
    }
    set targetFPS(value) {
        if (typeof value !== "number") { return; }

        this._targetFPS = value;
        raylib.SetTargetFPS(this._targetFPS);
    }

    get backgroundColor() {
        return this._backgroundColor;
    }
    get backgroundColorParameter() {
        return this._backgroundColorParameter;
    }
    set backgroundColor(value) {
        this._backgroundColorParameter = value;
        this._backgroundColor = new Color(value);
    }
}

module.exports = RenderingProperties;