(function ()
{

    angular.module("app")
        .controller("LoginController", LoginController);

    LoginController.$inject = [
        "$location",
        "$rootScope",
        'BarramentoService',
        'UserService'
    ];

    function LoginController($location,
                             $rootScope,
                             barramentoService,
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

                    if (!response.data)
                    {
                        return sendFeedback("Auth error");
                    }

                    var user = response.data;

                    self.r = user;

                    $rootScope.sessao.setLogged(true);
                    $rootScope.sessao.setUser(user);

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
