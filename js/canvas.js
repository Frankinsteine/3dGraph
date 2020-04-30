class Canvas {
    constructor ({id, width, height, WINDOW, callbacks = {}}) {
        if (id) {
            this.canvas = document.getElementById(id);
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(this.canvas);
        }
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.WINDOW = WINDOW;
        this.PI2 = 2 * Math.PI;
        //callbacks
        const wheel = (callbacks.wheel instanceof Function) ? callbacks.wheel : function () {};
        const mouseup = (callbacks.mouseup instanceof Function) ? callbacks.mouseup : function () {};
        const mousedown = (callbacks.mousedown instanceof Function) ? callbacks.mousedown : function () {};
        const mousemove = (callbacks.mousemove instanceof Function) ? callbacks.mousemove : function () {};
        const mouseleave = (callbacks.mouseleave instanceof Function) ? callbacks.mouseleave : function () {};
        this.canvas.addEventListener('wheel', wheel);
        this.canvas.addEventListener('mousedown', mousedown);
        this.canvas.addEventListener('mouseup', mouseup);
        this.canvas.addEventListener('mousemove', mousemove)
        this.canvas.addEventListener('mouseleave', mouseleave)
    }

    xs(x) {
        return (x - this.WINDOW.LEFT) * (this.canvas.width / this.WINDOW.WIDTH);
    }

    ys(y) {
        return (y - this.WINDOW.BOTTOM) * (this.canvas.height / this.WINDOW.HEIGHT);
    }

    sx(x){
        return x * this.WINDOW.WIDTH / this.canvas.width;
    }
    sy(y){
        return -y * this.WINDOW.HEIGHT / this.canvas.height;
    }


    point(x, y, color = '#f00', size = 2) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.arc(this.xs(x), this.ys(y), size, 0, this.PI2);
        this.context.stroke();
    }

    line(x1, y1, x2, y2, color = '#0f0', width = 2) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
    }

    clear = function () {
        this.context.fillStyle = '#e6ebef8a';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    text(x, y, text, font = '30px bold Arial', color = 'black') {
        this.context.fillStyle = color;
        this.context.font = font;
        this.context.fillText(text, this.xs(x), this.ys(y));
    }

    polygon(points, color = "#008800BB") {
        this.context.fillStyle = color;
        this.context.fillStroke = color;
        this.context.beginPath();
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.closePath();
        //this.context.stroke();
        this.context.fill()
    }
}