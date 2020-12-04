declare namespace AMap {
    namespace Util {
        function requestAnimFrame(callback: () => any): number
        function cancelAnimFrame(id:number): void
    }
}