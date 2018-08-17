(function ()
{

    angular.module("app")
        .controller('PostController', PostController);

    PostController.$inject = [
        '$rootScope',
        'PostService',
        "ErrorHandlerService",
        "PublicService"
    ];

    function PostController($rootScope, postService, errorHandler, PublicService)
    {
        //$rootScope.verifyAuthentication();

        var self = this;

        self.postData = {};

        self._creating         = false;
        self._updating         = false;
        self.requestInProgress = false;

        self.createPost = function ()
        {
            //devConsoleLog(self.postData);
            self.requestInProgress = true;

            // @todo Fix user info
            self.postData.user_id      = 1;
            self.postData.is_published = 1;

            postService.createPost(self.postData)
                .then(
                    function (response)
                    {
                        devConsoleLog(response.data);

                        self._creating         = false;
                        self._updating         = false;
                        self.requestInProgress = false;
                        self.postData          = {};
                        $rootScope.messageSuccess(response.data.msg || "Success");
                    })
                .catch(function (response)
                    {
                        self.requestInProgress = false;
                        $rootScope.messageError(response.data);
                    }
                );
        };

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

        self._initListPosts = function ()
        {
            self.listPosts();
        }
    }

})();
