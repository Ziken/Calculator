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
    * Public method, calculate result form array of operations
    * @param {Array} operations simple operations saved in array
    * @return {Number} result of operation
    */
    const calculateResult = (operations = []) => {
        const singleOperations = [...operations];

        return safeResult( getIntoParentheses(singleOperations)[0] );
    };
    /**
    * Compute operations contains parentheses
    * @param {Array} ArrOfOperations split array like [1,+,2,...]
    * @return array of one element -> result
    */
    const getIntoParentheses = ( ArrOfOperations ) => {
        let arr = [...ArrOfOperations];
        const arrOpenP = [];
        //no parenthesis
        if ( arr.indexOf('(') == -1 ) return orderOfOperations(arr);

        for ( let i = 0; i < arr.length; i++ ) {
            let currentChar = arr[i];
            if (currentChar == '(') {
                arrOpenP.push(i);
            } else if (currentChar == ')') {
                let lastOpenP = arrOpenP.pop();
                let r = orderOfOperations(arr.slice(lastOpenP+1,i) )[0];
                arr[lastOpenP] = r;

                arr = arr.filter((v,index) => {
                    if (index > lastOpenP && index <=i ) return false;
                    return true;
                });
                i = lastOpenP;
            }
        }
        //no parenthesis, just do simple operations
        if ( arr.length > 1 ) return orderOfOperations(arr);

        return arr;
    };
    /**
    * Compute operations which don't contain parentheses
    * @param {Array} arr split array like [1,+,2,...] which doesn't contain parentheses
    * @return result of these operations
    */
    const orderOfOperations = (arr) => {
        let singleOperations = [...arr];
        //first do division and multiplication
        singleOperations = templateForMakingOperations(singleOperations,SIGNS.multi,SIGNS.div);
        //then addition and substraction
        singleOperations = templateForMakingOperations(singleOperations,SIGNS.add,SIGNS.sub);
        return singleOperations;
    };
    /**
    * Compute simple operations and remove it form array.
      sign1 and sign2 is either addition, subtraction or division, multiplication
    * @param {Array}  arr array of operations like [1,'+',2,...]
    * @param {String} sign1 first operation sign like '+'
    * @param {String} sign1 second operation sign like '-'
    */
    const templateForMakingOperations = (arr, sign1, sign2) => {

        let sign1Pos = 0;
        let sign2Pos = 0;
        let arrOfOperations = [...arr];
        //divison and multiplication or addition and subtraction
        while ( true ) {
            sign1Pos = arrOfOperations.indexOf(sign1, sign1Pos);
            sign2Pos = arrOfOperations.indexOf(sign2, sign2Pos);
            // what is first
            if ( sign1Pos == -1 && sign2Pos == -1 ) {
                // no operations with these signs eg. division and multiplication
                // remove empty fields
                arrOfOperations = arrOfOperations.filter(v => v===''?false:true);
                break;
            } else if ( sign1Pos < sign2Pos && sign1Pos != -1 || sign2Pos == -1 ) {
                //sign1 first eg. division
                arrOfOperations = computeSimpleOperation(arrOfOperations,sign1Pos);
            } else if ( sign2Pos < sign1Pos && sign2Pos != -1 || sign1Pos == -1 ) {
                //sign2 first eg. multiplication
                arrOfOperations = computeSimpleOperation(arrOfOperations,sign2Pos);
            }
        }
        return arrOfOperations;
    };
    /**
    * Calculate single operation eg. 1 + 2
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
    const safeResult = ( r = 0 ) => {
        if (
            Number.isFinite(r) &&
            Math.abs(r) <= Number.MAX_SAFE_INTEGER &&
            !Number.isNaN(r)
        ) {
            return r;
        } else {
            return 'error';
        }
    };

    return {
        calculateResult
    };
};
