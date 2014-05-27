TaxDummy.MAIN = METHOD({

	run : function(m, params) {'use strict';

		TaxDummy.MATCH_VIEW({
			uris : [''],
			target : TaxDummy.Home
		});

		TaxDummy.MATCH_VIEW({
			uris : ['SignIn'],
			target : TaxDummy.SignIn
		});

		TaxDummy.MATCH_VIEW({
			uris : ['Terms'],
			target : TaxDummy.Terms
		});

		TaxDummy.MATCH_VIEW({
			uris : ['SignUp'],
			target : TaxDummy.SignUp
		});

		TaxDummy.MATCH_VIEW({
			uris : ['SignOut'],
			target : TaxDummy.SignOut
		});

		TaxDummy.MATCH_VIEW({
			uris : ['CreateDummy'],
			target : TaxDummy.CreateDummy
		});

		TaxDummy.MATCH_VIEW({
			uris : ['TaxList/{dummyId}'],
			target : TaxDummy.TaxList
		});
	}
});
