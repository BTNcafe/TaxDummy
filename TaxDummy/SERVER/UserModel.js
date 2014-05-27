OVERRIDE(TaxDummy.UserModel, function(origin) {

	TaxDummy.UserModel = CLASS({

		preset : function() {
			return origin;
		},

		init : function(cls, inner, self, params) {

			var
			// sign in valid
			signInValid = VALID(origin.signInValidDataSet),

			// db
			db = inner.getDB(),

			// remember me db
			rememberMeDB = TaxDummy.DB('RememberMe'),

			// before create.
			beforeCreate,

			// before update.
			beforeUpdate,

			// sign in.
			signIn;

			inner.beforeCreate = beforeCreate = function(data, funcs) {

				var
				// proc
				proc = funcs.proc,

				// ret
				ret = funcs.ret,

				// username
				username = data.username,

				// password
				password = data.password;

				db.checkIsExists({
					username : username
				}, function(errorMsg, isExists) {

					if (errorMsg !== undefined) {

						ret({
							hasError : true,
							errorMsg : errorMsg
						});

					} else {

						if (isExists === true) {

							ret({
								hasError : true,
								errors : {
									username : {
										type : 'existed'
									}
								}
							});

						} else if (isExists === false) {

							data.loginCount = 0;

							data.password = SHA1({
								key : username,
								password : password
							});
							delete data.isBanned;
							delete data.isLeft;

							data.roles = [TaxDummy.ROLE.USER];

							proc();
						}
					}
				});

				return false;
			};

			inner.beforeUpdate = beforeUpdate = function(data, funcs) {

				var
				// proc
				proc = funcs.proc,

				// ret
				ret = funcs.ret,

				// id
				id = data.id,

				// username
				username = data.username,

				// password
				password = data.password;

				db.checkIsExists({
					id : {
						$ne : id
					},
					username : username
				}, function(errorMsg, isExists) {

					if (errorMsg !== undefined) {

						ret({
							hasError : true,
							errorMsg : errorMsg
						});

					} else {

						if (isExists === true) {

							ret({
								hasError : true,
								errors : {
									username : {
										type : 'existed'
									}
								}
							});

						} else if (isExists === false) {
							delete data.loginCount;

							if (password !== undefined) {

								data.password = SHA1({
									key : username,
									password : password
								});
							}
							delete data.isBanned;
							delete data.isLeft;
							delete data.roles;

							proc();
						}
					}
				});

				return false;
			};

			signIn = function(savedData, room) {

				room.removeAuthKey();
				room.removeAllRoles();

				room.setAuthKey(savedData.id);

				EACH(savedData.roles, function(role) {
					room.addRole(role);
				});

				savedData.lastLoginTime = new Date();
				savedData.loginCount += 1;

				db.updateData(savedData, function(errorMsg, savedData) {

					if (errorMsg === undefined) {

						if (inner.afterUpdate !== undefined) {
							inner.afterUpdate(savedData);
						}

						TaxDummy.ROOMS('User/' + savedData.id).broadcast({
							methodName : 'update',
							data : savedData
						});
					}
				});
			};

			TaxDummy.ROOM('User', function(room) {

				room.on('signFacebook', function(facebookUserData, ret) {

					var
					// key
					key = 'facebook-' + facebookUserData.id;

					db.findData({
						key : key
					}, function(errorMsg, savedData) {

						if (errorMsg === undefined) {

							if (savedData !== undefined) {

								if (savedData.social === undefined) {
									savedData.social = {};
								}

								savedData.social.facebook = facebookUserData;

								signIn(savedData, room);

								ret({
									hasError : false,
									savedData : savedData
								});

							} else {

								db.createData({
									key : key,
									name : facebookUserData.name,
									email : facebookUserData.email,
									social : {
										facebook : facebookUserData
									},
									loginCount : 0,
									roles : [TaxDummy.ROLE.USER]
								}, function(errorMsg, savedData) {

									if (errorMsg !== undefined) {

										ret({
											hasError : true,
											errorMsg : errorMsg
										});

									} else {

										TaxDummy.ROOMS('User/create').broadcast({
											methodName : 'create',
											data : savedData
										});

										signIn(savedData, room);

										// 보안상 삭제
										delete savedData.password;
										delete savedData.isBanned;
										delete savedData.isLeft;

										ret({
											hasError : false,
											savedData : savedData
										});
									}
								});
							}
						}
					});
				});

				room.on('signIn', function(data, ret) {

					var
					// valid result
					validResult = signInValid.check({
						data : data
					}),

					// username
					username = data.username,

					// password
					password = data.password,

					// is remember me
					isRememberMe = data.isRememberMe;

					if (validResult.checkHasError() === true) {

						ret({
							hasError : true,
							errors : validResult.getErrors()
						});

					} else {

						password = SHA1({
							key : username,
							password : password
						});

						db.findData({
							username : username,
							password : password
						}, function(errorMsg, savedData) {

							var
							// headers
							headers,

							// key
							key;

							if (errorMsg !== undefined) {

								ret({
									hasError : true,
									errorMsg : errorMsg
								});

							} else if (savedData === undefined) {

								ret({
									hasError : true,
									errors : {
										username : {
											type : 'signIn'
										}
									}
								});

							} else {

								if (isRememberMe === true) {
									headers = room.getHeaders();
									key = headers['user-agent'] + headers['accept-encoding'] + headers['accept-language'] + headers['accept-charset'];

									rememberMeDB.findDataSet({
										filter : {
											userId : savedData.id,
											key : key
										}
									}, function(errorMsg, savedDataSet) {

										if (errorMsg === undefined) {
											EACH(savedDataSet, function(savedData) {
												rememberMeDB.removeData(savedData.id);
											});
										}
									});

									rememberMeDB.createData({
										userId : savedData.id,
										key : key
									});
								}

								signIn(savedData, room);

								// 보안상 삭제
								delete savedData.password;
								delete savedData.isBanned;
								delete savedData.isLeft;

								ret({
									hasError : false,
									savedData : savedData
								});
							}
						});

					}
				});

				room.on('checkRole', function(data, ret) {

					var
					// saved id
					savedId = data.savedId,

					// role
					role = data.role,

					// headers
					headers,

					// key
					key,

					// done.
					done = function() {

						ret({
							hasError : false,
							isChecked : room.checkRole(role),
							userId : room.getAuthKey()
						});
					};

					if (savedId !== undefined && room.getAuthKey() === undefined) {

						headers = room.getHeaders();

						key = headers['user-agent'] + headers['accept-encoding'] + headers['accept-language'] + headers['accept-charset'];

						rememberMeDB.findData({
							userId : savedId,
							key : key
						}, function(errorMsg, savedData) {

							var
							// headers
							headers = room.getHeaders();

							if (errorMsg === undefined && savedData !== undefined && savedData.key === key) {

								db.getData(savedId, function(errorMsg, savedData) {

									if (errorMsg === undefined && savedData !== undefined) {
										signIn(savedData, room);
									}

									done();
								});

							} else {
								done();
							}
						});

					} else {
						done();
					}
				});

				room.on('signOut', function(data, ret) {

					var
					// headers
					headers,

					// key
					key;

					if (room.getAuthKey() !== undefined) {

						headers = room.getHeaders();

						key = headers['user-agent'] + headers['accept-encoding'] + headers['accept-language'] + headers['accept-charset'];

						rememberMeDB.findDataSet({
							filter : {
								userId : room.getAuthKey(),
								key : key
							}
						}, function(errorMsg, savedDataSet) {

							var
							// i
							i = 0;

							if (errorMsg === undefined) {

								if (savedDataSet.length === 0) {

									room.removeAuthKey();
									room.removeAllRoles();

									ret({
										hasError : false
									});

								} else {

									EACH(savedDataSet, function(savedData) {
										rememberMeDB.removeData(savedData.id, function() {

											i += 1;

											if (i === savedDataSet.length) {

												room.removeAuthKey();
												room.removeAllRoles();

												ret({
													hasError : false
												});
											}
										});
									});
								}
							}
						});

					} else {

						room.removeAuthKey();
						room.removeAllRoles();

						ret({
							hasError : false
						});
					}
				});
			});
		}
	});
});
