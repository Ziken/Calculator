/**
 * Enable physical keyboard and this virtual one on the screen
 * @param {Object} calcElement DOM element of calculator
 * @param {Object} sendActionTo function which gets action of keyboard
*/
const Keyboard = function ( calcElement ) {
    'use strict';
    const containerButtons  =    calcElement.querySelector('.buttons');
    const buttons           =    Array.from(containerButtons.querySelectorAll('button'));
    let sendActionTo        =    ()=>{};

    const init = () => {
        triggerVirtualButtons();
        triggerPhysicalButtons();
    };
    const triggerPhysicalButtons = () => {
        calcElement.addEventListener('keydown',physicalKeyboardListener,false);
    };
    const triggerVirtualButtons = () => {
        buttons.forEach( ( btn ) => {
            btn.addEventListener('click', virtualKeyboardListener, false);
            const img = btn.querySelector('img');
            if ( img !== null ) {
                img.removeEventListener('click', virtualKeyboardListener, false);
            }//if
        });
    };

    const physicalKeyboardListener = ( evt ) => {
        const keyId = evt.keyCode || 0;
        let action = '';
        switch ( keyId ) {
            case 8: //backspace
                action = 'backspace';
                break;
            case 13: //enter
                action = 'equality';
                break;
            case 27: //ESC
                action = 'c';
                break;
            // numbers and nums
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 96:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
                action = (keyId%48).toString();
                break;
            case 106:
                action = 'multiply';
                break;
            case 107:
                action = 'add';
                break;
            case 109:
                action = 'substract';
                break;
            case 110:
                action = 'dot';
                break;
            case 111:
                action = 'divide';
                break;
            case 190:
                action = 'dot';
                break;
            default:
                action = '';
        }
        sendActionTo(action);
    };
    const virtualKeyboardListener = (evt) => {
        const action = evt.target.dataset.val || '';
        sendActionTo(action);
    };
    const setActionListener = ( func ) => {
        sendActionTo = func;
    };

    init();
    return {
        setActionListener
    };
};
