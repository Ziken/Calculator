const CalculatorInterface = function (calcHandler) {
    'use strict';
    const operations        =    calcHandler.querySelector('.operations');
    const calcInput         =    calcHandler.querySelector('.calc-input');
    const arrowLeft         =    calcHandler.querySelector('.arrow-left');
    const arrowRight        =    calcHandler.querySelector('.arrow-right');
    let movingOperationArrows = true;

    const SIGNS = { //operations signs
        multi: '*', // multiplication
        div: '/',   // division
        add: '+',   // addition
        sub: '-'    // subtraction
    };
    let whatCount = '';
    let amountOperations = 0;
    let isResult = false;

    init = () => {
        /*triggerButtons();
        memoryInit();
        keyboardInit();

        arrowLeft.addEventListener('click',moveOperationsBlockLeft,false);
        arrowRight.addEventListener('click',moveOperationsBlockRight,false);

        calcHandler.querySelector('.calculations').addEventListener('click',function(){
            calcInput.focus();
        },false);
    };*/
};
