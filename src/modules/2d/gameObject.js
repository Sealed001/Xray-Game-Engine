const { defaultsDeep } = require("lodash");

class GameObject2D {
    constructor(properties) {
        Object.assign(this, defaultsDeep(properties, {
            vars: {},
            position: {
                x: 0,
                y: 0
            },
            rotation: 0,
            renderers: [],
            children: [],
            update: function() {

            }
        }));

        this.updateTree = function (deltaTime, ...parents) {
            this.update(deltaTime, ...parents);

            this._rotation = parents[0]._rotation + this.rotation;
            this._position = {
                x: parents[0]._position.x + Math.cos(this._rotation) * this.position.x - Math.sin(this._rotation) * -this.position.y,
                y: parents[0]._position.y + Math.sin(this._rotation) * this.position.x + Math.cos(this._rotation) * -this.position.y
            };

            if (typeof this.children === "object") {
                if (Array.isArray(this.children)) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].updateTree(deltaTime, this, ...parents);
                    }
                } else {
                    let keys = Object.keys(this.children);
                    for (let i = 0; i < keys.length; i++) {
                        this.children[keys[i]].updateTree(deltaTime, this, ...parents);
                    }
                }
            }
        };

        this.drawTree = function (...parents) {
            this.renderers.forEach(renderer => {
                renderer.draw(this);
            });

            if (typeof this.children === "object") {
                if (Array.isArray(this.children)) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].drawTree(this, ...parents);
                    }
                } else {
                    let keys = Object.keys(this.children);
                    for (let i = 0; i < keys.length; i++) {
                        this.children[keys[i]].drawTree(this, ...parents);
                    }
                }
            }
        };
    }
}

module.exports = GameObject2D;