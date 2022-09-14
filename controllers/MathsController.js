const path = require("path");
const fs = require("fs");
const MathsModel = require("../models/math");
const Repository = require("../models/repository");
const { count } = require("console");
module.exports = class MathsController extends require("./Controller") {
  constructor(HttpContext) {
    super(HttpContext);
    this.repository = new Repository(new MathsModel());
    this.params = HttpContext.path.params;
  }

  checkValidation(x, string) {

    if (x == null) return this.params.error = string + " is null" ;
    if (x == Infinity) return this.params.error = string + " is infinite" ;
    if (isNaN(x)) return this.params.error = string + " is undefined" ;
  }

  Validation()
  {  this.checkValidation( this.HttpContext.path.params.value,"value"); 
    this.checkValidation( parseInt(this.HttpContext.path.params.x),"x");
    this.checkValidation( parseInt(this.HttpContext.path.params.y),"y");
 
  }
  get() {
    if (this.HttpContext.path.queryString == "?") {
      let helpPagePath = path.join(
        process.cwd(),
        "wwwroot/helpPages/mathsServiceHelp.html"
      );
      let content = fs.readFileSync(helpPagePath);
      this.HttpContext.response.content("text/html", content);
    } else if (this.HttpContext.path.params.op != "!" &&Object.keys(this.HttpContext.path.params).length > 3) {
      this.HttpContext.path.params.error = "too many parameters";
      this.HttpContext.response.JSON(this.HttpContext.path.params);
      return;
    } else if ( this.HttpContext.path.params.op == "!" && Object.keys(this.HttpContext.path.params).length > 2) {
      this.HttpContext.path.params.error = "too many parameters";
      this.HttpContext.response.JSON(this.HttpContext.path.params);
      return;
    } else {
      switch (this.HttpContext.path.params.op) {
        case "-":
          this.HttpContext.path.params.value =
            this.HttpContext.path.params.x - this.HttpContext.path.params.y;
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        case " ":
          this.HttpContext.path.params.op = "+";
          this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) +  parseInt(this.HttpContext.path.params.y);
          this.Validation();    
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        case "/":
          this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) / parseInt(this.HttpContext.path.params.y);
          this.Validation();
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        case "*":
          this.HttpContext.path.params.value =this.HttpContext.path.params.x * parseInt(this.HttpContext.path.params.y);
          this.Validation();   
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        case "%":
          this.HttpContext.path.params.value = this.HttpContext.path.params.x % parseInt(this.HttpContext.path.params.y);
          this.Validation();  
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        case "!":
          this.HttpContext.path.params.value = factorial( this.HttpContext.path.params.n);
          this.checkValidation( parseInt(this.HttpContext.path.params.n),"n");  
          this.HttpContext.response.JSON(this.HttpContext.path.params);

          break;
        case "p":
          this.HttpContext.path.params.value = isPrime(this.HttpContext.path.params.n);
          this.checkValidation( parseInt(this.HttpContext.path.params.n),"n");   
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        case "np":
          this.HttpContext.path.params.value = findPrime( this.HttpContext.path.params.n);
          this.checkValidation( parseInt(this.HttpContext.path.params.n),"n");
          this.HttpContext.response.JSON(this.HttpContext.path.params);
          break;
        default:
          this.HttpContext.path.params.error = "parameter op is missing";
          this.HttpContext.response.JSON(this.HttpContext.path.params);
      }
    }
    function factorial(n) {
      if (n === 0 || n === 1) {
        return 1;
      }
      return n * factorial(n - 1);
    }
    function isPrime(value) {
      for (var i = 2; i < value; i++) {
        if (value % i === 0) {
          return false;
        }
      }
      return value > 1;
    }
    function findPrime(n) {
      let primeNumer = 0;
      for (let i = 0; i < n; i++) {
        primeNumer++;
        while (!isPrime(primeNumer)) {
          primeNumer++;
        }
      }
      return primeNumer;
    }
  }
};
