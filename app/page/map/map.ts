import AMapLoader from '@amap/amap-jsapi-loader'
let map: AMap.Map;
let showPath: HTMLDivElement;
let solidWaste: HTMLDivElement;
let isShow: boolean = false;


AMapLoader.load({
    key: "cf177eeebccc02703ae8f87e1a375e06",
    version: "1.4.15",
    plugins: ["AMap.Geolocation"],
}).then((AMap) => {
    map = new AMap.Map("container");
    map.on("complete", main);
    // Routing = new RoutingController(this.map);

});

function main() {
    solidWaste = document.querySelector('#solid_waste') as HTMLDivElement;

    showPath = document.querySelector('#show_path') as HTMLDivElement;
    showPath.addEventListener('click', function () {
        if (!isShow) {

            solidWaste.className = '';

            solidWaste.classList.add('slide-fade-enter-active');
            solidWaste.classList.add('slide-fade-enter');
            isShow = true;

        } else {
            solidWaste.className = '';

            solidWaste.classList.add('slide-fade-leave-active');
            solidWaste.classList.add('slide-fade-leave-to');
            isShow = false
        }
    })

}
