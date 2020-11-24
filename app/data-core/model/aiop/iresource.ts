import { IGisPointElement } from "./igis-point-element";
import { IMapElement } from "./map-element";
import { IPlatformAccess } from "./iplatform-access";
import { ResourceLabel } from "../single-result";

/**资源信息规范接口 */
export interface IResource extends IGisPointElement, IMapElement, IPlatformAccess {
      /**唯一标识符 */
      Id: string;
      /**资源名称 */
      Name: string;
      /**
       * 资源类型：
       * Camera：监控点
       * EncodeDevice：编码设备
       * IoTSensor：物联网传感器
       */ResourceType: string;
      /**父资源节点ID(可选) */
      ParentResourceId: string;
      /**描述(可选) */
      Description: string;
      /**创建时间 */
      CreateTime: Date | string;
      /**更新事件 */
      UpdateTime: Date| string;
      /**区域路径(可选) */
      RegionPath: string;
      /**区域路径名称(可选) */
      RegionPathName: string;
      /**资源标签，用于分类和检索资源(可选) */
      Labels: ResourceLabel[];
}