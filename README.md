#AWS Cognito Authentication using Client Library


#Node js + cognito + Authentication, #javascript, #es6, #AWS, #Amazon Cognito Client Library


The purpose of this blog is to help the developers to consume the Cognito class file as it is for their project into a helper file.Let me explain the cognito class and its usage in step by step manner.


Step 1 : Import the npm packages

    global.fetch = require('node-fetch');
    const {AuthenticationDetails, CognitoUserPool, CognitoUser} = require('amazon-cognito-identity-js');

Step 2 : Create a Class "Cognito" with the constructor passed credentials as the params. credentials is an object of clientId, username, password, userPollId.

    class Cognito {
        
        constructor(credentials) {
            this.credentials = credentials;
            this.initialize();
        }
    }

    module.exports = Cognito;

Step 3 : Create a function "initialize" inside the Cognito class

    initialize() {
        try {
            const {username, password} = this.credentials;
            this.authenticationData = {
                Username: username,
                Password: password,
            };
            this.poolData = {
                UserPoolId: process.env.USER_POOL_ID,
                ClientId: process.env.CLIENT_ID,
            };
            this.authenticationDetails = new AuthenticationDetails(this.authenticationData);
            this.userPool = new CognitoUserPool(this.poolData);
            this.userData = {
                Username: username,
                Pool: this.userPool,
            };
            this.cognitoUser = new CognitoUser(this.userData);
        } catch (error) {
        console.log(error);
        }
    }

Step 4 : Create a function "getToken" inside the Cognito class

    getToken() {
        try {
            return new Promise((resolve, reject) => {
                this.cognitoUser.authenticateUser(this.authenticationDetails, {
                    onSuccess: function(result) {
                        const data = {
                            refreshToken: result.getRefreshToken().getToken(),
                            accessToken: result.getAccessToken().getJwtToken(),
                            idToken: result.getIdToken().getJwtToken(),
                        };
                        resolve(data);
                    },
                    onFailure: function(err) {
                        reject(err.message);
                    },
                });
            });
        } catch (error) {
            process.stderr.write(error);
        }
    }

Todo : Need to convert this class into package later.
