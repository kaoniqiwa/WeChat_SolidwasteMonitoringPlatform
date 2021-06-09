import weui from 'weui.js';
import "weui";
export class Test {
    
    showDatePicker() {
        
         weui.datePicker({
            start: new Date(2020, 12 - 1, 1),
            end: new Date(),
            onChange: (result: any) => {

            },
            onConfirm: (result: any) => {
                let date = new Date(result[0].value, result[1].value - 1, result[2].value);
                console.log(date);
            },
            title: '请选择日期',
            id:"111"
        });        
    }    
}

var test = new Test();
test.showDatePicker();
setTimeout(() => {    
     weui.datePicker({
        start: new Date(2020, 12 - 1, 1),
        end: new Date(),        
        onChange: (result: any) => {
    
        },
        onConfirm: (result: any) => {
            let date = new Date(result[0].value, result[1].value - 1, result[2].value);
            console.log(date);
        },
        title: '请选择日期',
        id:"222"
    });
}, 10*1000);
