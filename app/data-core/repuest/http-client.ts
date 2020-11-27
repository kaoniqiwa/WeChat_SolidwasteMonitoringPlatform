
import { HowellAuthHttp } from "./howell-auth-http";
export namespace HowellHttpClient {

    export class HttpClient {

        constructor() {

        }

        get http() {
            return new HowellAuthHttp('null', 'null');
        }
    }
}