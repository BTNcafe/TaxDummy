OVERRIDE(TaxDummy.BillModel, function(origin) {

	TaxDummy.BillModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {

			TaxDummy.ROOM('Bills/{dummyId}');

			inner.on('create', {
				after : function(savedData) {
					TaxDummy.BROADCAST({
						roomName : 'Bills/' + savedData.dummyId,
						methodName : 'create',
						data : savedData
					});
				}
			});

			inner.on('remove', {
				after : function(savedData) {
					TaxDummy.BROADCAST({
						roomName : 'Bills/' + savedData.dummyId,
						methodName : 'remove',
						data : savedData
					});
				}
			});
		}
	});
});
