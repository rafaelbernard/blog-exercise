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
        var logado = false;

        // OBJECTS - MODELOS
        var MODELO_DADOS_AUTENTICACAO = {
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
            localStorageService.set("usuario", self.usuario);
        };

        var limparLocalStorage = function ()
        {
            //devConsoleLog("sessao._limparLocalStorage");
            localStorageService.remove("usuario");
        };

        var recuperarLocalStorage = function ()
        {
            //devConsoleLog("sessao._recuperarLocalStorage");
            var localStorage = localStorageService.get("usuario");

            if (localStorage)
            {
                if (!localStorageValido(localStorage))
                {
                    return;
                }

                self.setLogado(true);
                self.setDadosAutenticacao(localStorage);
            }
        };

        var localStorageValido = function (localStorage)
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

        self.usuarioEstaLogadoOuLocalStorageV1 = function ()
        {
            //devConsoleLog("sessao.usuarioEstaLogadoOuLocalStorageV1");

            if (!self.getUsuario())
            {
                recuperarLocalStorage();
            }

            return (self.getLogado() && self.getUsuario());
        };

        self.getLogado = function ()
        {
            return logado;
        };

        self.setLogado = function (value)
        {
            logado = Boolean(value);
            return self;
        };

        self.limparDadosSessao = function ()
        {
            //devConsoleLog("sessao.limparDadosSessao");
            self.setLogado(false);
            self.usuario     = null;
            self.colaborador = null;
            limparLocalStorage();
        };

        self.getUsuario = function ()
        {
            //devConsoleLog("sessao.getUsuario");
            return self.usuario;
        };

        self.setUsuarioColaborador = function (dados)
        {
            //devConsoleLog("sessao.setUsuarioColaborador");
            dados.tipoLogin = "colaborador";
            self.setDadosAutenticacao(dados);
        };

        self.setDadosAutenticacao = function (dados)
        {
            //devConsoleLog("sessao.setDadosAutenticacao");
            self.usuario        = Object.assign(MODELO_DADOS_AUTENTICACAO, dados);
            self.usuario.objeto = angular.copy(dados);
            self.normalizeDadosAutenticacao();
            armazenarEmLocalStorage();
        };

        self.normalizeDadosAutenticacao = function ()
        {
            //devConsoleLog("sessao.normalizeDadosAutenticacao");
            if (self.usuario.tipoLogin === "colaborador")
            {
                self.normalizeDadosAutenticacaoColaborador();
            }
        };

        self.normalizeDadosAutenticacaoColaborador = function ()
        {
            //devConsoleLog("sessao.normalizeDadosAutenticacaoColaborador");
            var colaborador   = angular.copy(self.usuario.objeto);
            self.usuario.id   = colaborador.CPF;
            self.usuario.cpf  = colaborador.CPF;
            self.usuario.nome = colaborador.Nome;
            if (colaborador.Dados.Cargo.lastIndexOf('DISTRITAL') !== -1)
            {
                self.usuario.cargo = 'GERENTE';
                // TODO remover POG
                if (colaborador.Login.toLowerCase() === 'ldgjoao' || colaborador.Login.toLowerCase() === 'bbfernando' || colaborador.Login.toLowerCase() === 'tlclarisvaldo' || colaborador.Login.toLowerCase() === 'jvroberto' || colaborador.Login.toLowerCase() === 'trclarisse' || colaborador.Login.toLowerCase() === 'psokarina' || colaborador.Login.toLowerCase() === 'rsothais' || colaborador.Login.toLowerCase() === '36126150848')
                {
                    self.usuario.piloto = true;
                }
            }
            else if (colaborador.Dados.Cargo.lastIndexOf('PROPAGANDISTA') !== -1)
            {
                self.usuario.cargo = 'PROPAGANDISTA';
                // TODO remover POG
                if (colaborador.Login.toLowerCase() === 'ldgjoao' || colaborador.Login.toLowerCase() === 'bbfernando' || colaborador.Login.toLowerCase() === 'tlclarisvaldo' || colaborador.Login.toLowerCase() === 'jvroberto' || colaborador.Login.toLowerCase() === 'trclarisse' || colaborador.Login.toLowerCase() === 'psokarina' || colaborador.Login.toLowerCase() === 'rsothais' || colaborador.Login.toLowerCase() === '36126150848' || colaborador.Login.toLowerCase() === '05103969335' || colaborador.Login.toLowerCase() === 'aspablo' || colaborador.Login.toLowerCase() === 'pehiasmim' || colaborador.Login.toLowerCase() === 'pfilca' || colaborador.Login.toLowerCase() === 'oskarolina' || colaborador.Login.toLowerCase() === 'japriscila' || colaborador.Login.toLowerCase() === 'mbmariana' || colaborador.Login.toLowerCase() === 'sarafael' || colaborador.Login.toLowerCase() === 'acbruno' || colaborador.Login.toLowerCase() === 'crvaldecy' || colaborador.Login.toLowerCase() === 'godkamila' || colaborador.Login.toLowerCase() === 'fplaryssa' || colaborador.Login.toLowerCase() === 'mpwellington' || colaborador.Login.toLowerCase() === 'bgjglaucio' || colaborador.Login.toLowerCase() === 'gcelizeu' || colaborador.Login.toLowerCase() === 'xmcrislei' || colaborador.Login.toLowerCase() === 'skfellipe' || colaborador.Login.toLowerCase() === 'vgcaugusto' || colaborador.Login.toLowerCase() === 'aarenato' || colaborador.Login.toLowerCase() === 'bcggleicy' || colaborador.Login.toLowerCase() === 'banilo' || colaborador.Login.toLowerCase() === 'graana' || colaborador.Login.toLowerCase() === 'henriquems' || colaborador.Login.toLowerCase() === 'nacrenato' || colaborador.Login.toLowerCase() === 'adfscleticia' || colaborador.Login.toLowerCase() === 'saglaucia' || colaborador.Login.toLowerCase() === 'scsjulio' || colaborador.Login.toLowerCase() === 'gtaldenir' || colaborador.Login.toLowerCase() === 'gdcaroline' || colaborador.Login.toLowerCase() === 'mremerson' || colaborador.Login.toLowerCase() === 'sradao' || colaborador.Login.toLowerCase() === 'crthiago' || colaborador.Login.toLowerCase() === 'mjademilton' || colaborador.Login.toLowerCase() === 'fbjoao' || colaborador.Login.toLowerCase() === 'arheloisa' || colaborador.Login.toLowerCase() === 'ocbrafael' || colaborador.Login.toLowerCase() === 'sgiovani' || colaborador.Login.toLowerCase() === 'ffalan' || colaborador.Login.toLowerCase() === 'slanderson' || colaborador.Login.toLowerCase() === 'cgrodrigo' || colaborador.Login.toLowerCase() === 'getagide' || colaborador.Login.toLowerCase() === 'srvaldenir' || colaborador.Login.toLowerCase() === 'cdaline' || colaborador.Login.toLowerCase() === 'rairton' || colaborador.Login.toLowerCase() === 'nsluciana' || colaborador.Login.toLowerCase() === 'ldanderson' || colaborador.Login.toLowerCase() === 'phfernando' || colaborador.Login.toLowerCase() === 'mkana' || colaborador.Login.toLowerCase() === 'drfernando' || colaborador.Login.toLowerCase() === 'rcristiane' || colaborador.Login.toLowerCase() === 'bpfabio' || colaborador.Login.toLowerCase() === 'pmariana' || colaborador.Login.toLowerCase() === 'fedinei' || colaborador.Login.toLowerCase() === 'lmonique' || colaborador.Login.toLowerCase() === 'mkcristina' || colaborador.Login.toLowerCase() === 'fmplinio' || colaborador.Login.toLowerCase() === 'srmfelipe' || colaborador.Login.toLowerCase() === 'ccantonio' || colaborador.Login.toLowerCase() === 'fgjsamanta' || colaborador.Login.toLowerCase() === 'agczuleide' || colaborador.Login.toLowerCase() === 'smronaldo' || colaborador.Login.toLowerCase() === 'pcristian' || colaborador.Login.toLowerCase() === 'lmkaline' || colaborador.Login.toLowerCase() === 'tvmurilo' || colaborador.Login.toLowerCase() === 'ceder' || colaborador.Login.toLowerCase() === 'mpicolo' || colaborador.Login.toLowerCase() === 'mlilian' || colaborador.Login.toLowerCase() === 'sagrasiele' || colaborador.Login.toLowerCase() === 'agmauro' || colaborador.Login.toLowerCase() === 'ganayara' || colaborador.Login.toLowerCase() === 'ktjessica' || colaborador.Login.toLowerCase() === 'bbfabiano' || colaborador.Login.toLowerCase() === 'memaline' || colaborador.Login.toLowerCase() === 'cjose' || colaborador.Login.toLowerCase() === 'vlgabriela' || colaborador.Login.toLowerCase() === 'bavgabrielle' || colaborador.Login.toLowerCase() === 'ssdjair' || colaborador.Login.toLowerCase() === 'vbbianca' || colaborador.Login.toLowerCase() === 'atmariana' || colaborador.Login.toLowerCase() === 'sefabio' || colaborador.Login.toLowerCase() === 'mspamela' || colaborador.Login.toLowerCase() === 'jonary' || colaborador.Login.toLowerCase() === 'svcinthia' || colaborador.Login.toLowerCase() === 'malexandre' || colaborador.Login.toLowerCase() === 'pehiasmim' || colaborador.Login.toLowerCase() === 'ssedmilson' || colaborador.Login.toLowerCase() === 'frmarcelo' || colaborador.Login.toLowerCase() === 'modjuliana' || colaborador.Login.toLowerCase() === 'cspaloma' || colaborador.Login.toLowerCase() === 'dgtnatalia' || colaborador.Login.toLowerCase() === 'gtmagui' || colaborador.Login.toLowerCase() === 'gsligia' || colaborador.Login.toLowerCase() === 'jdmarcelo' || colaborador.Login.toLowerCase() === 'fzraul' || colaborador.Login.toLowerCase() === 'aqmaressa' || colaborador.Login.toLowerCase() === 'gmjuliana' || colaborador.Login.toLowerCase() === 'sramaristela' || colaborador.Login.toLowerCase() === 'feflavia' || colaborador.Login.toLowerCase() === 'mmvilson' || colaborador.Login.toLowerCase() === 'spalex' || colaborador.Login.toLowerCase() === 'pivan' || colaborador.Login.toLowerCase() === 'cpana' || colaborador.Login.toLowerCase() === 'rejuliana' || colaborador.Login.toLowerCase() === 'flsheila' || colaborador.Login.toLowerCase() === 'aacarlos' || colaborador.Login.toLowerCase() === 'adlfernando' || colaborador.Login.toLowerCase() === 'ppcaroline' || colaborador.Login.toLowerCase() === 'adrtamara' || colaborador.Login.toLowerCase() === 'lhldebora' || colaborador.Login.toLowerCase() === 'bnpedro' || colaborador.Login.toLowerCase() === 'ssdmariana' || colaborador.Login.toLowerCase() === 'stfluiz' || colaborador.Login.toLowerCase() === 'pgvinicius' || colaborador.Login.toLowerCase() === 'nfjoaquim' || colaborador.Login.toLowerCase() === 'bcelisangela' || colaborador.Login.toLowerCase() === 'gppana' || colaborador.Login.toLowerCase() === 'pmthais' || colaborador.Login.toLowerCase() === 'nctantonio' || colaborador.Login.toLowerCase() === 'lmwesley' || colaborador.Login.toLowerCase() === 'aqljadson' || colaborador.Login.toLowerCase() === 'ssrafael' || colaborador.Login.toLowerCase() === 'flgfernanda' || colaborador.Login.toLowerCase() === 'bprafael' || colaborador.Login.toLowerCase() === 'brharison')
                {
                    self.usuario.piloto = true;
                }
            }
            // TODO remover POG
            else if (colaborador.Login.toLowerCase() === 'ccamila' || colaborador.Login.toLowerCase() === 'stfantonio' || colaborador.Login.toLowerCase() === 'sxvsamuel')
            {
                self.usuario.cargo = 'GERENTE';
                self.usuario.piloto = true;
            }
            // TODO remover POG
            else if (colaborador.Login.toLowerCase() === 'ncristiane' || colaborador.Login.toLowerCase() === 'ssgabriel')
            {
                self.usuario.cargo = 'PROPAGANDISTA';
                self.usuario.piloto = true;
                self.usuario.Dados.Gestores = [
                {
                    Nome: "Camila Crispiniano",
                    Email: "igor.gois@ache.com.br",
                    CelularCorporativo: "11999960043",
                    Cargo: "GERENTE MARKETING RELACIONAMENTO"
                }];

            }
            else
            {
                self.usuario.cargo = 'OUTROS';
            }
        };

    }
})();