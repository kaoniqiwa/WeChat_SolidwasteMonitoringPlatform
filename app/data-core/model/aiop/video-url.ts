 /**视频URL地址 */
    export class VideoUrl
    {
        /**Url地址 */
        Url: string;
        /**用户名(可选) */
        Username: string;
        /**密码(可选) */
        Password: string;
    }

     /**获取预览视频的URL地址请求参数 */
    export class GetPreviewUrlParams
    {
        /**监控点ID */
        CameraId: string;
        /**流类型：1-主码流，2-子码流 */
        StreamType: number;
        /**协议类型：rtmp, rtsp, hls, ws-flv, ws-ps */
        Protocol: string;
    }
    /**获取回放点播视频流地址请求参数 */
    export class GetVodUrlParams
    {
        /**监控点ID */
        CameraId: string;
        /**流类型：1-主码流，2-子码流 */
        StreamType: number;
        /**协议类型：rtmp, rtsp, hls, ws-flv, ws-ps */
        Protocol: string;
        /**开始时间 */
        BeginTime: Date | string;
        /**结束时间 */
        EndTime: Date | string;
    }