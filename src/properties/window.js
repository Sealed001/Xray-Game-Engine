const raylib = require("raylib");
const { defaultsDeep } = require("lodash");

const defaultsProperties = {
    title: "Raylib Game Engine",
    size: {
        width: 960,
        height: 540
    },
    fullscreen: false,
    resizable: false,
    decorated: true,
    transparent: false
};

class WindowProperties {
    _fullscreen = false;

    constructor(userProperties) {
        let properties = defaultsDeep(userProperties || {}, defaultsProperties);

        this._resizable = properties.resizable;
        this._title = properties.title;
        this._size = {
            width: properties.size.width,
            height: properties.size.height
        };

        this.fullscreen = properties.fullscreen;
        

        // Set flags
        if (properties.resizable) {
            raylib.SetConfigFlags(raylib.FLAG_WINDOW_RESIZABLE);
        }
        if (!properties.decorated) {
            raylib.SetConfigFlags(raylib.FLAG_WINDOW_UNDECORATED);
        }
        if (properties.transparent) {
            raylib.SetConfigFlags(raylib.FLAG_WINDOW_TRANSPARENT);
        }
    }

    static windowInitializationProperties(userProperties) {
        let properties = defaultsDeep(userProperties || {}, defaultsProperties);

        return [properties.size.width, properties.size.height, properties.title];
    }

    update() {
        // Check if the window as been resized
        if (this._resizable && raylib.IsWindowResized() && !this._fullscreen) {
            this._size = {
                width: raylib.GetScreenWidth(),
                height: raylib.GetScreenHeight()
            };
        }
    }

    get title() {
        return this._title;
    }
    set title(value) {
        if (typeof value !== "string") { return; }
  
        this._title = value;
        raylib.SetWindowTitle(this._title);
    }

    get size() {
        return this._fullscreen ? {
            width: raylib.GetMonitorWidth(),
            height: raylib.GetMonitorHeight()
        } : this._size;
    }
    set size(value) {
        if (typeof value !== "object") { return; }

        if (Array.isArray(value)) {
            if (typeof value[0] !== "number" || typeof value[1] !== "number") { return; }

            this._size = {
                width: value[0],
                height: value[1]
            };
        } else {
            if (typeof value.width !== "number" || typeof value.height !== "number") { return; }

            this._size = {
                width: value.width,
                height: value.height
            };
        }

        if (!this._fullscreen) {
            raylib.SetWindowSize(this._size.width, this._size.height);
        }
    }

    get width() {
        return this._fullscreen ? raylib.GetMonitorWidth() : this._size.width;
    }
    set width(value) {
        if (typeof value !== "number") { return; }

        this._size.width = value;

        if (!this._fullscreen) {
            raylib.SetWindowSize(this._size.width, this._size.height);
        }
    }

    get height() {
        return this._fullscreen ? raylib.GetMonitorHeight() : this._size.height;
    }
    set height(value) {
        if (typeof value !== "number") { return; }

        this._size.height = value;

        if (!this._fullscreen) {
            raylib.SetWindowSize(this._size.width, this._size.height);
        }
    }

    get fullscreen() {
        return this._fullscreen;
    }
    set fullscreen(value) {
        if (typeof value !== "boolean" || value === this._fullscreen) { return; }

        this._fullscreen = value;

        if (this._fullscreen) {
            raylib.SetWindowSize(raylib.GetMonitorWidth(0), raylib.GetMonitorHeight(0));
        } else {
            raylib.SetWindowSize(this._size.width, this._size.height);
        }

        raylib.ToggleFullscreen();
    }

    get open() {
        return !raylib.WindowShouldClose();
    }
}

module.exports = WindowProperties;