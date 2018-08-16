(function ()
{

    angular.module("app")
        .controller("cadastroController", cadastroController);

    cadastroController.$inject = [
        "$anchorScroll",
        "$location",
        "$rootScope",
        "$scope",
        "_",
        "BarramentoService",
        "IntegracaoService",
        "PublicService",
    ];

    function cadastroController($anchorScroll,
                                $location,
                                $rootScope,
                                $scope,
                                _,
                                barramentoColaboradorService,
                                integracaoService,
                                publicService)
    {
        $rootScope.verificarAutenticacao();

        var self = this;

        self.cidades = {};

        self.listaMedicos = {};

        self.voltarFaseUm = function ()
        {
            self._init();
        };

        /**
         *
         * @returns {boolean}
         */

        self.cadastroFaseUmV2 = function ()
        {
            devConsoleLog("cadastroFaseUmV2");

            self.requestInProgress         = true;
            self.requestInProgressBuscaCPF = true;

            if (isValidCPF(self.formCadastro.cpf) === false)
            {
                sendFeedback('Informe um CPF válido.', 'alert');
                self.requestInProgress = false;
                return false;
            }

            if (!self.formCadastro.viewDataNascConsumidor)
            {
                sendFeedback('Informe uma data de nascimento válida.', 'alert');
                //$scope.requestInProgress = false;
                self.requestInProgress         = false;
                self.requestInProgressBuscaCPF = false;
                return false;
            }

            self.formCadastro.DataNascConsumidor = formatDate(self.formCadastro.viewDataNascConsumidor);

            if (!isValidDate(self.formCadastro.DataNascConsumidor))
            {
                sendFeedback('Informe uma data de nascimento válida.', 'alert');
                //$scope.requestInProgress = false;
                self.requestInProgress         = false;
                self.requestInProgressBuscaCPF = false;
                return false;
            }

            // menos do que 1 ano, eh invalido
            if ((new Date()).getFullYear() - self.formCadastro.DataNascConsumidor.getFullYear() < 1)
            {
                sendFeedback('Informe uma data de nascimento válida.', 'alert');
                //$scope.requestInProgress = false;
                self.requestInProgress         = false;
                self.requestInProgressBuscaCPF = false;
                return false;
            }
            if ((new Date()).getFullYear() - self.formCadastro.DataNascConsumidor.getFullYear() > 120)
            {
                sendFeedback('Informe uma data de nascimento válida.', 'alert');
                //$scope.requestInProgress = false;
                self.requestInProgress         = false;
                self.requestInProgressBuscaCPF = false;
                return false;
            }

            var params = {cpf: self.formCadastro.cpf};

            barramentoColaboradorService.buscarPaciente(params)
                .then(function (response)
                {
                    barramentoColaboradorService.buscarAdesao(params)
                        .then(function (responseAdesao)
                        {
                            $rootScope.customerNotExists = false;

                            var paciente;
                            var dataNascimentoInformada;

                            if (barramentoColaboradorService.isDefinedCustomer(response) &&
                                !barramentoColaboradorService.isDefinedSubscription(responseAdesao))
                            {
                                paciente                = response.data.paciente;
                                dataNascimentoInformada = self.formCadastro.viewDataNascimetno || self.formCadastro.viewDataNascConsumidor;
                                return self.verificarDataNascimentoERecuperarDadosPaciente(paciente, dataNascimentoInformada);
                            }
                            else if (barramentoColaboradorService.isDefinedCustomer(response) &&
                                barramentoColaboradorService.isDefinedSubscription(responseAdesao))
                            {
                                paciente                = response.data.paciente;
                                dataNascimentoInformada = self.formCadastro.viewDataNascimetno || self.formCadastro.viewDataNascConsumidor;
                                return self.verificarDataNascimentoERecuperarDadosPaciente(paciente, dataNascimentoInformada);
                            }

                            self.requestInProgress         = false;
                            self.requestInProgressBuscaCPF = false;

                            $rootScope.customerNotExists = true;

                            self.formCadastro.fase1 = false;
                            self.formCadastro.fase2 = true;
                            self.formCadastro.fase3 = true;
                            self.requestInProgress  = false;

                            self.findProducts();

                        })
                        .catch(function (response)
                        {
                            devConsoleLog(response);
                            //showErrorMessage(response);
                            self.requestInProgress = false;
                        });
                })
                .catch(function (response)
                {
                    devConsoleLog(response);
                    exibirMensagemErro(response);
                    self.requestInProgress = false;
                });

        };

        /**
         *
         * @param paciente
         * @param dataNascimentoInformada
         */
        self.verificarDataNascimentoERecuperarDadosPaciente = function (paciente, dataNascimentoInformada)
        {
            devConsoleLog("verificarDataNascimentoERecuperarDadosPaciente");

            var dataNascimento     = formatDateToStrView(paciente.dataNascPaciente).replace(/\//g, "");
            var dataNascimentoForm = dataNascimentoInformada.replace(/\//g, "");

            if (dataNascimento !== dataNascimentoForm)
            {
                self.requestInProgress         = false;
                self.requestInProgressBuscaCPF = false;
                sendFeedback("CPF já cadastrado com data de nascimento diferente da indicada. Entre em contato com a Central de Atendimento.", "alert");
                return;
            }

            self.requestInProgress         = false;
            self.requestInProgressBuscaCPF = false;

            sendFeedback("CPF já cadastrado. Realize uma nova adesão.", "alert");

            self.formCadastro.UFConsumidor = paciente.uf;

            self.buscarCidades();

            self.formCadastro.NomeConsumidor      = paciente.primeiroNome;
            self.formCadastro.SobrenomeConsumidor = paciente.sobreNome;
            self.formCadastro.email               = paciente.emailPaciente;
            self.formCadastro.genero              = paciente.genero;
            self.formCadastro.generoPersonalizado = paciente.descricaoGenero;
            self.formCadastro.CidadeConsumidor    = paciente.cidade;
            self.formCadastro.DDDCelular          = paciente.dddCelularPaciente;
            self.formCadastro.FoneCelular         = paciente.celularPaciente;
            self.formCadastro.dddTelefoneFixo     = paciente.dddTelefonePaciente;
            self.formCadastro.telefoneFixo        = paciente.telefonePaciente;

            self.formCadastro.fase1 = false;
            self.formCadastro.fase2 = false;
            self.formCadastro.fase3 = true;

            //self.requestInProgress = false;
            self.findProducts();
        };


        self.buscarProfissional = function ()
        {
            devConsoleLog("buscarProfissional");

            self.requestInProgress = true;

            return integracaoService.getCrmsByUfParamsV2(self.formCadastro.UFProfissional)
                .then(function (response)
                {
                    self.listaMedicos = response.data;

                    //devConsoleLog(response.data);
                    self.requestInProgress = false;
                })
                .catch(function (response)
                {
                    devConsoleLog(response);
                    exibirMensagemErro(response);
                    self.requestInProgress = false;
                });
        };

        self.checaCrm = function (form)
        {
            barramentoColaboradorService.buscarProfissionalSaude("CRM", form.UFProfissional, form.codigoProfissional)
                .then(
                    function (response)
                    {
                        self.requestBuscaCRM = false;

                        if (!barramentoColaboradorService.isSuccessResponse(response))
                        {
                            barramentoColaboradorService.showErrorMessage(response);
                            return;
                        }
                        self.salvarCadastro();
                    })
                .catch(
                    function (erro)
                    {
                        self.requestBuscaCRM = false;
                        barramentoColaboradorService.showErrorMessage(erro);
                    }
                );
        };

        self.consultaDadosCadastro = function ()
        {
            // teste se medicamento é prescrito
            if (self.formCadastro.produto.produto.requerPrescricao === 'T')
            {

                self.checaCrm(self.formCadastro);

                // condição para medicamentos não prescritos
            }
            else
            {

                // testando se o CRM foi preenchido
                if (self.formCadastro.codigoProfissional)
                {

                    self.checaCrm(self.formCadastro);

                }
                else
                {
                    self.salvarCadastro();
                }
            }

        };

        /**
         * Salvar cadastro de paciente e adesao
         */
        self.salvarCadastro = function ()
        {
            devConsoleLog("salvarCadastro");

            self.requestInProgress = true;


            if (!self.validarFormulario())
            {
                sendFeedback('Por favor, verifique os campos obrigatórios', "alert");
                self.requestInProgress = false;
                return;
            }

            if (self.formCadastro.cpf === '' || self.formCadastro.viewDataNascConsumidor === '' ||
                self.formCadastro.cpf === undefined || self.formCadastro.viewDataNascConsumidor === undefined)
            {
                sendFeedback('Por favor, informe seu CPF e data de nascimento.', "alert");
                self.requestInProgress = false;
                return self.voltarFaseUm();
            }

            if (!self.formCadastro.codigoProfissional)
            {
                self.formCadastro.codigoProfissional = 0;
            }

            if (self.formCadastro.fase2 === true)
            {
                //Novo cadastro
                var paciente = barramentoColaboradorService.criarPacienteViaFormulario(self.formCadastro);

                integracaoService.registrarFormularioPacienteBarramento(paciente)
                    .catch(function ()
                    {
                        // do nothing
                    });

                barramentoColaboradorService.cadastrarPaciente(paciente)
                    .then(function (response)
                    {
                        if (!barramentoColaboradorService.isSuccessResponseFromPacientePost(response))
                        {
                            barramentoColaboradorService.showErrorMessage(response);
                            self.requestInProgress = false;
                            return;
                        }

                        var adesao = barramentoColaboradorService.criarAdesaoViaFormulario(self.formCadastro);

                        integracaoService.registrarFormularioAdesaoBarramento(adesao)
                            .catch(function ()
                            {
                                // do nothing
                            });

                        barramentoColaboradorService.cadastrarAdesao(adesao)
                            .then(function (response)
                            {
                                self.requestInProgress = false;

                                if (!barramentoColaboradorService.isSuccessResponse(response))
                                {
                                    barramentoColaboradorService.showErrorMessage(response);
                                    self.requestInProgress = false;
                                    return;
                                }

                                sendFeedback("Cadastro concluído com sucesso.");

                                self._init();
                            })
                            .catch(function (response)
                            {
                                devConsoleLog(response);
                                exibirMensagemErro(response);
                                self.requestInProgress = false;
                            });
                    });
            }
            else
            {
                //Nova adesao
                var adesao = barramentoColaboradorService.criarAdesaoViaFormulario(self.formCadastro);

                integracaoService.registrarFormularioAdesaoBarramento(adesao)
                    .catch(function ()
                    {
                        // do nothing
                    });

                barramentoColaboradorService.cadastrarAdesao(adesao)
                    .then(function (response)
                    {
                        if (barramentoColaboradorService.isSuccessResponse(response))
                        {
                            //devConsoleLog(response);
                            self.requestInProgress = false;

                            if (!barramentoColaboradorService.isSuccessResponse(response))
                            {
                                barramentoColaboradorService.showErrorMessage(response);
                                sendFeedback("Houve uma falha de comunicação ao incluir sua adesão. Por favor, tente realizar a inclusão da adesão novamente.");
                                return;
                            }

                            sendFeedback('Nova adesão concluida com sucesso.', 'alert');

                            self._init();

                        }
                    })
                    .catch(function (response)
                    {
                        self.requestInProgress = false;
                        devConsoleLog(response);
                        exibirMensagemErro(response);
                        //sendFeedback('Informe um CPF válido.', 'alert');
                    });
            }
        };

        /**
         *
         */
        self.validarFormulario = function ()
        {
            devConsoleLog("validarFormulario");

            if (self.formCadastro.cpf === '' || self.formCadastro.cpf === undefined ||
                self.formCadastro.viewDataNascConsumidor === '' || self.formCadastro.viewDataNascConsumidor === undefined ||
                self.formCadastro.NomeConsumidor === '' || self.formCadastro.NomeConsumidor === undefined ||
                self.formCadastro.SobrenomeConsumidor === '' || self.formCadastro.SobrenomeConsumidor === undefined ||
                self.formCadastro.genero === '' || self.formCadastro.genero === undefined ||
                self.formCadastro.UFConsumidor === '' ||
                self.formCadastro.UFConsumidor === undefined ||
                self.formCadastro.CidadeConsumidor === '' ||
                self.formCadastro.CidadeConsumidor === undefined)
            {
                devConsoleLog("1");
                self.formCadastro.cadastroFinalizado = false;
                return false;
            }


            if (self.formCadastro.DDDCelular === '' || self.formCadastro.FoneCelular === '' ||
                self.formCadastro.DDDCelular === undefined || self.formCadastro.FoneCelular === undefined)
            {

                if (self.formCadastro.dddTelefoneFixo === '' || self.formCadastro.telefoneFixo === '' ||
                    self.formCadastro.dddTelefoneFixo === undefined || self.formCadastro.telefoneFixo === undefined)
                {
                    devConsoleLog("2");
                    self.formCadastro.cadastroFinalizado = false;
                    return false;
                }

            }


            //checar se o produto é obrigatório
            if (self.formCadastro.EAN === '' ||
                self.formCadastro.EAN === undefined)
            {
                if (self.formCadastro.produto === undefined)
                {
                    self.formCadastro.cadastroFinalizado = false;
                    return false;
                }
                if (self.formCadastro.produto.requerPrescricao === 'T' &&
                    (self.formCadastro.codigoProfissional === '' || self.formCadastro.codigoProfissional === undefined ||
                        self.formCadastro.UFProfissional === '' || self.formCadastro.UFProfissional === undefined))
                {

                    self.formCadastro.cadastroFinalizado = false;
                    return false;
                }


            }

            self.formCadastro.cadastroFinalizado = true;
            return self.formCadastro.cadastroFinalizado;
        };

        self.buscarCidades = function ()
        {
            //devConsoleLog("buscarcidades");
            //self.requestInProgress = true;
            if (self.formCadastro.UFConsumidor)
            {
                return publicService.buscarCidadesPorUF(self.formCadastro.UFConsumidor)
                    .then(function (response)
                    {
                        self.cidades = response.data.data;

                        //self.requestInProgress = false;
                    })
                    .catch(function (response)
                    {
                        devConsoleLog(response);
                        //showErrorMessage(response);
                        //self.requestInProgress = false;
                    });

            }
        };

        self.verificarDadosMinimosDeCadastro = function ()
        {
            devConsoleLog('verificarDadosMinimosDeCadastro');

            if (!self.possuiDadosMinimosDeCadastro())
            {
                $location.path('/cadastro-paciente');
                return false;
            }

            return true;
        };

        self.possuiDadosMinimosDeCadastro = function ()
        {
            devConsoleLog("possuiDadosMinimosDeCadastro");

            return (($rootScope.formCadastro.cpf !== "" || $rootScope.formCadastro.cpf !== "") && self.formCadastro.viewDataNascConsumidor !== '');
        };

        self.findProducts = function ()
        {
            //devConsoleLog("findProducts");

            if (self.listaProduto)
            {
                return;
            }

            self.requestProdutoInProgress = true;

            barramentoColaboradorService.buscarProduto()
                .then(function (response)
                {
                    self.requestProdutoInProgress = false;

                    if (!barramentoColaboradorService.isSuccessResponse(response))
                    {
                        exibirMensagemErro(barramentoColaboradorService.tratarMensagemErroRequisicao(response));
                        return;
                    }

                    var arrayFinal = response.data.produtos.filter(function (produto)
                    {
                        return produto.produto.participaCPV === "T";
                    });

                    self.listaProduto = arrayFinal || null;
                })
                .catch(function (response)
                {
                    self.requestInProgress = false;
                    barramentoColaboradorService.showErrorMessage(response);
                });
        };

        /**
         * Execucao de funcoes iniciais em preparacao do cadastro
         * @private
         */
        self._init = function ()
        {
            // Declaracao e limpeza de variaveis
            self._initDadosFormularioCadastro();

            self.buscaMedicoPeloNome = false;

            self.dadosDoMedico = {};

            self.findProducts();

            $location.hash("content");
            $anchorScroll();
        };

        /**
         *
         * @private
         */
        self._initDadosFormularioCadastro = function ()
        {
            devConsoleLog("_initDadosFormularioCadastro");

            self.formCadastro = {};

            self.formCadastro.produto = {};

            self.formCadastro.cpf                    = '';
            self.formCadastro.DataNascConsumidor     = new Date();
            self.formCadastro.viewDataNascConsumidor = '';
            self.formCadastro.NomeConsumidor         = '';
            self.formCadastro.SobrenomeConsumidor    = '';
            self.formCadastro.Sexo                   = '';
            self.formCadastro.email                  = '';
            self.formCadastro.genero                 = '';
            self.formCadastro.generoPersonalizado    = '';
            self.formCadastro.CidadeConsumidor       = '';
            self.formCadastro.UFConsumidor           = '';

            // O CEP eh obrigatorio para a Seven e enviamos um CEP ficticio
            self.formCadastro.cep = "00000000";

            self.formCadastro.DDDCelular      = '';
            self.formCadastro.FoneCelular     = '';
            self.formCadastro.dddTelefoneFixo = '';
            self.formCadastro.telefoneFixo    = '';

            self.formCadastro.assuntoInteresse   = [];
            self.formCadastro.EAN                = '';
            self.formCadastro.Campanha           = '';
            self.formCadastro.codigoProfissional = '';
            self.formCadastro.UFProfissional     = '';
            self.formCadastro.nomeProfissional   = '';

            self.formCadastro.fase1              = true;
            self.formCadastro.fase2              = false;
            self.formCadastro.fase3              = false;
            self.formCadastro.cadastroFinalizado = false;
        };

        self.buscarCrmV2 = function (form)
        {
            devConsoleLog("buscarCrmV2");

            self.requestBuscaCRM = true;

            if (!form.UFProfissional || !form.codigoProfissional)
            {
                sendFeedback("Informe UF e código do profissional.");
                return;
            }

            barramentoColaboradorService.buscarProfissionalSaude("CRM", form.UFProfissional, form.codigoProfissional)
                .then(
                    function (response)
                    {
                        self.requestBuscaCRM = false;

                        if (!barramentoColaboradorService.isSuccessResponse(response))
                        {
                            barramentoColaboradorService.showErrorMessage(response);
                            return;
                        }

                        var crm               = response.data.profissional;
                        form.nomeProfissional = crm.nomeProfissional;
                    })
                .catch(
                    function (erro)
                    {
                        self.requestBuscaCRM = false;
                        barramentoColaboradorService.showErrorMessage(erro);
                    }
                );
        };

        /**
         * Selecionar CRM e armazenar no formulario enviado
         * @param form
         * @param crm
         * @param nome
         */
        self.selecionarCrmV1 = function (form, crm, nome)
        {
            devConsoleLog("selecionarCrmV1");
            form.nomeProfissional   = nome;
            form.codigoProfissional = crm;
        };

        /**
         *
         * @param uf
         * @param nomeProfissional
         */
        self.findCrmByUfAndNomeProfissionalV1 = function (uf, nomeProfissional)
        {
            devConsoleLog("findCrmByUfAndNomeProfissionalV1");

            if (!nomeProfissional)
            {
                return;
            }

            var params = {"NomeProfissional": nomeProfissional};

            return self.findCrmByUfAndParamsV1(uf, params);
        };

        self.findCrmByUfAndParamsV1 = function (uf, params)
        {
            devConsoleLog("findCrmByUfAndParamsV1");

            self.requestInProgress = true;
            self.requestBuscaCRM   = true;

            self.listaCrm = null;

            integracaoService.getCrmsByUfParamsV2(uf, params)
                .then(
                    function (response)
                    {
                        self.requestInProgress = false;
                        self.requestBuscaCRM   = false;

                        if (_.isEmpty(response.data))
                        {
                            sendFeedback("Nenhum CRM encontrado para os dados enviados.");
                            return;
                        }

                        self.listaCrm = response.data;
                    })
                .catch(
                    function (erro)
                    {
                        exibirMensagemErro(erro);

                        self.requestInProgress = false;
                        self.requestBuscaCRM   = false;
                    }
                );
        };
    }


})();
