
const MemoryCalculator = function ( calcElement ) {
    'use strict';
    const memoryCont = calcElement.querySelector('.memory-calc');
    const valuesInMemory = new Set();

    const init = () => {
        let closeMemoryBtn = memoryCont.querySelector('.close-memory-calc');
        closeMemoryBtn.addEventListener('click',hideMemoryCont,false);

        memoryCont.addEventListener('click',function(){ //FIXME how to handle with calc input
            //calcInput.focus();
        },false); //after close memory container, focus on input
    };
    /**
    * public funciton
    */
    const showMemoryCont = () => {
        memoryCont.classList.add('show-elem');
    };

    const hideMemoryCont = () => {
        memoryCont.classList.remove('show-elem');
    };
    /**
    * Public funciton
    */
    const addCellToMemory = ( val = 0 ) => {
        //if ( val == '' ) return false;
        const inputVal = val;
        if ( valuesInMemory.has(inputVal) ) { // terminate executing function
            return true;
        }
        valuesInMemory.add(inputVal);

        const cell              = document.createElement('P');
        const resultSpan    = document.createElement('SPAN');
        const removeCellSpan         = document.querySelector('SPAN');
        const resultNode        = document.createTextNode(inputVal);
        const closeTextNode     = document.createTextNode('x');

        cell.dataset.value = inputVal;
        cell.classList.add('single-cell');
        cell.setAttribute('tabindex', 0);
        cell.addEventListener('click', loadMemoryIntoInput, false);

        resultSpan.classList.add('memory-result');
        resultSpan.appendChild(resultNode);

        removeCellSpan.classList.add('remove-single-cell');
        removeCellSpan.appendChild(closeTextNode);
        removeCellSpan.addEventListener('click', removeSingleCell, false);

        cell.appendChild(resultSpan);
        cell.appendChild(removeCellSpan);
        memoryCont.appendChild(cell);
    };

    const removeSingleCell = ( evt ) => {
        const parent = evt.target.parentNode;
        const val = parent.dataset.value;
        valuesInMemory.delete(+val); //parse into number
        parent.remove();
    };
    const loadMemoryIntoInput = (evt) => {
        const elemName = evt.target.nodeName;
        let value = 0;
        if (elemName.toLowerCase() == 'p') { // click on text
            value = evt.target.dataset.value;
        } else if(elemName.toLowerCase() == 'span') { // click on cell
            const parent = evt.target.parentNode;
            value = parent.dataset.value;
        }
        //setInputVal(value); //FIXME add function to add val
        hideMemoryCont();
    };

    init();
    return {
        addCellToMemory,
        showMemoryCont
    };
};
