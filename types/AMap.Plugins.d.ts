declare namespace AMap {

    interface RenderClusterMarkerOptions {
        count: number;
        markers: Array<Marker>;
        marker: Marker;
    }
    interface MarkerClustererOptions {

        // 聚合计算时网格的像素大小，默认60
        gridSize: number
        // 聚合的最小数量。默认值为2，即小于2个点则不能成为一个聚合
        minClusterSize?: number
        // 最大的聚合级别，大于该级别就不进行相应的聚合。默认值为18，即小于18级的级别均进行聚合，18及以上级别不进行聚合
        maxZoom?: number
        // 聚合点的图标位置是否是所有聚合内点的中心点。默认为否，即聚合点的图标位置位于聚合内的第一个点处
        averageCenter?: boolean
        // 指定聚合后的点标记的图标样式，可缺省，缺省时为默认样式；
        // 数据元素分别对应聚合量在1-10,11-100,101-1000…的聚合点的样式；
        // 当用户设置聚合样式少于实际叠加的点数，未设置部分按照系统默认样式显示；
        // 单个图标样式包括以下几个属性：
        // 1. {string}url：图标显示图片的url地址（必选）
        // 2. {AMap.Size}size：图标显示图片的大小（必选）
        // 3. {AMap.Pixel} offset：图标定位在地图上的位置相对于图标左上角的偏移值。默认为(0,0),不偏移（可选）
        // 4. {AMap.Pixel} imageOffset：图片相对于可视区域的偏移值，此功能的作用等同CSS中的background-position属性。默认为(0,0)，不偏移（可选）
        // 5. {string} textColor：文字的颜色，默认为"#000000"（可选）
        // 6. {number} textSize：文字的大小，默认为10（可选）
        styles?: Array<Object>
        // 该方法用来实现聚合点的自定义绘制，由开发者自己实现，API将在绘制每个聚合点的时候调用这个方法，可以实现聚合点样式的灵活设定，指定了renderClusterMarker后styles无效。
        // 该函数的入参为一个Object，包含如下属性：
        // 1. count: 当前聚合点下聚合的Marker的数量
        // 2. markers: 当前聚合点下聚合的所有Marker的数组
        // 3. marker：当前聚合点的显示Marker
        // 在renderClusterMarker里面可以根据count和markers的一些附加属性来修改marker的icon、content等属性实现聚合点的完全自定义
        renderClusterMarker?: Function
        // 点击聚合点时，是否散开，默认值为：true
        zoomOnClick?: boolean

    }
    class MarkerClusterer {
        constructor(map: Map, markers: Array<Marker>, opts?: MarkerClustererOptions);
        // 添加一个需进行聚合的点标记
        addMarker(marker: Marker): void
        // 删除一个聚合的点标记
        removeMarker(marker: Marker): void
        // 获取聚合点的总数量
        getClustersCount(): number
        // 获取聚合网格的像素大小
        getGridSize(): number
        // 获取地图中点标记的最大聚合级别
        getMaxZoom(): number
        // 获取单个聚合的最小数量
        getMinClusterSize(): number
        // 获取聚合的样式风格集合
        getStyles(): Array<Object>
        // 设置聚合网格的像素大小
        setGridSize(size: number): void
        // 设置地图中点标记的最大聚合级别
        setMaxZoom(zoom: number): void
        // 设置单个聚合的最小数量
        setMinClusterSize(size: number): void
        // 设置聚合的样式风格
        setStyles(styles: Array<any>): void
        // 从地图上彻底清除所有聚合点标记
        clearMarkers(): void
        // 设置将进行点聚合的地图对象
        setMap(map: Map): void
        // 设置将进行点聚合显示的点标记集合
        setMarkers(markers: Array<Marker>): void
        // 获取该点聚合的地图对象
        getMap(): Map
        // 获取该点聚合中的点标记集合
        getMarkers(): Array<Marker>
        // 添加一组需进行聚合的点标记
        addMarkers(markers: Array<Marker>): void
        // 删除一组聚合的点标记
        removeMarkers(markers: Array<Marker>): void
        // 获取单个聚合点位置是否是聚合内所有标记的平均中心
        isAverageCenter(): boolean
        // 设置单个聚合点位置是否是聚合内所有标记的平均中心
        setAverageCenter(averageCenter: boolean): void
        // {cluster,lnglat,target,markers}
        // 点击事件，其中：        
        // cluster：点击的聚合点对象，        
        // lnglat：点击的位置点坐标，        
        // target：点聚合插件对象，        
        // marker：点击的聚合点所包含的点对象。
        click: Function;

    }


    interface HeatmapOptions {
        // 热力图中单个点的半径，默认：30，单位：pixel	
        radius?: number;
        // 热力图的渐变区间，热力图按照设置的颜色及间隔显示热力图，例：	
        // {		
        // 0.4:'rgb(0, 255, 255)',		
        // 0.65:'rgb(0, 110, 255)',		
        // 0.85:'rgb(100, 0, 255)',		
        // 1.0:'rgb(100, 0, 255)'		
        // }		
        // 其中 key 表示间隔位置，取值范围： [0,1]，value 为颜色值。默认：heatmap.js标准配色方案		
        gradient?: Object;
        // 热力图透明度数组，取值范围[0,1]，0表示完全透明，1表示不透明，默认：[0,1]	
        opacity?: Array<number>;
        // 支持的缩放级别范围，取值范围[3-18]，默认：[3,18]	
        zooms?: Array<number>;
    }

    class Heatmap {
        // 设置热力图要叠加的地图对象，也可以在Map中的layers属性中设置为默认显示的图层	
        setMap(map: Map): void;
        // 设置热力图属性，参考HeatmapOptions列表中的说明	
        setOptions(opts: HeatmapOptions): void;
        // 向热力图数据集中添加坐标点，count不填写时默认：1	
        addDataPoint(lng: number, lat: number, count: Number): void;
        // 设置热力图展现的数据集，dataset数据集格式为：	
        // {		
        //   max: Number 权重的最大值,		
        //   data: Array 坐标数据集		
        // }，		
        // 其中max不填则取数据集count最大值		
        // 例： {		
        //   max: 100,		
        //   data: [{lng: 116.405285, lat: 39.904989, count: 65},{}, …]		
        //   }		
        // 也可以通过url来加载数据，格式为		
        // {		
        //   data：jsonp格式数据的服务地址URL,		
        //   dataParser: 数据格式转换function //当jsonp返回结果和官方结构不一致的时候，用户可以传递一个函数用来进行数据格式转换；		
        // }		
        // 例：		
        // {		
        //   data:'http://abc.com/jsonp.js',		
        //   dataParser:function(data){		
        //    return doSomthing(data);//返回的对象结果应该与上面例子的data字段结构相同		
        //   }		
        // }		
        setDataSet(dataset: Object): void;
        // 隐藏热力图	
        hide(): void;
        // 显示热力图	
        show(): void;
        // 获取热力图叠加地图对象	
        getMap(): Map;
        // 获取热力图的属性信息	
        getOptions(): HeatmapOptions;
        // 输出热力图的数据集，数据结构同setDataSet中的数据集	
        getDataSet(): Object;

    }
}
