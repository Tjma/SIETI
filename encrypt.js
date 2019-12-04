const cryptoJSON = require('crypto-json')
const C = require('./info');

const input1 = JSON.stringify(C)
 input = JSON.parse(input1)
 
 console.log(input)
 console.log(input.length)
const keys = ['id', 'gradeItem', 'course', 'description', 'term', 'grade', 'units']


const password = 'itoy' 
const output = []
input.forEach(function(item){
    output.push(cryptoJSON.encrypt(
        item, password
    ));
});

//console.log(cryptoJSON.decrypt(output[0],password))

decrypted_o = []
output.forEach(function(item){
    decrypted_o.push(cryptoJSON.decrypt(item,password))
});

console.log(decrypted_o)

decrypted_o.forEach(function(item){
    console.log(item)
});

const fs = require('fs');
  const jsonContent = JSON.stringify(output);
  fs.writeFile("encrypted_info.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });