

declare namespace CesiumDataController {
    class Controller {
        constructor(host: string, port: number, onloaded: () => void)


        Village: VillageController;
        Building: any;
        Floor: any;
        Point: PointController;
        Polyline: any;
        Ellipsoid: any;
    }

    export type Dictionary<T> = { [key: string]: T; }

    class PointController {
        GetIds: () => void;
        List: () => Dictionary<Point>;
        Get: (villageId: string, pointId:string) => Point;
        Create: (villageId: string, pointId:string, point: Point) => boolean;
        Update: (villageId: string, pointId:string, point: Point) => boolean;
        Remove: (villageId: string, pointId:string) => boolean;       
    }

    class VillageController {
        GetIds: () => void;
        List: () => Dictionary<Village>;
        Get: (villageId: string) => Village;
        Create: (villageId: string, village: Village) => boolean;
        Update: (villageId: string, village: Village) => boolean;
        Remove: (villageId: string) => boolean;
        GetByBuildingId: (buildingId: string) => Building;
        Asyn: AsynVillageController;
        Point: any;
        Polyline: any;
        Ellipsoid: any;
    }

    namespace CallbackType {
        type Array<T> = (values: Array<T>) => void;
        type Dictionary<T> = (values: Dictionary<T>) => void;
        type Item<T> = (value: T) => void;
    }


    class AsynVillageController {
        GetIds: (callback: CallbackType.Array<string>) => void;
        List: (callback: CallbackType.Dictionary<Village>) => void;
        Get: (callback: CallbackType.Item<Village>) => void;
        GetByBuildingId: (buildingId: string, callback: CallbackType.Item<Village>) => void;
    }




    enum ElementType {
        Village = "village",                 //小区
        Building = "building",               //建筑物
        Floor = "floor",                     //楼层
        Entrance = "entrance",               //出入口
        Camera = "camera",                   //摄像机
        Annunciator = "annunciator",         //报警器
        Sensor = "sensor",                   //传感器
        ElevatorShaft = "elevatorShaft",     //电梯井
        Elevator = "elevator",               //电梯
        ParkingLot = "parkingLot",           //停车场
        MissionPoint = "missionPoint",       //巡更点
        Person = "person",                   //人
        Vehicle = "vehicle",                 //车
        Shape = "shape",                     //面结构,    
        Polyline = "polyline",               //多线段
        Ellipse = "ellipse",                   //圆球
        WaterQuality = "waterQuality",        //水质
        DumpingCamera = "dumpingCamera",      //垃圾倾倒检测
        GarbageClassificationCamera = "garbageClassificationCamera"//垃圾分类
    }

    enum ShapeType {
        Building = "building",               //建筑物	
        Entrance = "entrance",               //出入口	
        Stairway = "stairway",               //楼梯	
        Elevator = "elevator",               //电梯	
        Escalator = "escalator",             //自动扶梯
        ParkingLot = "parkingLot",           //停车场	
        ParkingSpace = "parkingSpace",       //停车位
        Shop = "shop",                       //购物	
        Restaurant = "restaurant",           //餐厅、饭店	
        Recreation = "recreation",           //娱乐	
        Room = "room",                       //普通房间	
        SpecialRoom = "specialRoom",         //专用房间（如：机房、配电间等）	
        Toilet = "toilet",                   //厕所	
        ServiceCenter = "serviceCenter",     //服务中心	
        Office = "office",                   //办公室
        Wall = "wall",                       //墙
        Road = "road",                       //道路	
        Water = "water",                     //水池等	
        Grass = "grass",                     //绿化	
        Floor = "floor",
        Other = "other",                     //其他	
    }

    //模型类型
    enum ModelType {
        Json = "json",
        Glb = "glb",
        Image = "img"
    }
    //报警等级
    enum AlarmColor {
        red = "red",
        orange = "orange"
    }

    enum ViewMode {
        auto = 0,
        three = 1,
        birld = 2
    }
    enum InnerElementType {
        Point = "Point",
        Polyline = "Polyline",
        Ellipsoid = "Ellipsoid"
    }




    /**
     *  范围
    **/
    class Range {
        min: number;
        max: number;

        constructor(min?: number, max?: number)
    }



    class HeadingPitch {

        heading: number;
        pitch: number;

        /**
         *  水平角度/垂直角度
         */
        constructor(heading?: number, pitch?: number)
    }

    class HeadingPitchRange extends HeadingPitch {

        range: number;

        /**
         *  水平角度/垂直角度/范围
         */
        constructor(heading?: number, pitch?: number, range?: number)

    }

    class HeadingPitchRoll extends HeadingPitch {
        roll: number;
        /**
         *  水平角度/垂直角度/自身旋转角度
         */
        constructor(heading?: number, pitch?: number, roll?: number)
    }


    /**
     *  绘制参数
    **/
    class DrawOptions {

        id?: string;
        name?: string;
        color?: string;
        alpha?: number;
    }
    /**
     *  绘制线段参数
    **/
    class DrawLineOptions extends DrawOptions {
        extrudedHeight?: number;
        width?: number;
        img?: string;
    }


    /**
     *  绘制线段参数
    **/
    class DrawPlaneOptions extends DrawOptions {
        extrudedHeight: number;
        img: string;
    }



    //形状外部边框线
    class Outline {
        //宽度
        width: number;
        color: string;
        alpha: number;
        enabled: boolean;
    }


    /**
     *  绘制圆球参数
    **/
    class DrawEllipsoidOptions extends DrawOptions {
        hpr: HeadingPitchRoll;
        clock: Range;
        cone: Range;
        outline: Outline;
    }



    class XY {
        x: number;
        y: number;
        /**
         *  二维坐标
         */
        constructor(x?: number, y?: number)
    }
    class XYZ extends XY {
        z: number

