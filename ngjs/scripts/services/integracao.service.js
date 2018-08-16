(function ()
{
    //'use strict';
    angular
        .module("app")
        .service("IntegracaoService", IntegracaoService);

    IntegracaoService.$inject = ["$http", "$rootScope", "_CONFIG"];

    function IntegracaoService($http, $rootScope, _CONFIG)
    {

        var self = this;
        self.token = _CONFIG.X_TOKEN_API;
        self.host = _CONFIG.HOST_API;

        /**
         *
         * @param cpf
         * @returns {*}
         */
        self.getCrmsByUfParams = function (params)
        {
            var dados = angular.copy(params[0]);
            var req = {
                method: 'GET',
                url: self.host + '/v1/integracao/crm/uf/' + params[0].estado,
                headers: {
                    "Content-Type": "application/json",
                    'x-token': self.token
                },
                params: dados,
                cache: true
            };
            return $http(req);
        };

        self.getCrmsByUfParamsV2 = function (uf, params)
        {
            var req = {
                method: 'GET',
                url: self.host + '/v1/integracao/crm/uf/' + uf,
                headers: {
                    "Content-Type": "application/json",
                    'x-token': self.token
                },
                params: params || "",
                cache: true
            };
            return $http(req);
        };

        self.registrarFormularioPacienteBarramento = function (customer)
        {
            var url = self.host + '/v1/integracao/barramento/formulario-paciente';
            //devConsoleLog(url);
            //devConsoleLog("guardandno no banco");

            var data = {customer: customer};

            var config = {
                headers: {
                    "x-token": $rootScope.CONFIG_USO.X_TOKEN_API
                }
            };

            return $http.post(url, data, config);
        };

        /**
         *
         * @param subscription
         * @returns {*}
         */
        self.registrarFormularioAdesaoBarramento = function (subscription)
        {
            var url = self.host + '/v1/integracao/barramento/formulario-adesao';
            //devConsoleLog(url);
            //devConsoleLog("guardando adesao no banco");

            var data = {subscription: subscription};

            var config = {
                headers: {
                    "x-token": $rootScope.CONFIG_USO.X_TOKEN_API
                }
            };

            return $http.post(url, data, config);
        };

        self.getAdesaoByCPF = function (cpf)
        {
            var url = self.host + '/v1/integracao/barramento/formulario-adesao/' + cpf;

            var config = {
                headers: {
                    "x-token": $rootScope.CONFIG_USO.X_TOKEN_API
                }
            };

            return $http.get(url, config);
        };

    }
})();