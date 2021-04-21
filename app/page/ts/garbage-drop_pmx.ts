import { NavigationWindow } from ".";
import "../css/header.less"
import "../css/garbage-drop.css"

const user = (window.parent as NavigationWindow).User;
const http = (window.parent as NavigationWindow).Authentication;
