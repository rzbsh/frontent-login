export default {

    kc: {
        clientId: 'angular',
        resource: 'angular',
        realm: 'myservice',
        sslRequired: 'none',
        authServerUrl: 'http://localhost:8083/auth/',
        //accessTokenGrantType: 'password',
        //refreshTokenGrantType: 'refresh_token'
        redirectUri: 'http://localhost:4200/login/callback',
        //scopes: ['openid', 'profile', 'email']
        accessTokenCookieName:'access_token',
        refreshTokenCookieName:'refresh_token'
    }
    
}