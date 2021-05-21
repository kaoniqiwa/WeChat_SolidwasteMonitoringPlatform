import { NavigationWindow } from ".";
import { Service } from "../../data-core/repuest/service";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import GarbageStationClient from "./GarbageStationClient";
import GarbageStationServer from "./GarbageStationServer";



const user = (window.parent as NavigationWindow).User;
const http = (window.parent as NavigationWindow).Authentication;

const service = new Service(http);
const type = user.WUser.Resources![0].ResourceType;
console.log(user)
const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!);

const stationServer = new GarbageStationServer(dataController);
const stationClient = new GarbageStationClient(type, dataController, stationServer);

stationClient.init();

