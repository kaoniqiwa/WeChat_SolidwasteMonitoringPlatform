declare namespace AMap {
    class Vector3 {
        constructor(x?: number, y?: number, z?: number)
        crossVectors(x: any, y: any): {
            normalize: any
        }
    }
    /**矢量物覆盖图层 */
    class VectorLayer {
        constructor(opts?: { visible: boolean });
        add(vector: VectorOverlay | Array<VectorOverlay>): void
        remove(vector: VectorOverlay | Array<VectorOverlay>): void
        show(): void
        hide(): void
        has(vector: VectorOverlay): void
        clear(): void;
        getBounds(): void
    }
    type VectorEventTypes = 'show' | 'hide' | 'click' | 'dblclick' | 'mouseover' | 'mouseout'

    interface VectorOptions {

    }
    class VectorOverlay extends EventHandle<VectorEventTypes>{
        data: any;
        id: string
    }

    /** PolylineOptions **/
    interface PolylineOptions extends VectorOptions {
        /**要显示该polyline的地图对象**/
        map?: Map;

        /**折线覆盖物的叠加顺序。默认叠加顺序, 先添加的线在底层, 后添加的线在上层。通过该属性可调整叠加顺序, 使级别较高的折线覆盖物在上层显示 默认zIndex: 50**/
        zIndex?: number;

        /**是否将覆盖物的鼠标或touch等事件冒泡到地图上
        * (自v1.3 新增) 默认值: false**/
        bubble?: boolean;

        /**指定鼠标悬停时的鼠标样式, 自定义cursor, IE仅支持cur/ani/ico格式, Opera不支持自定义cursor**/
        cursor?: string;

        /**是否绘制成大地线, 默认false相关示例**/
        geodesic?: boolean;

        /**线条是否带描边, 默认false**/
        isOutline?: boolean;

        /**描边的宽度, 默认为1**/
        borderWeight?: number;

        /**线条描边颜色, 此项仅在isOutline为true时有效, 默认: #000000**/
        outlineColor?: string;

        /**折线的节点坐标数组**/
        path?: Array<Array<LngLatNum>> | Array<LngLatNum> | Array<[number,number]>;

        /**线条颜色, 使用16进制颜色代码赋值。默认值为#006600**/
        strokeColor?: string;

        /**线条透明度, 取值范围[0, 1], 0表示完全透明, 1表示不透明。默认为0.9**/
        strokeOpacity?: number;

        /**线条宽度, 单位: 像素**/
        strokeWeight?: number;

        /**线样式, 实线: solid, 虚线: dashed**/
        strokeStyle?: string;

        /**勾勒形状轮廓的虚线和间隙的样式, 此属性在strokeStyle 为dashed 时有效, 此属性在ie9+浏览器有效 取值:
        * 实线: [0, 0, 0] 虚线: [10, 10] , [10, 10] 表示10个像素的实线和10个像素的空白(如此反复)组成的虚线 点画线: [10, 2, 10], [10, 2, 10] 表示10个像素的实线和2个像素的空白 + 10个像素的实线和10个像素的空白 (如此反复)组成的虚线**/
        strokeDasharray?: Array<number> | Array<Array<number>>

        /**折线拐点的绘制样式, 默认值为'miter'尖角, 其他可选值: 'round'圆角、'bevel'斜角**/
        lineJoin?: 'miter' | 'round' | 'bevel';

        /**折线两端线帽的绘制样式, 默认值为'butt'无头, 其他可选值: 'round'圆头、'square'方头**/
        lineCap?: string;

        /**设置折线是否可拖拽移动, 默认为false**/
        draggable?: boolean;

        /**用户自定义属性, 支持JavaScript API任意数据类型, 如Polyline的id等**/
        extData?: any;

        /**是否延路径显示白色方向箭头, 默认false。Canvas绘制时有效, 建议折线宽度大于6时使用；在3D视图下不支持显示方向箭头(自V1.4.0版本参数效果变更)**/
        showDir?: boolean;
        dirColor?:string;
        dirImg?:any;

    }

    /** Polyline类 **/
    class Polyline extends VectorOverlay {
        /**构造折线对象, 通过PolylineOptions指定折线样式**/
        constructor(opt: PolylineOptions);
        /**设置组成该折线的节点数组**/
        setPath(path: Array<any>): void;

        /**获取折线路径的节点数组。其中lat和lng是经纬度参数。**/
        getPath(): Array<any>;

        /**修改折线属性(包括路径的节点、线样式、是否绘制大地线等。属性详情参看PolylineOptions列表)**/
        setOptions(opt: PolylineOptions): void;

        /**获取线的属性**/
        getOptions(): any;

        /**获取折线的总长度(单位: 米)**/
        getLength(): number;

        /**获取当前折线的矩形范围对象**/
        getBounds(): Bounds;

        /**地图上隐藏指定折线**/
        hide(): void;

        /**地图上显示指定折线**/
        show(): void;

        /**设置折线所在的地图。参数map即为目标地图, 参数为null时, 在地图上移除当前折线**/
        setMap(map: Map): void;

        /**设置用户自定义属性, 支持JavaScript API任意数据类型, 如Polyline的id等**/
        setExtData(ext: any): void;

        /**获取用户自定义属性**/
        getExtData(): any;

    }


    interface PolygonOptions extends VectorOptions {
        fillColor?: string;
        fillOpacity?: number;

        /**要显示该polyline的地图对象**/
        map?: Map;

        /**折线覆盖物的叠加顺序。默认叠加顺序, 先添加的线在底层, 后添加的线在上层。通过该属性可调整叠加顺序, 使级别较高的折线覆盖物在上层显示 默认zIndex: 50**/
        zIndex?: number;

        /**是否将覆盖物的鼠标或touch等事件冒泡到地图上
        * (自v1.3 新增) 默认值: false**/
        bubble?: boolean;

        /**指定鼠标悬停时的鼠标样式, 自定义cursor, IE仅支持cur/ani/ico格式, Opera不支持自定义cursor**/
        cursor?: string;

        /**是否绘制成大地线, 默认false相关示例**/
        geodesic?: boolean;

        /**线条是否带描边, 默认false**/
        isOutline?: boolean;

        /**描边的宽度, 默认为1**/
        borderWeight?: number;

        /**线条描边颜色, 此项仅在isOutline为true时有效, 默认: #000000**/
        outlineColor?: string;

        /**折线的节点坐标数组**/
        path?: Array<Array<LngLatNum>> | Array<LngLatNum>;

        /**线条颜色, 使用16进制颜色代码赋值。默认值为#006600**/
        strokeColor?: string;

        /**线条透明度, 取值范围[0, 1], 0表示完全透明, 1表示不透明。默认为0.9**/
        strokeOpacity?: number;

        /**线条宽度, 单位: 像素**/
        strokeWeight?: number;

        /**线样式, 实线: solid, 虚线: dashed**/
        strokeStyle?: string;

        /**勾勒形状轮廓的虚线和间隙的样式, 此属性在strokeStyle 为dashed 时有效, 此属性在ie9+浏览器有效 取值:
        * 实线: [0, 0, 0] 虚线: [10, 10] , [10, 10] 表示10个像素的实线和10个像素的空白(如此反复)组成的虚线 点画线: [10, 2, 10], [10, 2, 10] 表示10个像素的实线和2个像素的空白 + 10个像素的实线和10个像素的空白 (如此反复)组成的虚线**/
        strokeDasharray?: Array<number> | Array<Array<number>>

        /**折线拐点的绘制样式, 默认值为'miter'尖角, 其他可选值: 'round'圆角、'bevel'斜角**/
        lineJoin?: 'miter' | 'round' | 'bevel';

        /**折线两端线帽的绘制样式, 默认值为'butt'无头, 其他可选值: 'round'圆头、'square'方头**/
        lineCap?: string;

        /**设置折线是否可拖拽移动, 默认为false**/
        draggable?: boolean;

        /**用户自定义属性, 支持JavaScript API任意数据类型, 如Polyline的id等**/
        extData?: any;

        /**是否延路径显示白色方向箭头, 默认false。Canvas绘制时有效, 建议折线宽度大于6时使用；在3D视图下不支持显示方向箭头(自V1.4.0版本参数效果变更)**/
        showDir?: boolean;
    }

    class Polygon extends VectorOverlay {
        constructor(opt: PolygonOptions);
        // 设置多边形轮廓线节点数组，当为“环”多边形时，path为二维数组，数组元素为多边形轮廓线的节点坐标数组
        setPath(path: Array<LngLat> | Array<Array<LngLat>>): void
        // 获取多边形轮廓线节点数组。其中lat和lng是经纬度参数。
        getPath(): Array<LngLat>
        // 修改多边形属性（样式风格，包括组成多边形轮廓线的节点、轮廓线样式等。属性详情参看PolygonOptions列表）
        setOptions(opt?: PolygonOptions): void
        // 获取多边形的属性
        getOptions(): object
        // 获取当前多边形的矩形范围对象。 （自v1.2 新增）
        getBounds(): Bounds
        // 获取多边形的面积（单位：平方米） （自v1.1 新增）
        getArea(): number
        // 隐藏多边形
        hide(): void
        // 显示多边形
        show(): void
        // 在指定地图上显示当前的多边形。参数取值为null时，在地图上移除当前多边形 （自v1.2 新增）
        setMap(map: Map): void
        // 设置用户自定义属性，支持JavaScript API任意数据类型，如Polygon的id等
        setExtData(ext: any): void
        // 获取用户自定义属性
        getExtData(): any
        // 判断指定点坐标是否在多边形范围内
        contains(point: LngLat): boolean
    }
    interface RectangleOptions {
        map?: AMap.Map;
        bounds?: Bounds;
        zIndex?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
        fillColor?: string;
        fillOpacity?: number;

    }
    class Rectangle {
        constructor(opts?: RectangleOptions)
    }


}