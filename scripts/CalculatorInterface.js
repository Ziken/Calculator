/**

*/
const CalculatorInterface = function ( calcHandler, keyboardObj ) {
    'use strict';
    const operationsContainer   =    calcHandler.querySelector('.operations');
    const calcInput             =    calcHandler.querySelector('.calc-input');
    //const arrowLeft         =    calcHandler.querySelector('.arrow-left');
    //const arrowRight        =    calcHandler.querySelector('.arrow-right');
    //let movingOperationArrows = true;

    const SIGNS = { //operations signs
        multi: '*', // multiplication
        div: '/',   // division
        add: '+',   // addition
        sub: '-'    // subtraction
    };

    let whatCount = '';
    let isResult = false;

    const init = () => {
        keyboardObj.setActionListener(executeCalcAction);
    };
    const getInputValue  = () => {
        return Number(calcInput.value);
    };
    const getInputValueAsString = () => {
        return getInputValue().toString();
    };
    const setInputVal = ( val = '' ) => {
        let value = val;
        if ( value.toString().length <= 8 /*&& isFloat(value)*/ ) {
            //value = Number(value).toPrecision(8);
            calcInput.value  =  value;
        }

    };

    const addNumberToInput = ( val ) => {
        let inputValueAsString = getInputValueAsString();
        let lenInput = inputValueAsString.length;
        if ( lenInput === 1 &&  inputValueAsString === '0' ) {//if input of calculator is empty (is only 0)
            setInputVal(val);
        } else if (lenInput <= 8) {//limit of digits
            setInputVal(inputValueAsString + String(val));
        }
    };

    const addDotToInput = () => {
        const value = getInputValue();
        if ( !/\./.test(value) ) { //if dot has not used in this number
            setInputVal(value + '.');
        }
    };

    const reverseValue = () => {
        setInputVal(getInputValue() * -1);
    };

    const clearInput = () => {
        setInputVal(0);
    };

    const removeFirstChar = () => {
        let valueAsString = getInputValueAsString();
        let lenInput = valueAsString.length;
        if ( lenInput > 1 ) {
            let valWithoutFirstChar = valueAsString.substring(0,lenInput-1);

            if ( valWithoutFirstChar === '-' ) {
                setInputVal(0);
            } else {
                setInputVal(valWithoutFirstChar);
            }
        } else {
            setInputVal(0);
        }
    };
    const executeCalcAction = ( action = '' ) => {

        switch (action) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                //clearLastResult();// don't save current value
                addNumberToInput(action);
                break;
            case 'dot':
                //clearLastResult();// don't save current value
                addDotToInput();
                break;
            case 'change_sign':
                //clearLastResult();// don't save current value
                reverseValue();
                break;
            case 'backspace':
                removeFirstChar();
                break;
            case 'ce':
                clearInput();
                break;
            case 'c':
                clearCalc();
                break;
            case 'multiply'://TODO function saveOperation
                //saveOperation(SIGNS.multi);
                break;
            case 'divide':
                //saveOperation(SIGNS.div);
                break;
            case 'add':
                //(SIGNS.add);
                break;
            case 'substract':
                //saveOperation(SIGNS.sub);
                break;
            case 'left_p'://FIXME replace it for parenthesis
                //sqrtOperation();
                break;
            case 'right_p'://FIXME replace it for parenthesis
                //valueSquared();
                break;
            case 'equality':
                //countOperation();
                break;
            case 'show_memory':///FIXME
                //showMemory();
                break;
            case 'add_memory'://FIXME
                //addCellToMemory();
                break;
            default:

        }
    };

    init();
};
