TaxDummy.DummyModel = OBJECT(function(cls) {'use strict';

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
	
	return {

		preset : function() {'use strict';
			return TaxDummy.MODEL;
		},
	
		params : function() {'use strict';
	
			return {
				name : 'Dummy',
				methodConfig : {
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
