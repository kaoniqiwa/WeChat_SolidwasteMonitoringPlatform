import { NavigationWindow } from ".";
import "../css/basic.less"
import "../css/garbage-drop.less"

const user = (window.parent as NavigationWindow).User;
const http = (window.parent as NavigationWindow).Authentication;
