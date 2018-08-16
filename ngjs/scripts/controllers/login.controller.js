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

        $rootScope.namePage = "pagina_login";

        self.loginV1 = function (dadosLogin)
        {
            devConsoleLog("loginV1");

            self.requisicaoEmAndamento = true;

            barramentoService.salesforceAuthenticate(dadosLogin)
                .then(function (response)
                {
                    if (!response.data.Matricula || !response.data.CPF)
                    {
                        self.requisicaoEmAndamento = false;
                        return sendFeedback("Login não realizado.");
                    }

                    dadosLogin.matricula = response.data.Matricula;
                    dadosLogin.cpf       = response.data.CPF;

                    barramentoService.buscarDocumento(dadosLogin)
                        .then(function (response)
                        {
                            self.requisicaoEmAndamento = false;

                            if (!response.data)
                            {
                                return sendFeedback("Erro na autenticação");
                            }

                            var colaborador = response.data;

                            if (!colaborador.CPF)
                            {
                                return sendFeedback("Erro na autenticação");
                            }

                            $rootScope.sessao.setLogado(true);
                            $rootScope.sessao.setUsuarioColaborador(colaborador);

                            var pcsFuncionario               = angular.copy(colaborador);
                            pcsFuncionario.idUsuarioInclusao = pcsFuncionario.CPF;

                            acheService.inserirPcsFuncionario(pcsFuncionario)
                                .catch(function ()
                                {
                                    //do nothing
                                });
                            acheService.loginPcsFuncionario(colaborador)
                                .then(function (response)
                                {
                                    colaborador._login = response.data;
                                    $rootScope.sessao.setUsuarioColaborador(colaborador);
                                })
                                .catch(function ()
                                {
                                    //do nothing
                                });

                            $location.path("/inicial/colaborador");
                        })
                        .catch(function (response)
                        {
                            self.requisicaoEmAndamento = false;
                            barramentoService.exibirMensagemErro(response);
                        });
                })
                .catch(function (response)
                {
                    self.requisicaoEmAndamento = false;
                    // TODO verificar se o back retorna o erro do barramento
                    // barramentoService.exibirMensagemErro(response);
                    devConsoleLog(JSON.stringify(response));
                    sendFeedback('Usuário ou senha inválidos.', 'alert');
                });
        };

    }

})();
