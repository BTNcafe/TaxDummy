TaxDummy.Home = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(inner, self) {'use strict';

		var
		// user model
		userModel = TaxDummy.UserModel,

		// dummy model
		dummyModel = TaxDummy.DummyModel,

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
		list;

		inner.on('paramsChange', function() {

			var
			// loading
			loading = UUI.LOADING({
				style : popupStyle.wrapper,
				contentStyle : popupStyle.content,
				msg : '회원 인증 확인중입니다.'
			});

			userModel.checkRole(TaxDummy.ROLE.USER, function(result) {

				loading.remove();

				// signed
				if (result.isChecked === true) {

					userModel.get(result.userId, function(userData) {

						TaxDummy.GLOBAL.signedUserData = userData;

						wrapper = DIV({
							style : {
								backgroundColor : '#fff',
								color : '#000',
								padding : 30
							},
							c : [H1({
								c : ['TaxDummy']
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

						dummyModel.find({
							filter : {}
						}, function(savedDataSet) {

							EACH(savedDataSet, function(savedData) {
								list.addItem({
									key : 'folder-' + savedData.id,
									item : LI({
										c : [UUI.TEXT_BUTTON({
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
						});
					});

				}

				// unsigned
				else {
					TaxDummy.GO('SignIn');
				}
			});
		});

		inner.on('close', function() {
			if (wrapper !== undefined) {
				wrapper.remove();
			}
		});
	}
});
