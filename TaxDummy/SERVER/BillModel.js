OVERRIDE(TaxDummy.BillModel, function(origin) {

	TaxDummy.BillModel = CLASS({

		preset : function() {
			return origin;
		},

		init : function(cls, inner, self, params) {

			var
			// after create.
			afterCreate,

			// after remove.
			afterRemove;

			TaxDummy.ROOM('Bills/{dummyId}');

			inner.afterCreate = afterCreate = function(savedData) {
				TaxDummy.ROOMS('Bills/' + savedData.dummyId).broadcast({
					methodName : 'create',
					data : savedData
				});
			};

			inner.afterRemove = afterRemove = function(savedData) {
				TaxDummy.ROOMS('Bills/' + savedData.dummyId).broadcast({
					methodName : 'remove',
					data : savedData
				});
			};
		}
	});
});
