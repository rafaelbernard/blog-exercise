(function ()
{
    //"use strict";
    angular
        .module('app')
        .service('Session', Session);

    Session.$inject = ['localStorageService', "timestampToDateObjectFilter"];

    function Session(localStorageService, timestampToDateObjectFilter)
    {
        var self = this;

        self.user = null;

        // BOOLEAN
        var logged = false;

        // OBJECTS - MODELOS
        var AUTH_MODEL_DATA = {
            _login: {createdat: null},
            id: "",
            email: "",
            name: "",
            token: {},
            object: {},
            getId: function ()
            {
                return this.id;
            }
        };

        var armazenarEmLocalStorage = function ()
        {
            //devConsoleLog("sessao._armazenarEmLocalStorage");
            localStorageService.set("user", self.user);
        };

        var deleteLocalStorage = function ()
        {
            //devConsoleLog("sessao._limparLocalStorage");
            localStorageService.remove('user');
        };

        var recoverLocalStorage = function ()
        {
            //devConsoleLog("sessao._recuperarLocalStorage");
            var localStorage = localStorageService.get('user');

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
            if (localStorage._login && localStorage._login.createdat)
            {
                var _DATE_NOW                            = new Date();
                //devConsoleLog("_DATE_NOW: " + _DATE_NOW);
                var _DATE_NOW_TIMEZONE_OFFSET_IN_MINUTES = _DATE_NOW.getTimezoneOffset();
                /**
                 * convert to ms
                 * @type {number}
                 */
                var milissegundosDateAgoraTimezoneOffset = (_DATE_NOW_TIMEZONE_OFFSET_IN_MINUTES * 60 * 1000);
                var milissegundosDateAgoraComOffset      = (_DATE_NOW.getTime() - milissegundosDateAgoraTimezoneOffset);

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
                    localStorage._login.createdat = _DATE_NOW;
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
            deleteLocalStorage();
        };

        self.getUser = function ()
        {
            //devConsoleLog("sessao.getUser");
            return self.user;
        };

        self.setUser = function (data)
        {
            //devConsoleLog("sessao.setUser");
            self.setAuthenticationData(data);
        };

        self.setAuthenticationData = function (data)
        {
            //devConsoleLog("sessao.setAuthenticationData");
            self.user       = data.user;
            self.user.token = data.token || {};
            armazenarEmLocalStorage();
        };

    }
})();