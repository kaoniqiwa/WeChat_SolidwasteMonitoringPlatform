  /**平台信息 */
  export class Platform
  {
      /**平台ID */
      Id: string;
      /**平台名称(可选) */
      Name: string;
      /**用户名，AccessID(可选) */
      Username: string;
      /**密码，AccessKEY(可选) */
      Password: string;
      /**协议类型:Artemis */
      ProtocolType: string;
      /**连接地址 */
      Url: string;
      /**软件版本(可选) */
      SoftwareVersion: string;
      /**状态(可选)：0-正常，1-故障 */
      State: number;
      /**创建时间 */
      CreateTime: Date | string;
      /**更新时间 */
      UpdateTime: Date | string;
      /**事件接收端口号(可选) */
      EventRecvPort: number | null;
      /**事件接收的本地IP地址(可选) */
      EventRecvIPAddress: string;
      /**订阅事件编码列表(可选) */
      EventCodes: number[];

  }