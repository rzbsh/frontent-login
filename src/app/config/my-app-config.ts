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
        refreshTokenCookieName:'refresh_token',
        regClientId: 'angular-conf',
        regClientSecret: '00d7c8dc-3bd9-40e0-b894-f6b038ff987e',
        regUrl: 'http://localhost:8083/auth/admin/realms/myservice/users',
        resourceServerUrl: 'http://localhost:8081/resource-server/api/'
    },

    resource: {
        serverApiUrl: 'http://localhost:8081/resource-server/api/'
    }
    
}