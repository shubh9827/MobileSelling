 function capitalize(word) {
    let newString = word.toLowerCase();
    const newWord = newString.charAt(0).toUpperCase() + newString.slice(1);
    return newWord;
  }
  export default capitalize;