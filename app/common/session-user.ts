import { WeChatUser } from "../data-core/model/we-chat";

 
export class SessionUser {
 
    constructor(){

       // this.division='310109011000';
        // this.user= {
        //     name:'guangzhong',
        //     pwd:'123456'
        // }
    }

    set WUser(val:WeChatUser){
        localStorage.setItem('WUser', JSON.stringify(val));
    }

    get WUser(){
        const val = localStorage.getItem('WUser');
        return JSON.parse(val);
    }
    set user(val: { name: string, pwd: string }) {
        this.pwd = val.pwd;
        this.name = val.name;
    }

    get user() {
        return {
            name: this.name,
            pwd: this.pwd
        }
    }

    set division(val: string) {
        localStorage.setItem('division', val);
    }

    get division() {
        return localStorage.getItem('division');
    } 

    set name(val: string) { 
          localStorage.setItem('name', val);
    }

    get name() {
        return localStorage.getItem('name');  
    }

    set pwd(val: string) { 
          localStorage.setItem('pwd', val);
    }

    get pwd() {
        return localStorage.getItem('pwd'); 
    }
 
}