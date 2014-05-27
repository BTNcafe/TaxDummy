require('./UPPERCASE.IO/BOOT.js');

BOOT({
	CONFIG : {
		port : 8814,
		defaultBoxName : 'TaxDummy',
		isDevMode : true,

		/*Facebook : {
		 appId : '723588444340744',
		 domain : 'taxdummy.btncafe.com'
		 }*/

		Facebook : {
			appId : '457250557721419',
			domain : 'localhost:8814'
		}
	},
	SERVER_CONFIG : {
		dbName : 'TaxDummy',
		maxDataCount : 10000,
		isNotRequiringDBAuth : true
	}
});
