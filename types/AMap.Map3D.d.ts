declare namespace AMap {
    interface MapOptions {
        AmbientLight?: Lights.AmbientLight
        DirectionLight?: Lights.DirectionLight
    }
    // 一般图层的通用属性
    interface MapLayerOptions {

    }
    // 加载 3D 覆盖物
    class Object3DLayer {
        constructor(opts?: MapLayerOptions)
        public readonly objects: Array<Object3D>
        add(object3d: Object3D): void
        remove(object3d: Object3D): void;
        clear(): void;
        reDraw(): void
    }
    namespace Lights {
        class AmbientLight {
            constructor(color: [number, number, number], intensity: number)
        }
        class DirectionLight {
            constructor(direction: [number, number, number], color: [number, number, number], intensity: number)
        }
    }
    class Object3D {
        constructor()
        reDraw(): void;
        rotateX(a: number): void
        rotateY(a: number): void
        rotateZ(a: number): void
        scale(a: number, b?: number, c?: number): void

    }
    namespace Object3D {
        interface MeshOptions {

        }
        interface MeshGeometry {
            readonly vertices: Array<number>
            vertexColors: Array<number>
            vertexUVs: Array<number>
            faces: Array<number>
            textureIndices: Array<number>
        }
        interface MeshAcceptLightsGeometry extends MeshGeometry {
            vertexNormals: Array<number>
        }
        class Mesh extends Object3D {
            public readonly geometry: MeshGeometry;
            public textures: Array<string | HTMLCanvasElement>;
            public needUpdate: boolean;
            public transparent: boolean;
            public DEPTH_TEST: boolean;
            public backOrFront: 'back' | 'front' | 'both';

            constructor(opts?: MeshOptions)

        }
        class MeshAcceptLights extends Mesh {
            public readonly geometry: MeshAcceptLightsGeometry;
            position(center:AMap.LngLatNum):void
        }
    }

}