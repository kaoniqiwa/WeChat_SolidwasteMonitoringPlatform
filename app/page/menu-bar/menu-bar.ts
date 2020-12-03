
namespace HowellBar {
    export class MenuBar {
        items = ['barItem1', 'barItem2', 'barItem3', 'barItem4', 'barItem5'];
        links = ['index.html', 'event-history.html', 'garbage-stations.html', 'map.html', 'me.html'];
        constructor(){
           const index=  sessionStorage.getItem('pageIndex')

           ,dom = document.getElementById(this.items[index]);
            if(dom){
                const itemDom = document.getElementsByClassName('weui-tabbar__item');
                for (const d of itemDom) {
                    var itemClass = d.getAttribute('class');
                    itemClass = itemClass.replace('weui-bar__item_on', '');
                    d.setAttribute('class', itemClass);
                }
                var itemClass =dom.getAttribute('class');
                itemClass += ' weui-bar__item_on';
                dom.setAttribute('class', itemClass);
            }
          

        }
        changeItem() {
           

            for (let i = 0; i < this.items.length; i++) {
                document.getElementById(this.items[i]).addEventListener('click', () => {
                   
                    sessionStorage.setItem('pageIndex',i+'');
                    mui.openWindow({
                        url: '../../' + this.links[i],
                        id: '../../' + this.links[i],

                    });
                });

            }


        }


    }
}


const m = new HowellBar.MenuBar();
m.changeItem();
