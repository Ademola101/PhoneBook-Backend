

const reverse = (string) => {
  return string.split("").reverse().join("")
  };
  
  const average = (array) => {
    const reducer = (sum, item) => {
      return sum + item
    };
  
    return array.reduce(reducer / array.length)
  };
  
  module.exports =  {
    reverse,
    average,
  }
  