(function ()
{
    //'use strict';

    angular.module('app')
        .service('AcheService', AcheService);

    AcheService.$inject = ["$http", "_CONFIG"];

    function AcheService($http, _CONFIG)
    {
        var self = this;

        self.inserirPcsFuncionario = function (colaborador)
        {
            var config = {
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                }
            };
            var url = _CONFIG.HOST_API + "/v1/ache/pcs-funcionario";
            return $http.post(url, colaborador, config);
        };

        self.loginPcsFuncionario = function (colaborador)
        {
            var config = {
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                }
            };
            var url = _CONFIG.HOST_API + "/v1/ache/pcs-funcionario/login";
            return $http.post(url, colaborador, config);
        };

    }
})();