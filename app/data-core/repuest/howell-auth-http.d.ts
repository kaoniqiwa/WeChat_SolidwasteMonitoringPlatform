import { AxiosInstance, AxiosRequestConfig, AxiosStatic, AxiosResponse } from "axios"; 
import { Digest } from "./digest";
export declare class HowellAuthHttp {
    protected readonly axios: AxiosInstance | AxiosStatic;
    // private username;
    // private passwd;
    // private webBrowserAuth;
    constructor(username: string, passwd: string, webBrowserAuth?: boolean, customAxios?: AxiosInstance | AxiosStatic);
     set clientCredentials(credentials: ClientCredentials);
     get clientCredentials(): ClientCredentials;
     set digest(digest:Digest);
     
    get<TResult = any>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<TResult>>;
    post<TRequest = any, TResult = any>(path: string, data?: TRequest, config?: AxiosRequestConfig): Promise<TResult>;
    put<TRequest = any, TResult = any>(path: string, data?: TRequest, config?: AxiosRequestConfig): Promise<TResult>;
    delete<TResult = any>(path: string, config?: AxiosRequestConfig): Promise<TResult>;
    auth<TResult = any>(path: string,digestFn:(header:Headers)=>Digest,error:()=>void): Promise<TResult>;
    // head<TResult = any>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<TResult>>;
    // patch<TRequest = any, TResult = any>(path: string, data?: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse<TResult>>;
    // private getWwwAuth;
    // private getAuthHeader;
}