(function ()
{

    angular.module('app')
        .controller('PublicPostController', PublicPostController);

    PublicPostController.$inject = [
        '$rootScope',
        '$routeParams',
        'PostService',
        "ErrorHandlerService"
    ];

    function PublicPostController($rootScope,
                                  $routeParams, postService, errorHandler)
    {
        var self = this;

        self.postData = {};

        self._creating         = false;
        self._updating         = false;
        self.requestInProgress = false;

        self.listPosts = function ()
        {
            //devConsoleLog(self.postData);
            $rootScope.infoMessage('Loading...');
            postService.listPosts(self.postData)
                .then(
                    function (response)
                    {
                        devConsoleLog(response.data);

                        self.postList = response.data.posts;
                        $rootScope.removeMessage();
                    })
                .catch(function (response)
                    {
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self.getPostById = function (id)
        {
            //devConsoleLog(self.postData);
            $rootScope.infoMessage('Loading...');
            postService.getPostById(id)
                .then(
                    function (response)
                    {
                        devConsoleLog(response.data);

                        self.postSingle = response.data.post;
                        $rootScope.removeMessage();
                    })
                .catch(function (response)
                    {
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self._initListPosts = function ()
        {
            self.listPosts();
        };

        self._initPostSingle = function ()
        {
            self.getPostById($routeParams.id);
        }
    }

})();
