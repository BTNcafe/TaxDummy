TaxDummy.DummyModel = CLASS({

	statics : function(cls) {'use strict';

		// valid dataSet
		cls.validDataSet = {
			userId : {
				notEmpty : true,
				id : true
			},
			name : {
				notEmpty : true,
				size : {
					max : 255
				}
			}
		};
	},

	preset : function() {'use strict';
		return TaxDummy.MODEL;
	},

	params : function(cls) {'use strict';

		return {
			name : 'Dummy',
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
});
