TaxDummy.TaxList = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(cls, inner, self) {'use strict';

		var
		//IMRORT: TaxDummy.UserModel
		UserModel = TaxDummy.UserModel,

		//IMRORT: TaxDummy.DummyModel
		DummyModel = TaxDummy.DummyModel,

		//IMRORT: TaxDummy.BillModel
		BillModel = TaxDummy.BillModel,

		// user model
		userModel = UserModel(),

		// dummy model
		dummyModel = DummyModel(),

		// bill model
		billModel = BillModel(),

		// bills room
		billsRoom,

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

		// on change params.
		onChangeParams,

		// close.
		close;

		//OVERRIDE: self.onChangeParams
		self.onChangeParams = onChangeParams = function(params) {

			var
			// dummy id
			dummyId = params.dummyId,

			// loading
			loading = UUI.LOADING({
				wrapperStyle : popupStyle.wrapper,
				contentStyle : popupStyle.content,
				msg : '회원 인증 확인중입니다.'
			});

			if (billsRoom !== undefined) {
				billsRoom.exit();
			}

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

							dummyModel.getData(dummyId, function(result) {

								var
								// dummy data
								dummyData = result.savedData,

								// dataSet
								dataSet = {},

								// form
								form,

								// bn input
								bnInput,

								// table
								table,

								// calculate.
								calculate,

								// create bill.
								createBill;

								if (result.hasError === false) {

									if (dummyData !== undefined && dummyData.userId === userData.id) {

										wrapper = DIV({
											style : {
												backgroundColor : '#fff',
												color : '#000',
												padding : 30
											},
											children : [H1({
												children : ['Tax List']
											}), form = UUI.VALID_FORM({
												style : {
													marginTop : 10
												},
												errorMsgs : {
													businessNumber : {
														notEmpty : '사업자 번호를 입력해주세요.',
														size : function(size) {
															return size + '글자입니다.';
														}
													},
													cardNumber : {
														notEmpty : '카드 번호를 입력해주세요.',
														size : function(size) {
															return size + '글자입니다.';
														}
													},
													price : {
														notEmpty : '가격을 입력해주세요.',
														integer : '가격은 숫자입니다.'
													}
												},
												errorMsgStyle : {
													padding : 5,
													background : '#ffbaba',
													color : '#d8000c',
													border : '1px solid #d8000c',
													marginTop : -1
												},
												children : [ bnInput = UUI.FULL_INPUT({
													wrapperStyle : {
														border : '1px solid #999'
													},
													name : 'businessNumber',
													placeholder : '사업자 번호',
													on : {
														change : function(e, input) {
															input.setValue(input.getValue().replace(/[^A-Za-z0-9]/g, ''));
														}
													}
												}), UUI.FULL_INPUT({
													wrapperStyle : {
														border : '1px solid #999',
														marginTop : 10
													},
													name : 'price',
													placeholder : '가격 (숫자만 입력해주세요.)',
													on : {
														change : function(e, input) {
															input.setValue(input.getValue().replace(/[^A-Za-z0-9]/g, ''));
														}
													}
												}), UUI.FULL_INPUT({
													wrapperStyle : {
														border : '1px solid #999',
														marginTop : 10
													},
													name : 'cardNumber',
													placeholder : '카드 번호 (숫자만 입력해주세요.)',
													on : {
														change : function(e, input) {
															input.setValue(input.getValue().replace(/[^A-Za-z0-9]/g, ''));
														}
													}
												}), UUI.FULL_SUBMIT({
													style : {
														color : '#FFF',
														backgroundColor : '#ff7100',
														marginTop : 10
													},
													value : '카드 전표 생성 (숫자만 입력해주세요.)'
												})],
												on : {
													submit : function(e, form) {

														var
														// data
														data = form.getData(),

														// loading
														loading = UUI.LOADING({
															wrapperStyle : popupStyle.wrapper,
															contentStyle : popupStyle.content,
															msg : '카드 전표 생성 중입니다.'
														});

														data.dummyId = dummyId;

														billModel.create(data, function(result) {

															var
															// saved data
															savedData = result.savedData;

															loading.remove();

															if (result.hasError === true) {
																form.showErrors(result.errors);
															} else {

																UUI.NOTICE({
																	wrapperStyle : popupStyle.wrapper,
																	contentStyle : popupStyle.content,
																	msg : '카드 전표 생성 하셨습니다.'
																});

																form.setData({
																	cardNumber : data.cardNumber
																});

																bnInput.focus();
															}
														});
													}
												}
											}), table = UUI.TABLE({
												style : {
													marginTop : 15
												},
												children : [TR({
													children : [TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['공급자(가맹점)사업자등록번호']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['카드회원번호']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['공급가액']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['세액']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['합계']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['기능']
													})]
												})]
											}), result = DIV()]
										}).appendTo(BODY);

										calculate = function() {

											var
											// dataSet2
											dataSet2 = {},

											// total
											total = 0,

											// table
											table;

											result.removeAllChildren();

											result.append( table = TABLE({
												children : [TR({
													children : [TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['카드회원번호']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['공급자(가맹점)사업자등록번호']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['거래건수']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['공급가액']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['세액']
													}), TH({
														style : {
															padding : 5,
															border : '1px solid #999',
															fontWeight : 'bold',
															textAlign : 'center'
														},
														children : ['합계']
													})]
												})]
											}));

											EACH(dataSet, function(data) {

												if (dataSet2[data.businessNumber + ':' + data.cardNumber] === undefined) {
													dataSet2[data.businessNumber + ':' + data.cardNumber] = {
														businessNumber : data.businessNumber,
														cardNumber : data.cardNumber,
														price : Math.round(data.price * 10 / 11),
														tax : data.price - Math.round(data.price * 10 / 11),
														count : 1
													};
												} else {
													dataSet2[data.businessNumber + ':' + data.cardNumber].count += 1;
													dataSet2[data.businessNumber + ':' + data.cardNumber].price += Math.round(data.price * 10 / 11);
													dataSet2[data.businessNumber + ':' + data.cardNumber].tax += data.price - Math.round(data.price * 10 / 11);
												}
											});

											EACH(dataSet2, function(data2) {

												table.append(TR({
													children : [TD({
														style : {
															padding : 5,
															border : '1px solid #999'
														},
														children : [data2.cardNumber]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999'
														},
														children : [data2.businessNumber]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [data2.count]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [data2.price]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [data2.tax]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [String(data2.price + data2.tax).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
													})]
												}));

												total += data2.price + data2.tax;
											});

											table.after(DIV({
												children : ['총합: ' + String(total).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
											}));
										};

										createBill = function(savedData) {

											dataSet[savedData.id] = savedData;

											table.addTR({
												key : savedData.id,
												tr : TR({
													children : [TD({
														style : {
															padding : 5,
															border : '1px solid #999'
														},
														children : [savedData.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999'
														},
														children : [savedData.cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/g, '$1-$2-$3-$4')]
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [String(Math.round(savedData.price * 10 / 11)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [String(savedData.price - Math.round(savedData.price * 10 / 11)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															textAlign : 'right'
														},
														children : [String(savedData.price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
													}), TD({
														style : {
															padding : 5,
															border : '1px solid #999',
															color : 'red'
														},
														children : [UUI.TEXT_BUTTON({
															title : '[삭제]',
															on : {
																tap : function() {
																	billModel.remove(savedData.id, function() {
																		UUI.NOTICE({
																			wrapperStyle : popupStyle.wrapper,
																			contentStyle : popupStyle.content,
																			msg : '카드 전표 삭제 하셨습니다.'
																		});
																	});
																}
															}
														})]
													})]
												})
											});

											calculate();
										};

										billModel.findDataSet({
											filter : {}
										}, function(result) {
											if (result.hasError === false) {
												EACH(result.savedDataSet, createBill);
											}
										});

										billsRoom = TaxDummy.ROOM('Bills/' + dummyId);

										billsRoom.on('create', createBill);

										billsRoom.on('remove', function(savedData) {

											table.removeTR(savedData.id);

											REMOVE_AT({
												data : dataSet,
												key : savedData.id
											});

											calculate();
										});

									} else {
										TaxDummy.GO('');
									}
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
			billModel.close();

			if (billsRoom !== undefined) {
				billsRoom.exit();
			}

			if (wrapper !== undefined) {
				wrapper.remove();
			}
		};
	}
});

