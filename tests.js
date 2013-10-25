var onAssertion;
var handleOnAssertion = function (assertionText) {
	console.log("passed: " + assertionText);
	assertEquals.passedCount++;
	if (typeof onAssertion === "function") {
		onAssertion();
	}
};
var assertEquals = function (actual,expected,assertionText) {
	if (actual !== expected) {
		console.log("FAILED ASSERTION: " + assertionText);
		process.exit();
	} else {
		handleOnAssertion(assertionText);
	}
};
assertEquals.printPassedCount = function () {
	console.log("Passed " + this.passedCount + " assertions!");
};
assertEquals.passedCount = 0;
var assertRejected = function (promise,assertionText) {
	promise.then(function () {
		console.log("FAILED ASSERTION: " + assertionText);
		process.exit();
	},function () {
		handleOnAssertion(assertionText);
	});
};
var assertResolved = function (promise,assertionText) {
	promise.then(function () {
		handleOnAssertion(assertionText);
	},function () {
		console.log("FAILED ASSERTION: " + assertionText);
		process.exit();
	});
};
var fail = function (assertionText) {
	console.log("FAILED ASSERTION: " + assertionText);
	process.exit();
};
var addTests = function (test) {
	if (test === undefined) {
		assertEquals.printPassedCount();
		process.exit();
	}

	var otherTests = Array.prototype.slice.call(arguments,1);
	onAssertion = function () {
		addTests.apply(undefined,otherTests);
	};
	test();
};

var authentication = require("./authentication.js");

addTests(
	function () {
		var user = new authentication.User;
		user.setUsername("robert");
		assertEquals(user.getUsername(),"robert","Username is persisted.");
	},
	function () {
		user = new authentication.User;
		user.setUsername("Robert");
		assertEquals(user.getUsername(),"robert","Username is case insensitive.");
	},
	function () {
		user = new authentication.User;
		assertRejected(user.setPassword("aaaaaaaaa"),"Passwords shorter than 10 characters may not be set.");
	},
	function () {
		user = new authentication.User;
		assertRejected(user.setPassword("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),"Passwords longer than 128 characters may not be set.");
	},
	function () {
		user = new authentication.User;
		assertRejected(user.setPassword("aaaaaaaaaaaaaaaaaaa"),"Passwords shorter than 20 characters that only consist of lower case latin characters may not be set.");
	},
	function () {
		user = new authentication.User;
		assertRejected(user.setPassword("          "),"Passwords may contain spaces.");
	},
	function () {
	user = new authentication.User;
	user.setPassword("aAaAaAaAaAaAaAaAaAaA");
	user.getPasswordMatches("aaaaaaaaaaaaaaaaaaaa").
		then(function (matches) {
			assertEquals(matches,false,"Passwords are case sensitive.");
		},function () {
			throw new Error;
		});
	}
);
