TaxDummy.BillModel = OBJECT(function(cls) {'use strict';

	// valid dataSet
	cls.validDataSet = {
		dummyId : {
			notEmpty : true,
			id : true
		},
		businessNumber : {
			notEmpty : true,
			size : 10
		},
		cardNumber : {
			notEmpty : true,
			size : 16
		},
		price : {
			notEmpty : true,
			integer : true
		}
	};
	
	return {
	
		preset : function() {'use strict';
			return TaxDummy.MODEL;
		},
	
		params : function() {'use strict';
	
			return {
				name : 'Bill',
				config : {
					create : {
						valid : VALID(cls.validDataSet)
					},
					update : {
						valid : VALID(cls.validDataSet)
					}
				}
			};
		}
	};
});
