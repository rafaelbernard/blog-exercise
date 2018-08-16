(function ()
{
    //"use strict";
    angular
        .module("app")
        .service("Sessao", Sessao);

    Sessao.$inject = ["localStorageService", "timestampToDateObjectFilter"];

    function Sessao(localStorageService, timestampToDateObjectFilter)
    {
        var self = this;

        // BOOLEAN
        var logged = false;

        // OBJECTS - MODELOS
        var AUTH_MODEL_DATA = {
            _login: {inclusao: null},
            id: "",
            cpf: "",
            nome: "",
            tipoLogin: "",
            objeto: {},
            getId: function ()
            {
                return this.id;
            }
        };

        var armazenarEmLocalStorage = function ()
        {
            //devConsoleLog("sessao._armazenarEmLocalStorage");
            localStorageService.set("usuario", self.user);
        };

        var limparLocalStorage = function ()
        {
            //devConsoleLog("sessao._limparLocalStorage");
            localStorageService.remove("usuario");
        };

        var recoverLocalStorage = function ()
        {
            //devConsoleLog("sessao._recuperarLocalStorage");
            var localStorage = localStorageService.get("usuario");

            if (localStorage)
            {
                if (!validLocalStorage(localStorage))
                {
                    return;
                }

                self.setLogged(true);
                self.setAuthenticationData(localStorage);
            }
        };

        var validLocalStorage = function (localStorage)
        {
            //devConsoleLog("sessao.var.localStorageValido");
            if (localStorage._login && localStorage._login.inclusao)
            {
                var _DATE_AGORA                            = new Date();
                //devConsoleLog("_DATE_AGORA: " + _DATE_AGORA);
                var _DATE_AGORA_TIMEZONE_OFFSET_EM_MINUTOS = _DATE_AGORA.getTimezoneOffset();
                /**
                 * convert to ms
                 * @type {number}
                 */
                var milissegundosDateAgoraTimezoneOffset   = (_DATE_AGORA_TIMEZONE_OFFSET_EM_MINUTOS * 60 * 1000);
                var milissegundosDateAgoraComOffset        = (_DATE_AGORA.getTime() - milissegundosDateAgoraTimezoneOffset);

                var _MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE  = 60;
                //devConsoleLog("_MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE: " + _MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE);
                var milissegundosValidadeDadosLocalStorage = _MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE * 60 * 1000;
                var milissegundosSessaoLocalStorage        = timestampToDateObjectFilter(localStorage._login.inclusao).getTime();
                //devConsoleLog("localStorage._login.inclusao: " + localStorage._login.inclusao);

                if ((milissegundosDateAgoraComOffset - milissegundosSessaoLocalStorage) < milissegundosValidadeDadosLocalStorage)
                {
                    //devConsoleLog("valida");
                    // renovando?
                    //devConsoleLog("teste de renovacao de sessao");
                    localStorage._login.inclusao = _DATE_AGORA;
                    return true;
                }
                //devConsoleLog("!(milissegundosDateAgoraComOffset - milissegundosSessaoLocalStorage) < milissegundosValidadeDadosLocalStorage");
            }

            //devConsoleLog("invalida");
            return false;
        };

        self.isUserLoggedOrLocalStorageV1 = function ()
        {
            //devConsoleLog("sessao.isUserLoggedOrLocalStorageV1");

            if (!self.getUser())
            {
                recoverLocalStorage();
            }

            return (self.getLogged() && self.getUser());
        };

        self.getLogged = function ()
        {
            return logged;
        };

        self.setLogged = function (value)
        {
            logged = Boolean(value);
            return self;
        };

        self.cleanSessionData = function ()
        {
            //devConsoleLog("sessao.cleanSessionData");
            self.setLogged(false);
            self.user = null;
            limparLocalStorage();
        };

        self.getUser = function ()
        {
            //devConsoleLog("sessao.getUser");
            return self.user;
        };

        self.setUser = function (dados)
        {
            //devConsoleLog("sessao.setUser");
            self.setAuthenticationData(dados);
        };

        self.setAuthenticationData = function (dados)
        {
            //devConsoleLog("sessao.setAuthenticationData");
            self.user        = Object.assign(AUTH_MODEL_DATA, dados);
            self.user.objeto = angular.copy(dados);
            self.normalizeAuthenticationData();
            armazenarEmLocalStorage();
        };

        self.normalizeAuthenticationData = function ()
        {
            //devConsoleLog("sessao.normalizeAuthenticationData");

        };

    }
})();