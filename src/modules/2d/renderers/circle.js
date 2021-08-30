const raylib = require("raylib");
const { defaultsDeep } = require("lodash");

class CircleRenderer {
    constructor(properties) {
        this.properties = defaultsDeep(properties, {
            position: {
                x: 0,
                y: 0
            },
            radius: 10,
            color: raylib.BEIGE
        });
    }

    draw(gameObject) {
        let x;
        let y;
        let radius;
        let color;

        if (typeof this.properties.position.x === "function") {
            x = this.properties.position.x.call(gameObject.vars);
        } else {
            x = this.properties.position.x;
        }

        if (typeof this.properties.position.y === "function") {
            y = this.properties.position.y.call(gameObject.vars);
        } else {
            y = this.properties.position.y;
        }

        if (typeof this.properties.radius === "function") {
            radius = this.properties.radius.call(gameObject.vars);
        } else {
            radius = this.properties.radius;
        }

        if (typeof this.properties.color === "function") {
            color = this.properties.color.call(gameObject.vars);
        } else {
            color = this.properties.color;
        }

        raylib.DrawCircle(gameObject._position.x + Math.cos(gameObject._rotation) * x, gameObject._position.y - Math.sin(gameObject._rotation) * y, radius, color);
    }
}

module.exports = CircleRenderer;