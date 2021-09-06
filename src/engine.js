const raylib = require("raylib");
const { EventSystemModule, GameObject2D, Scene2D, CircleRenderer, RectangleRenderer } = require("./modules/index");
const Color = require("./color");

class WindowProperties {
    _fullscreen = false;

    constructor(title, width, height, fullscreen) {
        this._title = title;
        this._size = { width, height };
        this.fullscreen = fullscreen;
    }

    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
        raylib.SetWindowTitle(value);
    }

    get size() {
        if (this._fullscreen) {
            return { width: raylib.GetMonitorWidth(), height: raylib.GetMonitorHeight() }
        } else {
            return this._size;
        }
    }
    set size(value) {
        this._size = value;

        if (!this._fullscreen) {
            raylib.SetWindowSize(value.width, value.height);
        }
    }

    get fullscreen() {
        return this._fullscreen;
    }
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

    get open() {
        return !raylib.WindowShouldClose();
    }
}

class RenderingProperties {
    constructor(targetFPS, backgroundColor) {
        this.targetFPS = targetFPS;
        this.backgroundColor = backgroundColor;
    }

    get targetFPS() {
        return this._targetFPS;
    }
    set targetFPS(value) {
        this._targetFPS = value;
        raylib.SetTargetFPS(value);
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

class Engine {
    _raylib = raylib;

    get raylib() {
        return this._raylib;
    }
    get r() {
        return this._raylib;
    }

    _deltaTime = 0;
    get deltaTime() {
        return this._deltaTime;
    }
    get dt() {
        return this._deltaTime;
    }

    _time = 0;
    get time() {
        return this._time;
    }
    get t() {
        return this._time;
    }

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
    }
    
    run() {
        let resizable;
        {
            // Properties
            let width = this._initialProperties.window?.size?.width || 960;
            let height = this._initialProperties.window?.size?.height || 540;
            let title = this._initialProperties.window?.title || "Raylib Game Engine";
            let fullscreen = (this._initialProperties.window?.fullscreen != undefined) ? this._initialProperties.window.fullscreen : false;
            resizable = (this._initialProperties.window?.resizable != undefined) ? this._initialProperties.window.resizable : false;
            let decorated = (this._initialProperties.window?.decorated != undefined) ? this._initialProperties.window.decorated : true;
            let transparent = (this._initialProperties.window?.transparent != undefined) ? this._initialProperties.window.transparent : false;
            let targetFPS = this._initialProperties.rendering?.targetFPS || 60;
            let backgroundColor = this._initialProperties.rendering?.backgroundColor || "black";

            // Flags
            if (resizable) {
                raylib.SetConfigFlags(raylib.FLAG_WINDOW_RESIZABLE);
            }
            if (!decorated) {
                raylib.SetConfigFlags(raylib.FLAG_WINDOW_UNDECORATED);
            }
            if (transparent) {
                raylib.SetConfigFlags(raylib.FLAG_WINDOW_TRANSPARENT);
            }

            // Window
            raylib.InitWindow(width, height, title);
            this.window = new WindowProperties(
                title,
                width,
                height,
                fullscreen
            );

            // Rendering
            this.rendering = new RenderingProperties(
                targetFPS,
                backgroundColor
            );
        }

        // Cleaning
        if (this._initialProperties.window != undefined) {
            delete this._initialProperties.window;
        }
        if (this._initialProperties.rendering?.targetFPS != undefined) {
            delete this._initialProperties.rendering.targetFPS;
        }

        // Game Loop
        while (this.window.open) {
            // Update Time
            this._deltaTime = raylib.GetFrameTime();
            this._time += this._deltaTime;

            // Check if the window as been resized
            if (resizable && raylib.IsWindowResized() && !this.window.fullscreen) {
                this.window._size = {
                    width: raylib.GetScreenWidth(),
                    height: raylib.GetScreenHeight()
                };
            }

            // Update Modules
            this._modules.forEach(module => {
                if (module.prototype.hasOwnProperty("onUpdate")) {
                    module.prototype.onUpdate.call(this);
                }
            });

            // Draw
            raylib.BeginDrawing();
                raylib.ClearBackground(this.rendering._backgroundColor);
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
    Color,
    Engine,
    EventSystemModule,
    GameObject2D,
    Scene2D,
    CircleRenderer,
    RectangleRenderer
};