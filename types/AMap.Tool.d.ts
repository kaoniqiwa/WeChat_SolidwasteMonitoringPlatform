declare namespace AMap {

    class MouseTool extends EventHandle<'draw'>{
        constructor(map: AMap.Map);
        marker(opts?: MarkerOptions): void;
        circle(opts?: CircleOptions): void;
        polyline(opts?: AMap.PolylineOptions): void;
        polygon(opts?:PolygonOptions): void
        close(flag:boolean):void
    }
}