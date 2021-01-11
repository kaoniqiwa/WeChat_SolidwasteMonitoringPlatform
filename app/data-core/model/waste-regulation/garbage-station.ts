import { TrashCan } from "./trashCan";
import { Camera } from "./camera";
import { IPageParams } from "../page";

export enum StationState {
    // 正常
    Normal = 0,
    // 满溢
    Full = 1,
    // 异常
    Error = 2
}


/**投放点信息 */
export class GarbageStation {
    /**垃圾房ID */
    Id!: string;
    /**垃圾房名称 */
    Name!: string;
    /**
     * 垃圾房类型(可选)，默认：0
     * 暂时无效，之后会用于高度，形状，室内、室外等区分
     */
    StationType!: number;

    /**描述信息(可选) */
    Description?: string;
    /**创建时间 */
    CreateTime!: Date | string;
    /**更新事件 */
    UpdateTime!: Date | string;
    /**GIS点位(可选) */
    GisPoint?: any;
    /**所属区划ID(可选) */
    DivisionId?: string;
    /**垃圾桶列表(可选) */
    TrashCans?: TrashCan[];
    /**摄像机列表(可选) */
    Cameras?: Camera[];
    /**干垃圾满溢(可选) */
    DryFull?: boolean;
    /**干垃圾满溢时间(可选) */
    DryFullTime?: Date | string;
    /**干垃圾容积(可选)，单位：L */
    DryVolume?: number;
    /**最大干垃圾容积，单位：L */
    MaxDryVolume!: number;
    /**湿垃圾满溢(可选) */
    WetFull?: boolean;
    /**湿垃圾满溢时间(可选) */
    WetFullTime?: Date | string;
    /**湿垃圾容积(可选)，单位：L */
    WetVolume?: number;
    /**最大湿垃圾容积，单位：L */
    MaxWetVolume!: number;

    // 垃圾厢房状态
    StationState!: number;
}



/**获取垃圾房列表参数 */
export class GetGarbageStationsParams implements IPageParams {
    /**页码[1-n](可选) */
    PageIndex?: number;
    /**分页大小[1-100](可选) */
    PageSize?: number;
    /**垃圾房ID(可选) */
    Ids?: string[];
    /**垃圾房名称(可选)，支持LIKE */
    Name?: string;
    /**垃圾房类型(可选) */
    StationType?: number;
    /**区划ID(可选) */
    DivisionId?: string;
    /**干垃圾是否满溢(可选) */
    DryFull?: boolean;
    /**湿垃圾是否满溢(可选) */
    WetFull?: boolean;
    /**祖辈ID(可选)，返回该ID下的所有子孙区划及其本身的垃圾房 */
    AncestorId?: string;

}