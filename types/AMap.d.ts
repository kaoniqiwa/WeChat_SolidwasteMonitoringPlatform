declare namespace AMap {

    function createDefaultLayer(): void

    class EventHandle<T> {
        on(option: T, fun: Function): void;
        off(option: T, fun: Function): void;
    }
    /**此对象用于表示地图、覆盖物、叠加层上的各种鼠标事件返回，包含以下字段：
    高德的事件说明文档有问题； 不是 LngLat 类，而是一个普通对象;
    **/

    namespace GeometryUtil {
        function ringArea(lnglats: number[][]): number
        function triangulateShape(path: any): any
    }



    /** 像素坐标, 确定地图上的一个像素点。 **/
    class Pixel {
        x: number;
        y: number;

        add(pixel: Pixel): Pixel
        /**构造一个像素坐标对象。**/
        constructor(x: number, y: number);
        /**获得X方向像素坐标**/
        getX(): number;

        /**获得Y方向像素坐标**/
        getY(): number;

        /**当前像素坐标与传入像素坐标是否相等**/
        equals(point: Pixel): boolean;

        /**以字符串形式返回像素坐标对象**/
        tostring(): string;



    }
    /** 地物对象的像素尺寸 **/
    class Size {
        /**构造尺寸对象。参数width: 宽度, height: 长度, 单位: 像素；**/
        constructor(width: number, height: number);
        /**获得宽度。**/
        getWidth(): number;

        /**获得高度。**/
        getHeight(): number;

        /**以字符串形式返回尺寸大小对象(自v1.2 新增)**/
        tostring(): string;
        width:number;
        height:number;


    }
    /** 经纬度坐标, 确定地图上的一个点。 **/
    class LngLat {
        /**构造一个地理坐标对象, lng、lat分别代表经度、纬度值**/
        constructor(lng: number, lat: number, noAutofix?: boolean);
        /**当前经纬度坐标值经度移动w, 纬度移动s, 得到新的坐标。经度向右移为正值, 纬度向上移为正值, 单位为米。(自v1.2 新增)**/
        offset(w: number, s: number): LngLat;

        /**当前经纬度和传入经纬度或者经纬度数组连线之间的地面距离, 单位为米 相关示例**/
        distance(lnglat: LngLat | Array<LngLat>): number;

        /**获取经度值。(自v1.2 新增)**/
        getLng(): number;

        /**获取纬度值。(自v1.2 新增)**/
        getLat(): number;

        /**判断当前坐标对象与传入坐标对象是否相等**/
        equals(lnglat: LngLat): boolean;

        /**LngLat对象以字符串的形式返回。**/
        tostring(): string;


    }
    /** 地物对象的经纬度矩形范围。 **/
    class Bounds {
        /**矩形范围的构造函数.参数southWest、northEast分别代表地物对象西南角经纬度和东北角经纬度值。**/
        constructor(southWest: LngLatNum, northEast: LngLatNum);
        /**指定点坐标是否在矩形范围内 相关示例**/
        contains(point: LngLat): boolean;

        /**获取当前Bounds的中心点经纬度坐标。**/
        getCenter(): LngLat;

        /**获取东北角坐标**/
        getNorthEast(): LngLat;

        /**西北 */
        getNorthWest():LngLat;

        getSouthEast():LngLat;
        getSouthWest():LngLat;


        /**以字符串形式返回地物对象的矩形范围**/
        tostring(): string;


    }

    class Overlay extends EventHandle<string> {
        data: any;
        id: string
    }
    class OverlayOptions { }




    /************panminxiang:2020/10/28*********** */
    function plugin(plugin: string | string[], callback?: () => any): void;





    namespace Browser {
         let  retina: boolean;
    }









}