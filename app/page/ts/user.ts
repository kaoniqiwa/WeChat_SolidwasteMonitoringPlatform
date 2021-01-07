import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SRServer } from "../../data-core/model/aiop/sr-server";


namespace UserPage {


    const client = new HowellHttpClient.HttpClient();
    client.login((http: HowellAuthHttp) => {

        console.log(http)
        var service = new Service(http)
        console.log(service)
        service.user.list().then((res)=>{
            console.log(res)
        }).catch((er)=>{
            console.warn(er)
        })

    });


}