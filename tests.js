var assertEquals = function (actual,expected,assertionText) {
	if (actual !== expected) {
		console.log("FAILED ASSERTION: " + assertionText);
		process.exit();
	} else {
		console.log("passed: " + assertionText);
		assertEquals.passedCount++;
	}
};
assertEquals.printPassedCount = function () {
	console.log("Passed " + this.passedCount + " assertions!");
};
assertEquals.passedCount = 0;

var authentication = require("./authentication.js");

var user = new authentication.User;
user.setUsername("robert");
assertEquals(user.getUsername(),"robert","Username is persisted.");

user = new authentication.User;
user.setUsername("Robert");
assertEquals(user.getUsername(),"robert","Username is case insensitive.");

assertEquals.printPassedCount();
process.exit();
