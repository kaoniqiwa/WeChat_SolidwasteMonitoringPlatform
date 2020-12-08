import { MediumPicture } from "../../data-core/url/aiop/medium";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { WeChatRequestService } from "../../data-core/repuest/we-chat.service"; 
import { SessionUser } from "../../common/session-user";
namespace MePage{

    export class Me{
        user :SessionUser;
        constructor(){
            this.user=new SessionUser();     
        }
         getUser(){
           const u_name =  document.getElementById('u_name'),
           division_name = document.getElementById('division_name'),
           tel=document.getElementById('tel');
           if(this.user.WUser){
            
            u_name.innerText=(this.user.WUser.FirstName||'-')+(this.user.WUser.LastName||'');
       
            tel.innerText=this.user.WUser.MobileNo||'-';
            if(this.user.WUser.Resources&&this.user.WUser.Resources.length)
                division_name.innerText=this.user.WUser.Resources[0].Name;
            
           }
       
        }
    }
}

new MePage.Me().getUser();