TaxDummy.CreateDummy = CLASS({

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

		// loading
		loading,

		// wrapper
		wrapper,

		// form
		form;

		loading = UUI.LOADING({
			style : popupStyle.wrapper,
			contentStyle : popupStyle.content,
			msg : '회원 인증 확인중입니다.'
		});

		userModel.checkRole(TaxDummy.ROLE.USER, function(result) {

			var
			// user id
			userId = result.userId;

			loading.remove();

			// signed
			if (result.isChecked === true) {

				wrapper = DIV({
					style : {
						backgroundColor : '#fff',
						color : '#000',
						padding : 30
					},
					c : [H1({
						c : ['더미 생성']
					}), form = UUI.VALID_FORM({
						style : {
							marginTop : 10
						},
						errorMsgs : {
							name : {
								notEmpty : '이름을 입력해주세요.',
								size : function(validParams) {
									return '최대 ' + validParams.max + '글자입니다.';
								}
							}
						},
						errorMsgStyle : {
							padding : 5,
							background : '#ffbaba',
							color : '#d8000c',
							border : '1px solid #d8000c',
							marginTop : -1
						},
						c : [UUI.FULL_INPUT({
							style : {
								border : '1px solid #999'
							},
							name : 'name',
							placeholder : '이름'
						}), UUI.FULL_SUBMIT({
							style : {
								color : '#FFF',
								backgroundColor : '#ff7100',
								marginTop : 10
							},
							value : '더미 생성'
						})],
						on : {
							submit : function(e, form) {

								var
								// data
								data = form.getData(),

								// loading
								loading = UUI.LOADING({
									style : popupStyle.wrapper,
									contentStyle : popupStyle.content,
									msg : '더미 생성 중입니다.'
								});

								data.userId = userId;

								dummyModel.create(data, {
									
									error : function(errors) {
										loading.remove();
										form.showErrors(errors);
									},
									
									success : function(savedData) {

										loading.remove();
										
										UUI.NOTICE({
											style : popupStyle.wrapper,
											contentStyle : popupStyle.content,
											msg : '더미 생성 하셨습니다.'
										});
	
										TaxDummy.GO('TaxList/' + savedData.id);
									}
								});
							}
						}
					})]
				}).appendTo(BODY);

			}

			// unsigned
			else {
				TaxDummy.GO('SignIn');
			}
		});

		inner.on('close', function() {
			if (wrapper !== undefined) {
				wrapper.remove();
			}
		});
	}
});
