/**
 * Connect all classes, run calculator
 * @param {Object} opt essential elements to run calculator
*/
const CalculatorInterface = function ( opt ) {
    //calcHandler, keyboardObj, computationsObj, memoryObj
    'use strict';
    const operationsContainer   =    opt.calcHandler.querySelector('.operations');
    const calcInput             =    opt.calcHandler.querySelector('.calc-input');
    const operationsArrowLeft   =    opt.calcHandler.querySelector('.arrow-left');
    const operationsArrowRight  =    opt.calcHandler.querySelector('.arrow-right');
    const missedParenthesisCont =    opt.calcHandler.querySelector('.missed-parenthesis');
    //let movingOperationArrows = true;

    const SIGNS = { //operations signs
        multi: '*', // multiplication
        div: '/',   // division
        add: '+',   // addition
        sub: '-'    // subtraction
    };
    const BOOL = { //store all booleans in one variable
        isResult:               false,
        wasParenthesisUsed:     false,
        forbidUsingParenthesis: false,
        forbidUsingKeyboard:    false,
        forbitUsingArrows:      false
    };
    const operations = [];

    let amountOfUsedLeftParenthesis = 0;

    const init = () => {
        opt.keyboardObj.setActionListener(executeCalcAction);
        opt.memoryObj.setValueMethod(setInputVal);
        operationsArrowLeft.addEventListener('click', moveOperationsContainer, false);
        operationsArrowRight.addEventListener('click', moveOperationsContainer, false);
        opt.calcHandler.addEventListener('click', () => {
            calcInput.focus();
        },false);
    };
    const getInputValue  = () => {
        return Number(calcInput.value);
    };
    const getInputValueAsString = () => {
        return calcInput.value;
    };
    const setInputVal = ( val = 0 ) => {
        let value = val;
        if ( isFloat(value) && value.toString().length > 8 ) {
            value = value.toPrecision(8);
        }
        calcInput.value = value;


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
        if ( BOOL.forbidUsingKeyboard ) return false;
        switch ( action ) {
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
                clearLastResult();// don't save current value (result)
                addNumberToInput(action);
                break;
            case 'dot':
                clearLastResult();// don't save current value (result)
                addDotToInput();
                break;
            case 'change_sign':
                clearLastResult();// don't save current value (result)
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
    const clearLastResult = () => {
        if ( BOOL.isResult ) {
            BOOL.isResult = false;
            refreshOperationsContainer();
            clearInput();
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
        new Promise( ( resolve ) => {
            BOOL.forbidUsingKeyboard = true;
            const result = opt.computationsObj.calculateResult(operations);
            resolve(result);

        }).then((v)=>{
            BOOL.forbidUsingKeyboard = false;
            BOOL.isResult = true;
            missedParenthesisCont.innerHTML = amountOfUsedLeftParenthesis;
            clearOperations();
            //console.log(v.toPrecision(8));
            setInputVal( v );
        });
    };
    const clearOperations = () => {
        operations.length = 0;
    };
    const clearCalc = () => {
        clearOperations();
        clearInput();
        refreshOperationsContainer();
        missedParenthesisCont.innerHTML = 0;
        //reset varabke bool to default
        Object.entries(BOOL).forEach( ( [key] ) => {
            BOOL[key] = false;
        });
    };
    const addParenthesis = (type) => {
        if ( type === 'left_p' && !BOOL.forbidUsingParenthesis ) {
            amountOfUsedLeftParenthesis++;
            missedParenthesisCont.innerHTML = amountOfUsedLeftParenthesis;
            operations.push('(');
        } else if ( type === 'right_p' && amountOfUsedLeftParenthesis > 0 ) {
            amountOfUsedLeftParenthesis--;
            missedParenthesisCont.innerHTML = amountOfUsedLeftParenthesis;
            saveOperation('');
            BOOL.forbidUsingParenthesis = true;
            BOOL.wasParenthesisUsed = true;
            operations.push(')');
        }
        refreshOperationsContainer();
    };
    const saveOperation = ( sign = '' ) => {
        if ( BOOL.isResult ) {
            const currentInput = getInputValue();
            if ( isNaN(currentInput) ) {
                clearInput();
            }
            BOOL.isResult = false;
        }
        if ( BOOL.wasParenthesisUsed ) {
            BOOL.wasParenthesisUsed = false;
            if ( sign != '' ) {
                operations.push(sign);
                BOOL.forbidUsingParenthesis = false;
            }
        } else {
            operations.push(getInputValue());
            if ( sign != '' ) {//after sign can use parenthesis
                BOOL.forbidUsingParenthesis = false;
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
        opt.memoryObj.showMemoryCont();
    };
    const addValueToMemory = () => {
        const val = getInputValue();
        opt.memoryObj.addCellToMemory(val);
    };
    const moveOperationsContainer = ( evt ) => {
        const direction = evt.target.dataset.direction;

        if ( BOOL.forbitUsingArrows ) return false;
        const widthOfBlock = +window.getComputedStyle(operationsContainer).width.split('px')[0] || 0;
        const leftStyle = +window.getComputedStyle(operationsContainer).left.split('px')[0] || 0;
        let offsetLeft = 0;
        let parts = widthOfBlock % 240;
        let changeOffset = false;

        if ( (widthOfBlock-parts) == leftStyle )
            offsetLeft = leftStyle + parts;
        else
            changeOffset = true;

        if ( direction == 'left' ) {
            if ( changeOffset )
                offsetLeft = leftStyle + 240;

            if ( offsetLeft <= 0 ) {
                BOOL.forbitUsingArrows = true;// if animations runs, block arrows
                animate(operationsContainer, 'left', offsetLeft + 'px', 300,() => { BOOL.forbitUsingArrows=false; });
            }
        } else {
            if ( changeOffset )
                offsetLeft = leftStyle - 240;

            if ( widthOfBlock>285 && -1*offsetLeft <= widthOfBlock ) {
                BOOL.forbitUsingArrows = true;// if animations runs, block arrows
                animate(operationsContainer, 'left', offsetLeft + 'px', 300,() => { BOOL.forbitUsingArrows=false; });
            }
        }
    };

    const animate =  ( elem, property, aim, duration = 1000, complete = ()=>{} ) => {
        let startTime;
        let direction;
        let end;
        let start = +window.getComputedStyle(elem)[property].split('p')[0] || 0;
        let unit = aim.split(/[0-9\s]+/)[1];
        let destination = aim.split(/[a-zA-Z\s]+/)[0];

        if ( destination > 0 && start > 0 ) {
            if ( (destination-start) > 0 ) {
                end = destination;
                direction = -1;
            } else {
                end = start;
                direction = 1;
            }
        } else {
            end = destination-start;
            direction = -1;
        }
        const runAnimation = ( timestamp ) => {
            let runTime = timestamp-startTime;
            let progress = runTime/duration;
            progress = Math.min(1,progress);

            elem.style[property] = (start - (progress*end).toFixed(2)*direction) + unit;
            if ( runTime < duration )
                window.requestAnimationFrame(runAnimation);
            else complete();
        };
        //run animaiton
        window.requestAnimationFrame( ( timestamp ) => {
            startTime = timestamp;
            runAnimation(timestamp);
        });
    };

    init();
};
