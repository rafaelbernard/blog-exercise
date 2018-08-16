(function ()
{

    angular.module("app")
        .controller("LoginController", LoginController);

    LoginController.$inject = [
        "$location",
        "$rootScope",
        "AcheService",
        "BarramentoService",
    ];

    function LoginController($location,
                             $rootScope,
                             acheService,
                             barramentoService)
    {

        var self = this;

        self.loginV1 = function (dadosLogin)
        {
            devConsoleLog("loginV1");

            self.requestInProgress = true;

            barramentoService.auth(dadosLogin)
                .then(function (response)
                {
                    self.requestInProgress = false;

                    if (!response.data)
                    {
                        return sendFeedback("Auth error");
                    }

                    var user = response.data;

                    self.r = user;

                    $rootScope.sessao.setLogado(true);
                    $rootScope.sessao.setUser(user);

                    //$location.path("/inicial/colaborador");
                })
                .catch(function (response)
                {
                    self.requestInProgress = false;
                    barramentoService.showErrorMessage(response);
                });
        };

    }

})();
