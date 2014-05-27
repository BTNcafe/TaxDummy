TaxDummy.Home = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(cls, inner, self) {'use strict';

		var
		//IMRORT: TaxDummy.UserModel
		UserModel = TaxDummy.UserModel,

		//IMRORT: TaxDummy.DummyModel
		DummyModel = TaxDummy.DummyModel,

		// user model
		userModel = UserModel(),

		// dummy model
		dummyModel = DummyModel(),

		// popup style
		popupStyle = {
			wrapper : {
				border : '1px solid #000',
				backgroundColor : '#fff',
				color : '#000',
				onDisplayResize : function(width, height) {

					var
					// style
					style;

					if (width < 300) {
						style = {
							width : '90%'
						};
					} else {
						style = {
							width : 300
						};
					}
					return style;
				},
				zIndex : 999999
			},
			content : {
				padding : 30
			}
		},

		// wrapper
		wrapper,

		// list
		list,

		// on change params.
		onChangeParams,

		// close.
		close;

		//OVERRIDE: self.onChangeParams
		self.onChangeParams = onChangeParams = function(params) {

			var
			// loading
			loading = UUI.LOADING({
				wrapperStyle : popupStyle.wrapper,
				contentStyle : popupStyle.content,
				msg : '회원 인증 확인중입니다.'
			});

			userModel.checkRole(TaxDummy.ROLE.USER, function(result) {

				loading.remove();

				// signed
				if (result.isChecked === true) {

					userModel.getData(result.userId, function(result) {

						var
						// user data
						userData = result.savedData;

						if (result.hasError === false) {

							TaxDummy.GLOBAL.signedUserData = userData;

							wrapper = DIV({
								style : {
									backgroundColor : '#fff',
									color : '#000',
									padding : 30
								},
								children : [H1({
									children : ['TaxDummy']
								}), list = UUI.LIST({
									listStyle : {
										marginTop : 10
									}
								}), UUI.BUTTON({
									style : {
										marginTop : 10,
										border : '1px solid #999'
									},
									title : '더미 생성',
									on : {
										tap : function() {
											TaxDummy.GO('CreateDummy');
										}
									}
								}), UUI.BUTTON({
									style : {
										marginTop : 10,
										border : '1px solid #999'
									},
									title : '로그아웃',
									on : {
										tap : function() {
											TaxDummy.GO('SignOut');
										}
									}
								})]
							}).appendTo(BODY);

							dummyModel.findDataSet({
								filter : {}
							}, function(result) {

								if (result.hasError === false) {

									EACH(result.savedDataSet, function(savedData) {
										list.addItem({
											key : 'folder-' + savedData.id,
											item : LI({
												children : [UUI.TEXT_BUTTON({
													title : savedData.name,
													on : {
														tap : function() {
															TaxDummy.GO('TaxList/' + savedData.id);
														}
													}
												})]
											})
										});
									});
								}
							});
						}
					});

				}

				// unsigned
				else {
					TaxDummy.GO('SignIn');
				}
			});
		};

		//OVERRIDE: self.close
		self.close = close = function(params) {

			userModel.close();
			dummyModel.close();

			if (wrapper !== undefined) {
				wrapper.remove();
			}
		};
	}
});
