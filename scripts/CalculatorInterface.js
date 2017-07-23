/**

*/
const CalculatorInterface = function ( calcHandler, keyboardObj, computationsObj, memoryObj ) {
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
    const BOOL = { //store all booleans in one variable
        isResult: false,
        wasParenthesisUsed: false,
        forbidUseParenthesis: false
    };
    const operations = [];

    let amountOfUsedLeftParenthesis = 0;


    const init = () => {
        keyboardObj.setActionListener(executeCalcAction);
        memoryObj.setValueMethod(setInputVal);
    };
    const getInputValue  = () => {
        return Number(calcInput.value);
    };
    const getInputValueAsString = () => {
        return calcInput.value;
    };
    const setInputVal = ( val = 0 ) => {
        let value = val;
        if ( isFloat(value) ) {
            value = value.toPrecision(8);
            calcInput.value = value;
        } else if ( value.toString().length <= 8  /*&& isFloat(value)*/ ) {
            //value = Number(value).toPrecision(8);
            calcInput.value  =  value;
        }

    };
    const isFloat = ( n = 0 ) => {
        return n === +n && n !== (n|0);
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
        const value = getInputValueAsString();
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
            case 'multiply':
                saveOperation(SIGNS.multi);
                break;
            case 'divide':
                saveOperation(SIGNS.div);
                break;
            case 'add':
                saveOperation(SIGNS.add);
                break;
            case 'substract':
                saveOperation(SIGNS.sub);
                break;
            case 'left_p':
                addParenthesis(action);
                break;
            case 'right_p':
                addParenthesis(action);
                break;
            case 'equality':
                computeOperations();
                break;
            case 'show_memory':///FIXME
                showMemoryContainer();
                break;
            case 'add_memory'://FIXME
                addValueToMemory();
                break;
            default:

        }
    };
    const computeOperations = () => {

        if ( amountOfUsedLeftParenthesis == 0 ) {
            saveOperation('');//add to input current value
        } else {
            //auto close parenthesis
            while ( amountOfUsedLeftParenthesis > 0 ) {
                addParenthesis('right_p');
                amountOfUsedLeftParenthesis--;
            }
        }
        refreshOperationsContainer();
        const compute = new Promise( ( resolve ) => { //TODO block keys when computes result
            const result = computationsObj.calculateResult(operations);
            resolve(result);

        }).then((v)=>{
            clearOperations();
            setInputVal(v);
        });
    };
    const clearOperations = () => {
        operations.length = 0;
    };
    const clearCalc = () => {
        clearOperations();
        clearInput();
        refreshOperationsContainer();
        //reset varabke bool to default
        Object.entries(BOOL).forEach( ( [key] ) => {
            BOOL[key] = false;
        });
    };
    const addParenthesis = (type) => {
        if ( type === 'left_p' && !BOOL.forbidUseParenthesis ) {
            amountOfUsedLeftParenthesis++;
            operations.push('(');
        } else if ( type === 'right_p' && amountOfUsedLeftParenthesis > 0 ) {
            amountOfUsedLeftParenthesis--;
            saveOperation('');
            BOOL.forbidUseParenthesis = true;
            BOOL.wasParenthesisUsed = true;
            operations.push(')');
        }
        refreshOperationsContainer();
    };
    const saveOperation = ( sign = '' ) => {
        //isResult = false;
        if ( BOOL.wasParenthesisUsed ) {
            BOOL.wasParenthesisUsed = false;
            if ( sign != '' ) {
                operations.push(sign);
                BOOL.forbidUseParenthesis = false;
            }
        } else {
            operations.push(getInputValue());
            if ( sign != '' ) {//after sign can use parenthesis
                BOOL.forbidUseParenthesis = false;
                operations.push(sign);
            }
            clearInput();
        }
        refreshOperationsContainer();

    };
    const refreshOperationsContainer = () => {
        operationsContainer.innerHTML = operations.join(' '); //convert into string
    };
    const showMemoryContainer = () => {
        memoryObj.showMemoryCont();
    };
    const addValueToMemory = () => {
        const val = getInputValue();
        memoryObj.addCellToMemory(val);
    };

    init();
};
