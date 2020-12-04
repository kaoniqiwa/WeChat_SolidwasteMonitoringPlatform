declare namespace AMap {

    //#region ImageLayer显示的范围
    interface ImageLayerOptions {
        // ImageLayer显示的范围
        bounds?: Bounds;
        // 需要显示的Image的Url
        url: string;
        // 图层的透明度，[0,1]
        opacity?: number;
        // 是否显示
        visible?: boolean;
        // 图层所属的地图对象
        map?: Map;
        // 层级，缺省为12
        zIndex?: number;
        // 设置可见级别，[最小级别，最大级别]
        zooms?: [number, number];
    }
    // 图片图层类，用户可以将一张静态图片作为图层添加在地图上，图片图层会随缩放级别而自适应缩放。
    class ImageLayer {
        // 构造一个ImageLayer图层对象，需要提供一个Image的url，以及它覆盖的Bounds。Image的内容会根据Bounds大小显示
        constructor(opts: ImageLayerOptions);
        // 设置图层所属的地图对象，传入null时从当前地图移除
        setMap(map: Map | null): void;
        // 返回图层所属的地图对象
        getMap(): Map;
        // 返回ImageLayer显示的范围
        getBounds(): Bounds;
        // 设置ImageLayer显示的范围
        setBounds(bounds: Bounds): void;
        // 显示
        show(): void;
        // 隐藏
        hide(): void;
        // 设置层级
        setzIndex(zindex: number): void;
        // 获取层级
        getzIndex(): number;
        // 返回Image对象
        getElement(): HTMLCanvasElement;
        // 修改Image的Url
        setImageUrl(url: string): void;
        // 返回Image的Url
        getImageUrl(): string;

    }


    //#endregion
    //#region MassMarks

    interface MassMarksOptions {
        // 图层叠加的顺序值，0表示最底层。默认zIndex：5
        zIndex?: number;
        // 图层的透明度，取值范围[0,1]，1代表完全不透明，0代表完全透明
        opacity?: number;
        // 支持的缩放级别范围，默认范围[3-18]，在PC上，取值范围为[3-18]；
        zooms?: [number, number];
        // 在移动设备上，取值范围为[3-19]
        // 指定鼠标悬停时的鼠标样式，自定义cursor，IE仅支持cur/ani/ico格式，
        cursor?: string;
        // Opera不支持自定义cursor
        // 表示是否在拖拽缩放过程中实时重绘，默认true，建议超过10000的时候设置false
        alwaysRender?: boolean;
        // 用于设置点的样式，当点样式一致时传入StyleObject即可；当需要展示多种点样式时，
        // 传入StyleObject的数组，此时需要为Data中每个元素指定 style字段为该元素要显示
        // 的样式在StyleObject数组中的索引
        style: StyleObjectOptions | Array<StyleObjectOptions>;
    }


    interface StyleObjectOptions {

        // 必填参数，图标显示位置偏移量，以图标的左上角为基准点（0,0）点，例如：anchor:new AMap.Pixel(5,5)
        anchor: Pixel;
        // 必填参数,图标的地址
        url: string;
        // 必填参数，图标的尺寸；例如：size:new AMap.Size(11,11)
        size: Size;
        // 旋转角度
        rotation?: number;
    }

    interface MassMarkData {
        lnglat: number[];
        name: string;
        id: string;
        style: number;
    }


    // 创建海量点类。datas为点对象的数组，点对象为包含经纬度lnglat属性的Object，opts为点与点集合的绘制样式。
    // 例data: [{lnglat: [116.405285, 39.904989], name: i,id:1},{}, …]或url串，支持从服务器直接取数据
    class MassMarks extends EventHandle<"complete" | "click" | "dblclick" | "mouseout" | "mouseup" | "mousedown" | "touchstart" | "touchend"> {
        constructor(data: Array<MassMarkData>, opts: MassMarksOptions);
        // 设置显示MassMark的地图对象
        setMap(map: Map): void;
        // 获取Marker所在地图对象
        getMap(): Map;
        // 设置MassMark的显示样式
        setStyle(opts: StyleObjectOptions | Array<StyleObjectOptions>): void;
        // 获取MassMark的显示样式，数据结构同setStyle中的属性一致
        getStyle(): StyleObjectOptions;
        // 设置MassMark展现的数据集，数据集格式为：, data: Array 坐标数据集. 例：data: [{lnglat: [116.405285, 39.904989], name: i,id:1},{}, …],{}, …]}
        setData(data: Array<MassMarkData>): void;
        // 输出MassMark的数据集，数据结构同setDatas中的数据集
        getData(): MassMarkData;
        // 显示海量点图层
        show(): void;
        // 隐藏海量点图层
        hide(): void;
        // 清除海量点
        clear(): void;
    }

    //#endregion

    //#region LabelsLayer
    // LabelsLayer 类是用于承载 LabelMarker 对象的图层。
    interface LabelsLayerOptions {
        zooms?: number[];
        // 图层是否可见
        visible?: boolean;
        // 图层的层级
        zIndex?: number;
        // 图层的透明度
        opacity?: number;
        // 是否开启碰撞检测，默认为 true
        // （自v1.4.15 新增）
        collision?: boolean;
        // 是否开启标注淡入动画，默认为 true
        // （自v1.4.15 新增）
        animation?: boolean;

    }
    class LabelsLayer extends EventHandle<"clear" | "show" | "hide"> {
        // 构造一个标注图层对象，通过LabelsLayerOptions设置图层属性
        constructor(opts: LabelsLayerOptions);
        // 获取该图层是否支持碰撞检测 （自v1.4.15 新增） 
        getCollision(): boolean;
        // 设置该图层是否支持碰撞检测
        setCollision(collision: boolean): void;
        // 获取该图层透明度
        getOpacity(): number;
        // 设置该图层透明度
        setOpacity(opacity: number): void;
        // 获取该图层叠加层级
        getzIndex(): number;
        // 设置该图层叠加层级
        setzIndex(zIndex: number): void;
        // 获取该图层标注是否开启淡入动画
        getAnimation(): boolean;
        // 设置该图层标注是否开启淡入动画
        setAnimation(animation: boolean): void;
        // 获取该图层显示级别
        getZooms(): Array<number>;
        // 设置该图层显示级别
        setZooms(zooms: Array<number>): void;
        // 图层中添加 LabelMarker
        add(args: LabelMarker | LabelMarker[]): void;
        // 图层中移除 LabelMarker
        remove(args: LabelMarker | LabelMarker[]): void;


    }
    interface CanvasLayerOptions {
        bounds?: AMap.Bounds;
        canvas?: HTMLCanvasElement;
        opacity?: number;
        visible?: boolean;
        map?: AMap.Map;
        zIndex?: number;
        zooms?: [number, number];
    }
    class CanvasLayer {
        constructor(opts?: CanvasLayerOptions);
        reFresh(): void;
        setMap(map: AMap.Map | null): void;
        getMap(): AMap.Map;
        show(): void;
        hide(): void;
        setzIndex(zindex: number): void;
        getzIndex(): number;
        getElement(): HTMLCanvasElement;
        setCanvas(canvas: HTMLCanvasElement): void
    }

    interface CustomLayerOptions {
        visible?: boolean;
        map?: AMap.Map;
        zIndex?: number;
        opacity?: number;
        zooms?: [number, number];
        alwaysRender?:boolean
    }
    class CustomLayer {
        constructor(canvas: HTMLCanvasElement, opts?: CustomLayerOptions);
        render: (...res: any[]) => any;
        setOpacity(): void;
        setMap(map: AMap.Map | null): void;
        getMap(): AMap.Map;
        show(): void;
        hide(): void;
        setzIndex(zindex: number): void;
        getzIndex(): number;
        getContainer():any;

    }
    interface TileLayerOptions {
        map?: AMap.Map;
        tileSize?: number;
        tileUrl?: string;
        errorUrl?: string;
        getTileUrl?: string | ((...res: any[]) => any);
        zIndex?: number;
        opacity?: number;
        zooms?: [number, number];
        detectRetina?: boolean
    }
    class TileLayer {
        constructor(opts?: TileLayerOptions)
    }
    namespace TileLayer {
        interface TrafficOptions {
            map?: Map;
            zIndex?: number;
            opacity?: number;
            zooms?: [number, number];
            detectRetina?: boolean;
            autoRefresh?: boolean;
            interval?: number
        }
        class Traffic  extends TileLayer{
            constructor(opts?: TrafficOptions)
            setMap(map: Map | null): void
        }

        interface SatelliteOptions {
            map?: Map;
            zIndex?: number;
            opacity?: number;
            zooms?: [number, number];
            detectRetina?: boolean;
        }
        class Satellite extends TileLayer{
            constructor(opts?: SatelliteOptions)
            setMap(map: Map | null): void
        }
        interface RoadNetOptions {
            map?: Map;
            zIndex?: number;
            opacity?: number;
            zooms?: [number, number];
            detectRetina?: boolean;
        }
        class RoadNet extends TileLayer{
            constructor(opts?:RoadNetOptions)
            setMap(map: Map | null): void
        }

      
    }
    class LayerGroup{
        constructor(layers?:Array<TileLayer>)
        addLayer(layer:TileLayer):void
        addLayers(layers:Array<TileLayer>):void;
        show():void;
        hide():void;
        setOptions(opt:TileLayerOptions):void;

        reload():void
    }

    interface BuildingsOptions{
        zooms?:[number,number];
        opacity?:number;
        heightFactor?:number;
        visible?:boolean;
        map?:Map;
        zIndex?:number
    }
    class Buildings{
        constructor(opts?:BuildingsOptions);

        setMap(map:Map | null):void;
        show():void;
        hide():void;
        setStyle(options:any):void
    }

    //#endregion

}