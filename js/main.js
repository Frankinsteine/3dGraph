window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, -30),
        CAMERA: new Point(0, 0, -50)
    }

    let canPrint = {
        points: false,
        edges: false,
        polygons: true
    };

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;

    const sur = new Surfaces;
    const canvas = new Canvas({ width: 500, height: 500, WINDOW, callbacks: { wheel, mouseup, mousedown, mouseleave, mousemove } });
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons } });

    const SCENE =  [
                    sur.bublik(9, 11, 1.5, "#FFFF00", new Point(0, 0, 0), xy = 1),
                    sur.sphere(6, new Point(), "#FF00FF")
                    ]; // сцена
    const LIGHT = new Light(-10, 2, -10, 150);

    let canRotate = false;
    // каллбэки //
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_OUT : ZOOM_IN;
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.zoom(delta, point)));
    }

    //checkbox

    function printPoints(value) {
        canPrint.points = value;
    }
    function printEdges(value) {
        canPrint.edges = value;
    }
    function printPolygons(value) {
        canPrint.polygons = value;
    }

    function printAllPolygons() {
        if (canPrint.polygons) {
            const polygons = []
            SCENE.forEach(subject => {
                //graph3D.calcGorner(subject, WINDOW.CAMERA);//отсечение невидимых граней
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');//расстояние до камеры
                graph3D.calcDistance(subject, LIGHT, 'lumen'); // освещённость
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = { x: graph3D.xS(subject.points[polygon.points[0]]), y: graph3D.yS(subject.points[polygon.points[0]]) };
                        const point2 = { x: graph3D.xS(subject.points[polygon.points[1]]), y: graph3D.yS(subject.points[polygon.points[1]]) };
                        const point3 = { x: graph3D.xS(subject.points[polygon.points[2]]), y: graph3D.yS(subject.points[polygon.points[2]]) };
                        const point4 = { x: graph3D.xS(subject.points[polygon.points[3]]), y: graph3D.yS(subject.points[polygon.points[3]]) };
                        let { r, g, b } = polygon.color;
                        const lumen = graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                }                
            });
            // отрисовка ВСЕХ полигонов
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => 
                canvas.polygon(polygon.points, polygon.color));
        }
    }

    //cb

    function mouseup() {
        canRotate = false;
    }
    function mouseleave() {
        mouseup();
    }
    function mousedown() {
        canRotate = true;
    }

    function mousemove(event) {
        if (canRotate) {
            if (event.movementX) {
                const alpha = canvas.sx(event.movementX) * 20 / WINDOW.CAMERA.z;
                SCENE.forEach(subject => subject.points.forEach(point => graph3D.rotateOy(alpha, point)));
            }
            if (event.movementY) {
                const alpha = canvas.sy(event.movementY) * 20 / -WINDOW.CAMERA.z;
                SCENE.forEach(subject => subject.points.forEach(point => graph3D.rotateOx(-alpha, point)));
            }
        }
    }

    function move(direction) {
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? -0.3 : 0.3;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(delta, point)));
        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? 0.3 : -0.3;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(delta, point)));
        }
    }


    function clear() {
        canvas.clear();
    }

    function printSubject(subject) {
        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edge = subject.edges[i];
                const point1 = subject.points[edge.p1];
                const point2 = subject.points[edge.p2];
                canvas.line(graph3D.xS(point1), graph3D.yS(point1), graph3D.xS(point2), graph3D.yS(point2));
            }
        }
        if (canPrint.points) {
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i]
                canvas.point(graph3D.xS(points), graph3D.yS(points), '#f00', 2);
            }
        }
    }

    function render() {
        clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(-4.5, -4, `FPS: ${FPSout}`);
    }

    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new Date()).getTime();
    (function animloop() {
        //считаем фпс 
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }
        //рисуем сцену
        render();
        requestAnimFrame(animloop);
    })()
}