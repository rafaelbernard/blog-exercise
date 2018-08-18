(function ()
{
    angular
        .module("app")
        .service('UserService', UserService);

    UserService.$inject = ['$http', "$rootScope", "_CONFIG"];

    function UserService($http, $rootScope, _CONFIG)
    {
        var self = this;

        self.token = $rootScope.CONFIG_USO.X_TOKEN_API;

        self.signin = function (login)
        {
            var url = '../lvl-rest/public/api/v1/user/signin';
            return $http.post(url, login);
        };

        self.createUser = function (user)
        {
            var config = {
                    headers: {
                        "Authorization": "Bearer " + $rootScope.session.getToken()
                    }
                }
            ;
            var url    = '../lvl-rest/public/api/v1/user';
            return $http.post(url, user, config);
        };

        self.listUsers = function ()
        {
            var config = {
                headers: {
                    "Authorization": "Bearer " + $rootScope.session.getToken()
                }
            };
            var url    = '../lvl-rest/public/api/v1/user';
            return $http.get(url, config);
        };

    }
})();