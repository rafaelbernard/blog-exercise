(function ()
{

    angular.module("app")
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$location',
        '$rootScope',
        'UserService'
    ];

    function LoginController($location,
                             $rootScope,
                             userService)
    {

        var self = this;

        self.loginV1 = function (dadosLogin)
        {
            devConsoleLog("loginV1");

            self.requestInProgress = true;

            userService.signin(dadosLogin)
                .then(function (response)
                {
                    self.requestInProgress = false;

                    if (!response.data || !response.data.user && !response.data.token)
                    {
                        return sendFeedback("Auth error");
                    }

                    var data = response.data;

                    $rootScope.session.setLogged(true);
                    $rootScope.session.setAuthenticationData(data.user, data.token);

                    $location.path('/admin/post');
                })
                .catch(function (response)
                {
                    self.requestInProgress = false;
                    $rootScope.messageError(response.data.msg || "Error");
                });
        };

    }

})();
