global.fetch = require('node-fetch');
const {AuthenticationDetails, CognitoUserPool, CognitoUser} = require('amazon-cognito-identity-js');

/**
  * @desription Cognito class for authenication token.
  * @author Gopal Krishna Shetty
  */
class Cognito {
  /**
   * @constructor
   * @param {*} credentials
   */
  constructor(credentials) {
    this.credentials = credentials;
    this.initialize();
  }

  /**
   * Todo : Move this to base class.
   * Initialize detail object
   */
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
      process.stdout.write(error);
    }
  }

  /**
   * getToken
   * @return {*} token
   */
  getToken() {
    try {
      return new Promise((resolve, reject) => {
        this.cognitoUser.authenticateUser(this.authenticationDetails, {
          onSuccess: function(result) {
            console.log(result.getIdToken().getJwtToken());
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
}

module.exports = Cognito;
