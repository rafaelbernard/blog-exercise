(function ()
{
    angular
        .module("app")
        .service("ColaboradorService", ColaboradorService);

    ColaboradorService.$inject = ['$http', "$rootScope", "_CONFIG"];

    function ColaboradorService($http, $rootScope, _CONFIG)
    {
        var self = this;

        self.token = $rootScope.CONFIG_USO.X_TOKEN_API;

        self.CONFIG          = $rootScope.CONFIG_USO.WS_BARRAMENTO;
        self.host            = $rootScope.CONFIG_USO.WS_BARRAMENTO.HOST;
        self.invalidateCache = false;

        self.convidarFarmacia = function (conviteFarmacia)
        {
            var config = {
                headers: {
                    "x-token": self.token
                }
            };
            var url    = $rootScope.CONFIG_USO.HOST_API + "/v1/emcampo/farmacia/convite";
            return $http.post(url, conviteFarmacia, config);
        };

        self.enviarConviteFarmacia = function (conviteFarmacia)
        {
            var config = {
                headers: {
                    "x-token": self.token
                }
            };

            var url = $rootScope.CONFIG_USO.HOST_API + "/v1/emcampo/farmacia/convite/enviar";
            return $http.put(url, conviteFarmacia, config);
        };

        self.getListaConviteFarmaciaByUsuarioAndParams = function (idUsuario, params)
        {
            var config = {
                headers: {
                    "ids": idUsuario,
                    "x-token": self.token
                },
                params: params
            };

            var url = $rootScope.CONFIG_USO.HOST_API + "/v1/emcampo/farmacia/convite";
            return $http.get(url, config);
        };

        self.getConviteFarmaciaPorChaveConvite = function (chaveConviteFarmacia)
        {
            var config = {
                headers: {
                    "x-token": _CONFIG.X_TOKEN_API
                }
            };

            var url = $rootScope.CONFIG_USO.HOST_API + "/v1/emcampo/farmacia/convite/" + chaveConviteFarmacia;
            return $http.get(url, config);
        };

        self.findSubscription = function (params)
        {
            if (!self.token)
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.findSubscription(params);
                    });
            }

            var filtrosConsulta = params;
            var data            = {filtrosConsulta: filtrosConsulta};

            var config = {
                cache: true,
                headers: {
                    "Authorization": self.token,
                    "Content-Type": 'application/json',
                    "InvalidateCache": self.invalidateCache
                }
            };

            var url = self.host + '/v1/subscription/lookup';
            return $http.post(url, data, config);
        };

        /**
         *
         * @param params
         * @returns {*}
         */
        self.findPurchase = function (params)
        {
            if (!self.token)
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.findPurchase(params);
                    });
            }

            //var filtrosConsulta = ;
            var data = {filtrosConsulta: params};

            var config = {
                cache: true,
                headers: {
                    "Authorization": self.token,
                    "Content-Type": 'application/json',
                    "InvalidateCache": self.invalidateCache
                }
            };

            var url = self.host + '/v1/purchase/lookup';
            return $http.post(url, data, config);
        };

        /**
         *
         * @param cep
         * @returns {*}
         */
        self.buscarEnderecoByCep = function (cep)
        {
            if (!self.token)
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarEnderecoByCep(cep);
                    });
            }

            var params = "/postalCode('" + cep + "')";

            var config = {
                    cache: true,
                    headers: {
                        "Authorization": self.token,
                        "Content-Type": 'application/json; charset=utf-8',
                        "InvalidateCache": self.invalidateCache
                    },
                    params: {
                        $format: 'json'
                    }
                }
            ;

            var url = self.host + '/v1/postalServices' + params;
            return $http.get(url, config);
        };

        /**
         *
         * @param response
         * @returns {boolean}
         */
        self.isDefinedCustomer = function (response)
        {
            devConsoleLog('isDefinedCustomer');

            if (!response.data)
            {
                return false;
            }

            if (!response.data.retornoConsulta)
            {
                devConsoleLog('Paciente: Retorno consulta nao existe');
                return false;
            }

            var retornoConsulta = response.data.retornoConsulta;

            if (retornoConsulta.retorno && retornoConsulta.retorno.codRetorno !== '0' && retornoConsulta.retorno.codRetorno !== 0)
            {
                console.log(retornoConsulta.retorno.mensagemRetorno);
                return false;
            }

            if (retornoConsulta.paciente && retornoConsulta.paciente.cpf === null)
            {
                devConsoleLog('Paciente: CPF indefinido');
                return false;
            }

            return true;
        };

        /**
         *
         * @param formData
         * @returns {{primeiroNome: (string|Document.NomeConsumidor|Document.formCadastroConclusao.NomeConsumidor), sobreNome: (string|Document.NomeConsumidor|Document.formCadastroConclusao.NomeConsumidor), dataNascPaciente: (*|string|string|Date), genero: (number|string|*), descricaoGenero: string}}
         */
        self.fromFormToPaciente = function (formData)
        {
            devConsoleLog('fromFormToPaciente');
            devConsoleLog(formData);

            var customer = {
                cpf: formData.CPFConsumidor,
                primeiroNome: formData.NomeConsumidor,
                sobreNome: formData.NomeConsumidor,
                dataNascPaciente: formData.DataNascConsumidor,
                genero: formData.Sexo,
                descricaoGenero: '',
                deviceId: '',
                cep: formData.CEPConsumidor,
                tipoLogradouro: formData.TipoLogradouroConsumidor,
                logradouro: formData.LogradouroConsumidor,
                nrLogradouro: formData.NrEnderConsumidor,
            };

            return customer;
        };

        self.isSuccessResponse = function (response)
        {
            if (!response.data)
            {
                return false;
            }

            var data = response.data;

            if (data.retornoCadastro && data.retornoCadastro.retorno && data.retornoCadastro.retorno.codigoRetorno !== 0 && data.retornoCadastro.retorno.codigoRetorno !== '0')
            {
                return false;
            }

            return true;
        };

    }
})();