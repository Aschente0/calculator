export default class Calculator {
  // queue based representation of current state of the expression; simplified by resolving the expression as much as possible
  state: string[];

  constructor(){ 
    this.state = [];
  }

  /*
    Method that takes in an input string that represents a series of button presses.
    Simplifies the expression by resolving left-to-right as much as possible, and stores the result as a state.
    Returns the value to be displayed in the current state.
  */
  resolve(input: string) {
    const elements = this._parseInputString(input);

    // queue the elements into the state
    this.state.push(...elements)

    // simplify the state by resolving as much as possible; simplifying is only done when >3 element exist (i.e. >1 operators)
    while (this.state.length > 3) {
      const [operand1, operator, operand2] = this.state.splice(0, 3);
      const num1 = parseFloat(operand1);
      const num2 = parseFloat(operand2);
      switch(operator) {
        case "+":
          this.state.unshift((num1 + num2).toString());
          break;
        case "-":
          this.state.unshift((num1 - num2).toString());
          break;
        case "*":
          this.state.unshift((num1 * num2).toString());
          break;
        case "/":
          this.state.unshift((num1 / num2).toString());
          break;
      }
    }
    // after simplification, we are left with <=3 elements; weed out the "equal" operator to clean up state for subsequent inputs
    if (this.state.slice(1)[0] === "=") {
      this.state.splice(1, 1);
    }
    return this._getDisplayValue();
  }

  /*
    Internal helper method to parse the input string into an array of operators and operands, with unary operators applied to the operands.
    Truncates operations up to and including the last reset operator.
  */
  _parseInputString(input: string) {
    // split input into array, where each element is either an operator or an operand
    // citation for constructing regex: https://medium.com/@shemar.gordon32/how-to-split-and-keep-the-delimiter-s-d433fb697c65
    let elements = input.split(/(?=[\+\-\*\/\=c])|(?<=[\+\-\*\/\=])/);

    // we can discard all elements up to and including the last "c" operator
    const resetElementIndex = elements.lastIndexOf("c")
    if (resetElementIndex !== -1) {
      elements.splice(0, resetElementIndex + 1);
      this.state = []; // if "c" operator is found, reset state
    }

    // there may be unary operators stuck to operands; apply them to the operands
    elements = elements.map(element => {
      if (element.slice(-1)[0] === "!") return `-${element.slice(0, -1)}` // case: negative unary operator
      return element // case: no unary operator
    })
    return elements;
  }

  /* Internal helper method to get the current display value. */
  _getDisplayValue(){
    // determine what number is read from the simplified state; this is based on the last 2 elements of the state.
    // if a number is read, return the number.
    const lastElement = this.state.slice(-1)[0];
    if (!lastElement) { return 0 }
    else if (!isNaN(parseFloat(lastElement))) {
      return parseFloat(lastElement)
    }
    // if an operator is read, then return the operand before it.
    return parseFloat(this.state.slice(-2)[0])
  }
}