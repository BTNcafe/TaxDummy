TaxDummy.MAIN = METHOD({

	run : function(params) {'use strict';

		TaxDummy.MATCH_VIEW({
			uri : [''],
			target : TaxDummy.Home
		});

		TaxDummy.MATCH_VIEW({
			uri : ['SignIn'],
			target : TaxDummy.SignIn
		});

		TaxDummy.MATCH_VIEW({
			uri : ['Terms'],
			target : TaxDummy.Terms
		});

		TaxDummy.MATCH_VIEW({
			uri : ['SignUp'],
			target : TaxDummy.SignUp
		});

		TaxDummy.MATCH_VIEW({
			uri : ['SignOut'],
			target : TaxDummy.SignOut
		});

		TaxDummy.MATCH_VIEW({
			uri : ['CreateDummy'],
			target : TaxDummy.CreateDummy
		});

		TaxDummy.MATCH_VIEW({
			uri : ['TaxList/{dummyId}'],
			target : TaxDummy.TaxList
		});
	}
});
