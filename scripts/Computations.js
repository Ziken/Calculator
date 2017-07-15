/**
 * Compute result form string like eval
*/
const Computations = function () {
    'use strict';
    const SIGNS = { //operations signs
        multi: '*', // multiplication
        div: '/',   // division
        add: '+',   // addition
        sub: '-'    // subtraction
    };
    /**
    * Calculate result form string
    * @param {String} operations simple operations saved in string
    */
    const calculateResult = (operations = '') => {
        let singleOperations = operations.split(' ');
        //compute multiplication and division
        singleOperations = orderOfOperations(singleOperations,SIGNS.multi,SIGNS.div);
        //compute addition and substraction
        singleOperations = orderOfOperations(singleOperations,SIGNS.add,SIGNS.sub);

        return singleOperations[0];
    };

    /**


    */
    /**
    * Compute simple operations and remove it form array. sign1 and sign2 is either addition, subtraction or division, multiplication
    * @param {Array}  arr array of operations like [1,'+',2,...]
    * @param {String} sign1 first operation sign
    * @param {String} sign1 second operation sign
    */
    let orderOfOperations = (arr, sign1, sign2) => {
        let sign1Pos = 0;
        let sign2Pos = 0;
        let arrOfOperations = [...arr];
        //divison and multiplication or addition and subtraction
        while ( true ) {
            sign1Pos = arrOfOperations.indexOf(sign1, sign1Pos);
            sign2Pos = arrOfOperations.indexOf(sign2, sign2Pos);

            // what is first
            if ( sign1Pos > sign2Pos && sign2Pos == -1 ) {
                //sign1 first eg. division
                arrOfOperations = computeSimpleOperation(arrOfOperations,sign1Pos);
            } else if (sign2Pos > sign1Pos && sign1Pos == -1 ) {
                //sign2 first eg. multiplication
                arrOfOperations = computeSimpleOperation(arrOfOperations,sign2Pos);
            } else {
                // no operations with these signs eg. division and multiplication
                // remove empty fields
                arrOfOperations = arrOfOperations.filter(v => v);
                break;
            }
        }
        return arrOfOperations;
    };
    /**
    * Calculate single operation
    * @param {Array}  arrOfOperations array of operations like [1,'+',2,...]
    * @param {Number} pos position of sign
    */
    const computeSimpleOperation = ( arrOfOperations, pos ) => {
        let cpArr = [...arrOfOperations];
        let sign  = arrOfOperations[pos];

        let result = 0;
        switch ( sign ) {
            case SIGNS.multi: {
                result = +cpArr[pos-1] * (+cpArr[pos+1]);
                break;
            }
            case SIGNS.div: {
                result = +cpArr[pos-1] / (+cpArr[pos+1]);
                break;
            }
            case SIGNS.add: {
                result = +cpArr[pos-1] + (+cpArr[pos+1]);
                break;
            }
            case SIGNS.sub: {
                result = +cpArr[pos-1] - (+cpArr[pos+1]);
                break;
            }
            default: {
                //do nothing
            }
        }
        cpArr[pos-1] = '';
        cpArr[pos]   = '';
        cpArr[pos+1] = result;
        return cpArr;
    };

    return {
        calculateResult
    };
};
