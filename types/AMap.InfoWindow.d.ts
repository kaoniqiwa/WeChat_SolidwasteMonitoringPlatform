declare namespace AMap {


    // 构造详细信息展示窗体。
    interface InforWindowOptions {
        // 是否自定义窗体。设为true时，信息窗体外框及内容完全按照content所设的值添加（默认为false，即在系统默认的信息窗体外框中显示content内容）
        isCustom?: boolean;
        // 是否自动调整窗体到视野内（当信息窗体超出视野范围时，通过该属性设置是否自动平移地图，使信息窗体完全显示）
        autoMove?: boolean
        // 控制是否在鼠标点击地图后关闭信息窗体，默认false，鼠标点击地图后不关闭信息窗体
        closeWhenClickMap?: boolean
        // 显示内容，可以是HTML要素字符串或者HTMLElement对象，自定义窗体示例
        content?: string | HTMLElement
        // 信息窗体尺寸（isCustom为true时，该属性无效）
        size?: Size
        // 信息窗体锚点。 
        // 默认值：'bottom-center' 
        // 可选值：'top-left'|'top-center'|'top-right'|'middle-left'|'center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right'                                                                                          （自v1.4.13 新增）
        anchor?: string
        // 信息窗体显示位置偏移量。默认基准点为信息窗体的底部中心（若设置了anchor，则以anchor值为基准点）。        
        offset?: Pixel
        // 信息窗体显示基点位置
        // （自v1.2 新增）
        position?: LngLat
        // boolean 控制是否显示信息窗体阴影，取值false时不显示窗体阴影，取值true时显示窗体阴影
        // 默认值：false    
        showShadow?: boolean
        // 信息窗体关闭时，是否将其Dom元素从页面中移除，默认为false
        retainWhenClose?: boolean
    }


    // 用于在地图上弹出一个详细信息展示窗体，地图上只允许同时展示1个信息窗体
    class InfoWindow extends EventHandle<"change" | "open" | "close">{
        constructor(opt: InforWindowOptions)

        // 在地图的指定位置打开信息窗体
        open(map: Map, pos: AMap.LngLat): void;
        // 关闭信息窗体
        close(): void;
        // 获取信息窗体是否打开
        getIsOpen(): boolean;
        // 设置信息窗体内容，可通过该函数动态更新信息窗体中的信息
        setContent(content: string | HTMLDocument): void;
        // 获取信息窗体内容 ，结果以字符串方式返回
        getContent(): string;
        // 设置信息窗体显示基点位置
        setPosition(lnglat: LngLat): void;
        // 获取信息窗体显示基点位置
        getPosition(): LngLat;
        // 获取信息窗体锚点 （自v1.4.13 新增）
        getAnchor(): string;
        // 设置信息窗体锚点
        // 可选值：'top-left'| 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'                                                                    （自v1.4.13 新增）
        setAnchor(): void;
        // 设置信息窗体大小（isCustom为false时有效）
        setSize(size: Size): void;
        // 获取信息窗体大小
        getSize(): Size



        // // 属性发生变化时
        // change: () => void;
        // // 信息窗体打开之后触发事件
        // open: () => void;

        // // 信息窗体关闭之后触发事件
        // close: () => void;
    }
}