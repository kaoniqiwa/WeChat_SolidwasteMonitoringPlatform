
import { SessionUser } from "../../common/session-user";
import { getQueryVariable } from "../../common/tool";
namespace HowellBar {
    export class MenuBar {
        
        user :SessionUser;
        items = ['barItem1', 'barItem2', 'barItem3', 'barItem4', 'barItem5'];
        links = ['index.html', 'event-history.html'
        , 'garbagestations.html', 'map.html', 'me.html'];
        constructor(){
            this.user=new SessionUser();          
            
            this.menu();
        }

        menu(){
            const pageParam=  getQueryVariable('page');
            if(pageParam){
                const itemDom = document.getElementsByClassName('weui-tabbar__item');
                for (const d of itemDom) {
                    var itemClass = d.getAttribute('class');
                    itemClass = itemClass.replace('weui-bar__item_on', '');
                    d.setAttribute('class', itemClass);
                }
                const dom = document.getElementById(pageParam+'');
                var itemClass =dom.getAttribute('class');
                itemClass += ' weui-bar__item_on';
                dom.setAttribute('class', itemClass);
            }        
        
        }

      
        changeItem() {        

            for (let i = 0; i < this.items.length; i++) {
                document.getElementById(this.items[i]).addEventListener('click', () => {
                   
                    //sessionStorage.setItem('pageIndex',i+'');
                    mui.openWindow({
                        url: '../../' + this.links[i]+`?openid=${this.user.name}`,
                        id: '../../' + this.links[i]+`?openid=${this.user.name}`

                    });
                });
            }
        }
    }
}


const m = new HowellBar.MenuBar();
m.changeItem();
