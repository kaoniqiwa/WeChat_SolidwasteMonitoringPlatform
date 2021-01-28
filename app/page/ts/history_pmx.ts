console.log("hello")

declare var Swiper:any;


let navBar = ["乱扔垃圾","满溢情况","混合投放"]
new Swiper(".swiper-container",{
    on:{
        slideChangeTransitionEnd:function(this:any){
            // console.log(this.activeIndex)
            let activeIndex = this.activeIndex;
            this.pagination.bullets[activeIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            })
        }
    },
    pagination: {
        el: '.swiper-pagination',
        clickable:true,
        renderBullet:function(index:number,className:string){
            return `
                <div class="${className}">${navBar[index]}</div>            
            `
        }
      },
})


