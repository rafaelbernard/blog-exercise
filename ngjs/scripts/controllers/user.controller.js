(function ()
{

    angular.module("app")
        .controller('UserController', UserController);

    UserController.$inject = [
        "$rootScope",
        'UserService',
        "ErrorHandlerService",
        "PublicService"
    ];

    function UserController($rootScope, userService, errorHandler, PublicService)
    {
        //$rootScope.verifyAuthentication();

        var self = this;

        self.userData = {};

        self._creating         = false;
        self._updating         = false;
        self.requestInProgress = false;

        self.prepareAddUser = function ()
        {
            self._creating = true;
            self.userData  = {};
        };

        self.createUser = function ()
        {
            //devConsoleLog(self.userData);
            self.requestInProgress = true;
            userService.createUser(self.userData)
                .then(
                    function (response)
                    {
                        devConsoleLog(response.data);

                        self._creating         = false;
                        self._updating         = false;
                        self.requestInProgress = false;
                        self.userData          = {};
                        $rootScope.messageSuccess(response.data.msg || "Success");

                        self.listUsers();
                    })
                .catch(function (response)
                    {
                        self.requestInProgress = false;
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self.listUsers = function ()
        {
            //devConsoleLog(self.userData);
            $rootScope.infoMessage('Loading...');
            userService.listUsers(self.userData)
                .then(
                    function (response)
                    {
                        devConsoleLog(response.data);

                        self.userList = response.data.users;
                        $rootScope.removeMessage();
                    })
                .catch(function (response)
                    {
                        self.requestInProgress = false;
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self._initListUsers = function ()
        {
            self.listUsers();
        }
    }

})();
