const { defaultsDeep } = require("lodash");
const raylib = require("raylib");

class RectangleRenderer {
    constructor(properties) {
        this.properties = defaultsDeep(properties, {
            position: {
                x: 0,
                y: 0
            },
            size: {
                width: 20,
                height: 20
            },
            rotation: 0,
            color: raylib.BEIGE
        });
    }

    draw(gameObject) {
        let x;
        let y;
        let width;
        let height;
        let rotation;
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

        if (typeof this.properties.size.width === "function") {
            width = this.properties.size.width.call(gameObject.vars);
        } else {
            width = this.properties.size.width;
        }

        if (typeof this.properties.size.height === "function") {
            height = this.properties.size.height.call(gameObject.vars);
        } else {
            height = this.properties.size.height;
        }

        if (typeof this.properties.rotation === "function") {
            rotation = this.properties.rotation.call(gameObject.vars);
        } else {
            rotation = this.properties.rotation;
        }

        if (typeof this.properties.color === "function") {
            color = this.properties.color.call(gameObject.vars);
        } else {
            color = this.properties.color;
        }

        //
        // 0 1
        // 2 3
        //

        let centerCoordinates = new raylib.Vector2(
            gameObject._position.x + Math.cos(gameObject._rotation) * x - Math.sin(gameObject._rotation) * -y,
            gameObject._position.y + Math.sin(gameObject._rotation) * x + Math.cos(gameObject._rotation) * -y
        )

        let points = [];
        for (let ySign = -1; ySign <= 1; ySign += 2) {
            for (let xSign = -1; xSign <= 1; xSign += 2) {
                points.push(new raylib.Vector2(
                    centerCoordinates.x + Math.cos(gameObject._rotation + rotation) * xSign * width / 2 - Math.sin(gameObject._rotation + rotation) * ySign * height / 2,
                    centerCoordinates.y + Math.sin(gameObject._rotation + rotation) * xSign * width / 2 + Math.cos(gameObject._rotation + rotation) * ySign * height / 2
                ));
            } 
        }

        raylib.DrawTriangle(points[0], points[2], points[1], color);
        raylib.DrawTriangle(points[3], points[1], points[2], color);
    }
}

module.exports = RectangleRenderer;