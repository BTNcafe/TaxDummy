OVERRIDE(TaxDummy.UserModel, function(origin) {

	TaxDummy.UserModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {

			var
			// sign in valid
			signInValid = VALID(origin.signInValidDataSet),

			// db
			db = self.getDB(),

			// remember me db
			rememberMeDB = TaxDummy.DB('RememberMe'),

			// sign in.
			signIn;

			inner.on('create', {

				before : function(data, ret, proc) {
	
					var
					// username
					username = data.username,
	
					// password
					password = data.password;
	
					db.checkIsExists({
						username : username
					}, {
						error : function(errorMsg) {
		
							ret({
								hasError : true,
								errorMsg : errorMsg
							});
						},
						
						success : function(isExists) {
							
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
				}
			});

			inner.on('update', {

				before : function(data, ret, proc) {

					var
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
					}, {
						
						error :  function(errorMsg, isExists) {
		
							ret({
								hasError : true,
								errorMsg : errorMsg
							});
						},
						
						success :  function(isExists) {
						
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
				}
			});

			signIn = function(savedData, clientInfo) {

				delete clientInfo.authKey;
				delete clientInfo.roles;

				clientInfo.authKey = savedData.id;

				clientInfo.roles = savedData.roles;

				savedData.lastLoginTime = new Date();
				savedData.loginCount += 1;

				db.update(savedData, function(savedData) {

					if (inner.afterUpdate !== undefined) {
						inner.afterUpdate(savedData);
					}

					TaxDummy.BROADCAST({
						roomName : 'User/' + savedData.id,
						methodName : 'update',
						data : savedData
					});
				});
			};

			TaxDummy.ROOM('User', function(clientInfo, on) {

				on('signFacebook', function(facebookUserData, ret) {

					var
					// key
					key = 'facebook-' + facebookUserData.id;

					db.get({
						filter : {
							key : key
						}
					}, {
						
						notExists : function(savedData) {
	
							db.create({
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

									TaxDummy.BROADCAST({
										roomName : 'User/create',
										methodName : 'create',
										data : savedData
									});

									signIn(savedData, clientInfo);

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
						},
						
						success : function(savedData) {
							
							if (savedData.social === undefined) {
								savedData.social = {};
							}

							savedData.social.facebook = facebookUserData;

							signIn(savedData, clientInfo);

							ret({
								hasError : false,
								savedData : savedData
							});
						}
					});
				});

				on('signIn', function(data, ret) {

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

						db.get({
							filter : {
								username : username,
								password : password
							}
						}, {
							
							error : function(errorMsg) {
	
								ret({
									hasError : true,
									errorMsg : errorMsg
								});
							},
							
							notExists : function() {
	
								ret({
									hasError : true,
									errors : {
										username : {
											type : 'signIn'
										}
									}
								});
							},
							
							success : function(savedData) {
	
								var
								// headers
								headers,
	
								// key
								key;
	
								if (isRememberMe === true) {
									headers = clientInfo.headers;
									key = headers['user-agent'] + headers['accept-encoding'] + headers['accept-language'] + headers['accept-charset'];

									rememberMeDB.find({
										filter : {
											userId : savedData.id,
											key : key
										}
									}, function(errorMsg, savedDataSet) {

										if (errorMsg === undefined) {
											EACH(savedDataSet, function(savedData) {
												rememberMeDB.remove(savedData.id);
											});
										}
									});

									rememberMeDB.create({
										userId : savedData.id,
										key : key
									});
								}

								signIn(savedData, clientInfo);

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

				on('checkRole', function(data, ret) {

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
							isChecked : CHECK_IS_IN({
								array : clientInfo.roles,
								value : role
							}),
							userId : clientInfo.authKey
						});
					};

					if (savedId !== undefined && clientInfo.authKey === undefined) {

						headers = clientInfo.headers;

						key = headers['user-agent'] + headers['accept-encoding'] + headers['accept-language'] + headers['accept-charset'];

						rememberMeDB.get({
							filter : {
								userId : savedId,
								key : key
							}
						}, {
							
							error : function() {
								done();
							},
							
							notExists : function() {
								done();
							},
							
							success : function(savedData) {
	
								var
								// headers
								headers = clientInfo.headers;
	
								if (savedData.key === key) {
	
									db.get(savedId, {
										
										error : function() {
											done();
										},
										
										notExists : function() {
											done();
										},
										
										success : function(savedData) {
											signIn(savedData, clientInfo);
											done();
										}
									});
	
								} else {
									done();
								}
							}
						});

					} else {
						done();
					}
				});

				on('signOut', function(data, ret) {

					var
					// headers
					headers,

					// key
					key;

					if (clientInfo.authKey !== undefined) {

						headers = clientInfo.headers;

						key = headers['user-agent'] + headers['accept-encoding'] + headers['accept-language'] + headers['accept-charset'];

						rememberMeDB.find({
							filter : {
								userId : clientInfo.authKey,
								key : key
							}
						}, function(savedDataSet) {

							var
							// i
							i = 0;

							if (savedDataSet.length === 0) {

								delete clientInfo.authKey;
								delete clientInfo.roles;

								ret({
									hasError : false
								});

							} else {

								EACH(savedDataSet, function(savedData) {
									rememberMeDB.remove(savedData.id, function() {

										i += 1;

										if (i === savedDataSet.length) {

											delete clientInfo.authKey;
											delete clientInfo.roles;

											ret({
												hasError : false
											});
										}
									});
								});
							}
						});

					} else {

						delete clientInfo.authKey;
						delete clientInfo.roles;

						ret({
							hasError : false
						});
					}
				});
			});
		}
	});
});
