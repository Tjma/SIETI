const cryptoJSON = require('crypto-json')
const C = require('./info_classSearch');

const input1 = JSON.stringify(C)
 input = JSON.parse(input1)
 
 console.log(input)
 console.log(input.length)
const keys = ['courseTitle', 'sectionID', 'sectionDetails', 'dates_and_times', 'room', 'instructor', 'meeting_dates']


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
  fs.writeFile("encrypted_info_classSearch.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });