import { HowellUri } from "./howell-url";

export class VideoPlayArgs {
    // 链接地址
    host: string;
    // 端口号
    port: number;
    // 摄像机id
    deviceId: string;
    // 通道号
    private _slot: number;

    get slot() {
        return this._slot;
    }
    set slot(value: string | number) {
        if (typeof (value) === 'string') {
            this._slot = parseInt(value);
        } else {
            this._slot = value;
        }
    }

    // 用户名
    username: string;
    // 密码
    password: string;

    // 模式
    mode: PlayMode;
    // 码流
    private _stream: number;

    get stream(): number {
        if (!this._stream) {
            this._stream = 1;
        }
        return this._stream;
    }
    set stream(val: number) {
        this._stream = val;
    }

    // 开始时间
    private beginTime: string;
    // 结束时间
    private endTime: string;

    get begin() {
        return this.beginTime;
    }
    set begin(value: string | Date) {
        if (value instanceof Date) {
            this.beginTime = value.toISOString();
        } else if (typeof (value) === 'string') {
            this.beginTime = value;
        } else { }
    }

    get end() {
        return this.endTime;
    }
    set end(value: string | Date) {
        if (value instanceof Date) {
            this.endTime = value.toISOString();
        } else if (typeof (value) === 'string') {
            this.endTime = value;
        } else { }
    }


    constructor(options: {
        host?: string,
        port?: number,
        deviceId?: string,
        slot?: number | string,
        username?: string,
        password?: string,
        mode?: PlayMode,
        beginTime?: string | Date,
        endTime?: string | Date
    } = {}) {
        this.host = options.host;
        this.port = options.port;
        this.deviceId = options.deviceId;
        this.slot = options.slot;
        this.username = options.username;
        this.password = options.password;
        this.mode = options.mode;
        this.begin = options.beginTime;
        this.end = options.endTime;
    }

    static FromUrl(url: string) {
        const uri = new HowellUri(url);
        const args = new VideoPlayArgs({
            host: uri.Host,
            port: uri.Port
        });
        if (uri.Querys) {
            if (uri.Querys['user']) {
                args.username = uri.Querys['user'];
            }
            if (uri.Querys['password']) {
                args.password = uri.Querys['password'];
            }
        }
        const startIndex = url.indexOf('howellps');
        const modeIndex = url.indexOf('/', startIndex);
        const deviceIdIndex = url.indexOf('/', modeIndex + 1);
        const slotIndex = url.indexOf('/', deviceIdIndex + 1);
        const streamIndex = url.indexOf('/', slotIndex + 1);
        const lastIndex = url.indexOf('/', streamIndex + 1);
        args.mode = url.substr(modeIndex + 1, deviceIdIndex - modeIndex - 1) as PlayMode;
        args.deviceId = url.substr(deviceIdIndex + 1, slotIndex - deviceIdIndex - 1);
        args.slot = url.substr(slotIndex + 1, streamIndex - slotIndex - 1);
        args.stream = parseInt(url.substr(streamIndex + 1, lastIndex - streamIndex - 1));

        if (args.mode === PlayMode.playback) {
            const intervalIndex = url.indexOf('/', lastIndex + 1);
            const strInterval = url.substr(lastIndex + 1, intervalIndex - lastIndex - 1);
            const intervals = strInterval.split('_');
            args.begin = intervals[0];
            args.end = intervals[1];
        }

        return args;
    }

    toString: (querys?: string) => string = (querys?: string) => {
        switch (this.mode) {
            case PlayMode.live:
                // 'ws://192.168.21.241:8800/ws/video/howellps/live/00310101031111111000073000000000/1/1/live.H265?user=howell&password=123456';
                return `ws://${this.host}:${this.port}/ws/video/howellps/${this.mode}/${this.deviceId}/${this.slot}/${this.stream}/${this.mode}.H265?user=${this.username}&password=${this.password}`;
            case PlayMode.playback:
                // ws://192.168.21.241:8800/ws/video/howellps/vod/00310101031111111000073000000000/1/1/2020-11-23T02:42:47.703Z_2020-11-23T02:47:47.703Z/vod.H265?user=howell&password=123456
                if (querys) {
                    return `ws://${this.host}:${this.port}/ws/video/howellps/${this.mode}/${this.deviceId}/${this.slot}/${this.stream}/${this.begin}_${this.end}/${this.mode}.H265` + querys;
                }
                else {
                    return `ws://${this.host}:${this.port}/ws/video/howellps/${this.mode}/${this.deviceId}/${this.slot}/${this.stream}/${this.begin}_${this.end}/${this.mode}.H265?user=${this.username}&password=${this.password}`;
                }
            default:
                return '';
        }
    }

}

export enum PlayMode {
    live = 'live',
    playback = 'vod'
}
