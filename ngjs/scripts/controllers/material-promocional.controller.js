(function ()
{
    angular
        .module("app")
        .controller("MaterialPromocionalController", MaterialPromocionalController);

    MaterialPromocionalController.$inject = [
        "$document",
        "$rootScope",
        "BarramentoService",
        "ErrorHandlerService",
        "$scope",
        "$mdDialog",
        "FarmaciaService"];

    function MaterialPromocionalController($document,
                                           $rootScope,
                                           barramentoService,
                                           errorHandler, $scope, $mdDialog, farmaciaService)
    {
        $rootScope.verificarAutenticacao();

        var self = this;
        $scope.status = '  ';
        $scope.customFullscreen = false;
        // Variaveis padrao

        // variaveis padrao - bool
        self.necessitaVerificarCep = true;
        self.requisicaoEmAndamento = false;


        $scope.theme = 'blue';

        //   var isThemeRed = true;

        //   $interval(function () {
        //     $scope.theme = isThemeRed ? 'blue' : 'red';

        //     isThemeRed = !isThemeRed;
        //   }, 2000);


        self.tipoDeMaterial = '';
        $scope.showModalMaterial = function (tipoDeMaterial)
        {
            $rootScope.materialSelecionado = tipoDeMaterial;
            $scope.showAdvanced();
        };

        $scope.showAdvanced = function ()
        {
            $mdDialog.show({
                controller: MaterialPromocionalController,
                templateUrl: '/views/includes/template_modal_promocional.html',
                parent: angular.element($document.body),
                //   targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer)
                {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function ()
                {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        // function DialogController($scope, $mdDialog)
        // {
        //     $scope.hide = function ()
        //     {
        //         $mdDialog.hide();
        //     };
        //
        //     $scope.cancel = function ()
        //     {
        //         $mdDialog.cancel();
        //     };
        //
        //     $scope.answer = function (answer)
        //     {
        //         $mdDialog.hide(answer);
        //     };
        // }

        // variaveis padrao - objeto
        self.materialPromocionalPedidoEmEdicao = {};

        self.getOpcoesMaterialPromocional = function ()
        {
            //console.log("getMaterialPromocional");
            return farmaciaService.getOpcoesMaterialPromocional();
        };

        self.solicitarMaterialPromocional = function ()
        {
            devConsoleLog("solicitarMaterialPromocional");
            //devConsoleLog(materialPromocionalPedido);

            self.requisicaoEmAndamento = true;

            self.materialPromocionalPedidoEmEdicao.idUsuarioInclusao = angular.copy($rootScope.sessao.getUsuario().id);

            farmaciaService.solicitarMaterialPromocional(self.materialPromocionalPedidoEmEdicao)
                .then(function (response)
                {
                    devConsoleLog(response);
                    self.requisicaoEmAndamento = false;

                    sendFeedback("Material promocional solicitado.");

                    self._initDadosMaterialPromocionalPedido();
                })
                .catch(function (response)
                {
                    self.requisicaoEmAndamento = false;
                    errorHandler.sendFeedbackErro(response);
                });
        };

        self._initDadosMaterialPromocionalPedido = function ()
        {
            devConsoleLog("_initDadosMaterialPromocionalPedido");
            var listaMaterialPromocionalOpcao = [];
            /*
            listaMaterialPromocionalOpcao[0] = {cod_material_opcao: 'ade'};
            listaMaterialPromocionalOpcao[1] = {cod_material_opcao: 'omon'};
            listaMaterialPromocionalOpcao[2] = {cod_material_opcao: 'spap'};
            listaMaterialPromocionalOpcao[3] = {cod_material_opcao: 'bex'};
            listaMaterialPromocionalOpcao[4] = {cod_material_opcao: 'papo'};
            listaMaterialPromocionalOpcao[5] = {cod_material_opcao: 'zip'};
            */
            self.getOpcoesMaterialPromocional()
                .then(function (response)
                {
                    //console.log("respondendo");
                    listaMaterialPromocionalOpcao = response.data;

                    //devConsoleLog("nova lista");
                    //devConsoleLog(listaMaterialPromocionalOpcao);

                    var dadosMaterialPromocionalPedido = {
                        "cnpj": "",
                        "nomeContato": "",
                        "telefoneContato": "",
                        "emailContato": "",
                        "cep": "",
                        "uf": "",
                        "cidade": "",
                        "bairro": "",
                        "tipoLogradouro": "",
                        "endereco": "",
                        "enderecoNumero": "",
                        "enderecoComplemento": null,
                        "nomeEventoUtilizacao": "",
                        "centroCusto": "",
                        "observacao": null,
                        "timestampExtracao": null,
                        "timestampEncerrado": null,
                        "inclusao": null,
                        "ipInclusao": null,
                        "idUsuarioInclusao": "",
                        "ipAlteracao": null,
                        "idUsuarioAlteracao": null,
                        "tipoUsuarioAlteracao": null
                    };
                    dadosMaterialPromocionalPedido.listaMaterialPromocionalOpcao = listaMaterialPromocionalOpcao;

                    self.materialPromocionalPedidoEmEdicao = angular.copy(dadosMaterialPromocionalPedido);
                })
                .catch(function (error)
                {
                    errorHandler.sendFeedbackErro(error);
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
         * @param resultadoEndereco
         */
        self.verificarCepMunicipal = function (resultadoEndereco)
        {
            devConsoleLog("verificarCepMunicipal");
            self.cepMunicipal = false;

            if (resultadoEndereco.cidade === '' || resultadoEndereco.bairro === '' || resultadoEndereco.logradouro === '' || resultadoEndereco.tipoLogradouro === '')
            {
                self.cepMunicipal = true;
            }
        };

        /**
         * Lista de tipos de logradouro
         */
        self.getTipoLogradouro = function ()
        {
            devConsoleLog("getTipoLogradouro");

            self.requisicaoEmAndamento = true;
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
                        self.requisicaoEmAndamento = false;
                    })
                .catch(function (response)
                    {
                        self.requisicaoEmAndamento = false;
                        barramentoService.exibirMensagemErro(response);
                    }
                );
        };

        /**
         *
         * @param formulario
         */
        self.limparEnderecoCadastro = function (formulario)
        {
            devConsoleLog("limparEnderecoCadastro");
            formulario.tipoLogradouro = "";
            formulario.logradouro = "";
            // caso logradouro seja chamado de endereco
            formulario.endereco = formulario.logradouro;
            formulario.enderecoNumero = '';
            formulario.enderecoComplemento = '';
            formulario.bairro = '';
            formulario.cidade = "";
            formulario.uf = "";
        };

    }

})();
