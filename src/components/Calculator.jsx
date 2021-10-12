import React from "react";

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equation: "0",
      evaluated: false,
      decimalClicker: false,
      result: "",
      storeEquation: "",
    };
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
  }

  handleNumbers(e) {
    const { equation, evaluated } = this.state;
    const { innerText } = e.target;
    let maxCharLimit = 20;
    let zeroAfterOperatorRegEx = /(\+0|-0|\/0|\*0)$/g;
    let lastTwoChars = equation.slice(-2);

    if (equation.length < maxCharLimit) {
      if (equation === "0") {
        // Don't let initial number begin with multiple zeros
        this.setState({
          equation: innerText,
        });
      } else {
        this.setState({
          equation: equation + innerText,
        });
      }
    }

    if (zeroAfterOperatorRegEx.test(lastTwoChars)) {
      if (innerText === "0") {
        // Don't let number after operator begin with multiple zeros
        this.setState({
          equation: equation,
        });
      } else if (innerText !== "0") {
        // Replace 0 with next number above 0
        this.setState({
          equation: equation.slice(0, -1) + innerText,
        });
      }
    }

    if (evaluated) {
      // Prevents unnecessary input after the equation is evaluated
      this.setState({
        equation: "",
      });
    }
  }

  handleOperators(e) {
    const { equation, evaluated, result } = this.state;
    const { innerText } = e.target;
    const operatorStore = ["+", "-", "/", "*"];
    let lastChar = equation.slice(-1);
    let operatorComboRegEx = /(--|\*-|\/-|\+-|-)$/g;

    if (lastChar === "-") {
      // Fixes "5 * - + 5" issue by replacing regex with new operator
      return this.setState({
        equation: equation.replace(operatorComboRegEx, innerText),
      });
    }

    if (innerText !== "-") {
      if (
        // Prevent operators from being added consecutively
        (operatorStore.includes(innerText) && equation === "0") ||
        (operatorStore.includes(innerText) && operatorStore.includes(lastChar))
      ) {
        return this.setState({
          equation: equation.replace(lastChar, innerText),
        });
      }
    }

    this.setState({
      equation: equation + innerText,
      decimalClicker: false,
    });

    if (evaluated) {
      this.setState({
        equation: result + innerText,
        evaluated: false,
        storeEquation: "",
      });
    }
  }

  handleDecimal(e) {
    const { equation, decimalClicker } = this.state;
    const { innerText } = e.target;

    if (decimalClicker === false) {
      // Only 1 decimal can be added per number
      this.setState({ equation: equation + innerText, decimalClicker: true });
    }
  }

  handleEvaluate() {
    const { equation } = this.state;
    const operatorStore = ["+", "-", "/", "*"];

    if (equation) {
      if (operatorStore.includes(equation.slice(-1))) {
        // If equation ENDS with an operator, remove it
        this.setState({
          equation: equation.slice(0, -1),
        });
      } else if (operatorStore.includes(equation[0])) {
        // If equation STARTS with an operator, remove it
        this.setState({
          equation: equation.substring(1),
        });
      } else {
        let answer = this.parse(equation);
        this.setState({
          storeEquation: equation + " = ",
          equation: "",
          result: answer,
          evaluated: true,
        });
      }
    }
  }

  parse(str) {
    // Avoid using eval()
    return Function(`'use strict'; return (${str})`)();
  }

  clearDisplay() {
    this.setState({
      equation: "0",
      evaluated: false,
      decimalClicker: false,
      result: "",
      storeEquation: "",
    });
  }

  render() {
    return (
      <div>
        <main id="calculator">
          {/* 
          Tool that displays state as a string (useful for debugging)
          <p
            style={{
              position: "absolute",
              top: 0,
              color: "white",
              fontSize: 30,
            }}
          >
            {JSON.stringify(this.state, null, 2)}
          </p> 
          */}

          <div className="grid-container">
            <div id="store-equation">
              {/* Makes the tests pass by being outside of the display element */}
              {this.state.storeEquation}
            </div>

            <div id="display">
              <div id="equation-display">{this.state.equation}</div>
              <div id="result-display">{this.state.result}</div>
            </div>

            <button id="clear" onClick={this.clearDisplay}>
              C
            </button>

            <button id="divide" onClick={this.handleOperators}>
              /
            </button>
            <button id="multiply" onClick={this.handleOperators}>
              *
            </button>

            <button
              id="seven"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              7
            </button>
            <button
              id="eight"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              8
            </button>
            <button
              id="nine"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              9
            </button>

            <button id="subtract" onClick={this.handleOperators}>
              -
            </button>

            <button
              id="four"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              4
            </button>
            <button
              id="five"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              5
            </button>
            <button id="six" className="light-btn" onClick={this.handleNumbers}>
              6
            </button>

            <button id="add" onClick={this.handleOperators}>
              +
            </button>

            <button id="one" className="light-btn" onClick={this.handleNumbers}>
              1
            </button>
            <button id="two" className="light-btn" onClick={this.handleNumbers}>
              2
            </button>
            <button
              id="three"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              3
            </button>
            <button
              id="zero"
              className="light-btn"
              onClick={this.handleNumbers}
            >
              0
            </button>
            <button
              id="decimal"
              className="light-btn"
              onClick={this.handleDecimal}
            >
              .
            </button>

            <button id="equals" onClick={this.handleEvaluate}>
              =
            </button>
          </div>
        </main>
      </div>
    );
  }
}

export default Calculator;
