declare class CesiumMapClient extends CesiumMap.Clinet {
  constructor(iframe: string | HTMLElement)
}

declare namespace CesiumMap {
  class Client {
    ExtendedWindow: ExtendedWindow
    Alarm: Alarm
    Draw: Draw
    Map: Map
    Viewer: Viewer
    Overlay: Overlay
    Point: Point
    Village: Village
    Operation: Operation
    Element: Element
    Shape: Shape
    DataController: CesiumDataController.Controller
    Events: Event
    constructor(iframe: string | HTMLElement)
  }

  interface Event {
    OnElementsSelected: (
      datas: Array<CesiumDataController.Element> | null
    ) => void

    GetCoordinate: (lon: number, lat: number) => void
    OnMapClicked: () => void
    OnMouseMoving: (lon: number, lat: number) => void
    OnVillageClicked: (village: CesiumDataController.Village | null) => void
    OnError: (ex: Error) => void
    OnElementsDoubleClick: (objs: Array<CesiumDataController.Element>) => void
    OnShapesDisplayed: (entities: Array<CesiumDataController.Element>) => void
    OnLoaded: () => void
    OnLoading: () => void

    OnPointDragend: () => void
    OnMouseClick: (
      position: CesiumDataController.Position,
      zoom: number
    ) => void
    OnMouseDoubleClick: (
      position: CesiumDataController.Position,
      zoom: number
    ) => void
  }
  interface ExtendedWindow {
    Register: (
      element: HTMLElement,
      boxId: string,
      css_urls: Array<string>,
      events: any
    ) => void
    Remove: (id: string) => void
  }

  //#region Alarm
  interface AlarmPoint {
    /// <summary>添加报警点位</summary>
    /// <param name="lon" type="Position">位置信息</param>
    /// <param name="color" type="EventColor">报警等级</param>
    /// <returns type="string">报警点位Id</returns>
    Add: (
      position: CesiumDataController.Position,
      color: string,
      isInWindow: boolean
    ) => string

    /// <summary>删除报警点位</summary>
    Remove: (alarmId: string, isInWindow: boolean) => boolean

    Focus: (alarmId: string) => void
  }

  interface AlarmLine {
    Start: (id: string, color: string) => string
    Stop: (id: string) => boolean
  }

  interface Alarm {
    Point: AlarmPoint
    Line: AlarmLine
  }
  //#endregion

  interface Map {
    SetStyle: (style: string) => void
    SetFloorModel: (floorModel: string) => void
    GetLocation: (callback: (res: any) => void) => CesiumDataController.Position
  }

  interface Viewer {
    MoveTo: (position: CesiumDataController.Position) => boolean
    FullScreen: () => void
    SetDateTime: (datetime: Date) => void
  }

  interface Overlay {
    /// <summary>创建覆盖物</summary>
    /// <param name="html" type="string">html内容</param>
    /// <param name="position" type="Position">位置信息</param>
    /// <param name="style" type="json">样式</param>
    /// <returns type="string">覆盖物Id</returns>
    Create: (
      html: string,
      position: CesiumDataController.Position,
      style: any,
      events: any
    ) => string

    /// <summary>删除气泡</summary>
    /// <param name="id" type="string">编号</param>
    Remove: (id: string) => void
  }

  interface PointName {
    /// <summary>显示点位名称</summary>
    Show: (id: string, style: string) => void
    Hide: (id: string, style: string) => void
  }
  interface Point {
    Name: PointName
    /// <summary>创建点位信息</summary>
    /// <param name="point" type="CesiumMapClient.Point">点位信息</param>
    Create: (point: CesiumDataController.Point) => CesiumDataController.Point
    Set: (opts: {}) => void
    /// <summary>设置点位状态</summary>
    /// <param name="status" type="{id:string, status:number}">点位状态</param>
    Status: (status: Array<{ id: string; status: number }>) => void
    /// <summary>删除点位信息</summary>
    /// <param name="pointId" type="string">点位Id</param>
    Remove: (pointId: string) => boolean
    Display: (
      id: string,
      visibility: {
        camera?: boolean
        entrance?: boolean
        annunciator?: boolean
        sensor?: boolean
        person?: boolean
        vehicle?: boolean
        missionPoint?: boolean
        parkingLot?: boolean
      }
    ) => void

