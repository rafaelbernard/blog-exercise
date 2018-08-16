(function ()
{
    //'use strict';

    angular.module("app")
        .service("SevenService", SevenService);

    SevenService.$inject = ["$http", "_CONFIG"];

    function SevenService($http, _CONFIG)
    {
        var self = this;

        self.buscarListaFarmaciaPorParametros = function (params)
        {
            var config = {
                cache: true,
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                },
                params: params
            };
            var url = _CONFIG.HOST_API + "/v1/seven/loja";
            return $http.get(url, config);
        };

        self.buscarListaMarcaPorParametros = function (params)
        {
            var config = {
                cache: true,
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                },
                params: params || null
            };
            var url = _CONFIG.HOST_API + "/v1/seven/marca";
            return $http.get(url, config);
        };

        /**
         *
         * @param cnpj
         * @param idMarca
         * @param params
         */
        self.buscarVendaEstatisticaCompraRecompraPorDiaDeFarmaciaEMarcaPorParametros = function (cnpj, idMarca, params)
        {
            var config = {
                cache: true,
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                },
                params: params || null
            };
            var url = _CONFIG.HOST_API + "/v1/seven/loja/" + cnpj + "/venda/compra-recompra/marca/" + idMarca + "/por-dia";
            return $http.get(url, config);
        };

        self.buscarVendaEstatisticaCompraRecompraDeFarmaciaEMarcaPorParametros = function (cnpj, idMarca, params)
        {
            var config = {
                cache: true,
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                },
                params: params || null
            };

            var url = _CONFIG.HOST_API + "/v1/seven/loja/" + cnpj + "/venda/compra-recompra/marca/" + idMarca;
            return $http.get(url, config);
        };

        self.buscarMedicoById = function (ufDocumentoProfissional, numeroDocumentoProfissional)
        {
            var config = {
                cache: true,
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                }
            };
            var url = _CONFIG.HOST_API + "/v1/seven/medico/" + ufDocumentoProfissional + "/" + numeroDocumentoProfissional;
            return $http.get(url, config);
        };

        self.buscarVendaSomaCompraRecompraDeMedicoEMarcaPorParametrosV1 = function (params)
        {
            var config = {
                cache: true,
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                },
                params: params || null
            };
            var url = _CONFIG.HOST_API + "/v1/seven/venda/medico/marca/compra-recompra/soma";
            return $http.get(url, config);
        };

    }
})();