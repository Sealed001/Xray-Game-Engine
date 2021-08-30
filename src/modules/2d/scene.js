const raylib = require("raylib");

class Scene2D {
    init(tree) {
        this._scene = {
            tree: tree,
            camera: raylib.Camera2D()
        };
    }

    onUpdate() {
        if (typeof this._scene.tree === "object") {
            if (Array.isArray(this._scene.tree)) {
                for (let i = 0; i < this._scene.tree.length; i++) {
                    this._scene.tree[i].updateTree(this.deltaTime, { _position: { x: 0, y: 0 }, _rotation: 0 });
                }
            } else {
                let keys = Object.keys(this._scene.tree);
                for (let i = 0; i < keys.length; i++) {
                    this._scene.tree[keys[i]].updateTree(this.deltaTime, { _position: { x: 0, y: 0 }, _rotation: 0 });
                }
            }
        }
        
        this._scene.camera.target = new raylib.Vector2(0, 0);
        this._scene.camera.offset = new raylib.Vector2(this.window.size.width / 2, this.window.size.height / 2);
        this._scene.camera.rotation = 0;
        this._scene.camera.zoom = 1;
    }

    on2dDraw() {
        raylib.BeginMode2D(this._scene.camera);
            if (typeof this._scene.tree === "object") {
                if (Array.isArray(this._scene.tree)) {
                    for (let i = 0; i < this._scene.tree.length; i++) {
                        this._scene.tree[i].drawTree({ _position: { x: 0, y: 0 }, _rotation: 0 });
                    }
                } else {
                    let keys = Object.keys(this._scene.tree);
                    for (let i = 0; i < keys.length; i++) {
                        this._scene.tree[keys[i]].drawTree({ _position: { x: 0, y: 0 }, _rotation: 0 });
                    }
                }
            }
        raylib.EndMode2D();
    }
}

module.exports = Scene2D; 