        /**
         *  三维坐标
         */
        constructor(x?: number, y?: number, z?: number)
    }

    class CesiumObject {
        public clone(): any;
    }

    enum LightColor {
        white,
        yellow,
        gold
    }


    class GuideboardStyleItem {
        border: string;
        background: string;
        innerShadow: string;
        line: string
    }

    export class GuideboardStyle {
        static Blue: GuideboardStyleItem;
        static Green: GuideboardStyleItem;
        static Red: GuideboardStyleItem;
        static Orange: GuideboardStyleItem;
    }


    //摄像机镜头范围
    enum CameraLens {
        //广角镜头
        wideAngle,
        //普通镜头
        normel,
        //长焦镜头
        telephoto
    }

    interface Instantiate<T> {
        Instantiate(t: T): T;
    }

    class Light {
        Get(color: LightColor, level: number): number[]
        static Get(color: LightColor, level: number): number[]
    }




    /**
     *  坐标
    **/
    class Position extends CesiumObject {
        lon: number;
        lat: number;
        height: number;

        constructor(lon?: number, lat?: number, height?: number)
    }
    /**
     *  建筑物信息
    **/
    class BuildingInformation {
        height: number;
        maxFloorNumber: number;
        constructor(height?: number, maxFloorNumber?: number)
    }
    /**
    *  模型样式
    **/
    class ModelStyle {
        alpha: number;
        fill: string;
        silhouetteColor: string;
        silhouetteSize: number;

        constructor(alpha?: number, fill?: string, silhouetteColor?: string, silhouetteSize?: number)
    }

    class BaseElement {
        id: string;
        parentId: string;
        name: string;
        position: CesiumDataController.Position;
        Instantiate<T extends BaseElement>(obj: T): T;
        constructor(id?: string)
    }


    class Element extends BaseElement {
        modelStyle: ModelStyle;
        model: ModelType;
        url: string;
        type: ElementType;
        radian: number;
        scale: number;
        light: Array<number>;
        defaultView: string;

        constructor(id?: string, type?: ElementType)
    }

    class Point extends Element {

        villageId: string;

        buildingId: string;



        floorId: string;
        /**
         *  点位信息
         */
        constructor(id?: string, type?: ElementType)
    }

    class Polyline extends Element {
        villageId: string;
        buildingId: string;
        floorId: string;
        positions: Position[];
        color: string;
        alpha: number;
        extrudedHeight: number;
        width: number;
        outline: Outline;
        img: string;
        /**
         *
         */
        constructor(id?: string)

        static FromOptions(opts: DrawLineOptions): Polyline;

    }

    class Polygon extends Element {
        villageId: string;
        buildingId: string;
        floorId: string;
        positions: Position[];
        color: string;
        alpha: number;
        extrudedHeight: number;
        img: string;
        outline: Outline;
        /**
         *
         */
        constructor(id?: string)

        static FromOptions(opts: DrawPlaneOptions): Polygon;
    }




    class Floor extends Element {
        villageId: string;
        number: number;
        buildingId: string;
        showBackground: boolean;
        parent: Building;
        points: Dictionary<Point>;
        polylines: Dictionary<Polyline>;
        ellipsoids: Dictionary<Ellipsoid>;
        /**
         *  楼层
         */
        constructor(id: string)

    }



    class Building extends Element {
        villageId: string;
        information: BuildingInformation;
        showBackground: boolean;
        children: Array<Element>;
        floors: Dictionary<Floor>;
        /**
         *  建筑物
         */
        constructor(id?: string)

    }


    class Village extends Element {
        showBackground: boolean;
        areas: Array<number>[];
        center: Position;
        buildings: Global.Dictionary<Building>;
        points: Global.Dictionary<Point>;
        polylines: Global.Dictionary<Polyline>;
        ellipsoids: Global.Dictionary<Ellipsoid>;
        /**
         *
         */
        constructor(id?: string)

    }

    class Shape extends Element {
        center?: Position;
        areas?: Array<number>;
        shapeType: ShapeType;
        passable?: boolean;
        floorHeight?: number;
        parentType: CesiumDataController.ElementType;
        villageId: string
        /**
         *
         */
        constructor(id?: string)
    }


    class Size {
        width: number;
        height: number;
    }



    //圆球形状
    class Ellipsoid extends BaseElement {

        villageId: string;
        buildingId: string;
        floorId: string;
        //半径
        radii: XYZ;
        //内径半径
        inner_radii: XYZ;
        //自身角度
        hpr: HeadingPitchRoll;
        //扇形展开角度 min:-360~360 max:-360~360
        clock: Range;
        //扇形垂直扇面角度, 从圆球顶部开始计算 min:0-180 max:0-180
        cone: Range;
        //颜色
        color: string;
        //透明度
        alpha: number;
        //外边框线
        outline: Outline;

        /**
         *
         */
        constructor(id: string)

        static FromOptions(opts: DrawEllipsoidOptions): Ellipsoid


    }


    class HeatmapData {
        //编号
        id: string;
        //坐标
        position: Position;
        //值
        value: number;
    }

    class Area extends Element {
        showBackground: boolean;
        areas: Array<number>[];
        center: Position;
        points: Global.Dictionary<Point>;
        /**
         *
         */
        constructor(id?: string)

    }

    // 路径规划类型
    enum PathPlanningType {
        // 驾车
        Driving = "driving",
        // 步行
        Walking = "walking",
        // 骑行
        Riding = "riding"
    }
    enum RoutingType {
        // 驾车
        Driving = "driving",
        // 步行
        Walking = "walking",
        // 骑行
        Riding = "riding"
    }
    

}



