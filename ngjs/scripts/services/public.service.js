(function ()
{
    //'use strict';

    angular
        .module("app")
        .service('PublicService', PublicService);

    PublicService.$inject = ["_CONFIG", '$http'];

    function PublicService(_CONFIG, $http)
    {
        var self = this;

        self.enviarFormularioBannerEvasaoV1 = function (formulario)
        {
            var url = configUso.HOST_API + '/v1/public/formulario/banner-evasao';
            return $http.post(url, formulario);
        };

        self.enviarFormularioContatoV1 = function (formulario)
        {
            var url = configUso.HOST_API + '/v1/public/formulario/contato';
            return $http.post(url, formulario);
        };

        self.enviarFormularioV1 = function (formulario)
        {
            var url = _CONFIG.HOST_API + '/v1/public/formulario';
            return $http.post(url, formulario);
        };

        self.enviarFormularioContatoV2 = function (formulario)
        {
            var url = _CONFIG.HOST_API + '/v2/public/formulario/contato';
            return $http.post(url, formulario);
        };

        self.enviarFormularioContatoV1 = function (formulario)
        {
            var url = _CONFIG.HOST_API + '/v1/public/formulario/contato';
            return $http.post(url, formulario);
        };

        self.enviarFormularioCredenciamentoLanding = function (formulario)
        {
            var url = _CONFIG.HOST_API + "/v1/public/formulario/credenciamento/landing";
            return $http.post(url, formulario);
        };

        self.buscarCidadesPorUF = function (uf)
        {
            var url = _CONFIG.HOST_API + '/v1/' + uf + '/cidades';
            var config = {
                cache: true
            };

            return $http.get(url, config);
        };

    }
})();