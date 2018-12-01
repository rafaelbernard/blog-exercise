(function ()
{
    angular
        .module('app')
        .service('PollService', PollService);

    PollService.$inject = ['$http', '$rootScope', '_CONFIG'];

    function PollService($http, $rootScope, _CONFIG)
    {
        var self = this;

        self.listPolls = function ()
        {
            var url = '../lvl-rest/public/api/v1/polls';
            return $http.get(url);
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