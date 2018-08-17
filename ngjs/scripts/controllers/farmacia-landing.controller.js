(function ()
{
    angular
        .module("app")
        .controller("FarmaciaLandingController", FarmaciaLandingController);

    FarmaciaLandingController.$inject = [
        "$location",
        "$rootScope",
        "$routeParams",
        "_",
        "BarramentoService",
        "PublicService",
        "ColaboradorService",
        "ErrorHandlerService"
    ];

    function FarmaciaLandingController($location,
                                       $rootScope,
                                       $routeParams,
                                       _,
                                       barramentoService,
                                       publicService,
                                       emcampoService,
                                       errorHandler)
    {
        var self = this;

        self.intencaoCredenciamentoRealizada = false;
        $rootScope.verificaPaginaSelecionada = "farmacias";
        $rootScope.namePage = "pagina_credenciamento";
        self.buscarConviteFarmaciaPorRouteParam = function ()
        {
            devConsoleLog("buscarConviteFarmaciaPorRouteParam");

            if (!$routeParams.chaveConviteFarmacia)
            {
                return sendFeedbackMensagemErro("Parâmetro de chave de convite inexistente");
            }

            return self.buscarConviteFarmaciaPorChaveConvite($routeParams.chaveConviteFarmacia);
        };

        self.buscarConviteFarmaciaPorChaveConvite = function (chaveConviteFarmacia)
        {
            devConsoleLog("buscarConviteFarmaciaPorChaveConvite");

            self.conviteFarmacia = null;
            self.requestInProgress = true;

            emcampoService.getConviteFarmaciaPorChaveConvite(chaveConviteFarmacia)
                .then(function (response)
                      {
                          self.requestInProgress = false;

                          var conviteFarmacia = response.data;

                          self.autorizarFormularioIntencaoCredenciamento(conviteFarmacia);

                          self.conviteFarmacia = response.data;
                      })
                .catch(function (response)
                       {
                           self.requestInProgress = false;
                           errorHandler.sendFeedbackErro(response);
                       });
        };

        self.autorizarFormularioIntencaoCredenciamento = function (conviteFarmacia)
        {
            if (_.isEmpty(conviteFarmacia))
            {
                return self.informarConviteInexistenteERedirecionar();
            }

            return self;
        };

        self.informarConviteInexistenteERedirecionar = function ()
        {
            sendFeedbackMensagemErro("Convite inexistente");
            $location.path("/");
            return;
        };

        /**
         *
         * @param intencaoCredenciamentoAEnviar
         */
        self.enviarFormularioCredenciamentoLanding = function (intencaoCredenciamentoAEnviar)
        {
            devConsoleLog("enviarFormularioCredenciamentoLanding");
            self.requestInProgress = true;

            intencaoCredenciamentoAEnviar.conviteFarmacia = angular.copy(self.conviteFarmacia);

            publicService.enviarFormularioCredenciamentoLanding(intencaoCredenciamentoAEnviar)
                .then(function ()
                      {
                          self.requestInProgress = false;
                          self.intencaoCredenciamentoRealizada = true;
                      })
                .catch(function (response)
                       {
                           self.requestInProgress = false;
                           errorHandler.sendFeedbackErro(response);
                       });
        };

        /**
         *
         * @param formulario
         */
        self.buscarEnderecoPeloCep = function (formulario)
        {
            devConsoleLog("buscarEnderecoPeloCep");

            self.requisicaoBuscaEndereco = true;
            self.necessitaVerificarCep = true;
            self.cepMunicipal = false;

            self.limparEnderecoCadastro(formulario);

            barramentoService.buscarEnderecoByCep(formulario.cep)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response);
                        self.requisicaoBuscaEndereco = false;

                        if (response.data)
                        {
                            var address = angular.copy(response.data.d);

                            formulario.cep = address.CEP;
                            formulario.uf = address.siglaUF;
                            formulario.cidade = address.nomeCidade;
                            formulario.bairro = address.nomeBairro;
                            formulario.tipoLogradouro = address.tipoLogradouro;
                            formulario.logradouro = address.nomeLogradouro;
                            formulario.endereco = formulario.logradouro;

                            self.verificarCepMunicipal(formulario);
                        }
                        else
                        {
                            self.confirmandoCEPNaoEncontrado(formulario);
                        }
                    })
                .catch(function (erro)
                       {
                           devConsoleLog(erro);
                           self.requisicaoBuscaEndereco = false;
                           self.cepMunicipal = false;

                           self.confirmandoCEPNaoEncontrado(formulario);
                       }
                );
        };

        /**
         * Lista de tipos de logradouro
         */
        self.getTipoLogradouro = function ()
        {
            devConsoleLog("getTipoLogradouro");

            self.requestInProgress = true;
            self.listaTipoLogradouro = null;

            barramentoService.getTipoLogradouro()
                .then(
                    function (response)
                    {
                        if (!barramentoService.isSuccessResponseFromGet(response))
                        {
                            return;
                        }

                        self.listaTipoLogradouro = response.data.d.results;
                        self.requestInProgress = false;
                    })
                .catch(function (response)
                       {
                           self.requestInProgress = false;
                           barramentoService.messageError(response);
                       }
                );
        };

        /**
         * Confirmar CEP nao encontrado no servico
         * @param formulario
         */
        self.confirmandoCEPNaoEncontrado = function (formulario)
        {
            devConsoleLog("confirmandoCEPNaoEncontrado");
            var r = confirm("CEP não encontrado. Quer utilizá-lo assim mesmo?");
            if (r === true)
            {
                self.limparEnderecoCadastro(formulario);
                self.necessitaVerificarCep = false;
            }
            else
            {
                self.limparEnderecoCadastro(formulario);
                self.necessitaVerificarCep = true;
            }
        };

        /**
         *
         * @param endereco
         */
        self.verificarCepMunicipal = function (endereco)
        {
            devConsoleLog("verificarCepMunicipal");
            self.cepMunicipal = false;

            if (endereco.cidade === '' || endereco.bairro === '' || endereco.logradouro === '' || endereco.tipoLogradouro === '')
            {
                self.cepMunicipal = true;
            }
        };

        /**
         *
         * @param formulario
         */
        self.limparEnderecoCadastro = function (formulario)
        {
            devConsoleLog("limparEnderecoCadastro");
            formulario.tipoLogradouro = "";
            formulario.logradouro = '';
            formulario.endereco = formulario.logradouro;
            formulario.numeroEndereco = '';
            formulario.numero = formulario.numeroEndereco;
            formulario.complementoEndereco = '';
            formulario.complemento = formulario.complementoEndereco;
            formulario.bairro = '';
            formulario.cidade = '';
            formulario.uf = '';
        };

    }

})();
