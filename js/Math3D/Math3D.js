class Math3D {

    calcVector (a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z,
        }
    }

    vectorProd(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        }
    }

    scalProd (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    calcGorner(a, b) {
        return this.scalProd(a, b) /
            (Math.sqrt(this.scalProd(a, a)) + Math.sqrt(this.scalProd(b, b)));
    }

    constructor() {
        // матрица сдвига
        this.moveMatrix = [[ 1,  0,  0, 0],
                           [ 0,  1,  0, 0],
                           [ 0,  0,  1, 0],
                           [ 1,  1,  1, 1]];
        // матрица масштабирования
        this.zoomMatrix = [[ 1, 0,  0, 0],
                           [ 0, 1,  0, 0],
                           [ 0, 0,  1, 0],
                           [ 0, 0,  0, 1]];
        // матрица поворота вокруг оси Ох
        this.rotateOxMatrix = [[ 1,  0,  0, 0],
                               [ 0,  1,  1, 0],
                               [ 0,  1,  1, 0],
                               [ 0,  0,  0, 1]];
        // матрица поворота вокруг оси Оy
        this.rotateOyMatrix = [[ 1,  0,  1, 0],
                               [ 0,  1,  0, 0],
                               [ 1,  0,  1, 0],
                               [ 0,  0,  0, 1]];
        // матрица поворота вокруг оси Оz
        this.rotateOzMatrix = [[ 1,  1,  0, 0],
                               [ 1,  1,  0, 0],
                               [ 0,  0,  1, 0],
                               [ 0,  0,  0, 1]];
    }
    multMatrix(T, m) {
        const c = [0,0,0,0];
        for (let i = 0; i < 4; i++) {
            let S = 0;
            for (let j = 0; j < 4; j++) {
                S+= T[j][i] * m[j];
            }
            c[i] = S;
        }
        return c;
    }
    zoom(delta, point) { 
        const array = this.multMatrix([[delta, 0, 0, 0],
                                       [0, delta, 0, 0],
                                       [0, 0, delta, 0],
                                       [0, 0, 0,     1]],
                                       [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    move(sx, sy, sz, point) {
        var array = this.multMatrix(
            [[ 1,  0,  0, 0],
             [ 0,  1,  0, 0],
             [ 0,  0,  1, 0],
             [sx, sy, sz, 1]], 
            [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOx(alpha, point) { 
        const array = this.multMatrix([[1, 0, 0, 0], 
                                       [0,  Math.cos(alpha), Math.sin(alpha), 0], 
                                       [0, -Math.sin(alpha), Math.cos(alpha), 0],
                                       [0, 0 , 0, 1]],
                                       [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOy(alpha, point) { 
        const array = this.multMatrix([[Math.cos(alpha), 0, -Math.sin(alpha), 0],
                                       [0, 1, 0, 0], 
                                       [Math.sin(alpha), 0 ,  Math.cos(alpha), 0],
                                       [0, 0, 0, 1]],
                                       [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOz(alpha, point) { 
        const array = this.multMatrix([[ Math.cos(alpha), Math.sin(alpha), 0 , 0],
                                       [-Math.sin(alpha), Math.cos(alpha), 0 , 0],
                                       [0, 0, 1, 0], 
                                       [0, 0, 0, 1]],
                                       [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    };
}