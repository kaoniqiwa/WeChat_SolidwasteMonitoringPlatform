
namespace HowellBar{
 export   class MenuBar{
        changeItem(){
            const items = ['barItem1','barItem2','barItem3','barItem4','barItem5'];    
        
            for (let i = 0; i < items.length; i++) {
                document.getElementById(items[i]).addEventListener('click',()=>{
                    const itemDom = document.getElementsByClassName('weui-tabbar__item'); 
                    for(const d of itemDom){
                        var itemClass= d.getAttribute('class');
                            itemClass = itemClass.replace('weui-bar__item_on','');
                            d.setAttribute('class',itemClass);
                    }
                    var itemClass= itemDom[i].getAttribute('class');
                    itemClass+=' weui-bar__item_on';
                    itemDom[i].setAttribute('class',itemClass);
                });
                
            }
         
        }
    
    
    } 
}


const m = new HowellBar.MenuBar();
m.changeItem();
