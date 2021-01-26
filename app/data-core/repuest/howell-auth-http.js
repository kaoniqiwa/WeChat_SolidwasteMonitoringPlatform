"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class HowellAuthHttp {
    nc = 1;
    digest;
    username;
    passwd;
    constructor(username, passwd, webBrowserAuth, customAxios) {
        this.passwd = passwd;
        this.username = username;
        this.getWwwAuth = (r) => {
            throw r;
        };
        this.axios = axios_1.default;
    }

    getHtml(path){
       return this.axios({
            method: 'get',
            url:path,
            responseType: 'html'
          })
          .catch(x=>{

          })
            .then(wwwAuth => { 
                return wwwAuth;
            });
    }

    get(path, error) {
        const myHeaders = this.getHttpHeaders('GET', path);
        const httpOptions = {
            headers: myHeaders
        };
        return this.axios
            .get(path, httpOptions)
            .catch(error)
            .then(wwwAuth => {
                return wwwAuth;
            });
    }

    post(path, data, config) {
       
        const myHeaders = this.getHttpHeaders('POST', path);
        const httpOptions = {
            headers: myHeaders
        };
        return this.axios
            .post(path, data, httpOptions)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {


                return wwwAuth.data;
            });
    }
    put(path, data, config) {
        const myHeaders = this.getHttpHeaders('PUT', path);
        const httpOptions = {
            headers: myHeaders
        };
        return this.axios
            .put(path, data, httpOptions)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {


                return wwwAuth;
            });
    }
    delete(path, config) {
        const myHeaders = this.getHttpHeaders('DELETE', path);
        const httpOptions = {
            headers: myHeaders
        };
        return this.axios
            .delete(path, httpOptions)
            .catch(this.httpOptions)
            .then(wwwAuth => {

                return wwwAuth;
            });
    }

    auth(username,path, digestFn,fn) { 
        this.username=username;
        const httpOptions = {
            headers: { 'X-WebBrowser-Authentication': 'Forbidden' }
        };
        return this.axios
            .get(path, httpOptions)
            .catch((error) => { 
                if (error.response.status == 403) {
                     
                    window['DIGEST'] = digestFn(error.response.headers);
                    return this.get(path,fn);                  
                }
            })
            .then(wwwAuth => {
                return wwwAuth;
            });
    }
    //获取已授权的头部
    getHttpHeaders(method, uri) {
        if (window['DIGEST']) {  
            var challenge = window['DIGEST'].parseServerChallenge(null); 
            this.nc += 1;            
            // 123456
            return window['DIGEST'].generateRequestHeader(this.nc, challenge, this.username, '', method, uri);
        }

    }

}
exports.HowellAuthHttp = HowellAuthHttp;
//# sourceMappingURL=digest-client.js.map