(function ()
{
    angular
        .module("app")
        .service('PostService', PostService);

    PostService.$inject = ['$http', '$rootScope', "_CONFIG"];

    function PostService($http, $rootScope, _CONFIG)
    {
        var self = this;

        self.token = $rootScope.CONFIG_USO.X_TOKEN_API;

        self.createPost = function (user)
        {
            var config = {
                headers: {
                    "x-token": ''
                }
            };
            var url    = '../lvl-rest/public/api/v1/post';
            return $http.post(url, user, config);
        };

        self.listPosts = function ()
        {
            var config = {
                headers: {
                    //"x-token": ''
                    "Authorization": "Bearer " + $rootScope.sessao.user.token
                }
            };
            var url    = '../lvl-rest/public/api/v1/post';
            return $http.get(url, config);
        };

        self.getPostById = function (id)
        {
            var config = {
                cache: true
            };
            var url    = '../lvl-rest/public/api/v1/post/' + id;
            return $http.get(url, config);
        };

    }
})();