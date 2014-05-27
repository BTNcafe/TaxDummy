TaxDummy.UserModel = CLASS({

	statics : function(cls) {'use strict';

		// valid data set
		cls.validDataSet = {
			username : {
				notEmpty : true,
				size : {
					min : 4,
					max : 20
				},
				username : true
			},
			name : {
				notEmpty : true,
				size : {
					min : 2,
					max : 50
				}
			},
			password : {
				notEmpty : true,
				size : {
					min : 4,
					max : 20
				}
			},
			email : {
				notEmpty : true,
				size : {
					min : 5,
					max : 320
				},
				email : true
			},
			social : {
				data : true,
				detail : {
					facebook : {
						data : true
					}
				}
			},
			loginCount : {
				notEmpty : true,
				integer : true
			},
			lastLoginTime : {
				date : true
			},
			isBanned : {
				bool : true
			},
			isLeft : {
				bool : true
			}
		};

		// sign in valid data set
		cls.signInValidDataSet = {
			username : {
				notEmpty : true,
				size : {
					min : 4,
					max : 20
				},
				username : true
			},
			password : {
				notEmpty : true,
				size : {
					min : 4,
					max : 20
				}
			},
			isRememberMe : {
				bool : true
			}
		};
	},

	preset : function() {'use strict';
		return TaxDummy.MODEL;
	},

	params : function(cls) {'use strict';

		return {
			name : 'User',
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
