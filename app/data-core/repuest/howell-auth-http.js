"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios")); 
class HowellAuthHttp {
    nc =1;
    digest;
    username;
     passwd;
    constructor(username, passwd, webBrowserAuth, customAxios) {
        this.passwd = passwd;
        this.username=username;
        this.getWwwAuth = (r) => {            
            throw r;
        };
        this.axios =  axios_1.default; 
    } 
 
    get(path, config) {
        const myHeaders = this.getHttpHeaders('GET', path); 
        const httpOptions = {
            headers: myHeaders
          };
        return this.axios
            .get(path, httpOptions)
            .catch(this.getWwwAuth)
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
            .delete(path, config)
            .catch(this.httpOptions)
            .then(wwwAuth => { 
            
            return wwwAuth;
        });
    }

    auth(path,digestFn) {      
        const httpOptions = {
            headers: { 'X-WebBrowser-Authentication': 'Forbidden' }
          };
        return this.axios
            .get(path, httpOptions)
            .catch((error)=>{ 
                if (error.response.status == 403) {
                  this.digest=  digestFn(error.response.headers); 
                  return  this.get(path);
                }
            })
            .then(wwwAuth => { 
            return wwwAuth;
        });
    }
     //获取已授权的头部
  getHttpHeaders(method, uri) {      
    var challenge = this.digest.parseServerChallenge(null); 
    this.nc+=1; 
    return   this.digest.generateRequestHeader(this.nc, challenge, this.username,'123456', method, uri);
  }
    
}
exports.HowellAuthHttp = HowellAuthHttp;
//# sourceMappingURL=digest-client.js.map