(function ()
{

    angular.module("app")
        .controller("FarmaciaController", FarmaciaController);

    FarmaciaController.$inject = [
        "$document",
        "$scope",
        "$rootScope",
        "ColaboradorService",
        "BarramentoService",
        "$mdDialog",
        "ErrorHandlerService",
        "$window"
    ];

    function FarmaciaController($document, $scope, $rootScope,
                                emcampoService,
                                barramentoService,
                                $mdDialog,
                                errorHandler,
                                $window)
    {
        $rootScope.verificarAutenticacao();

        var self = this;

        var CNPJ = window.CNPJ;


        $scope.tab = 1;

        self.arrConvites = [];
        self.conviteFarmacia = {};
        self.buscaFarmacia = {};
        self.conviteEnviado = false;
        self.conviteCodigo = '';

        $rootScope.namePage = "pagina_farmacia";

        $scope.setTab = function(newTab)
        {
            $scope.tab = newTab;

            if (newTab === 2)
            {
                self.conviteEnviado = false;
                self.conviteFarmacia = {};
                $window.ga('send', 'event', 'Click', 'Indicação');
            }
            if (newTab === 3)
            {
                self.accreditedLeadGet();
                $window.ga('send', 'event', 'Click', 'Status');
            }

            if (newTab === 1)
            {
                $window.ga('send', 'event', 'Click', 'passo-a-passo');
            }

        };

        $scope.isSet = function(tabNum)
        {
            return $scope.tab === tabNum;
        };

        self.accreditedLead = function ()
        {
            devConsoleLog("accreditedLead");

            if (!CNPJ.isValid(self.conviteFarmacia.cnpjResponsavelFarmacia))
            {
                self.conviteFarmacia.cnpjResponsavelFarmacia = '';
                sendFeedback('CNPJ inválido', 'alert');
                return false;
            }

            if ($rootScope.sessao.getUsuario().Dados.Gestores.length === 0 || ($rootScope.sessao.getUsuario().Dados.Gestores[0] && !$rootScope.sessao.getUsuario().Dados.Gestores[0].Email) || !$rootScope.sessao.getUsuario().Email)
            {
                sendFeedback('Sua estrutura organizacional está inconsistente. Procure o departamento de TI.', 'alert');
                return false;
            }

            self.requisicaoEmAndamento = true;

            self.conviteFarmacia.idUsuarioInclusao = angular.copy($rootScope.sessao.getUsuario().id);

            barramentoService.accreditedLead(self.conviteFarmacia)
                .then(function (response)
                {
                    self.requisicaoEmAndamento = false;

                    if (response.data.code === '200')
                    {
                        self.conviteEnviado = true;
                        self.conviteCodigo = response.data.data[0].salesForceId;
                        $window.ga('send', 'event', 'Click', 'Indicação-Sucesso');
                    }
                    else
                    {
                        sendFeedback(response.data.message, 'alert');
                    }

                })
                .catch(function (response)
                {
                    self.requisicaoEmAndamento = false;
                    errorHandler.sendFeedbackErro(response);
                });
        };

        self.accreditedLeadGet = function ()
        {
            devConsoleLog("accreditedLeadGet");

            self.requisicaoEmAndamento = true;

            self.conviteFarmacia.idUsuarioInclusao = angular.copy($rootScope.sessao.getUsuario().id);

            barramentoService.accreditedLeadGet(self.buscaFarmacia.cnpjResponsavelFarmacia)
                .then(function (response)
                {
                    self.requisicaoEmAndamento = false;
                    self.arrConvites = response.data.data;
                })
                .catch(function (response)
                {
                    self.requisicaoEmAndamento = false;
                    errorHandler.sendFeedbackErro(response);
                });
        };

        self.accreditedLeadStatus = function ()
        {
            if (self.conviteFarmacia.cnpjResponsavelFarmacia && !CNPJ.isValid(self.conviteFarmacia.cnpjResponsavelFarmacia))
            {
                self.conviteFarmacia.cnpjResponsavelFarmacia = '';
                sendFeedback('CNPJ inválido', 'alert');
                return false;
            }

            self.requisicaoEmAndamento = true;

            self.conviteFarmacia.idUsuarioInclusao = angular.copy($rootScope.sessao.getUsuario().id);

            barramentoService.accreditedLeadStatus(self.conviteFarmacia.cnpjResponsavelFarmacia)
                .then(function (response)
                {
                    self.requisicaoEmAndamento = false;

                    if (response.data.code === '200')
                    {
                        sendFeedback(response.data.message);
                        self.conviteFarmacia.cnpjResponsavelFarmacia = '';
                    }

                })
                .catch(function (response)
                {
                    self.requisicaoEmAndamento = false;
                    errorHandler.sendFeedbackErro(response);
                });
        };

        self.showMisModal = function (salesForceId)
        {
            $mdDialog.show({
                controller: FarmaciaController,
                template: '<iframe src="https://pub.s7.exacttarget.com/0yejnr41iqk?Id=' + salesForceId + '" width="800" height="520"></iframe>',
                parent: angular.element($document.body),
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

    }

})();
