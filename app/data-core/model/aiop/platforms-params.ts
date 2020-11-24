   /**获取平台信息请求参数 */
   export class GetPlatformsParams
   {
       /**页码[1-n](可选) */
       PageIndex: number | null;
       /**分页大小[1-100](可选) */
       PageSize: number | null;
       /**平台ID列表(可选) */
       PlatformIds: string[];
       /**平台名称，支持LIKE(可选) */
       Name: string;
       /**协议类型(可选) */
       ProtocolType: string;
       /**状态(可选) */
       State: number | null;
   }