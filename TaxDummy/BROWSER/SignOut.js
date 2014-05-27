TaxDummy.SignOut = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(cls, inner, self) {'use strict';

		var
		//IMRORT: TaxDummy.UserModel
		UserModel = TaxDummy.UserModel,

		// user model
		userModel = UserModel(),

		// close.
		close;

		userModel.signOut(function() {
			TaxDummy.GO('');
		});

		//OVERRIDE: self.close
		self.close = close = function() {
			userModel.close();
		};
	}
});