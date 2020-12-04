declare namespace AMap {

    /********************* modified by panminxiang ************************************ */

    /**AMap.plugin 加载插件的方法 */
    function plugin(plugin: string | string[], callback: () => any): void;

    /***************************地图控件********************************************* */
    // 控件事件类
    class PMX_EventHandle<T> {
        on(eventName: T, handler: Function, context?: object): void;
        off(eventName: T, handler: Function, context?: object): void;
    }
    // 控件位置参数对象
    type ORIENT = {
        top?: number | string;
        left?: number | string;
        right?: number | string;
        bottom?: number | string
    }
    type DOCK = 'LT' | 'RT' | 'LB' | 'RB';

    interface ControlConfig {
        position?: ORIENT | DOCK;
        offset?: [number, number];
        visible?: boolean
    }
    /**地图控件基类*/
    class Control extends PMX_EventHandle<'show' | 'hide'>{
        constructor(ops?: ControlConfig)
        addTo(map: Map): void;
        remove(): void;
        show(): void;
        hide(): void
    }

    /**比例尺类*/
    class Scale extends Control {
        constructor(ops?: ControlConfig)
        removeFrom(): void
    }
    /**工具条，新版只保留缩放功能 */
    class ToolBar extends Control {
        constructor(ops?: ControlConfig)
    }
    interface LayerInfo {
        id: string;
        enable: boolean;
        name: string;
        type: 'base' | 'overlay';
        layer: any;
        show: boolean;
    }
    interface MaptypeOptions extends ControlConfig {
        //初始化默认图层类型。 取值为0：默认底图 取值为1：卫星图 默认值：0
        defaultType?: 0 | 1;
        //叠加实时交通图层 默认值：false
        showTraffic?: boolean;
        //叠加路网图层 默认值：false
        showRoad?: boolean
    }
    class MapType extends Control {
        constructor(opts?: MaptypeOptions)
        addLayer(layerInfo: LayerInfo): void;
        removeLayer(id: string): void;
    }
    interface ControlBarOptions extends ControlConfig {
        showControlButton?: boolean
    }
    class ControlBar extends Control {
        constructor(opts?: ControlBarOptions)
    }
    interface HawkEyeOptions extends ControlConfig {
        autoMove?: boolean;
        showRectangle?: boolean;
        showButton?: boolean;
        isOpen?: boolean;
        mapStyle?: string;
        layers?: Array<any>;
        width?: string;
        height?: string;
        borderStyle?: string
        borderColor?: string
        borderRadius?: string
        borderWidth?: string
        buttonSize?: string
    }
    class HawkEye extends Control {
        constructor(opts?: HawkEyeOptions)
        open(): void
        close(): void
    }


    /**************************矢量图像******************************************* */

    // interface VectorOptions {
    //     map?: Map

    //     /**折线覆盖物的叠加顺序。默认叠加顺序, 先添加的线在底层, 后添加的线在上层。通过该属性可调整叠加顺序, 使级别较高的折线覆盖物在上层显示 默认zIndex: 50**/
    //     zIndex?: number;


    //     /**是否将覆盖物的鼠标或touch等事件冒泡到地图上
    //     * (自v1.3 新增) 默认值: false**/
    //     bubble?: boolean;

    //     /**指定鼠标悬停时的鼠标样式, 自定义cursor, IE仅支持cur/ani/ico格式, Opera不支持自定义cursor**/
    //     cursor?: string;


    //     /**线条颜色, 使用16进制颜色代码赋值。默认值为#006600**/
    //     strokeColor?: string;

    //     /**线条透明度, 取值范围[0, 1], 0表示完全透明, 1表示不透明。默认为0.9**/
    //     strokeOpacity?: number;


    //     /**线条宽度, 单位: 像素**/
    //     strokeWeight?: number;


    //     /**是否绘制成大地线, 默认false相关示例**/
    //     geodesic?: boolean;

    //     /**线条是否带描边, 默认false**/
    //     isOutline?: boolean;

    //     /**描边的宽度, 默认为1**/
    //     borderWeight?: number;

    //     /**线条描边颜色, 此项仅在isOutline为true时有效, 默认: #000000**/
    //     outlineColor?: string;

    //     /**线样式, 实线: solid, 虚线: dashed**/
    //     strokeStyle?: string;

    //     /**勾勒形状轮廓的虚线和间隙的样式, 此属性在strokeStyle 为dashed 时有效, 此属性在ie9+浏览器有效 取值:
    //     * 实线: [0, 0, 0] 虚线: [10, 10] , [10, 10] 表示10个像素的实线和10个像素的空白(如此反复)组成的虚线 点画线: [10, 2, 10], [10, 2, 10] 表示10个像素的实线和2个像素的空白 + 10个像素的实线和10个像素的空白 (如此反复)组成的虚线**/
    //     strokeDasharray?: Array<number>;

    //     /**折线拐点的绘制样式, 默认值为'miter'尖角, 其他可选值: 'round'圆角、'bevel'斜角**/
    //     lineJoin?: 'miter' | 'round' | 'bevel';

    //     /**折线两端线帽的绘制样式, 默认值为'butt'无头, 其他可选值: 'round'圆头、'square'方头**/
    //     lineCap?: string;

    //     /**设置折线是否可拖拽移动, 默认为false**/
    //     draggable?: boolean;

    //     /**用户自定义属性, 支持JavaScript API任意数据类型, 如Polyline的id等**/
    //     extData?: any;

    //     /**是否延路径显示白色方向箭头, 默认false。Canvas绘制时有效, 建议折线宽度大于6时使用；在3D视图下不支持显示方向箭头(自V1.4.0版本参数效果变更)**/
    //     showDir?: boolean;

    // }

    

    


    /***********************其他服务********************************** */
    interface DistrictSearchOptions {
        level?: 'country' | 'province' | 'city' | 'district' | 'biz_area';
        showbiz?: boolean;
        extensions?: 'base' | 'all';
        subdistrict?: 0 | 1 | 2 | 3;
    }
    interface DistrictSearchResult {
        info: string;
        districtList: Array<District>
    }
    interface District {
        name: string;
        center: JM;
        citycode: string;
        adcode: string;
        level: string;
        boundaries: Array<Array<JM>>;
        districtList?: Array<District>

    }
    interface JM {
        KL: number;
        className: string;
        KT: number;
        lng: number;
        lat: number;
        pos: [number, number]
    }
    interface DistrictSearchCallBack {
        (status: 'complete', res: DistrictSearchResult): void;
        (status: 'error', res: string): void;
        (status: 'no_data'): void;
    }
    class DistrictSearch {
        constructor(ops?: DistrictSearchOptions)
        setLevel(level: DistrictSearchOptions['level']): void;
        setSubdistrict(subdistrict: DistrictSearchOptions['subdistrict']): void
        search(keyword: any, DistrictSearchCallBack?: DistrictSearchCallBack, keywords?: string): void;
        setExtensions(extensions: 'base' | 'all'): void
    }
}