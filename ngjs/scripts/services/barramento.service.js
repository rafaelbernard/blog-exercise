(function ()
{
    angular
        .module("app")
        .service("BarramentoService", BarramentoService);

    BarramentoService.$inject = ["$http", "$httpParamSerializer", "$rootScope", "_CONFIG"];

    /**
     * Objeto de comunicacao com o barramento utilizando a autorizacao de acesso da area do colaborador
     * @param $http
     * @param $httpParamSerializer
     * @param $rootScope
     * @param _CONFIG Configuracoes do sistema em memoria
     * @constructor
     */
    function BarramentoService($http, $httpParamSerializer, $rootScope, _CONFIG)
    {
        var self = this;

        // --------
        // NUMBERS
        // ---------
        /**
         * Tempo de expiracao do token
         * Para controle. Caso o token tenha mais tempo, forcar renovacao.
         * @type {number}
         */
        self.tokenExpirationTime = 3000;

        self.invalidateCache = false;

        // -----------------
        // STRING
        // -----------------
        self.accessToken               = null;
        self.accreditedLeadAccessToken = null;
        self.urlBarramentoProxy        = _CONFIG.HOST_API + "/v1/_/barramento/proxy";

        // -----------------
        // OBJECT
        // -----------------
        self.token               = null;
        self.accreditedLeadtoken = null;

        /**
         *
         * @returns {*}
         */
        self.generateAccreditedLeadToken = function ()
        {
            var urlBarramento = self.host + '/v1/Logon/GenerateToken';
            var data          = {
                client_id: self.CONFIG_ACCREDITED_LEAD.CLIENT_ID,
                client_secret: self.CONFIG_ACCREDITED_LEAD.CLIENT_SECRET,
                grant_type: 'client_credentials'
            };
            var config        = {
                cache: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            return $http.post(urlBarramento, $httpParamSerializer(data), config)
                .then(function (response)
                {
                    devConsoleLog('token accreditedLead ok');
                    self.accreditedLeadAccessToken = 'Bearer ' + response.data.access_token;
                    self.accreditedLeadtoken       = response.data;
                });
        };

        /**
         *
         * @returns {*}
         */
        self.generateToken = function ()
        {
            var urlBarramento = self.host + '/v1/Logon/GenerateToken';
            var data          = {
                client_id: self.CONFIG.CLIENT_ID,
                client_secret: self.CONFIG.CLIENT_SECRET,
                grant_type: 'client_credentials'
            };
            var config        = {
                cache: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, $httpParamSerializer(data), config)
                .then(function (response)
                {
                    //devConsoleLog('token barramento ok');
                    self.accessToken = 'Bearer ' + response.data.access_token;
                    self.token       = response.data;
                });
        };

        self.buscarDocumento = function (params)
        {
            devConsoleLog("buscarDocumento");

            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarDocumento(params);
                    });
            }

            params.apikey = 0;

            var urlBarramento = self.host + "/v2/api/corp/it/security/accessapp/Salesforce/GetByDocument";

            if ($rootScope.CONFIG_USO._ENV !== "prod")
            {
                urlBarramento = self.host + "/v1/api/corp/it/security/accessapp/Salesforce/GetByDocument";
            }

            var config = {
                headers: {
                    "Authorization": self.accessToken,
                    url: urlBarramento
                },
                params: params
            };

            return $http.get(self.urlBarramentoProxy, config);
        };

        /**
         *
         * @param codDocumentType
         * @param uf
         * @param professionalCodeNumber
         * @returns {*}
         */
        self.buscarProfissionalSaude = function (codDocumentType, uf, professionalCodeNumber)
        {
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarProfissionalSaude(codDocumentType, uf, professionalCodeNumber);
                    });
            }

            var filtrosConsulta                  = {};
            filtrosConsulta.tipoDocumento        = codDocumentType || null;
            filtrosConsulta.uf                   = uf || null;
            filtrosConsulta.consultaProfissional = professionalCodeNumber || null;

            var data = {filtrosConsulta: filtrosConsulta};

            var urlBarramento = self.host + '/v1/HealthProfessional/Lookup';

            var config = {
                cache: true,
                //params: params,
                headers: {
                    "Authorization": self.accessToken,
                    "InvalidateCache": self.invalidateCache,
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        /**
         * Busca de produtos
         * - o barramento necessita que seja passado, pelo menos o parametro `ean`, mesmo em branco
         * @param params
         * @returns {*}
         */
        self.buscarProduto = function (params)
        {
            devConsoleLog("buscarProduto");
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarProduto(params);
                    });
            }

            var data = {
                filtrosConsulta: {
                    ean: (params && params.ean) ? params.ean : "",
                    marca: (params && params.marca) ? params.marca : "",
                    apresentacao: (params && params.apresentacao) ? params.apresentacao : "",
                }
            };

            var urlBarramento = self.host + '/v1/product/lookup';
            var config        = {
                cache: true,
                headers: {
                    "Authorization": self.accessToken,
                    "InvalidateCache": self.invalidateCache,
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        /**
         *
         * @param customer
         * @returns Promise
         */
        self.cadastrarPaciente = function (customer)
        {
            if (!self.isTokenValido())
            {
                //throw new Error('Token é necessário');
                return self.generateToken()
                    .then(function ()
                    {
                        return self.cadastrarPaciente(customer);
                    });
            }

            var data          = {paciente: customer};
            var urlBarramento = self.host + '/v1/customer/post';
            var config        = {
                headers: {
                    "Authorization": self.accessToken,
                    "Content-Type": 'application/json',
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        self.isTokenValido = function ()
        {
            devConsoleLog("isTokenValido");
            //devConsoleLog(self.token);

            if (self.token)
            {
                var milissegundosPassados = Date.now() - self.token.issued_at;
                var limite                = (self.token.expires_in - 500) * 1000;
                // devConsoleLog("now: " + Date.now());
                // devConsoleLog("issued: " + self.token.issued_at);
                // devConsoleLog("passados: " + milissegundosPassados);
                // devConsoleLog("expires: " + self.token.expires_in);
                // devConsoleLog("limite: " + limite);

                //se o token tiver expirado, remover da memoria
                if (milissegundosPassados > limite)
                {
                    devConsoleLog("token expirado! [milissegundosPassados > limite]");
                    self.token = null;
                    return false;
                }

                return true;
            }

            return false;
        };

        self.isAccreditedLeadTokenValido = function ()
        {
            devConsoleLog("isAccreditedLeadTokenValido");
            //devConsoleLog(self.token);

            if (self.accreditedLeadtoken)
            {
                var milissegundosPassados = Date.now() - self.accreditedLeadtoken.issued_at;
                var limite                = (self.accreditedLeadtoken.expires_in - 500) * 1000;
                // devConsoleLog("now: " + Date.now());
                // devConsoleLog("issued: " + self.token.issued_at);
                // devConsoleLog("passados: " + milissegundosPassados);
                // devConsoleLog("expires: " + self.token.expires_in);
                // devConsoleLog("limite: " + limite);

                //se o token tiver expirado, remover da memoria
                if (milissegundosPassados > limite)
                {
                    devConsoleLog("token expirado! [milissegundosPassados > limite]");
                    self.accreditedLeadtoken = null;
                    return false;
                }

                return true;
            }

            return false;
        };

        /**
         *
         * @param params Parametros de busca
         * @returns {*}
         */
        self.buscarPaciente = function (params)
        {
            devConsoleLog("buscarPaciente");
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarPaciente(params);
                    });
            }

            var data          = {filtrosConsulta: params};
            var urlBarramento = self.host + '/v1/customer/lookup';
            var config        = {
                headers: {
                    "Authorization": self.accessToken,
                    "Content-Type": "application/json",
                    "InvalidateCache": "true",
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        /**
         * Buscar paciente por CPF
         * @param cpf
         * @returns {*}
         */
        self.buscarPacientePorCpf = function (cpf)
        {
            var params = {cpf: cpf};
            return self.buscarPaciente(params);
        };

        /**
         * Buscar adesao
         * @param params
         * @returns Promise
         */
        self.buscarAdesao = function (params)
        {
            devConsoleLog("buscarAdesao");
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarAdesao(params);
                    });
            }

            //var filtrosConsulta = params;
            var data          = {filtrosConsulta: params};
            var urlBarramento = self.host + '/v1/subscription/lookup';
            var config        = {
                headers: {
                    "Authorization": self.accessToken,
                    "Content-Type": 'application/json',
                    "InvalidateCache": "true",
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        /**
         *
         * @param params
         * @returns {*}
         */
        self.buscarHistoricoCompraPorParams = function (params)
        {
            devConsoleLog("buscarHistoricoCompraPorParams");
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.buscarHistoricoCompraPorParams(params);
                    });
            }

            var data          = {filtrosConsulta: params};
            var urlBarramento = self.host + '/v1/purchase/lookup';
            var config        = {
                headers: {
                    "Authorization": self.accessToken,
                    "Content-Type": 'application/json',
                    "InvalidateCache": self.invalidateCache,
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        /**
         * Lista de tipos de logradouro
         * @returns {Promise}
         */
        self.getTipoLogradouro = function ()
        {
            devConsoleLog("getTipoLogradouro");
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.getTipoLogradouro();
                    });
            }

            var route         = "/v1/postalServices/addressType";
            var urlBarramento = self.host + route;
            var config        = {
                cache: true,
                headers: {
                    "Authorization": self.accessToken,
                    "Content-Type": 'application/json; charset=utf-8',
                    "InvalidateCache": self.invalidateCache,
                    url: urlBarramento
                },
                params: {
                    "$format": 'json',
                    route: route
                }
            };

            return $http.get(self.urlBarramentoProxy, config);
        };

        self.cadastrarAdesao = function (adesao)
        {
            devConsoleLog("cadastrarAdesao");
            if (!self.isTokenValido())
            {
                //throw new Error('Token é necessário');
                return self.generateToken()
                    .then(function ()
                    {
                        return self.cadastrarAdesao(adesao);
                    });
            }

            var data          = {adesao: adesao};
            var urlBarramento = self.host + "/v1/subscription/subscription";
            var config        = {
                headers: {
                    "Authorization": self.accessToken,
                    "InvalidateCache": "true",
                    url: urlBarramento
                }
            };

            return $http.post(self.urlBarramentoProxy, data, config);
        };

        /**
         *
         * @param response
         * @returns {boolean}
         */
        self.isDefinedSubscription = function (response)
        {
            devConsoleLog("isDefinedSubscription");

            if (!response.data)
            {
                return false;
            }

            if (!response.data.adesao)
            {
                devConsoleLog("Adesao: objeto nao existe");
                return false;
            }

            var retornoConsultaSubscription = response.data;

            if (retornoConsultaSubscription.retorno && retornoConsultaSubscription.retorno.codigoRetorno !== "0" && retornoConsultaSubscription.retorno.codigoRetorno !== 0)
            {
                console.log(retornoConsultaSubscription.retorno.mensagemRetorno);
                return false;
            }

            if (retornoConsultaSubscription.adesao && retornoConsultaSubscription.adesao[0].cpf === null)
            {
                devConsoleLog("Adesão: CPF indefinido");
                return false;
            }

            return true;
        };

        /**
         *
         * @returns {Promise}
         */
        self.getInterestOptionsList = function ()
        {
            if (!self.isTokenValido())
            {
                return self.generateToken()
                    .then(function ()
                    {
                        return self.getInterestOptionsList();
                    });
            }

            var route         = "/v1/interestOptions/lookup";
            var urlBarramento = self.host + route;
            var config        = {
                    cache: true,
                    headers: {
                        "Authorization": self.accessToken,
                        "Content-Type": 'application/json; charset=utf-8',
                        "InvalidateCache": self.invalidateCache,
                        url: urlBarramento
                    },
                    params: {
                        route: route
                    }
                }
            ;

            return $http.get(self.urlBarramentoProxy, config);
        };

        /**
         *
         * @param response
         * @returns {boolean}
         */
        self.isDefinedCustomer = function (response)
        {
            devConsoleLog("isDefinedCustomer");

            if (!response.data)
            {
                return false;
            }

            if (!response.data.paciente)
            {
                devConsoleLog("Paciente: objeto nao existe");
                return false;
            }

            var retornoConsulta = response.data;

            if (retornoConsulta.retorno && retornoConsulta.retorno.codigoRetorno !== "0" && retornoConsulta.retorno.codigoRetorno !== 0)
            {
                console.log(retornoConsulta.retorno.mensagemRetorno);
                return false;
            }

            if (retornoConsulta.paciente && retornoConsulta.paciente.cpf === null)
            {
                devConsoleLog("Paciente: CPF indefinido");
                return false;
            }

            return true;
        };

        /**
         *
         * @param response
         * @returns {boolean}
         */
        self.isSuccessResponseFromPacientePost = function (response)
        {
            devConsoleLog("isSuccessResponseFromPacientePost");

            if (!response.data)
            {
                devConsoleLog('isSuccessResponseFromPacientePost: !response.data');
                return false;
            }

            var data = response.data;

            if (data.retorno && data.retorno.length !== 1)
            {
                devConsoleLog('isSuccessResponseFromPacientePost: data.retorno && data.retorno.length !== 1');
                return false;
            }

            if (data.retorno && data.retorno.length === 1 && data.retorno[0].codigoRetorno !== 0 && data.retorno[0].codigoRetorno !== '0')
            {
                devConsoleLog("isSuccessResponseFromPacientePost: data.retorno && data.retorno.length === 1 && data.retorno[0].codigoRetorno !== 0 && data.retorno[0].codigoRetorno !== '0'");
                return false;
            }

            return true;
        };

        self.isSuccessResponse = function (response)
        {
            devConsoleLog('isSuccessResponse');
            // devConsoleLog(response);
            // devConsoleLog(response.data);

            if (!response.data)
            {
                devConsoleLog('isSuccessResponse: !response.data');
                return false;
            }

            var data = response.data;

            // get returns
            if (!self.isSuccessResponseFromGet(response))
            {
                devConsoleLog('isSuccessResponse: !self.isSuccessResponseFromGet(response)');
                return false;
            }

            // post returns
            if (data.retorno && data.retorno.codigoRetorno !== 0 && data.retorno.codigoRetorno !== '0')
            {
                devConsoleLog('isSuccessResponse: data.retorno.codRetorno !== 0');
                return false;
            }

            return true;
        };

        self.isSuccessResponseFromGet = function (response)
        {
            devConsoleLog('isSuccessResponseFromGet');

            if (!response.data)
            {
                devConsoleLog('isSuccessResponseFromGet: !response.data');
                return false;
            }

            var data = response.data;

            //if (data.retornoConsulta && data.retornoConsulta.retorno && data.retornoConsulta.retorno.codigoRetorno !== 0 && data.retornoConsulta.retorno.codigoRetorno !== '0')
            if (data && data.retorno && data.retorno.codigoRetorno !== 0 && data.retorno.codigoRetorno !== '0')
            {
                devConsoleLog('isSuccessResponseFromGet: data.retorno.codigoRetorno !== 0');
                return false;
            }

            return true;
        };

        /**
         *
         * @param response
         * @returns {*}
         */
        self.tratarMensagemErroRequisicao = function (response)
        {
            devConsoleLog("tratarMensagemErroRequisicao");
            //devConsoleLog(response);

            if (response.message)
            {
                return response.message;
            }

            if (response.data)
            {
                if (response.data.message)
                {
                    return response.data.message;
                }

                if (response.data && response.data.retorno && response.data.retorno.mensagemRetorno)
                {
                    return response.data.retorno.mensagemRetorno;
                }

                if (response.data && response.data.retorno && response.data.retorno[0] && response.data.retorno[0].mensagemRetorno)
                {
                    return response.data.retorno[0].mensagemRetorno;
                }

                if (response.data.Message)
                {
                    return response.data.Message;
                }
            }

            return "Erro desconhecido. [0-BRRMT]";
        };

        /**
         *
         * @param response
         */
        self.showErrorMessage = function (response)
        {
            sendFeedbackMensagemErro(self.tratarMensagemErroRequisicao(response));
        };

        self.accreditedLeadStatus = function (cnpj)
        {
            devConsoleLog("s.accreditedLeadStatus: " + cnpj);

            if (!self.isAccreditedLeadTokenValido())
            {
                devConsoleLog("self.generateAccreditedLeadToken()");

                return self.generateAccreditedLeadToken()
                    .then(function ()
                    {
                        return self.accreditedLeadStatus(cnpj);
                    });
            }

            var route         = '/v1/api/corp/sales/lead/accreditedLead/status';
            var urlBarramento = self.host + route;
            var config        = {
                cache: true,
                headers: {
                    "Authorization": self.accreditedLeadAccessToken,
                    "Content-Type": 'application/json; charset=utf-8',
                    "InvalidateCache": self.invalidateCache
                },
                params: {
                    cnpj: cnpj
                }
            };

            return $http.get(urlBarramento, config);
        };

        self.accreditedLeadGet = function (cnpj)
        {
            devConsoleLog("s.accreditedLeadGet");

            if (!self.isAccreditedLeadTokenValido())
            {
                devConsoleLog("self.generateAccreditedLeadToken()");

                return self.generateAccreditedLeadToken()
                    .then(function ()
                    {
                        return self.accreditedLeadGet(cnpj);
                    });
            }

            var params = {};
            if (cnpj)
            {
                params = {cnpj: cnpj};
            }
            else if ($rootScope.sessao.getUser().cargo === 'GERENTE')
            {
                params = {managerEmail: $rootScope.sessao.getUser().Email};
            }
            else
            {
                params = {agentEmail: $rootScope.sessao.getUser().Email};
            }

            var route         = '/v1/api/corp/sales/lead/accreditedLead';
            var urlBarramento = self.host + route;
            var config        = {
                cache: false,
                headers: {
                    "Authorization": self.accreditedLeadAccessToken,
                    "Content-Type": 'application/json; charset=utf-8',
                    "InvalidateCache": self.invalidateCache
                },
                params: params
            };

            return $http.get(urlBarramento, config);
        };

        self.accreditedLead = function (params)
        {
            devConsoleLog("s.accreditedLeadStatus");

            if (!self.isAccreditedLeadTokenValido())
            {
                devConsoleLog("self.generateAccreditedLeadToken()");

                return self.generateAccreditedLeadToken()
                    .then(function ()
                    {
                        return self.accreditedLeadStatus();
                    });
            }

            var route         = '/v1/api/corp/sales/lead/accreditedLead';
            var urlBarramento = self.host + route;
            // TODO tratar se nao vier gestor
            var data          = {
                fantasyName: params.nomeFarmacia,
                cnpj: params.cnpjResponsavelFarmacia,
                responsibleName: params.nomeResponsavelFarmacia,
                responsiblePhone: params.telefoneResponsavelFarmacia,
                responsibleMobilePhone: params.celularResponsavelFarmacia,
                responsibleEmail: params.emailResponsavelFarmacia,
                agentName: $rootScope.sessao.getUser().Nome,
                agentMobilePhone: $rootScope.sessao.getUser().Dados.CelularCorporativo,
                agentEmail: $rootScope.sessao.getUser().Email,
                managerName: $rootScope.sessao.getUser().Dados.Gestores[0].Nome,
                managerMobilePhone: $rootScope.sessao.getUser().Dados.Gestores[0].CelularCorporativo,
                managerEmail: $rootScope.sessao.getUser().Dados.Gestores[0].Email,
                businessActivity: 'Drogaria',
                leadExistsSevenPDV: false,
                partnerId: 18,
                channelId: 'site'
            };
            var config        = {
                cache: true,
                headers: {
                    "Authorization": self.accreditedLeadAccessToken,
                    "Content-Type": 'application/json; charset=utf-8',
                    "InvalidateCache": self.invalidateCache
                }
            };

            return $http.post(urlBarramento, data, config);
        };

        self.auth = function (login)
        {
            devConsoleLog("login");

            // if (!self.isTokenValido())
            // {
            //     //throw new Error('Token é necessário');
            //     return self.generateToken()
            //         .then(function ()
            //         {
            //             return self.salesforceAuthenticate(login);
            //         });
            // }

            //login.apikey = _CONFIG.WS_BARRAMENTO.APP_PCS.APIKEY;

            var config = {
                headers: {
                    "Authorization": self.accessToken,
                    "InvalidateCache": "true"
                }
            };

            //var url = _CONFIG.HOST_API + '/public/api/v1/user/sigin';
            var url = '../lvl-rest/public/api/v1/user/signin';
            return $http.post(url, login, config);
        };

    }
})();