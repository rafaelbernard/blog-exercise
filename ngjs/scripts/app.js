(function ()
{
    //'use strict';

    angular
        .module("app", [
            "ngRoute",
            "LocalStorageModule",
            'ngSanitize',
            'ngMaterial',
            'ngResource',
            "chart.js",
            "ui.mask",
            "ui.select",
        ])
        .run(
            ["$location",
                "$rootScope",
                '$route',
                "$sce",
                "Sessao",
                function ($location,
                          $rootScope,
                          $route,
                          $sce,
                          sessao)
                {
                    // ===========
                    // CONS
                    // ===========
                    //$rootScope.CONFIG_USO = configUso;
                    $rootScope.CONFIG_USO = window._CONFIG;

                    $rootScope.NOW = new Date();

                    // =========
                    // BOOLEANS
                    // =========
                    $rootScope.logado          = false;
                    $rootScope.rotaDeAplicacao = false;

                    // =========
                    // OBJECTS
                    // =========
                    $rootScope.seo = {
                        description: "Figured"
                    };

                    // ==================
                    // OBJECTS - MODELOS
                    // ==================
                    var MODELO_DADOS_AUTENTICACAO = {
                        id: "",
                        nome: "",
                        tipoLogin: "",
                        objeto: {},
                        getId: function ()
                        {
                            return this.id;
                        }
                    };

                    // ==================
                    // OBJETOS DE SESSAO
                    // ==================
                    $rootScope.sessao = sessao;

                    $rootScope.getDadosAutenticacao = function ()
                    {
                        return $rootScope.sessao.getUsuario();
                    };

                    /**
                     *
                     * @returns {boolean|*}
                     */

                    $rootScope.getLogado = function ()
                    {
                        return $rootScope.sessao.getLogado();
                    };

                    $rootScope.setLogado = function (value)
                    {
                        return $rootScope.sessao.setLogado(value);
                        //$rootScope.logado = Boolean(value);
                        //return this;
                    };

                    /**
                     *
                     * @param html
                     * @returns {*}
                     */
                    $rootScope.toTrustedHTML = function (html)
                    {
                        return $sce.trustAsHtml(html);
                    };

                    $rootScope.setLastBreadcrumbLabel = function (newLabel)
                    {
                        var bc                  = breadcrumbs.getAll();
                        bc[bc.length - 1].label = newLabel;
                    };

                    $rootScope.setLastButOneBreadcrumbLabel = function (newLabel)
                    {
                        var bc                  = breadcrumbs.getAll();
                        bc[bc.length - 2].label = newLabel;
                    };

                    $rootScope.isSuccessResponse = function (response)
                    {
                        if (!response.data)
                        {
                            return false;
                        }

                        var data = response.data;

                        return true;
                    };

                    $rootScope.getIdUsuarioAutenticado = function ()
                    {
                        if ($rootScope.usuario.tipoLogin === "colaborador")
                        {
                            return $rootScope.usuario.objeto.CPF;
                        }

                        return null;
                    };

                    $rootScope.limparDadosSessao = function ()
                    {
                        //devConsoleLog("$rootScope.limparDadosSessao");
                        $rootScope.setLogado(false);
                        $rootScope.sessao.limparDadosSessao();
                    };

                    $rootScope.usuarioEstaLogadoV1 = function ()
                    {
                        //devConsoleLog("$rootScope.usuarioEstaLogadoV1");
                        return $rootScope.sessao.usuarioEstaLogadoOuLocalStorageV1();
                    };

                    /**
                     * Verifica se usuario estah autenticado e realiza redirecionamento se necessario
                     */
                    $rootScope.verificarAutenticacao = function ()
                    {
                        //devConsoleLog("$rootScope.verificarAutenticacao");
                        $rootScope.redirecionarSeUsuarioDeslogadoV1();
                    };

                    $rootScope.redirecionarSeUsuarioDeslogadoV1 = function ()
                    {
                        //devConsoleLog("$rootScope.redirecionarSeUsuarioDeslogadoV1");

                        if (!$rootScope.usuarioEstaLogadoV1())
                        {
                            //devConsoleLog('self.redirecionarSeUsuarioDeslogadoV1: !self.usuarioEstaLogadoV1()');
                            //return;
                            $rootScope.logoff();
                            $location.path("/login");
                        }
                    };

                    $rootScope.logoff = function ()
                    {
                        //devConsoleLog("$rootScope.logoff");
                        $rootScope.limparDadosSessao();
                        return $rootScope;
                    };

                    $rootScope.sair = function ()
                    {
                        //devConsoleLog("$rootScope.sair");
                        $rootScope.logoff();
                        $location.path("/");
                        return $rootScope;
                    };

                    /**
                     *
                     * @returns {*}
                     */
                    $rootScope.verificarRotaDeAplicacao = function ()
                    {
                        //devConsoleLog("$rootScope.verificarRotaDeAplicacao");
                        $rootScope.rotaDeAplicacao = true;

                        var caminho = $location.path();

                        var emCaminhoLandingConviteFarmacia = (caminho.indexOf("/farmacia/convite/") !== 1 && caminho.indexOf("/credenciamento/") !== 1);

                        if (caminho === "/login" || emCaminhoLandingConviteFarmacia)
                        {
                            $rootScope.rotaDeAplicacao = false;
                        }

                        return $rootScope;
                    };

                    $rootScope.$on("$locationChangeStart", function (event, next, current)
                    {
                        // handle route changes
                        //devConsoleLog("$locationChangeStart");
                    });

                    $rootScope.$on("$locationChangeSuccess", function (event, next, current)
                    {
                        // handle route changes
                        //devConsoleLog("$locationChangeSuccess");
                        $rootScope.verificarRotaDeAplicacao();
                    });

                    $rootScope.setDadosAutenticacao = function (dados)
                    {
                        $rootScope.usuario        = Object.assign(MODELO_DADOS_AUTENTICACAO, dados);
                        $rootScope.usuario.objeto = angular.copy(dados);
                        $rootScope.normalizeDadosAutenticacao();
                    };

                    $rootScope.setDadosAutenticacaoColaborador = function (dados)
                    {
                        dados.tipoLogin = "colaborador";
                        $rootScope.setDadosAutenticacao(dados);
                        return $rootScope.sessao.setUsuarioColaborador(dados);
                    };

                    $rootScope.normalizeDadosAutenticacao = function ()
                    {
                        //devConsoleLog("$rootScope.normalizeDadosAutenticacao");
                        if ($rootScope.usuario.tipoLogin === "colaborador")
                        {
                            $rootScope.normalizeDadosAutenticacaoColaborador();
                        }
                    };

                    $rootScope.normalizeDadosAutenticacaoColaborador = function ()
                    {
                        //devConsoleLog("$rootScope.normalizeDadosAutenticacaoColaborador");
                        var colaborador         = angular.copy($rootScope.usuario.objeto);
                        $rootScope.usuario.id   = colaborador.CPF;
                        $rootScope.usuario.nome = colaborador.Nome;
                    };

                    $rootScope.isActiveRoute = function (route)
                    {
                        // I added '/' instead of using a regex to remove it from path()
                        return '/' + route === $location.path();
                    };

                    $rootScope._init = function ()
                    {
                        //devConsoleLog("rs._init");
                        //devConsoleLog($location.path());

                        $rootScope.verificarRotaDeAplicacao();

                        if (!$rootScope.rotaDeAplicacao)
                        {
                            return;
                        }

                        $rootScope.redirecionarSeUsuarioDeslogadoV1();
                    };

                    $rootScope._init();
                }])
        .config(['$httpProvider', '$routeProvider', "$locationProvider", "localStorageServiceProvider", "$mdThemingProvider", "ChartJsProvider",
            function ($httpProvider, $routeProvider, $locationProvider, localStorageServiceProvider, $mdThemingProvider, ChartJsProvider)
            {
                devConsoleLog("rs.config");

                ChartJsProvider.setOptions({colors: ['#ec008c', '#803690', '#ec008c', '#ec008c', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']});

                localStorageServiceProvider
                    .setPrefix('achecpvcolaborador');

                $mdThemingProvider.theme('red')
                    .primaryPalette('red');

                $mdThemingProvider.theme('blue')
                    .primaryPalette('blue');

                $routeProvider
                    .when("/", {
                        templateUrl: "views/main.html",
                        controller: 'MainController',
                        controllerAs: 'main',
                        label: 'Home'
                    })
                    // landings
                    .when("/login", {
                        templateUrl: "views/login.html",
                        controller: "LoginController",
                        controllerAs: "loginController",
                        label: "Login"
                    })
                    .when("/landing/:urlLandingPage", {
                        templateUrl: 'views/achevita.html',
                        controller: 'mipController',
                        controllerAs: 'mip',
                        label: 'Achevita'
                    })
                    .when("/farmacia/convite/:chaveConviteFarmacia/credenciamento", {
                        templateUrl: "views/landing/farmacia/formulario-credenciamento.html",
                        controller: "FarmaciaLandingController",
                        controllerAs: "farmacia",
                        label: "Farmácia"
                    })
                    // rotas de aplicacao
                    .when("/inicial/colaborador", {
                        templateUrl: "views/inicial-colaborador.html",
                        controller: "InicialColaboradorController",
                        controllerAs: "inicial",
                        label: "Inicial"
                    })
                    .when("/farmacia/convite", {
                        templateUrl: "views/farmacia/tabela-lista-convite.html",
                        controller: "FarmaciaController",
                        controllerAs: "farmacia",
                        label: "Farmácia"
                    })
                    .when("/relatorios", {
                        templateUrl: "views/relatorios.html",
                        controller: "RelatorioController",
                        controllerAs: "relatorio",
                        label: "Relatórios"
                    })
                    .when("/mensagens", {
                        templateUrl: "views/mensagens.html",
                        controller: "MensagensController",
                        controllerAs: "mensagens",
                        label: "Mensagens"
                    })
                    .when("/cadastro-paciente", {
                        templateUrl: "views/cadastro-paciente.html",
                        controller: "cadastroController",
                        controllerAs: "cadastroController",
                        label: "Cadastro de Pacientes"
                    })
                    // .when("/cadastro-paciente-2", {
                    //     templateUrl: "views/cadastro-paciente-2.html",
                    //     controller: "cadastroController",
                    //     controllerAs: "cadastroController",
                    //     label: "Cadastro de Pacientes"
                    // })
                    // .when("/cadastro-paciente-3", {
                    //     templateUrl: "views/cadastro-paciente-3.html",
                    //     controller: "cadastroController",
                    //     controllerAs: "cadastroController",
                    //     label: "Cadastro de Pacientes"
                    // })
                    .when("/produtos-participantes", {
                        templateUrl: "views/produtos-participantes.html",
                        controller: "ProdutosController",
                        controllerAs: "produtos",
                        label: "Produtos Participantes"
                    })
                    .when('/produtos-participantes/:prodSlug', {
                        templateUrl: 'views/produtos-participantes-detalhe.html',
                        controller: 'ProdutoDetalheController',
                        controllerAs: 'produtoDetalhe',
                        label: 'Produtos Participantes'
                    })
                    .when("/materiais-promocionais", {
                        templateUrl: "views/materiais-promocionais.html",
                        controller: "MaterialPromocionalController",
                        controllerAs: "materialPromocionalController",
                        label: "Materiais Promocionais"
                    })
                    .when("/programa", {
                        templateUrl: "views/programa.html",
                        // controller: "ProgramaController",
                        // controllerAs: "programa",
                        label: "O Programa"
                    })
                    .when("/faq", {
                        templateUrl: "views/faq.html",
                        controller: "FaqController",
                        controllerAs: "faq",
                        label: "FAQ"
                    })
                    .when("/cuidador", {
                        templateUrl: "views/cuidador.html",
                        controller: "CuidadorController",
                        controllerAs: "cuidador",
                        label: "Cuidador"
                    })
                    .when("/saudavel-saber", {
                        templateUrl: "views/saudavelsaber.html",
                        controller: "SaudavelController",
                        controllerAs: "saudavel",
                        label: "Saudavel Saber"
                    })
                    .when("/pagina-nao-encontrada", {
                        templateUrl: "views/erro404.html",
                        controller: 'erro404Controller',
                        controllerAs: 'erro404',
                        label: 'Erro 404'
                    })
                    .otherwise({
                        templateUrl: 'views/erro404.html',
                        controller: 'erro404Controller',
                        controllerAs: 'erro404',
                        label: 'Erro 404'
                    });

                $locationProvider.html5Mode(true);
                //$locationProvider.hashPrefix("");

            }]);

    //devConsoleLog(window._CONFIG);

    angular
        .module("app")
        .constant("_", window._);

})();
