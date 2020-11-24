import { Resource } from "./Resource"; 
    /**编码设备信息 */
    export class EncodeDevice extends Resource  
    {
        /**传输类型(可选)　0：UDP，1：TCP */
        TransType: number | null;
        /**协议类型(可选) Howell，Hikvision，UniView */
        ProtocolType: string;
        /**状态(可选) 0-正常,1-离线 */
        OnlineStatus: number | null;
        /**型号(可选) */
        Model: string;
        /**序列号(可选) */
        SerialNumber: string;
        /**厂商(可选) */
        Manufactory: string;
        /**连接地址(可选) */
        Url: string;
        /**用户名(可选) */
        Username: string;
        /**密码(可选) */
        Password: string;
        /**能力(可选) */
        CapabilitySet: string[];
        /**能力名称(可选) */
        CapabilitySetName: string[];
        /**固件版本号(可选) */
        FirmwareVersion: string;
        /**固件版本号(可选) */
        SoftwareVersion: string;
        /**固件版本号(可选) */
        HardwareVersion: string;
        /**设备类型(可选) NVR，IPC，DVS */
        DeviceType: string;
    }