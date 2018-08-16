(function ()
{
    //'use strict';

    angular.module('app')
        .service('FarmaciaService', FarmaciaService);

    FarmaciaService.$inject = ["$http", "_CONFIG"];

    function FarmaciaService($http, _CONFIG)
    {
        var self = this;

        self.solicitarMaterialPromocional = function (materialPromocionalPedido)
        {
            var config = {
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                }
            };

            var url = _CONFIG.HOST_API + "/v1/emcampo/farmacia/material-promocional/pedido";
            return $http.post(url, materialPromocionalPedido, config);
        };

        self.getOpcoesMaterialPromocional = function ()
        {
            var url = _CONFIG.HOST_API + "/v1/emcampo/farmacia/material-promocional/opcoes";
            return $http.get(url);
        };
    }
})();