TaxDummy.SignUp = CLASS({

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
				c : ['회원 가입']
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
						existed : '이미 존재하는 아이디입니다.'
					},
					name : {
						notEmpty : '이름을 입력해주세요.',
						size : function(validParams) {
							return '최소 ' + validParams.min + '글자, 최대 ' + validParams.max + '글자입니다.';
						}
					},
					password : {
						notEmpty : '비밀번호를 입력해주세요.',
						size : function(validParams) {
							return '최소 ' + validParams.min + '글자, 최대 ' + validParams.max + '글자입니다.';
						}
					},
					email : {
						notEmpty : '이메일을 입력해주세요.',
						size : function(validParams) {
							return '최소 ' + validParams.min + '글자, 최대 ' + validParams.max + '글자입니다.';
						},
						email : '이메일 양식에 맞추어주세요.'
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
					placeholder : '로그인 아이디'
				}), UUI.FULL_INPUT({
					style : {
						marginTop : 10,
						border : '1px solid #999'
					},
					name : 'name',
					placeholder : '이름'
				}), UUI.FULL_INPUT({
					style : {
						marginTop : 10,
						border : '1px solid #999'
					},
					name : 'email',
					placeholder : '이메일'
				}), UUI.FULL_INPUT({
					style : {
						marginTop : 10,
						border : '1px solid #999'
					},
					type : 'password',
					name : 'password',
					placeholder : '비밀번호'
				}), UUI.FULL_SUBMIT({
					style : {
						color : '#FFF',
						backgroundColor : '#ff7100',
						marginTop : 10
					},
					value : '회원가입'
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
							msg : '회원 가입중입니다.'
						});

						data.loginCount = 0;

						userModel.create(data, {
							
							error : function(errors) {
								loading.remove();
								form.showErrors(errors);
							},
							
							success : function(userData) {

								loading.remove();

								loading = UUI.LOADING({
									style : popupStyle.wrapper,
									contentStyle : popupStyle.content,
									msg : '회원 인증중입니다.'
								});

								userModel.signIn(data, function(result) {

									loading.remove();

									if (result.hasError === false) {

										UUI.NOTICE({
											style : popupStyle.wrapper,
											contentStyle : popupStyle.content,
											msg : '회원 가입하셨습니다.'
										});

										TaxDummy.GO('');
									}
								});
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
