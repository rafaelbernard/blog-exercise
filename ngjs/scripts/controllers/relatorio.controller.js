(function ()
{

    angular.module("app")
        .controller("RelatorioController", RelatoriosController);

    RelatoriosController.$inject = [
        "$rootScope",
        "ErrorHandlerService",
        "PublicService",
        "SevenService",
        "$scope"
    ];

    function RelatoriosController($rootScope,
                                  errorHandler,
                                  publicService,
                                  sevenService,
                                  $scope)
    {
        $rootScope.verifyAuthentication();

        var self = this;

        self.trincaMedicos = false;
        self.trincaFarmacia = false;

        $scope.date = new Date();

        
        //self.dadosMesAtual = [];


        self.buscarCidadesPorUF = function (uf)
        {
            devConsoleLog("buscarCidadesPorUF");

            if (!uf)
            {
                sendFeedbackMensagemErro("Informe a UF.");
            }

            self.requestInProgress = true;
            self.listaCidade = null;

            publicService.buscarCidadesPorUF(uf)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;

                        if (response.data && response.data.data)
                        {
                            self.listaCidade = response.data.data;
                        }
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        self.buscarListaFarmaciaPorParametrosLocalizacao = function (params)
        {
            devConsoleLog("buscarListaFarmaciaPorParametrosLocalizacao");

            if (!params.uf)
            {
                sendFeedbackMensagemErro("Informe a UF.");
            }
            if (!params.cidade)
            {
                sendFeedbackMensagemErro("Informe a cidade.");
            }

            self.paramsBuscaLocalizacaoFarmacia = {
                uf: params.uf,
                cidade: params.cidade,
                bairro: params.bairro || ""
            };

            self.requestInProgress = true;
            self.requisicaoBuscaFarmaciaEmAndamento = true;
            self.listaFarmacia = null;

            sevenService.buscarListaFarmaciaPorParametros(self.paramsBuscaLocalizacaoFarmacia)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.requisicaoBuscaFarmaciaEmAndamento = false;
                        self.listaFarmacia = response.data;
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        self.requisicaoBuscaFarmaciaEmAndamento = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        self.buscarListaMarca = function ()
        {
            devConsoleLog("buscarListaMarca");

            self.requestInProgress = true;
            self.listaMarca = null;

            sevenService.buscarListaMarcaPorParametros()
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.listaMarca = response.data;
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        self.processarTodosDadosCompraRecompraFarmaciaPorParametros = function (cnpj, idMarca)
        {
            devConsoleLog("processarTodosDadosCompraRecompraFarmaciaPorParametros");
            self.processarDadosCompraRecompraPorDiaFarmacia7DiasD_1(cnpj, idMarca);
            self.processarDadosCompraRecompraPorDiaFarmaciaMesAtual(cnpj, idMarca);
            self.processarDadosCompraRecompraPorMesFarmacia3MesesM_1(cnpj, idMarca);
        };

        self.processarDadosCompraRecompraPorDiaFarmacia7DiasD_1 = function (cnpj, idMarca)
        {
            devConsoleLog("processarDadosCompraRecompraPorDiaFarmacia7DiasD_1");
            self.trincaFarmacia = true;

            if (!cnpj)
            {
                sendFeedbackMensagemErro("Escolha uma farmácia.");
                return;
            }

            if (!idMarca)
            {
                sendFeedbackMensagemErro("Escolha uma marca.");
                return;
            }

            var params = {
                periodo: "7diasD-1"
            };

            self.requestInProgress = true;
            self.requisicaoDadosCompraRecompraPorDiaFarmacia7DiasD_1 = true;

            sevenService.buscarVendaEstatisticaCompraRecompraPorDiaDeFarmaciaEMarcaPorParametros(cnpj, idMarca, params)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.requisicaoDadosCompraRecompraPorDiaFarmacia7DiasD_1 = self.requestInProgress;

                        self.listaDadosCompraRecompra7Dias = response.data;
                        $scope.labels = [];
                        self.dadosCompraRecompraFarmacia7Dias = [];
                        self.dadosCompraRecompraFarmacia7Dias[0] = [];
                        self.dadosCompraRecompraFarmacia7Dias[1] = [];
                        self.dadosCompraRecompraFarmacia7Dias[2] = [];
                        //devConsoleLog("TAMANHO: " + self.listaDadosCompraRecompra7Dias.length);
                        for (var j = 0; j < self.listaDadosCompraRecompra7Dias.length; j++)
                        {
                            $scope.labels.push(self.listaDadosCompraRecompra7Dias[j].dia);
                            self.dadosCompraRecompraFarmacia7Dias[0].push(self.listaDadosCompraRecompra7Dias[j].soma_caixas_primeira_compra);
                            self.dadosCompraRecompraFarmacia7Dias[1].push(self.listaDadosCompraRecompra7Dias[j].soma_caixas_recompra);
                            self.dadosCompraRecompraFarmacia7Dias[2].push(self.listaDadosCompraRecompra7Dias[j].soma_caixas_venda);
                        }

                    })
                .catch(function (erro)
                    {
                        //devConsoleLog(erro);
                        self.requestInProgress = false;
                        self.requisicaoDadosCompraRecompraPorDiaFarmacia7DiasD_1 = self.requestInProgress;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        // FARMÁCIAS - ÚLTIMOS 7 DIAS
       
        $scope.series = ['Compra', 'Recompra', 'Total'];
        //self.data = [];
        // $scope.onClick = function (points, evt)
        // {
        //     console.log(points, evt);
        // };
        $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
        $scope.options = {
            legend: {display: true, position: 'top'},
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };

        /**
         *
         * @param cnpj
         * @param idMarca
         */
        self.processarDadosCompraRecompraPorDiaFarmaciaMesAtual = function (cnpj, idMarca)
        {
            devConsoleLog("processarDadosCompraRecompraPorDiaFarmaciaMesAtual");

            if (!cnpj)
            {
                sendFeedbackMensagemErro("Escolha uma farmácia.");
                return;
            }

            if (!idMarca)
            {
                sendFeedbackMensagemErro("Escolha uma marca.");
                return;
            }

            var params = {
                periodo: "mesAtual"
            };

            self.requestInProgress = true;
            self.requisicaoDadosCompraRecompraPorDiaFarmaciaMesAtual = self.requestInProgress;

            sevenService.buscarVendaEstatisticaCompraRecompraPorDiaDeFarmaciaEMarcaPorParametros(cnpj, idMarca, params)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.requisicaoDadosCompraRecompraPorDiaFarmaciaMesAtual = self.requestInProgress;
                        self.listaDadosCompraRecompra = response.data;

                        self.listaDadosCompraRecompraMesAtual = response.data;
                        self.labelMesAtualFarmacia = [];
                        self.dadosMesAtualFarmacia = [[], [], []];

                        self.listaDadosCompraRecompraMesAtual.map(
                            function (item)
                            {
                                self.dadosMesAtualFarmacia[0].push(item.soma_caixas_primeira_compra);
                                self.dadosMesAtualFarmacia[1].push(item.soma_caixas_recompra);
                                self.dadosMesAtualFarmacia[2].push(item.soma_caixas_venda);
                                self.labelMesAtualFarmacia.push(item.dia);
                            });


                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        self.requisicaoDadosCompraRecompraPorDiaFarmaciaMesAtual = self.requestInProgress;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        /**
         * FARMÁCIAS - MÊS CORRENTE (30 DIAS)
         * @param cnpj
         * @param idMarca
         */
        self.processarDadosCompraRecompraPorMesFarmacia3MesesM_1 = function (cnpj, idMarca)
        {
            devConsoleLog("processarDadosCompraRecompraPorMesFarmacia3MesesM_1");

            if (!cnpj)
            {
                sendFeedbackMensagemErro("Escolha uma farmácia.");
                return;
            }

            if (!idMarca)
            {
                sendFeedbackMensagemErro("Escolha uma marca.");
                return;
            }

            var params = {
                groupBy: "mes",
                periodo: "3mesesM-1"
            };

            self.requestInProgress = true;
            self.requisicaoDadosCompraRecompraPorMesFarmacia3MesesM_1 = self.requestInProgress;

            sevenService.buscarVendaEstatisticaCompraRecompraDeFarmaciaEMarcaPorParametros(cnpj, idMarca, params)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.requisicaoDadosCompraRecompraPorMesFarmacia3MesesM_1 = self.requestInProgress;

                        self.listaDadosCompraRecompra3Meses = response.data;

                        $scope.labelsTres = [];
                        $scope.dataTres = [];
                        $scope.dataTres[0] = [];
                        $scope.dataTres[1] = [];
                        $scope.dataTres[2] = [];

                        for (var k = 0; k < self.listaDadosCompraRecompra3Meses.length; k++)
                        {
                            $scope.labelsTres.push(self.listaDadosCompraRecompra3Meses[k].mes);
                            $scope.dataTres[0].push(self.listaDadosCompraRecompra3Meses[k].soma_caixas_primeira_compra);
                            $scope.dataTres[1].push(self.listaDadosCompraRecompra3Meses[k].soma_caixas_recompra);
                            $scope.dataTres[2].push(self.listaDadosCompraRecompra3Meses[k].soma_caixas_venda);
                        }

                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };


        // $scope.datasetOverrideTres = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
        // $scope.optionsTres = {
        //     legend: {display: true},
        //     scales: {
        //         yAxes: [
        //             {
        //                 id: 'y-axis-1',
        //                 type: 'linear',
        //                 display: true,
        //                 position: 'left'
        //             },
        //             {
        //                 id: 'y-axis-2',
        //                 type: 'linear',
        //                 display: true,
        //                 position: 'right'
        //             }
        //         ]
        //     }
        // };

        self.processarTodosDadosCompraRecompraMedicoPorParametrosV1 = function (ufDocumentoProfissional, numeroDocumentoProfissional, idMarca)
        {
            devConsoleLog("processarTodosDadosCompraRecompraMedicoPorParametros");
            self.processarDadosCompraRecompraPorDiaMedico7DiasD_1V1(ufDocumentoProfissional, numeroDocumentoProfissional, idMarca);
            self.processarDadosCompraRecompraPorDiaMedicoMesAtualV1(ufDocumentoProfissional, numeroDocumentoProfissional, idMarca);
            self.processarDadosCompraRecompraPorMesMedico3MesesM_1V1(ufDocumentoProfissional, numeroDocumentoProfissional, idMarca);
        };

        self.buscarMedicoCadastradoById = function (ufDocumentoProfissional, numeroDocumentoProfissional)
        {
            devConsoleLog("buscarMedicoCadastradoById");

            self.requestInProgress = true;
            self.medicoCadastradoResultadoBusca = null;

            sevenService.buscarMedicoById(ufDocumentoProfissional, numeroDocumentoProfissional)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.medicoCadastradoResultadoBusca = response.data;
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        self.processarDadosCompraRecompraPorDiaMedico7DiasD_1V1 = function (ufDocumentoProfissional, numeroDocumentoProfissional, idMarca)
        {
            devConsoleLog("processarDadosCompraRecompraPorDiaMedico7DiasD_1V1");

            self.relatorioAtualMedicos = "setediasMedicos";
            self.trincaMedicos = true;

            if (!ufDocumentoProfissional)
            {
                sendFeedbackMensagemErro("Informe a UF do profissional.");
                return;
            }

            if (!numeroDocumentoProfissional)
            {
                sendFeedbackMensagemErro("Informe o número do documento do profissional.");
                return;
            }

            if (!idMarca)
            {
                sendFeedbackMensagemErro("Escolha uma marca.");
                return;
            }

            var params = {
                periodo: "7diasD-1",
                idMarca: idMarca,
                ufDocumentoProfissional: ufDocumentoProfissional,
                numeroDocumentoProfissional: numeroDocumentoProfissional
            };

            self.requestInProgress = true;
            self.listaDadosCompraRecompra7DiasMedico = null;

            sevenService.buscarVendaSomaCompraRecompraDeMedicoEMarcaPorParametrosV1(params)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response.data);
                        self.requestInProgress = false;
                        self.listaDadosCompraRecompra7DiasMedico = response.data;

                        //self.series7DiasMedico = ["Compra", "Recompra"];
                        self.labels7DiasMedico = [];
                        self.data7DiasMedico = [];
                        self.data7DiasMedico[0] = [];
                        self.data7DiasMedico[1] = [];
                        self.data7DiasMedico[2] = [];

                        self.listaDadosCompraRecompra7DiasMedico.map(
                            function (item)
                            {
                                self.labels7DiasMedico.push(item.dia);
                                self.data7DiasMedico[0].push(item.soma_caixas_primeira_compra);
                                self.data7DiasMedico[1].push(item.soma_caixas_recompra);
                                self.data7DiasMedico[2].push(item.soma_caixas_venda);
                            });
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        /**
         *
         * @param ufDocumentoProfissional
         * @param numeroDocumentoProfissional
         * @param idMarca
         */
        self.processarDadosCompraRecompraPorDiaMedicoMesAtualV1 = function (ufDocumentoProfissional, numeroDocumentoProfissional, idMarca)
        {
            devConsoleLog("processarDadosCompraRecompraPorDiaMedicoMesAtualV1");
            self.relatorioAtualMedicos = "mesatualMedicos";
            if (!ufDocumentoProfissional)
            {
                sendFeedbackMensagemErro("Informe a UF do profissional.");
                return;
            }

            if (!numeroDocumentoProfissional)
            {
                sendFeedbackMensagemErro("Informe o número do documento do profissional.");
                return;
            }

            if (!idMarca)
            {
                sendFeedbackMensagemErro("Escolha uma marca.");
                return;
            }

            var params = {
                periodo: "mesAtual",
                idMarca: idMarca,
                ufDocumentoProfissional: ufDocumentoProfissional,
                numeroDocumentoProfissional: numeroDocumentoProfissional
            };

            self.requestInProgress = true;
            self.listaDadosCompraRecompraMesAtualMedico = null;

            sevenService.buscarVendaSomaCompraRecompraDeMedicoEMarcaPorParametrosV1(params)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response.data);
                        self.requestInProgress = false;
                        self.listaDadosCompraRecompraMesAtualMedico = response.data;

                        self.dadosMesAtualMedico = [[], [], []];
                        self.labelsMesAtualMedico = [];

                        self.listaDadosCompraRecompraMesAtualMedico.map(function (item)
                        {
                            self.dadosMesAtualMedico[0].push(item.soma_caixas_primeira_compra);
                            self.dadosMesAtualMedico[1].push(item.soma_caixas_recompra);
                            self.dadosMesAtualMedico[2].push(item.soma_caixas_venda);
                            self.labelsMesAtualMedico.push(item.dia);
                        });
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        /**
         * Dados de compra e recompra por mes
         * De medico e marca nos ultimos 3 meses (M-1)
         * @param ufDocumentoProfissional
         * @param numeroDocumentoProfissional
         * @param idMarca
         */
        self.processarDadosCompraRecompraPorMesMedico3MesesM_1V1 = function (ufDocumentoProfissional, numeroDocumentoProfissional, idMarca)
        {
            devConsoleLog("processarDadosCompraRecompraPorMesMedico3MesesM_1V1");
            self.relatorioAtualMedicos = "tresmesesMedicos";
            if (!ufDocumentoProfissional)
            {
                sendFeedbackMensagemErro("Informe a UF do profissional.");
                return;
            }

            if (!numeroDocumentoProfissional)
            {
                sendFeedbackMensagemErro("Informe o número do documento do profissional.");
                return;
            }

            if (!idMarca)
            {
                sendFeedbackMensagemErro("Escolha uma marca.");
                return;
            }

            var params = {
                periodo: "3mesesM-1",
                groupBy: "mes",
                idMarca: idMarca,
                ufDocumentoProfissional: ufDocumentoProfissional,
                numeroDocumentoProfissional: numeroDocumentoProfissional,
            };

            self.requestInProgress = true;
            self.listaDadosCompraRecompra3MesesMedico = null;

            sevenService.buscarVendaSomaCompraRecompraDeMedicoEMarcaPorParametrosV1(params)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response.data);
                        self.requestInProgress = false;
                        self.listaDadosCompraRecompra3MesesMedico = response.data;

                        self.dados3MesesMedico = [[], [], []];
                        self.labels3MesesMedico = [];

                        self.listaDadosCompraRecompra3MesesMedico.map(function (item)
                        {
                            self.dados3MesesMedico[0].push(item.soma_caixas_primeira_compra);
                            self.dados3MesesMedico[1].push(item.soma_caixas_recompra);
                            self.dados3MesesMedico[2].push(item.soma_caixas_venda);
                            self.labels3MesesMedico.push(item.mes);
                        });
                    })
                .catch(function (erro)
                    {
                        self.requestInProgress = false;
                        errorHandler.sendFeedbackErro(erro);
                    }
                );
        };

        /**
         * Funcao de inicializacao do controller
         * @private
         */
        self._init = function ()
        {
            devConsoleLog("init");

            self.coresPadraoGraficos = ['#00aeef', '#ec008c', '#2e3192'];
            // self.coresPadraoGraficos = [
            //     {fillColor:['red', 'red', 'red']}, 
            //     {strokeColor:['red', 'red', 'red']}
            // ];
            
            self.seriesPadraoGraficos = ["Compra", "Recompra", "Total"];
            
            // $scope.coresRelatorio1 = ['#00aeef', '#ec008c'];
            // $scope.coresRelatorio2 = ['#00aeef', '#ec008c'];
            // $scope.coresRelatorio1 = ['#00aeef', '#ec008c'];





        };

    }

})();
