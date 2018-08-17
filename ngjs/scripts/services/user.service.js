(function ()
{
    angular
        .module("app")
        .service("UserService", UserService);

    UserService.$inject = ['$http', "$rootScope", "_CONFIG"];

    function UserService($http, $rootScope, _CONFIG)
    {
        var self = this;

        self.token = $rootScope.CONFIG_USO.X_TOKEN_API;

        self.createUser = function (user)
        {
            var config = {
                headers: {
                    "x-token": ''
                }
            };
            var url    = '../lvl-rest/public/api/v1/user';
            return $http.post(url, user, config);
        };

    }
})();