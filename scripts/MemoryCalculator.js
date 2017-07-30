/**
 * Enable save numbers in memory
*/
const MemoryCalculator = function ( calcElement ) {
    'use strict';
    const memoryCont     =  calcElement.querySelector('.memory-calc');
    const valuesInMemory =  new Set();
    const closeMemoryBtn =  memoryCont.querySelector('.close-memory-calc');

    let setValue;
    let stopExecuting = false; // Stop executing superior(parent) triggered event

    const init = () => {
        closeMemoryBtn.addEventListener('click', hideMemoryCont, false);
        closeMemoryBtn.addEventListener('keydown', hideMemoryCont, false); // enable using keyboard
    };
    const setValueMethod = ( method ) => {
        setValue = method;
    };
    /**
    * public funciton
    */
    const showMemoryCont = () => {
        memoryCont.classList.add('show-elem');
        closeMemoryBtn.focus();
    };

    const hideMemoryCont = ( evt = {} ) => {
        if ( !isEnterKey(evt) ) return false;
        memoryCont.classList.remove('show-elem');
        calcElement.click();
    };
    const isEnterKey = ( evt ) => {
        const key = evt.keyCode;
        if ( key == undefined ) { // there is no keyboard event
            return true
        } else {
            if ( key === 13 )
                return true;
        }
        return false;
    };
    /**
     * Public funciton, create memory cell
     * @param {Number} val add this value to momoery
    */
    const addCellToMemory = ( val = 0 ) => {
        const inputVal = val;
        if ( valuesInMemory.has(inputVal) ) { // terminate executing function
            return true;
        }
        valuesInMemory.add(inputVal);

        const cell              = document.createElement('P');
        const resultSpan        = document.createElement('SPAN');
        const removeCellSpan    = document.createElement('SPAN');
        const resultNode        = document.createTextNode(inputVal);
        const closeTextNode     = document.createTextNode('x');

        cell.dataset.value = inputVal;
        cell.classList.add('single-cell');
        cell.setAttribute('tabindex', 0);
        cell.addEventListener('click', loadMemoryIntoInput, false);
        cell.addEventListener('keypress', loadMemoryIntoInput, false);// catch enter key

        resultSpan.classList.add('memory-result');
        resultSpan.appendChild(resultNode);

        removeCellSpan.classList.add('remove-single-cell');
        removeCellSpan.setAttribute('tabindex', 0);
        removeCellSpan.appendChild(closeTextNode);
        removeCellSpan.addEventListener('click', removeSingleCell, false);
        removeCellSpan.addEventListener('keypress', removeSingleCell, false);// catch enter key

        cell.appendChild(resultSpan);
        cell.appendChild(removeCellSpan);
        memoryCont.appendChild(cell);
    };

    const removeSingleCell = ( evt ) => {
        const parent = evt.target.parentNode;
        const val = parent.dataset.value;
        valuesInMemory.delete(+val); //parse into number and delete it
        parent.remove();
        closeMemoryBtn.focus();
        stopExecuting = true;
    };
    const loadMemoryIntoInput = ( evt ) => {
        if ( stopExecuting ) {
            stopExecuting = false;
            return true;
        }
        if ( !isEnterKey(evt) ) return true;

        const elemName = evt.target.nodeName;
        let value = 0;
        if (elemName.toLowerCase() == 'p') { // click on text
            value = evt.target.dataset.value;
        } else if(elemName.toLowerCase() == 'span') { // click on cell
            const parent = evt.target.parentNode;
            value = parent.dataset.value;
        }
        setValue(value);
        hideMemoryCont();
    };

    init();
    return {
        addCellToMemory,
        showMemoryCont,
        setValueMethod
    };
};
