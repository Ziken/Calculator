var Calculator = function (elem) {
  "use strict";
  let self = {};
  self.e = elem;
  self.containerButtons = self.e.querySelector(".buttons");
  let nodeList = self.containerButtons.querySelectorAll("button");
  self.buttons = [].slice.call(nodeList); //convert into array
  self.operations = self.e.querySelector(".operations");
  self.calcInput = self.e.querySelector(".calc-input");
  self.arrowLeft = self.e.querySelector(".arrow-left");
  self.arrowRight = self.e.querySelector(".arrow-right");
  self.movingOperationArrows = true;

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
    self.keyboardInit();

    self.arrowLeft.addEventListener("click",self.moveOperationsBlockLeft,false);
    self.arrowRight.addEventListener("click",self.moveOperationsBlockRight,false);

    self.e.querySelector(".calculations").addEventListener("click",function(){
	     self.calcInput.focus();
  },false);
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
    let action = evt.target.dataset.val || 0;
    self.actionCalc(action);
  }
  self.actionCalc = (action) => {
    //let value = evt.target.dataset.val;
    if (self.isResult) {
      let currentVal = self.getInputVal();
      let condition = Number.isFinite(currentVal) && (Number.isSafeInteger(currentVal) || self.isFloat(currentVal));
      if (!condition) {
        self.setInputVal(0);
      }
      self.clearOperations();
    }
    switch (action) {
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
        self.addNumberToInput(action); break;
      case "dot":
        self.clearLastResult();
        self.addDotToInput(); break;
      case "change_sign":
        self.clearLastResult();
        self.changeSignValueInput(); break;
      case "backspace":
        self.removeFirstChar(); break;
      case "ce":
        self.clearInput(); break;
      case "c":
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
        return true;
    }
  };
  self.addNumberToInput = (val) => {
    let valOfInput = self.getInputValAsString();
    let lenInput = valOfInput.length;
    if (lenInput == 1 && valOfInput == 0) {//if input of calculator is empty (is only 0)
      self.setInputVal(val);
    } else if (lenInput > 8) {//limit of digits
      return true;
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
    self.operations.style.left = 0;
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
      case self.signOperations.multiply: singleOperations[pos+1] = sOperPrev * sOperNext; break;
      case self.signOperations.divide: singleOperations[pos+1] = sOperPrev / sOperNext; break;
      case self.signOperations.add: singleOperations[pos+1] = sOperPrev + sOperNext; break;
      case self.signOperations.substract: singleOperations[pos+1] = sOperPrev - sOperNext; break;
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
  };

  self.moveOperationsBlockLeft = () => {
    if(!self.movingOperationArrows) return true;
    let widthOfBlock = +window.getComputedStyle(self.operations).width.split("px")[0] || 0;
    let leftStyle = +window.getComputedStyle(self.operations).left.split("px")[0] || 0;
    let offsetLeft = 0;
    let a = widthOfBlock%240;

    if( (widthOfBlock-a) == leftStyle) offsetLeft = leftStyle + a;
    else offsetLeft = leftStyle+240;

    if(offsetLeft <= 0) {
      self.movingOperationArrows = false;
      self.animate(self.operations, "left", offsetLeft + "px", 300,function(){self.movingOperationArrows=true;});
    }


  }
  self.moveOperationsBlockRight = () => {
    if(!self.movingOperationArrows) return true;
    let widthOfBlock = +window.getComputedStyle(self.operations).width.split("px")[0] || 0;
    let leftStyle = +window.getComputedStyle(self.operations).left.split("px")[0] || 0;
    let offsetLeft = 0;
    let a = widthOfBlock%240;

    if( (widthOfBlock-a) == leftStyle) offsetLeft = leftStyle + a;
    else offsetLeft = leftStyle-240;

    if(widthOfBlock>285 && -1*offsetLeft <= widthOfBlock) {
      self.movingOperationArrows=false;
      self.animate(self.operations, "left", offsetLeft + "px", 300,function(){self.movingOperationArrows=true;});
    }

  }
  self.animate =  (elem,property, aim, duration=1000,complete=function(){} ) => {
    let startTime, direction, end;
    let start = +window.getComputedStyle(elem)[property].split("px")[0] || 0;
    let unit = aim.split(/[0-9\s]+/)[1];
    let destination = aim.split(/[a-zA-Z\s]+/)[0];

    if(destination > 0 && start>0)
    {
      if ( (destination-start) > 0) {
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
    let animate_h = (timestamp) => {
      let runTime = timestamp-startTime;
      let progress = runTime/duration;
      progress = Math.min(1,progress);

      elem.style[property] = (start - (progress*end).toFixed(2)*direction) + unit;
      if(runTime < duration)
        window.requestAnimationFrame(animate_h);
      else complete();
    };

    window.requestAnimationFrame((timestamp) => {
      startTime = timestamp;
      animate_h(timestamp)
    });
  }
  /** Memory things **/
  self.memoryInit = () => {
    let closeMemoryBtn = self.memoryCont.querySelector(".close-memory-calc");
    closeMemoryBtn.addEventListener("click",self.hideMemory,false);
    self.memoryCont.addEventListener("click",function(){
    	self.calcInput.focus();
    },false);
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

  /** keyboard things */
  self.keyboardInit = () => {
    self.e.addEventListener("keydown",self.keyboardListener,false);
  }
  self.keyboardListener = (evt) => {
    let keyId = evt.keyCode;
    switch (keyId) {
      case 8://backspace
        self.actionCalc("backspace"); break;
      case 13://enter
        self.actionCalc("equality"); break;
      case 27://esc
        self.actionCalc("c"); break;
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
        self.actionCalc(""+(keyId%48)); break;
      case 106:
        self.actionCalc("multiply"); break;
      case 107:
        self.actionCalc("add"); break;
      case 109:
        self.actionCalc("substract"); break;
      case 110:
        self.addDotToInput(); break;
      case 111:
        self.actionCalc("divide"); break;
      case 190:
        self.addDotToInput(); break;
      default:
        return true;
    }
  }
  return self.init();
};

var elem = document.querySelector("#calc");
let calc = new Calculator(elem);
