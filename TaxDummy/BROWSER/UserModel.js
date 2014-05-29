OVERRIDE(TaxDummy.UserModel, function(origin) {

	TaxDummy.UserModel = CLASS({

		preset : function() {
			return origin;
		},

		init : function(cls, inner, self) {

			var
			// sign in valid
			signInValid = VALID(origin.signInValidDataSet),

			// room
			room = inner.getRoom(),

			// remember me store
			rememberMeStore = TaxDummy.STORE('rememberMe'),

			// sign facebook.
			signFacebook,

			// sign in.
			signIn,

			// check role.
			checkRole,

			// sign out.
			signOut;

			self.signFacebook = signFacebook = function(userData, callback) {
				//REQUIRED: userData
				//OPTIONAL: callback

				room.send({
					methodName : 'signFacebook',
					data : userData
				}, function(result) {

					var
					// saved data
					savedData = result.savedData;

					if (result.hasError === false) {
						rememberMeStore.save({
							key : 'savedId',
							value : savedData.id
						});
					}

					cls.isSignedUsingFacebook = true;

					if (callback !== undefined) {
						callback(result);
					}
				});
			};

			self.signIn = signIn = function(data, callback) {
				//REQUIRED: data
				//OPTIONAL: callback

				var
				// valid result
				validResult = signInValid.check({
					data : data
				});

				if (validResult.checkHasError() === true) {

					if (callback !== undefined) {
						callback({
							hasError : true,
							errors : validResult.getErrors()
						});
					}

				} else {

					room.send({
						methodName : 'signIn',
						data : data
					}, function(result) {

						var
						// saved data
						savedData = result.savedData;

						if (result.hasError === false) {
							rememberMeStore.save({
								key : 'savedId',
								value : savedData.id
							});
						}

						callback(result);
					});
				}
			};

			self.checkRole = checkRole = function(role, callback) {

				var
				// facebook timeout
				facebookTimeout,

				// check role.
				checkRole = function() {

					room.send({
						methodName : 'checkRole',
						data : {
							savedId : rememberMeStore.get('savedId'),
							role : role
						}
					}, callback);
				};

				facebookTimeout = setTimeout(function() {

					UUI.MODAL({
						wrapperStyle : {
							backgroundColor : '#000',
							zIndex : 999999
						},
						contentStyle : {
							padding : 10
						},
						children : ['오류: 페이스북 로그인이 작동하지 않습니다.']
					});

					checkRole();
				}, 5000);

				Facebook.checkSigned({

					signed : function(signedUserData) {
						clearTimeout(facebookTimeout);
						signFacebook(signedUserData, function() {
							checkRole();
						});
					},

					unsigned : function() {
						clearTimeout(facebookTimeout);
						checkRole();
					}
				});
			};

			self.signOut = signOut = function(callback) {

				if (cls.isSignedUsingFacebook === true) {

					Facebook.signOut(function() {

						rememberMeStore.remove('savedId');

						room.send({
							methodName : 'signOut'
						}, callback);
					});
					delete cls.isSignedUsingFacebook;

				} else {

					rememberMeStore.remove('savedId');

					room.send({
						methodName : 'signOut'
					}, callback);
				}
			};
		}
	});
});
