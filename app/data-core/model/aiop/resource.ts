import { ResourceLabel } from "../single-result";
import { PlatformAssociation } from "./iplatform-access";
import { GisPoint } from "./igis-point";
import { IResource } from "./iresource";

 /**资源信息 */
 export class Resource implements IResource
 {
     gisPoint: GisPoint;
     ElementType: number;
     MapId: string;
     Resources: Resource[];
     platformAssociation: PlatformAssociation;
     /**唯一标识符 */
     Id: string;
     /**资源名称 */
     Name: string;
     /**
      * 资源类型：
      * Camera：监控点
      * EncodeDevice：编码设备
      * IoTSensor：物联网传感器
      */
     ResourceType: string;
     /**父资源节点ID(可选) */
     ParentResourceId: string;
     /**描述(可选) */
     Description: string;
     /**创建时间 */
     CreateTime: Date | string;
     /**更新事件 */
     UpdateTime: Date | string;
     /**区域路径(可选) */
     RegionPath: string;
     /**区域路径名称(可选) */
     RegionPathName: string;
     /**资源标签，用于分类和检索资源(可选) */
     Labels: ResourceLabel[];
     /**GIS坐标(可选) */
     GisPoint: GisPoint;
     /**所属地图元素ID(可选) */
     MapElementId: string;
     /**平台接入信息(可选) */
     PlatformAssociation: PlatformAssociation;
     /**所属区域ID */
     RegionId:string;
 }