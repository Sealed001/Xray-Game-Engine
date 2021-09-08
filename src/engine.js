const raylib = require("raylib");

const { EventSystemModule, GameObject2D, Scene2D, CircleRenderer, RectangleRenderer } = require("./modules/index");
const { WindowProperties, RenderingProperties, DebuggerProperties } = require("./properties/index");
const Color = require("./color");

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

    update() {
        let deltaTime = raylib.GetFrameTime();

        // Update Time
        this._deltaTime = deltaTime;
        this._time += deltaTime;

        // Update Window
        this.window.update();

        // Update Modules
        this._modules.forEach(module => {
            if (module.prototype.hasOwnProperty("onUpdate")) {
                module.prototype.onUpdate.call(this);
            }
        });

        // Draw
        raylib.BeginDrawing();
            this.rendering.clearBackground();
            this._modules.forEach(module => {
                if (module.prototype.hasOwnProperty("on2dDraw")) {
                    module.prototype.on2dDraw.call(this);
                }
            });
            this.debugger.draw();
        raylib.EndDrawing();
    }
    
    run() {
        // Window Initialization
        raylib.InitWindow(...WindowProperties.windowInitializationProperties(this._initialProperties.window));

        // Window
        this.window = new WindowProperties(this._initialProperties.window);

        // Rendering
        this.rendering = new RenderingProperties(this._initialProperties.rendering);

        // Debugger
        this.debugger = new DebuggerProperties(this._initialProperties.debugger);

        // Cleaning
        if (typeof this._initialProperties.window !== "undefined") {
            delete this._initialProperties.window;
        }
        if (typeof this._initialProperties.rendering !== "undefined") {
            delete this._initialProperties.rendering;
        }

        // Game Loop
        while (this.window.open) {
            this.update();
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