import { SessionUser } from '../../common/session-user'
import { VideoPlayArgs } from '../model/waste-regulation/video-args'
import {
  GetPreviewUrlParams,
  GetVodUrlParams,
  VideoUrl,
} from '../model/waste-regulation/video-model'

import { HowellAuthHttp } from './howell-auth-http'
import { HowellResponse } from '../model/response'
import { SRServiceUrl } from '../url/aiop/sr-server'

export class SRServersRequestService {
  url: SRServiceUrl

  constructor(private requestService: HowellAuthHttp) {
    this.url = new SRServiceUrl()
  }

  async PreviewUrls(params: GetPreviewUrlParams) {
    // return this.requestService.post<VideoUrl>(this.url.preview(), params);
    const response = await this.requestService.post<
      GetPreviewUrlParams,
      HowellResponse<VideoUrl>
    >(this.url.preview(), params)
    if (response.Data.Url) {
      let args = VideoPlayArgs.FromUrl(response.Data.Url)
      if (response.Data.Username) {
        args.username = response.Data.Username
      }
      if (response.Data.Password) {
        args.password = response.Data.Password
      }
      let url = args.toString()
      response.Data.Url = url
    }
    // if (isIPAddressOrLocalhost()) {
    //     const host = document.location.hostname;
    //     const port = document.location.port;
    //     response.Data.WebUrl = "http://" + host + ":" + port + "/video/wsplayer/wsplayer.html";
    // }
    return response.Data
  }

  async VodUrls(params: GetVodUrlParams) {
    // return this.requestService.post<VideoUrl>(this.url.vod(), params);
    const response = await this.requestService.post<
      GetVodUrlParams,
      HowellResponse<VideoUrl>
    >(this.url.vod(), params)
    if (response.Data.Url) {
      let args = VideoPlayArgs.FromUrl(response.Data.Url)
      if (response.Data.Username) {
        args.username = response.Data.Username
      }
      if (response.Data.Password) {
        args.password = response.Data.Password
      }
      let url = args.toString()
      response.Data.Url = url
    }
    // if (isIPAddressOrLocalhost()) {

    //     const host = document.location.hostname;
    //     const port = document.location.port;
    //     response.Data.WebUrl = "http://" + host + ":" + port + "/video/wsplayer/wsplayer.html";
    // }
    return response.Data
  }
}
