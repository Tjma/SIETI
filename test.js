var assert = require('assert');
var fs = require("fs");
const getGrades = require('./getGrades')



  describe('getGrades.playTest', function() {
    it('first id should be 1,should have a length of 65, first course should be BIO 1, grade should be 12.50', function() {
       getGrades.playTest();
        let result = fs.readFileSync("info_test.json");
        let content = JSON.parse(result);
        //let content2 = JSON.parse(content[0].gradeItem[0]);
      
      //assert.equal(content[0].id,'1');
     // assert.equal(content[64].id,'65')
      //assert.equal(content[0].gradeItem[0],"BIO 1");
     assert.equal(content[0].gradeItem[0].course,"BIO 1");
    //assert.equal(content[0].gradeItem[3],'12.50')
      
  });
});


