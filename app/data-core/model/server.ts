import { number } from "echarts/core";
import { Division } from "./waste-regulation/division";

export class Server {
    /**
     *	String	业务服务器ID	M
     *
     * @type {string}
     * @memberof Server
     */
    Id!: string;
    /**
     *	String	名称	O
     *
     * @type {string}
     * @memberof Server
     */
    Name?: string;
    /**
     *	Division[]	管理的区划	M
     *
     * @type {Division[]}
     * @memberof Server
     */
    Divisions!: Division[];
    /**
     *	String	连接地址：http://ip:port/query	M
     *
     * @type {string}
     * @memberof Server
     */
    Url!: string;
    /**
     *	String	MQTT地址：tcp://ip:port/	M
     *
     * @type {string}
     * @memberof Server
     */
    MqttUrl!: string;
    /**
     *	String	视频服务器地址 	O
     *
     * @type {string}
     * @memberof Server
     */
    VideoUrl?: string;
    /**
     *	String	版本	O
     *
     * @type {string}
     * @memberof Server
     */
    Version?: string;
    /**
     *	String	用户名，AccessID	O
     *
     * @type {string}
     * @memberof Server
     */
    Username?: string;
    /**
     *	String	密码，AccessKEY	O
     *
     * @type {string}
     * @memberof Server
     */
    Password?: string;
    /**
     *	Int32	状态：0-正常，1-故障	M
     *
     * @type {number}
     * @memberof Server
     */
    MqttState!: MqttState;
    /**
     *	Int32	状态：0-正常，1-故障	M
     *
     * @type {number}
     * @memberof Server
     */
    State!: ServerState;
    /**
     *	DateTime	创建时间	M /R
     *
     * @type {string}
     * @memberof Server
     */
    CreateTime!: string;
    /**
     *	DateTime	更新时间	M /R
     *
     * @type {string}
     * @memberof Server
     */
    UpdateTime!: string;
}

/**
 *  状态：0-正常，1-故障
 *
 * @export
 * @enum {number}
 */
export enum MqttState {
    /**
     *  0-正常
     */
    Normal = 0,
    /**
     *  1-故障
     */
    Fault = 1
}
export enum ServerState {
    /**
     *  0-正常
     */
    Normal = 0,
    /**
     *  1-故障
     */
    Fault = 1
}

export interface GetServersParams {

    /**
     *	Int32	页码[1-n]	O
     *
     * @type {number}
     * @memberof GetServersParams
     */
    PageIndex?: number;
    /**
     *	Int32	分页大小[1-100]	O
     *
     * @type {number}
     * @memberof GetServersParams
     */
    PageSize?: number;
    /**
     *	String[]	服务器ID	O
     *
     * @type {string[]}
     * @memberof GetServersParams
     */
    Ids?: string[];
    /**
     *	String	服务器名称，支持LIKE	O
     *
     * @type {string}
     * @memberof GetServersParams
     */
    Name?: string;
    /**
     *	String	负责的区划ID	O
     *
     * @type {string}
     * @memberof GetServersParams
     */
    DivisionId?: string;
    /**
     *	String	负责的区划名称，支持LIKE	O
     *
     * @type {string}
     * @memberof GetServersParams
     */
    DivisionName?: string;
    /**
     *	String	地址，支持LIKE	O
     *
     * @type {string}
     * @memberof GetServersParams
     */
    Url?: string;
    /**
     *	Int32	状态：0-正常，1-故障	O
     *
     * @type {MqttState}
     * @memberof GetServersParams
     */
    MqttState?: MqttState;
    
    /**
     *	Int32	状态：0-正常，1-故障	O
     *
     * @type {ServerState}
     * @memberof GetServersParams
     */
    State?: ServerState;
}

export class GetDivisionsParams{

/**
 *	Int32	页码[1-n]	O
 *
 * @type {number}
 * @memberof GetDivisionsParams
 */
PageIndex?:number;
/**
 *	Int32	分页大小[1-100]	O
 *
 * @type {number}
 * @memberof GetDivisionsParams
 */
PageSize?:number;
/**
 *	String[]	区划ID	O
 *
 * @type {string[]}
 * @memberof GetDivisionsParams
 */
Ids?:string[];
/**
 *	String	区划名称，支持LIKE	O
 *
 * @type {string}
 * @memberof GetDivisionsParams
 */
Name?:string;
/**
 *	Int32	区划类型	O
 *
 * @type {number}
 * @memberof GetDivisionsParams
 */
DivisionType?:number;
/**
 *	String	父ID	O
 *
 * @type {string}
 * @memberof GetDivisionsParams
 */
ParentId?:string;
/**
 *	String	区划完整路径，含本节点，@进行分割，上级节点在前，支持LIKE	O
 *
 * @type {string}
 * @memberof GetDivisionsParams
 */
DivisionPath?:string;
/**
 *	String	祖辈ID，返回该ID下的所有子孙区划信息	O
 *
 * @type {string}
 * @memberof GetDivisionsParams
 */
AncestorId?:string;
}

export class GetGarbageStationsParams{

/**
 *	Int32	页码[1-n]	O
 *
 * @type {number}
 * @memberof GetGarbageStationsParams
 */
PageIndex?:number;
/**
 *	Int32	分页大小[1-100]	O
 *
 * @type {number}
 * @memberof GetGarbageStationsParams
 */
PageSize?:number;
/**
 *	String[]	垃圾房ID	O
 *
 * @type {string[]}
 * @memberof GetGarbageStationsParams
 */
Ids?:string[];
/**
 *	String	垃圾房名称，支持LIKE	O
 *
 * @type {string}
 * @memberof GetGarbageStationsParams
 */
Name?:string;
/**
 *	Int32	垃圾房类型	O
 *
 * @type {number}
 * @memberof GetGarbageStationsParams
 */
StationType?:number;
/**
 *	String	区划ID	O
 *
 * @type {string}
 * @memberof GetGarbageStationsParams
 */
DivisionId?:string;
/**
 *	Boolean	干垃圾是否满溢	O
 *
 * @type {boolean}
 * @memberof GetGarbageStationsParams
 */
DryFull?:boolean;
/**
 *
 *
 * @type {boolean}
 * @memberof GetGarbageStationsParams
 */
WetFull?:boolean;
/**
 *	String	祖辈ID，返回该ID下的所有子孙区划及其本身的垃圾房	O
 *
 * @type {string}
 * @memberof GetGarbageStationsParams
 */
AncestorId?:string;
/**
 *	Boolean	区划ID为NULL	O
 *
 * @type {boolean}
 * @memberof GetGarbageStationsParams
 */
DivisionIdNullable?:boolean;
}