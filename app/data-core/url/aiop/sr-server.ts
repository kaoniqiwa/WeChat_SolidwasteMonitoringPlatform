import { IUrl, BaseUrl } from "../IUrl";

export class SRService extends BaseUrl implements IUrl {
    create(): string {
        return this.gateway + 'SRServers';
    }
    edit(id: string): string {
        return this.gateway + `SRServers/${id}`;
    }
    del(id: string): string {
        return this.gateway + `SRServers/${id}`;
    }
    get(id: string): string {
        return this.gateway + `SRServers/${id}`;
    }
    list(): string {
        return this.gateway + 'SRServers';
    }
    sync(id: string): string {
        return this.gateway + `SRServers/${id}/Sync`;
    }

    preview() {
        return this.gateway + `SRServers/PreviewUrls`;
    }

    vod() {
        return this.gateway + `SRServers/VodUrls`;
    }
}