    /// <summary>元素点位筛选</summary>
    /// <param name="filter" type="json">筛选参数 (camera, entrance, annunciator, sensor)</param>
    Filter: (filter: string) => void
    Draggable: (draggable: boolean) => boolean
  }

  interface Village {
    Select: (villageId: string) => void
  }

  interface Operation {
    Show: () => void
    Hide: () => void
  }

  interface ElementDescription {
    Set: (elementId: string, html: string) => void
    EnableVisiblity: (enbale: boolean) => void
  }
  interface Element {
    Description: ElementDescription
    SetPosition: (
      elementId: string,
      position: CesiumDataController.Position
    ) => void
    SetColor: (elementId: string, color: string) => boolean
    SetTitle: (elementId: string, title: string, opts: any) => void
    HideTitle: (id: string) => void
    ShowTitle: (id: string) => void
    GetById: (elementId: string) => CesiumDataController.Element
  }

  interface Shape {
    HideTitle: () => void
    ShowTitle: () => void
    GetById: (elementId: string) => void
    SetTitle: (elementId: string, title: string, font: string) => void
  }

  //#region Draw
  interface DrawLine {
    Drawing: (
      begin: CesiumDataController.Position,
      end: CesiumDataController.Position,
      opts: CesiumDataController.DrawLineOptions,
      over: boolean
    ) => CesiumDataController.Polyline
    Redraw: (
      id: string,
      begin: CesiumDataController.Position,
      end: CesiumDataController.Position,
      opts: CesiumDataController.DrawLineOptions,
      over: boolean
    ) => CesiumDataController.Polyline
    Remove: (id: string) => boolean
  }
  interface DrawEllipsoid {
    Drawing: (
      begin: CesiumDataController.Position,
      end: CesiumDataController.Position,
      opts: CesiumDataController.DrawEllipsoidOptions,
      over: boolean
    ) => CesiumDataController.Ellipsoid
    Redraw: (
      id: string,
      begin: CesiumDataController.Position,
      end: CesiumDataController.Position,
      opts: CesiumDataController.DrawEllipsoidOptions,
      over: boolean
    ) => CesiumDataController.Ellipsoid
    Remove: (id: string) => boolean
  }
  interface DrawPolyline {
    Drawing: (
      positions: Array<CesiumDataController.Position>,
      opts: CesiumDataController.DrawLineOptions,
      over: boolean
    ) => CesiumDataController.Polyline
    Redraw: (
      id: string,
      positions: Array<CesiumDataController.Position>,
      opts: CesiumDataController.DrawLineOptions,
      over: boolean
    ) => CesiumDataController.Polyline
    Remove: (id: string) => boolean
  }
  interface DrawPolygon {
    Drawing: (
      positions: Array<CesiumDataController.Position>,
      opts: CesiumDataController.DrawPlaneOptions,
      over: boolean
    ) => CesiumDataController.Polygon
    Redraw: (
      id: string,
      positions: Array<CesiumDataController.Position>,
      opts: CesiumDataController.DrawPlaneOptions,
      over: boolean
    ) => CesiumDataController.Polygon
    Remove: (id: string) => boolean
  }
  interface DrawHeatmap {
    Draw: (
      datas: Array<CesiumDataController.HeatmapData>,
      max?: number
    ) => string
  }
  interface DrawRouting {
    Drawing: (
      positions: Array<CesiumDataController.Position>,
      type: CesiumDataController.RoutingType,
      opts?: CesiumDataController.DrawLineOptions
    ) => CesiumDataController.Polyline
    Remove: (id: string) => boolean
  }

  interface Draw {
    Line: DrawLine
    Ellipsoid: DrawEllipsoid
    Polyline: DrawPolyline
    Polygon: DrawPolygon
    Heatmap: DrawHeatmap
    Routing: DrawRouting
  }
  //#endregion
}
