TaxDummy.SignOut = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(inner, self) {'use strict';

		var
		// user model
		userModel = TaxDummy.UserModel;

		userModel.signOut(function() {
			TaxDummy.GO('');
		});
	}
});