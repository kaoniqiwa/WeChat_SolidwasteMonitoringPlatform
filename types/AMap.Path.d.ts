declare namespace AMap {
    /*******************路径规划************************************** */

    type Poi = {
        name: string;
        type: string;
        location: LngLat

    }
    type waypoint = {
        isWaypoint: boolean;
        name: string;
        type: string;
        location: LngLat
    }
    // 途径城市
    type ViaCity = {
        adcode: string;
        citycode: string;
        name: string;
        districts: Array<ViaDistrict>
    }
    // 途径行政区
    type ViaDistrict = {
        name: string;
        adcode: string;
    }

    type LngLatNum = LngLat | [number, number]

    class Route extends EventHandle<'complete' | 'error'>{

    }
    interface RouteResult{

    }

    /**路线规划策略**/
    enum DrivingPolicy {
        // 最快捷模式
        LEAST_TIME,
        // 最经济模式
        LEAST_FEE,
        // 最短距离模式
        LEAST_DISTANCE,
        // 考虑实时路况
        REAL_TRAFFIC
    }

    /**Driving类构造函数参数类型 */
    interface DrivingOptions {

        /**AMap.Map对象, 展现结果的地图实例。当指定此参数后，搜索结果的标注、线路等均会自动添加到此地图上。可选 */
        map?: Map;

        /**结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示 */
        panel?: string | HTMLElement;

        /**
        * 设置隐藏路径规划的起始点图标 设置为true：隐藏图标；设置false：显示图标
        * 默认值为：false
         */
        hideMarkers?: boolean;

        /*使用map属性时，绘制的规划线路是否显示描边。缺省为true*/
        isOutline?: boolean

        /*使用map属性时，绘制的规划线路的描边颜色。缺省为'white'*/
        outlineColor?: string

        /*用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围*/
        autoFitView?: boolean

        // 路线规划策略
        policy?: DrivingPolicy;

        /**
         * 默认值：base，返回基本地址信息
         * 当取值为：all，返回DriveStep基本信息+DriveStep详细信息
         */
        extensions?: 'base' | 'all';

        /**默认为0，表示可以使用轮渡，为1的时候表示不可以使用轮渡 */
        ferry?: 0 | 1;

        /**设置是否显示实时路况信息，默认设置为true */
        showTraffic?: boolean;

        /*车牌省份的汉字缩写，用于判断是否限行*/
        province?: string;

        /*除省份之外车牌的字母和数字，用于判断限行相关*/
        number?: string;
    }


    interface DrivingCallback {
        (status: 'complete', result: DrivingResult): void;
        (status: 'error', result: string): void
        (status: 'no_data', result: 0): void
    }

    interface DrivingResult{
        info: string;
        origin: LngLat;
        destination: LngLat;
        start: Poi
        end: Poi;
        count: number;
        routes: Array<DriveRoute>;

        taxi_cost: number;

        waypoints: Array<waypoint>
    }
    interface DriveRoute {

        distance: Number;
        // 此路段预计使用时间，单位：秒 

        steps: Array<DriveStep>

        // 起点到终点的驾车距离，单位：米 
        // 时间预计，单位：秒 
        // 驾车规划策略 
        policy: String;
        // 此驾车路线收费金额，单位：元 
        tolls: Number;
        // 收费路段长度，单位：米 
        tolls_distance: Number;
        // 限行结果 
        // 0 代表限行已规避或未限行，即该路线没有限行路段  
        // 1 代表限行无法规避，即该线路有限行路段  
        restriction: Number;
    }
    interface DriveStep {
        start_location: LngLat;
        end_location: LngLat;
        instruction: String;
        action: String;
        // 驾车方向 
        orientation: String;
        // 道路 
        road: String;
        // 此路段距离，单位：米 
        distance: Number;
        // 此路段预计使用时间，单位：秒 
        time: Number;
        // 此路段坐标集合 
        path: Array<LngLat>;

        // 驾车子路段完成后辅助动作，一般为到达某个目的地时返回 
        assist_action: String;
        // 道路 
        // 此段收费，单位：元 
        tolls: Number;
        // 收费路段长度，单位：米 
        tolls_distance: Number;
        // 主要收费道路 
        toll_road: String;
        // 此路段预计使用时间，单位：秒 
        cities: Array<ViaCity>
    }

    class Driving {
        // 构造函数，创建驾车路线规划实例
        constructor(opts?: DrivingOptions);

        search(origin: LngLatNum, destination: LngLatNum, callback?: DrivingCallback): void;

        search(origin: LngLatNum, destination: LngLatNum, opts?: {
            waypoints: Array<LngLatNum>
        }, callback?: DrivingCallback): void;

        search(points: Array<{
            keyword: string,
            city: string
        }>, callback?: DrivingCallback): void

        // 清除搜索结果
        clear(): void;
        // 设置避让区域，最大支持三个避让区域，参数为LngLat的二维数组  
        setAvoidPolygons(areas: Array<Array<LngLatNum>>): void

        // 清除避让区域
        clearAvoidPolygons(): void

        // 获取避让区域，返回LngLat的二维数组
        getAvoidPolygons(): Array<Array<LngLat>>;

        // 设置避让道路名称，只支持一条避让道路 注：避让道路和避让区域不能同时使用
        setAvoidRoad(val: string): void;

        // 清除避让道路
        clearAvoidRoad(): void

        // 获取避让道路
        getAvoidRoad(): string;

        // 设置车牌的汉字首字符和首字后的号码，设置后路线规划的结果将考虑该车牌在当前时间的限行路段
        setProvinceAndNumber(province: string, num: string): void

        // 设置驾车路线规划策略
        setPolicy(policy: DrivingPolicy): void;

    }

    /**路线规划策略**/
    enum RidingPolicy {
        // 最快捷模式
        LEAST_TIME,
        // 最经济模式
        LEAST_FEE,
        // 最短距离模式
        LEAST_DISTANCE,
    }

    // /**Driving类构造函数参数类型 */
    interface RidingOptions {

        /**AMap.Map对象, 展现结果的地图实例。当指定此参数后，搜索结果的标注、线路等均会自动添加到此地图上。可选 */
        map?: Map;

        /**结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示 */
        panel?: string | HTMLElement;

        /**
        * 设置隐藏路径规划的起始点图标 设置为true：隐藏图标；设置false：显示图标
        * 默认值为：false
         */
        hideMarkers?: boolean;

        /*使用map属性时，绘制的规划线路是否显示描边。缺省为true*/
        isOutline?: boolean

        /*使用map属性时，绘制的规划线路的描边颜色。缺省为'white'*/
        outlineColor?: string

        /*用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围*/
        autoFitView?: boolean

        // 路线规划策略
        policy?: RidingPolicy;

    }

    interface RidingCallback {
        (status: 'complete', result: RidingResult): void;
        (status: 'error', result: string): void
        (status: 'no_data', result: 0): void
    }

    interface RidingResult{
        info: string;
        origin: LngLat;
        destination: LngLat;
        start: Poi
        end: Poi;
        count: number;
        routes: Array<RideRoute>;
    }

    interface RideRoute {
        // 起点到终点的驾车距离，单位：米 
        distance: Number;
        // 时间预计，单位：秒 
        time: Number;
        rides: Array<RideStep>;
    }
    interface RideStep {
        start_location: LngLat;
        end_location: LngLat;
        instruction: String;
        action: String;
        // 驾车方向 
        orientation: String;
        // 道路 
        road: String;
        // 此路段距离，单位：米 
        distance: Number;
        // 此路段预计使用时间，单位：秒 
        time: Number;
        // 此路段坐标集合 
        path: Array<LngLat>;

    }
    class Riding {
        constructor(opts?: RidingOptions);

        search(origin: LngLatNum, destination: LngLatNum, callback?: RidingCallback): void;


        search(points: Array<{
            keyword: string,
            city: string
        }>, callback?: RidingCallback): void

        // 清除搜索的结果
        clear(): void;

        // 骑行路线规划策略
        setPolicy(policy: RidingPolicy): void

    }

    interface WalkingOptions {
        /**AMap.Map对象, 展现结果的地图实例。当指定此参数后，搜索结果的标注、线路等均会自动添加到此地图上。可选 */
        map?: Map;

        /**结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示 */
        panel?: string | HTMLElement;

        /**
        * 设置隐藏路径规划的起始点图标 设置为true：隐藏图标；设置false：显示图标
        * 默认值为：false
         */
        hideMarkers?: boolean;

        /*使用map属性时，绘制的规划线路是否显示描边。缺省为true*/
        isOutline?: boolean

        /*使用map属性时，绘制的规划线路的描边颜色。缺省为'white'*/
        outlineColor?: string

        /*用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围*/
        autoFitView?: boolean

    }

    interface WalkingCallback {
        (status: 'complete', result: WalkingResult): void;
        (status: 'error', result: string): void
        (status: 'no_data', result: 0): void
    }

    interface WalkingResult {
        info: string;
        origin: LngLat;
        destination: LngLat;
        start: Poi
        end: Poi;
        count: number;
        routes: Array<WalkRoute>;
    }

    interface WalkRoute {

        distance: Number;
        // 此路段预计使用时间，单位：秒 
        time: Number;

        steps: Array<WalkStep>
    }
    interface WalkStep {
        start_location: LngLat;
        end_location: LngLat;
        instruction: String;
        action: String;
        // 驾车方向 
        orientation: String;
        // 道路 
        road: String;
        // 此路段距离，单位：米 
        distance: Number;
        // 此路段预计使用时间，单位：秒 
        time: Number;
        // 此路段坐标集合 
        path: Array<LngLat>;
        assist_action: string;
    }
    class Walking  {
        // 构造函数，创建驾车路线规划实例
        constructor(opts?: WalkingOptions);

        search(origin: LngLatNum, destination: LngLatNum, callback?: WalkingCallback): void;


        search(points: Array<{
            keyword: string,
            city: string
        }>, callback?: WalkingCallback): void

        clear(): void
    }


}