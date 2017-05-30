/**
 * Created by patev on 31.01.2017.
 */
Object.prototype.calc  = function() {
  "use strict";
  let self = {};
  self.e = this;
  self.containerButtons = self.e.querySelector(".buttons");
  let nodeList = self.containerButtons.querySelectorAll("button");
  self.buttons = [].slice.call(nodeList); //convert into array
  self.operations = self.e.querySelector(".operations");
  self.calcInput = self.e.querySelector(".calc-input");

  self.memoryCont = self.e.querySelector(".memory-calc");
  self.memoryValues = new Set();
  self.whatCount = "";
  self.amountOperations = 0;
  self.isResult = false;

  self.signOperations = {
    add: "+",
    substract: "-",
    multiply: "x",
    divide: "/",
    sqrt: "√"
  };

  self.init = () => {
    self.triggerButtons();
    self.memoryInit();
  };
  self.getInputVal  = () => {
    return parseFloat(self.calcInput.value);
  };
  self.getInputValAsString = () => {
    return self.calcInput.value.toString();
  };
  self.setInputVal = (val) => {
    if (val.toString().length > 8 && self.isFloat(val)) {
      val = val.toPrecision(8);
    }
    self.calcInput.value  =  val;
  };
  self.triggerButtons = () => {
    self.buttons = [].slice.call(self.buttons);
    for(var elem of self.buttons) {
      elem.addEventListener("click",self.buttonClick,false);
      if(elem.querySelector("img")) {
        elem.querySelector("img").removeEventListener("click",self.buttonClick,false);
      }
    }
  };
  self.buttonClick = (evt) => {
    let value = evt.target.dataset.val;
    if (self.isResult) {
      let currentVal = self.getInputVal();
      let conditon = Number.isFinite(currentVal) && (Number.isSafeInteger(currentVal) || self.isFloat(currentVal));
      if (!conditon) {
        self.setInputVal(0);
      }
      self.clearOperations();
    }

    switch (value) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        self.clearLastResult();
        self.addNumberToInput(value); break;
      case "dot":
        self.clearLastResult();
        self.addDotToInput(); break;
      case "change_sign":
        self.clearLastResult();
        self.changeSignValueInput(); break;
      case "backspace":
        self.removeFirstChar(); break;
      case "c":
        self.clearInput(); break;
      case "ce":
        self.clearCalc(); break;
      case "multiply":
        self.saveOperation(self.signOperations.multiply); break;
      case "divide":
        self.saveOperation(self.signOperations.divide); break;
      case "add":
        self.saveOperation(self.signOperations.add); break;
      case "substract":
        self.saveOperation(self.signOperations.substract); break;
      case "sqrt":
        self.sqrtOperation(); break;
      case "pow2":
        self.valueSquared(); break; //value power to 2
      case "equality":
        self.countOperation(); break;
      case "show_memory":
        self.showMemory(); break;
      case "add_memory":
        self.addCellToMemory();
      default:

    }
  };
  self.addNumberToInput = (val) => {
    let valOfInput = self.getInputValAsString();
    let lenInput = valOfInput.length;
    if (lenInput == 1 && valOfInput == 0) {
      self.setInputVal(val);
    } else if (lenInput > 8) {
      return false;
    } else {
      self.setInputVal(valOfInput+ val);
    }

  };
  self.addDotToInput = () => {
    if(!/\./.test(self.getInputVal())) {
      self.setInputVal(self.getInputVal() + ".");
    }
  };
  self.changeSignValueInput = () => {
    self.setInputVal(self.getInputVal()*-1);
  };
  self.clearInput = () => {
    self.setInputVal(0);
  };
  self.removeFirstChar = () => {
    let valOfInput = self.getInputValAsString();
    let lenInput = valOfInput.length;
    if(lenInput > 1) {
      self.setInputVal(valOfInput.substring(0,lenInput-1));
      if(self.getInputValAsString() == "-") {
        self.setInputVal(0);
      }
    } else {
      self.setInputVal(0);
    }
  };
  self.clearOperations = () => {
    self.operations.innerHTML = "";
    self.whatCount = "";
    self.amountOperations = 0;
  };
  self.clearCalc = () => {
    self.setInputVal(0);
    self.clearOperations();
  };
  self.clearLastResult = () => {
    if (self.isResult) {
      self.clearCalc();
      self.isResult = false;
    }
  };
  self.saveOperation = (sign) => {
    self.amountOperations++;
    self.isResult = false;
    if (sign == "") {
      self.whatCount += self.getInputVal();
    } else {
      self.whatCount += self.getInputVal() + " " + sign + " ";
    }
    self.operations.innerHTML = self.whatCount;
    self.setInputVal(0);
  };
  self.countOperation = () => {
    self.saveOperation("");// func
    self.isResult = true;

    let singleOperations = self.whatCount.split(" ");
    do {//multiply and divide
      let multiplyPos = singleOperations.indexOf(self.signOperations.multiply);
      let dividePos = singleOperations.indexOf(self.signOperations.divide);
      if ((multiplyPos > dividePos || multiplyPos == -1) && dividePos != -1) {//divide
          singleOperations = self.countOperationHelp(singleOperations,dividePos,"/");
      } else if ((dividePos > multiplyPos || dividePos == -1) && multiplyPos != -1) {//multiply
          singleOperations = self.countOperationHelp(singleOperations,multiplyPos,"x");
      } else {
          self.amountOperations++;// because no operation was done
          break;
      }
    } while(self.amountOperations--);

    do {//add and substract
      let substractPos = singleOperations.indexOf(self.signOperations.substract);
      let addPos = singleOperations.indexOf(self.signOperations.add);
        if ((addPos > substractPos || addPos == -1) && substractPos != -1) {// substract
            singleOperations = self.countOperationHelp(singleOperations,substractPos,"-");
        } else if ((substractPos > addPos || substractPos == -1) && addPos != -1) {// add
            singleOperations = self.countOperationHelp(singleOperations,addPos,"+");
        } else {
            break;
        }
      } while(self.amountOperations--);

      self.setInputVal(self.isCorrectResult(singleOperations[0]));
  };
  self.countOperationHelp = (singleOperations,pos,sign) => {
    let [tempArray,tempPos] = [[],0];
    let [sOperPrev, sOperNext] = [parseFloat(singleOperations[pos-1]),parseFloat(singleOperations[pos+1])];
    switch (sign) {
      case "x": singleOperations[pos+1] = sOperPrev * sOperNext; break;
      case "/": singleOperations[pos+1] = sOperPrev / sOperNext; break;
      case "+": singleOperations[pos+1] = sOperPrev + sOperNext; break;
      case "-": singleOperations[pos+1] = sOperPrev - sOperNext; break;
    }
    tempPos = (pos-2)<0?0:pos-1;
    tempArray = tempArray.concat(singleOperations.slice(0,tempPos));
    tempArray = tempArray.concat(singleOperations.slice(pos+1));

    return tempArray;
  };
  self.sqrtOperation = () => {
    let val = self.getInputVal();
    val = Math.sqrt(val);
    self.setInputVal(self.isCorrectResult(val));
  };
  self.valueSquared = () => {
    let val = self.getInputVal();
    val = Math.pow(val,2);
    self.setInputVal(self.isCorrectResult(val));
  };
  self.isCorrectResult = (value) => {
    if(isNaN(value) || !isFinite(value)) {
      self.isResult = true; // reset the value
      return "error";
    }
    return value;
  };
  self.isFloat = (n) => {
    return n === +n && n !== (n|0);
    // Unary operator +,-. It means it convert variable to number (but "-" also negative its);
  };
  /** Memory things **/
  self.memoryInit = () => {
    let closeMemoryBtn = self.memoryCont.querySelector(".close-memory-calc");
    closeMemoryBtn.addEventListener("click",self.hideMemory,false);
  };
  self.showMemory = () => {
    self.memoryCont.classList.add("show-elem");
  };
  self.hideMemory = () => {
    self.memoryCont.classList.remove("show-elem");
  };
  self.addCellToMemory = () => {
    let inputVal = self.getInputVal();
    if(self.memoryValues.has(inputVal)) { //Does not add same values
      return true;
    }
    self.memoryValues.add(inputVal);

    let cell = document.createElement("P"),
        memoryResult = document.createElement("SPAN"),
        removeSingleCell = document.createElement("SPAN"),
        valNode = document.createTextNode(inputVal),
        closeTextNode = document.createTextNode("x");

    cell.dataset.value = inputVal;
    cell.classList.add("single-cell");
    cell.addEventListener("click",self.loadMemoryIntoInput,false);

    memoryResult.classList.add("memory-result");
    memoryResult.appendChild(valNode);

    removeSingleCell.classList.add("remove-single-cell");
    removeSingleCell.appendChild(closeTextNode);
    removeSingleCell.addEventListener("click",self.removeSingleCell,false);// trigger

    cell.appendChild(memoryResult);
    cell.appendChild(removeSingleCell);

    self.memoryCont.appendChild(cell);
  };
  self.removeSingleCell = (evt) => {
    let parent = evt.target.parentNode,
        val = parent.dataset.value;
    self.memoryValues.delete(+val); //parse into number
    parent.remove();
  };
  self.loadMemoryIntoInput = (evt) => {
    let elemName = evt.target.nodeName;
    let value = 0;
    if (elemName.toLowerCase() == "p") {
      value = evt.target.dataset.value;
    } else if(elemName.toLowerCase() == "span") {
      let parent = evt.target.parentNode;
      value = parent.dataset.value;
    }
    self.setInputVal(value);
    self.hideMemory();
  };

  return self.init();
};

var calc = document.querySelector("#calc");
calc.calc();
