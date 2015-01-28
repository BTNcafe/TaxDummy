TaxDummy.SignIn = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(inner, self) {'use strict';

		var
		// user model
		userModel = TaxDummy.UserModel,

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
		wrapper = DIV({
			style : {
				backgroundColor : '#fff',
				color : '#000',
				padding : 30
			},
			c : [H1({
				c : ['로그인']
			}), UUI.VALID_FORM({
				style : {
					marginTop : 10
				},
				errorMsgs : {
					username : {
						notEmpty : '아이디를 입력해주세요.',
						size : function(validParams) {
							return '최소 ' + validParams.min + '글자, 최대 ' + validParams.max + '글자입니다.';
						},
						username : '영문과 숫자, 하이픈으로 작성 가능합니다.',
						signIn : '로그인 오류입니다. 아이디와 비밀번호를 확인해주세요.'
					},
					password : {
						notEmpty : '비밀번호를 입력해주세요.',
						size : function(validParams) {
							return '최소 ' + validParams.min + '글자, 최대 ' + validParams.max + '글자입니다.';
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
					name : 'username',
					placeholder : '아이디'
				}), UUI.FULL_INPUT({
					style : {
						marginTop : 10,
						border : '1px solid #999'
					},
					type : 'password',
					name : 'password',
					placeholder : '비밀번호'
				}), UUI.FULL_CHECKBOX({
					style : {
						marginTop : 10,
						color : '#777',
						fontSize : 12
					},
					name : 'isRememberMe',
					label : '로그인 상태 유지'
				}), UUI.FULL_SUBMIT({
					style : {
						color : '#FFF',
						backgroundColor : '#ff7100',
						marginTop : 10
					},
					value : '로그인'
				}), UUI.BUTTON({
					style : {
						color : '#FFF',
						backgroundColor : '#3b5998',
						marginTop : 10
					},
					title : '페이스북 로그인',
					on : {
						tap : function() {
							Facebook.signIn('email', {
								signed : function(signedUserData) {
									userModel.signFacebook(signedUserData, function(result) {
										if (result.hasError === false) {
											TaxDummy.GO('');
										}
									});
								}
							});
						}
					}
				}), UUI.BUTTON({
					style : {
						color : '#FFF',
						backgroundColor : '#ff7100',
						marginTop : 10
					},
					title : '회원가입',
					on : {
						tap : function() {
							TaxDummy.GO('SignUp');
						}
					}
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
							msg : '로그인 중입니다.'
						});

						userModel.signIn(data, function(result) {

							loading.remove();

							if (result.hasError === true) {
								form.showErrors(result.errors);
							} else {

								UUI.NOTICE({
									style : popupStyle.wrapper,
									contentStyle : popupStyle.content,
									msg : '로그인 하셨습니다.'
								});

								TaxDummy.GO('');
							}
						});
					}
				}
			})]
		}).appendTo(BODY);

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
