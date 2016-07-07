TaxDummy.TaxList = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(inner, self) {'use strict';

		var
		// user model
		userModel = TaxDummy.UserModel,

		// dummy model
		dummyModel = TaxDummy.DummyModel,

		// bill model
		billModel = TaxDummy.BillModel,

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
		wrapper;

		inner.on('paramsChange', function(params) {

			var
			// dummy id
			dummyId = params.dummyId,

			// loading
			loading = UUI.LOADING({
				style : popupStyle.wrapper,
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

					userModel.get(result.userId, function(userData) {

						TaxDummy.GLOBAL.signedUserData = userData;

						dummyModel.get(dummyId, function(dummyData) {

							var
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

							if (dummyData.userId === userData.id) {

								wrapper = DIV({
									style : {
										backgroundColor : '#fff',
										color : '#000',
										padding : 30
									},
									c : [H1({
										c : ['Tax List']
									}), H2({
										c : '단일 전표 입력'
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
										c : [ bnInput = UUI.FULL_INPUT({
											style : {
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
											style : {
												border : '1px solid #999',
												marginTop : 10
											},
											name : 'price',
											placeholder : '가격',
											on : {
												change : function(e, input) {
													input.setValue(input.getValue().replace(/[^A-Za-z0-9]/g, ''));
												}
											}
										}), UUI.FULL_INPUT({
											style : {
												border : '1px solid #999',
												marginTop : 10
											},
											name : 'cardNumber',
											placeholder : '카드 번호',
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
											value : '카드 전표 생성'
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
													msg : '카드 전표 생성 중입니다.'
												});

												data.dummyId = dummyId;

												billModel.create(data, {
													
													error : function(errors) {
														loading.remove();
														form.showErrors(errors);
													},
													
													success : function(savedData) {
														
														loading.remove();
														
														UUI.NOTICE({
															style : popupStyle.wrapper,
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
									}), H2({
										style : {
											marginTop : 20
										},
										c : '여러 전표 입력'
									}), UUI.VALID_FORM({
										style : {
											marginTop : 10
										},
										errorMsgStyle : {
											padding : 5,
											background : '#ffbaba',
											color : '#d8000c',
											border : '1px solid #d8000c',
											marginTop : -1
										},
										c : [UUI.FULL_TEXTAREA({
											style : {
												border : '1px solid #999'
											},
											name : 'businessNumbers',
											placeholder : '사업자 번호들'
										}), UUI.FULL_TEXTAREA({
											style : {
												border : '1px solid #999',
												marginTop : 10
											},
											name : 'prices',
											placeholder : '가격들'
										}), UUI.FULL_INPUT({
											style : {
												border : '1px solid #999',
												marginTop : 10
											},
											name : 'cardNumber',
											placeholder : '카드 번호',
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
											value : '카드 전표 생성'
										})],
										on : {
											submit : function(e, form) {

												var
												// data
												data = form.getData(),
												
												// business numbers
												businessNumbers = data.businessNumbers.trim().split('\n'),
												
												// prices
												prices = data.prices.trim().split('\n'),
												
												// card number
												cardNumber = data.cardNumber;
												
												EACH(businessNumbers, function(businessNumber, i) {
													
													var
													// data
													data = {
														dummyId : dummyId,
														businessNumber : businessNumber.replace(/[^A-Za-z0-9]/g, ''),
														price : prices[i].replace(/[^A-Za-z0-9]/g, ''),
														cardNumber : cardNumber
													},
	
													// loading
													loading = UUI.LOADING({
														style : popupStyle.wrapper,
														contentStyle : popupStyle.content,
														msg : '카드 전표 생성 중입니다.'
													});
													
													billModel.create(data, {
														
														error : function(errors) {
															loading.remove();
															alert('오류가 발생하였습니다.');
														},
														
														success : function(savedData) {
															
															loading.remove();
															
															UUI.NOTICE({
																style : popupStyle.wrapper,
																contentStyle : popupStyle.content,
																msg : '카드 전표 생성 하셨습니다.'
															});
	
															form.setData({
																cardNumber : cardNumber
															});
														}
													});
												});
											}
										}
									}), table = UUI.TABLE({
										style : {
											marginTop : 15
										},
										c : [TR({
											c : [TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['공급자(가맹점)사업자등록번호']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['카드회원번호']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['공급가액']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['세액']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['합계']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['기능']
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

									result.empty();

									result.append( table = TABLE({
										c : [TR({
											c : [TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['카드회원번호']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['공급자(가맹점)사업자등록번호']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['거래건수']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['공급가액']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['세액']
											}), TH({
												style : {
													padding : 5,
													border : '1px solid #999',
													fontWeight : 'bold',
													textAlign : 'center'
												},
												c : ['합계']
											})]
										})]
									}));

									EACH(dataSet, function(data) {

										if (dataSet2[data.businessNumber + ':' + data.cardNumber] === undefined) {
											dataSet2[data.businessNumber + ':' + data.cardNumber] = {
												businessNumber : data.businessNumber,
												cardNumber : data.cardNumber,
												price : Math.ceil(data.price * 10 / 11),
												tax : data.price - Math.ceil(data.price * 10 / 11),
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
											c : [TD({
												style : {
													padding : 5,
													border : '1px solid #999'
												},
												c : [data2.cardNumber]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999'
												},
												c : [data2.businessNumber]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [data2.count]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [data2.price]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [data2.tax]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [String(data2.price + data2.tax).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
											})]
										}));

										total += data2.price + data2.tax;
									});

									table.after(DIV({
										c : ['총합: ' + String(total).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
									}));
								};

								createBill = function(savedData) {

									dataSet[savedData.id] = savedData;

									table.addTR({
										key : savedData.id,
										tr : TR({
											c : [TD({
												style : {
													padding : 5,
													border : '1px solid #999'
												},
												c : [savedData.businessNumber === undefined ? '' : savedData.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999'
												},
												c : [savedData.cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/g, '$1-$2-$3-$4')]
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [String(Math.round(savedData.price * 10 / 11)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [String(savedData.price - Math.round(savedData.price * 10 / 11)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													textAlign : 'right'
												},
												c : [String(savedData.price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '₩']
											}), TD({
												style : {
													padding : 5,
													border : '1px solid #999',
													color : 'red'
												},
												c : [UUI.TEXT_BUTTON({
													title : '[삭제]',
													on : {
														tap : function() {
															billModel.remove(savedData.id, function() {
																UUI.NOTICE({
																	style : popupStyle.wrapper,
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

								billModel.find({
									filter : {
										dummyId : dummyId
									}
								}, function(savedDataSet) {
									EACH(savedDataSet, createBill);
								});

								billsRoom = TaxDummy.ROOM('Bills/' + dummyId);

								billsRoom.on('create', createBill);

								billsRoom.on('remove', function(savedData) {

									table.removeTR(savedData.id);

									delete dataSet[savedData.id];

									calculate();
								});

							} else {
								TaxDummy.GO('');
							}
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

			if (billsRoom !== undefined) {
				billsRoom.exit();
			}

			if (wrapper !== undefined) {
				wrapper.remove();
			}
		});
	}
});

