(function ()
{

    angular.module("app")
        .controller('UserController', UserController);

    UserController.$inject = [
        "$rootScope",
        'UserService'
    ];

    function UserController($rootScope, userService)
    {
        $rootScope.verifyAuthentication();

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
            $rootScope.messageInfo("Processing...");
            userService.createUser(self.userData)
                .then(
                    function ()
                    {
                        self._creating         = false;
                        self._updating         = false;
                        self.requestInProgress = false;
                        self.userData          = {};
                        $rootScope.messageSuccess("Success");

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
            $rootScope.messageInfo('Loading...');
            userService.listUsers(self.userData)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response.data);

                        //self.userList = response.data;
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
        };
    }

})();
