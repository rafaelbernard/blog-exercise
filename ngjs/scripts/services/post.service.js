(function ()
{
    angular
        .module('app')
        .service('PostService', PostService);

    PostService.$inject = ['$http', '$rootScope', '_CONFIG'];

    function PostService($http, $rootScope, _CONFIG)
    {
        var self = this;

        self.createPost = function (post)
        {
            var config = {
                headers: {
                    "Authorization": "Bearer " + $rootScope.session.getToken()
                }
            };
            var url    = '../lvl-rest/public/api/v1/post';
            return $http.post(url, post, config);
        };

        self.deletePost = function (id)
        {
            var config = {
                headers: {
                    "Authorization": "Bearer " + $rootScope.session.getToken()
                }
            };
            var url    = '../lvl-rest/public/api/v1/post/' + id;
            return $http.delete(url, config);
        };

        self.updatePost = function (post)
        {
            var config = {
                headers: {
                    "Authorization": "Bearer " + $rootScope.session.getToken()
                }
            };
            var url    = '../lvl-rest/public/api/v1/post/' + post._id;
            return $http.patch(url, post, config);
        };

        self.listPosts = function (query)
        {
            var config = {
                headers: {
                    //"x-token": ''
                    "Authorization": "Bearer " + $rootScope.session.getToken()
                },
                params: query
            };
            var url    = '../lvl-rest/public/api/v1/post';
            return $http.get(url, config);
        };

        self.listPublishedPosts = function ()
        {
            var config = {
                cache: true
            };
            var url    = '../lvl-rest/public/api/v1/post';
            return $http.get(url, config);
        };

        self.getPostById = function (id)
        {
            devConsoleLog($rootScope.session);

            var config = {
                cache: true
            };

            if ($rootScope.session.getToken())
            {
                config.headers = {
                    "Authorization": "Bearer " + ($rootScope.session.getToken() || "")
                };
            }

            var url = '../lvl-rest/public/api/v1/post/' + id;
            return $http.get(url, config);
        };

    }
})();