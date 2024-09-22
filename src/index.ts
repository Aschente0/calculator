import inquirer from 'inquirer';
import Calculator from "./calculator/index";

// singleton creation of calculator object
const calculator = new Calculator();


/*
  Handler responsible for execution of the interactive CLI
*/
const main = async (): Promise<any> => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "process",
        message: "Series of button presses:"
      }
    ])
    .then((input: { process: string }) => {
      if (input["process"] === "q") return;
      const value = calculator.resolve(input.process);
      console.log(value);
      return main();
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment")
        return;
      } else {
        // Something else went wrong
        console.log(error)
        return;
      }
    });
}

main();