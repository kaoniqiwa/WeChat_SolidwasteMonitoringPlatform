declare namespace AMap {
    interface GeocoderOptions {
        // 可选值：城市名（中文或中文全拼）、citycode、adcode 默认值：“全国”
        city?: string;
        radius?: number;

        // 设置语言类型
        lang?: string;

        // 是否批量查询
        batch?: boolean;
        extensions?: string;
    }
    interface getLocationCallback {
        (status: 'complete', res: GeocodeResult): void;
        (status: 'error', res: string): void;
        (status: 'no_data', res: 0): void
    }

    interface getAddressCallback {
        (status: 'complete', res: ReGeocodeResult): void;
        (status: 'error', res: string): void;
        (status: 'no_data', res: 0): void
    }
    interface GeocodeResult {
        info: string;
        resultNum: number;
        geocodes: Array<Geocode>
    }
    interface Geocode {
        // 地址组成元素
        addressComponent: AddressComponent;

        // 格式化地址
        formattedAddress: string;

        // 坐标
        location: LngLat;

        // 区域编码
        adcode: string;

        // 给定地址匹配级别
        level: string
    }
    interface AddressComponent {
        province: string;
        city: string;
        citycode: string;
        district: string;
        adcode: string;
        township: string;
        street: string;
        streetNumber: string;
        neighborhood: string;
        neighborhoodType: string;
        building: string;
        buildingType: string;

        // 所属商圈
        businessAreas?: Array<BusinessArea>;
    }
    interface BusinessArea {
        // 商圈id
        id: string;

        // 商圈名称
        name: string;

        // 商圈中心点经纬度
        location: string;
    }
    interface ReGeocodeResult {
        info: string;
        regeocode?: ReGeocode;
        regeocodes?: Array<ReGeocode>
    }
    interface ReGeocode {
        // 地址组成元素
        addressComponent: AddressComponent;

        // 格式化地址
        formattedAddress: string;

        // 道路信息列表
        roads: Array<Road>;

        // 道路路口列表
        crosses: Array<Cross>;


        pois: Array<ReGeocodePoi>
    }
    interface Road {
        id: string;
        name: string;
        distance: number;
        location: LngLat;
        direction: string;
    }
    interface Cross {
        distance: number;
        direction: string;
        location: LngLat;
        first_id: string;
        first_name: string;
        second_id: string;
        second_name: string
    }
    interface ReGeocodePoi {
        id: string;
        name: string;
        type: string;
        tel: string;
        distance: number;
        direction: string;
        address: string;
        location: LngLat;
        businessArea: string;

    }
    /** 地址描述与坐标之间的转换  */
    class Geocoder extends EventHandle<'complete' | 'error'> {
        constructor(opts?: GeocoderOptions);
        getLocation(address: string | Array<string>, callback: getLocationCallback): void;
        getAddress(location: LngLat | Array<LngLat>, callback: getAddressCallback): void;
        setCity(city: string): void;

    }





    interface CitySearchResult {
        adcode: string;
        city: string;
        info: string;
        infocode: string;
        province: string;
        status: string;
        type: string;
        rectangle: string;
        bounds: Bounds
    }
    interface citySearchCallback {
        (status: 'complete', res: CitySearchResult): void;
        (status: 'error', res: string): void;
        (status: 'no_data', result: 0): void
    }
    class CitySearch {
        constructor();
        getLocalCity(callback: citySearchCallback): void
        getCityByIp(ip: string, callback: citySearchCallback): void
    }

    interface GeolocationOptions {
        // 是否使用高精度
        enableHighAccuracy?: boolean;

        // 超时毫秒数
        timeout?: number;

        // 是否禁止使用IP定位
        noIpLocate?: number;

        // 设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
        GeoLocationFirst?: boolean;

        // 定位成功后，定位结果的保留时间
        maximumAge?: number;

        // 取值true:为高德地图坐标，取值false:为浏览器定位坐标
        convert?: boolean;

        // 是否显示定位按钮
        showButton?: boolean;

        // 自定义定位按钮的内容
        buttonDom?: string | HTMLElement;

        // 定位按钮可停靠的位置
        buttonPosition?: 'LB' | 'LT' | 'RT' | 'RB';

        // 按钮距离停靠位置的偏移量
        buttonOffset?: Pixel;

        // 定位成功时是否在定位位置显示一个Marker
        showMarker?: boolean;

        // 定位点Marker的配置，不设置该属性则使用默认Marker样式
        markerOptions?: MarkerOptions;


        // 定位成功并且有精度信息时，是否用一个圆圈circle表示精度范围
        showCircle?: boolean;

        // 定位点Circle的配置，不设置该属性则使用默认Circle样式
        circleOptions?: CircleOptions;

        // 定位成功后，是否把定位得到的坐标设置为地图中心点坐标
        panToLocation?: boolean;

        // 定位成功且显示精度范围时，是否把地图视野调整到正好显示精度范围
        zoomToAccuracy?: boolean;


        // 是否使用安卓定位sdk用来进行定位，默认：false
        useNative?: boolean;

        extensions?: 'base' | 'all';

        borderColor?: string;
        borderRadius?: string;
        buttonSize?: string;


    }
    interface GeolocationCallBack {
        (status: 'complete', res: GeolocationResult): void;
        (status: 'error', res: { info: string, message: string }): void
    }
    interface GeolocationResult {
        // 定位结果
        position: LngLat;

        // 精度范围，单位：米
        accuracy: number;

        // 定位结果的来源，可能的值有:'html5'、'ip'、'sdk'
        location_type: string;

        // 形成当前定位结果的一些信息
        message: string;

        // 是否经过坐标纠偏
        isConverted: boolean;

        // 状态信息 "SUCCESS"
        info: number;

        addressComponent: any

        // 地址
        formattedAddress: string;

        // 定位点附近的POI信息，extensions等于'base'的时候为空
        pois: Array<any>;

        // 定位点附近的道路信息，extensions等于'base'的时候为空
        roads: Array<any>;

        // 定位点附近的道路交叉口信息，extensions等于'base'的时候为空
        crosses: Array<any>;

        heading?:any
    }
    /** 定位服务插件  */
    class Geolocation extends EventHandle<'complete' | 'error'> {
        constructor(opts?: GeolocationOptions);
        // 是否支持浏览器定位
        isSupported(): boolean

        // 获取用户当前的精确位置信息
        getCurrentPosition(callback?: GeolocationCallBack): void;

        // 使用浏览器定位接口监控当前位置，移动端有效
        watchPosition(): number;

        // 取消对当前位置的监控
        clearWatch(watchId: number): void;

        // 进行IP城市查询
        getCityInfo(callback?: GeolocationCallBack): void;


    }
}