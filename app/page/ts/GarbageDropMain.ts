import { SessionUser } from "../../common/session-user";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";


import 'minirefresh';
import 'minirefresh/dist/debug/minirefresh.css'
import "../css/header.less"
import "../css/garbage-drop.less"

import { ControllerFactory } from "./data-controllers/ControllerFactory";
import MyWeui from "./myWeui";
import GarbageDrop from './GarbageDrop';

import MyTemplate from './myTemplate';

const user = new SessionUser();
if (user.WUser.Resources) {
  const type = user.WUser.Resources![0].ResourceType;
  const openId = user.WUser.OpenId || null
  /**
   *  pmx
   */
  new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {

    const service = new Service(http);
    const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!);

    let myTemplate = new MyTemplate();
    myTemplate.bindTo('#GarbageDropTemplate')

    // 构造函数式依赖注入
    let garbageDrop = new GarbageDrop(dataController, openId, type, myTemplate);

    garbageDrop.init();

  });
}
