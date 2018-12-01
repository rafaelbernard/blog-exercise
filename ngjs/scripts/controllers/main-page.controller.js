(function ()
{

    angular.module('app')
        .controller('MainPageController', MainPageController);

    MainPageController.$inject = [
        '$rootScope',
        '$routeParams',
        'PollService',
        "ErrorHandlerService"
    ];

    function MainPageController($rootScope,
                                $routeParams,
                                pollService,
                                errorHandler)
    {
        var self = this;

        self.postData = {};

        self.requestInProgress = false;

        self.listPolls = function ()
        {
            $rootScope.messageInfo('Loading...');
            pollService.listPolls()
                .then(
                    function (response)
                    {
                        self.pollsList = response.data;
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
            $rootScope.messageInfo('Loading...');
            postService.getPostById(id)
                .then(
                    function (response)
                    {
                        //self.postSingle = response.data.post;
                        self.postSingle = response.data;
                        $rootScope.removeMessage();
                    })
                .catch(function (response)
                    {
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self._init = function ()
        {
            self.listPolls();
        };

        self._initPostSingle = function ()
        {
            devConsoleLog("_initPostSingle");
            self.getPostById($routeParams.id);
        };
    }

})();
