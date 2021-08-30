const raylib = require("raylib");
const { EventSystemModule, GameObject2D, Scene2D, CircleRenderer, RectangleRenderer } = require("./modules/index");

class Engine {
    time = 0;
    deltaTime = 0;
    window = {
        _title: "",
        _size: {
            width: 0,
            height: 0
        },
        _targetFPS: 0,
        _fullscreen: false,

        get title() {
            return this._title;
        },
        set title(value) {
            this._title = value;
            raylib.SetWindowTitle(value);
        },

        get size() {
            if (this._fullscreen) {
                return { width: raylib.GetMonitorWidth(), height: raylib.GetMonitorHeight() }
            } else {
                return this._size;
            }
        },
        set size(value) {
            this._size = value;
            if (!this._fullscreen) {
                raylib.SetWindowSize(value.width, value.height);
            }
        },

        get targetFPS() {
            return this._targetFPS;
        },
        set targetFPS(value) {
            this._targetFPS = value;
            raylib.SetTargetFPS(value);
        },

        get fullscreen() {
            return this._fullscreen;
        },
        set fullscreen(value) {
            if (value != this._fullscreen) {
                this._fullscreen = value;
                if (value) {
                    raylib.SetWindowSize(raylib.GetMonitorWidth(0), raylib.GetMonitorHeight(0));
                } else {
                    raylib.SetWindowSize(this._size.width, this._size.height);
                }

                raylib.ToggleFullscreen();
            }
        }
    };

    constructor(modules, properties) {
        // Set Initial Properties
        this._initialProperties = properties || {};

        // Modules
        this._modules = [];
        modules.forEach(module => {
            if (typeof module === "object") {
                if (module.module.prototype.hasOwnProperty("init")) {
                    let args = module.args || [];
                    module.module.prototype.init.call(this, ...args);
                }

                this._modules.push(module.module);
            } else if (typeof module === "function") {
                if (module.prototype.hasOwnProperty("init")) {
                    module.prototype.init.call(this);
                }

                this._modules.push(module);
            }
        });

        // Include Raylib
        this.raylib = raylib;
    }
    
    run() {
        // Set Flags
        if (this._initialProperties.window?.resizable != undefined && this._initialProperties.window.resizable) {
            raylib.SetConfigFlags(raylib.FLAG_WINDOW_RESIZABLE);
        }

        if (this._initialProperties.window?.decorated != undefined && !(this._initialProperties.window.decorated)) {
            raylib.SetConfigFlags(raylib.FLAG_WINDOW_UNDECORATED);
        }

        if(this._initialProperties.window?.transparent != undefined && this._initialProperties.window.transparent) {
            raylib.SetConfigFlags(raylib.FLAG_WINDOW_TRANSPARENT);
        }

        // Window Initialization
        let width = this._initialProperties.window?.size?.width || 960;
        let height = this._initialProperties.window?.size?.height || 540;
        let title = this._initialProperties.window?.title || "Raylib Game Engine";
        raylib.InitWindow(width, height, title);

        // Set Window Properties Object Values
        this.window._title = title;
        this.window._size = { width, height };
        this.window.targetFPS = this._initialProperties.window?.targetFPS || 60;
        if (this._initialProperties.window?.fullscreen != undefined) {
            this.window.fullscreen = this._initialProperties.window.fullscreen;
        }

        while (!raylib.WindowShouldClose()) {
            // Update Time
            this.deltaTime = raylib.GetFrameTime();
            this.time += this.deltaTime;

            // Check if the window as been resized
            if (this._initialProperties.window?.resizable != undefined && this._initialProperties.window.resizable) {
                if (raylib.IsWindowResized()) {
                    if (!this.window._fullscreen) {
                        this.window._size = {
                            width: raylib.GetScreenWidth(),
                            height: raylib.GetScreenHeight()
                        };
                    }
                }
            }

            // Update Modules
            this._modules.forEach(module => {
                if (module.prototype.hasOwnProperty("onUpdate")) {
                    module.prototype.onUpdate.call(this);
                }
            });

            // Draw
            raylib.BeginDrawing();
                raylib.ClearBackground(raylib.WHITE);
                this._modules.forEach(module => {
                    if (module.prototype.hasOwnProperty("on2dDraw")) {
                        module.prototype.on2dDraw.call(this);
                    }
                });
                if (this._initialProperties.debugger?.showFPS != undefined && this._initialProperties.debugger.showFPS) {
                    raylib.DrawText(`FPS: ${Math.floor(1 / this.deltaTime)}`, 10, 10, 20, raylib.BLUE);
                }
            raylib.EndDrawing();
        }

        raylib.CloseWindow();
    }
}

module.exports = {
    colors: {
        lightgray: raylib.LIGHTGRAY,
        gray: raylib.GRAY,
        darkgray: raylib.DARKGRAY,
        yellow: raylib.YELLOW,
        gold: raylib.GOLD,
        orange: raylib.ORANGE,
        pink: raylib.PINK,
        red: raylib.RED,
        maroon: raylib.MAROON,
        green: raylib.GREEN,
        lime: raylib.LIME,
        darkgreen: raylib.DARKGREEN,
        skyblue: raylib.SKYBLUE,
        blue: raylib.BLUE,
        darkblue: raylib.DARKBLUE,
        purple: raylib.PURPLE,
        violet: raylib.VIOLET,
        darkpurple: raylib.DARKPURPLE,
        beige: raylib.BEIGE,
        brown: raylib.BROWN,
        darkbrown: raylib.DARKBROWN,
        white: raylib.WHITE,
        black: raylib.BLACK,
        blank: raylib.BLANK,
        magenta: raylib.MAGENTA,
        raywhite: raylib.RAYWHITE
    },
    Engine,
    EventSystemModule,
    GameObject2D,
    Scene2D,
    CircleRenderer,
    RectangleRenderer
};