"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios")); 
class HowellAuthHttp {
    constructor(username, passwd, webBrowserAuth, customAxios) {
        this.getWwwAuth = (r) => {            
            throw r;
        };
        this.axios =  axios_1.default; 
    } 
    get(path, config) {
        return this.axios
            .get(path, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
             
            return wwwAuth;
        });
    }

    post(path, data, config) {
        return this.axios
            .post(path, data, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
          //  const { reAuth, authenticateHeader } = wwwAuth;
            
       
            return wwwAuth.data;
        });
    }
    put(path, data, config) {
        return this.axios
            .put(path, data, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
            const { reAuth, authenticateHeader } = wwwAuth;
             
            return wwwAuth;
        });
    }
    delete(path, config) {
        return this.axios
            .delete(path, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
            const { reAuth, authenticateHeader } = wwwAuth;
            
            return wwwAuth;
        });
    }
    
    
}
exports.HowellAuthHttp = HowellAuthHttp;
//# sourceMappingURL=digest-client.js.map