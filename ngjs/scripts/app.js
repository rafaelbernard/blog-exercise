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
            "ui.mask",
        ])
        .run(
            ['$location',
                '$http',
                "$rootScope",
                '$route',
                "$sce",
                "Sessao",
                function ($location,
                          $http,
                          $rootScope,
                          $route,
                          $sce,
                          sessao
                )
                {
                    // ===========
                    // CONS
                    // ===========
                    $rootScope.CONFIG_USO = window._CONFIG;

                    $rootScope.NOW = new Date();

                    // =========
                    // BOOLEANS
                    // =========
                    $rootScope.logado           = false;
                    $rootScope.applicationRoute = false;

                    // =========
                    // OBJECTS
                    // =========
                    $rootScope.seo = {
                        description: "Figured"
                    };

                    // ==================
                    // OBJECTS - MODELOS
                    // ==================
                    var AUTH_MODEL_DATA = {
                        id: "",
                        nome: "",
                        tipoLogin: "",
                        objeto: {},
                        getId: function ()
                        {
                            return this.id;
                        }
                    };

                    $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

                    // ==================
                    // OBJETOS DE SESSAO
                    // ==================
                    $rootScope.sessao = sessao;

                    $rootScope.getDadosAutenticacao = function ()
                    {
                        return $rootScope.sessao.getUser();
                    };

                    /**
                     *
                     * @returns {boolean|*}
                     */

                    $rootScope.getLogged = function ()
                    {
                        return $rootScope.sessao.getLogged();
                    };

                    $rootScope.setLogged = function (value)
                    {
                        return $rootScope.sessao.setLogged(value);
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
                        if ($rootScope.user.tipoLogin === "colaborador")
                        {
                            return $rootScope.user.objeto.CPF;
                        }

                        return null;
                    };

                    $rootScope.cleanSessionData = function ()
                    {
                        //devConsoleLog("$rootScope.cleanSessionData");
                        $rootScope.setLogged(false);
                        $rootScope.sessao.cleanSessionData();
                    };

                    $rootScope.isUserLoggedV1 = function ()
                    {
                        //devConsoleLog("$rootScope.isUserLoggedV1");
                        return $rootScope.sessao.isUserLoggedOrLocalStorageV1();
                    };

                    $rootScope.verifyAuthentication = function ()
                    {
                        //devConsoleLog("$rootScope.verifyAuthentication");
                        $rootScope.redirectUnloggedUserV1();
                    };

                    $rootScope.redirectUnloggedUserV1 = function ()
                    {
                        //devConsoleLog("$rootScope.redirectUnloggedUserV1");

                        if (!$rootScope.isUserLoggedV1())
                        {
                            //devConsoleLog('self.redirectUnloggedUserV1: !self.usuarioEstaLogadoV1()');
                            //return;
                            $rootScope.logoff();
                            $location.path("/login");
                        }
                    };

                    $rootScope.logoff = function ()
                    {
                        //devConsoleLog("$rootScope.logoff");
                        $rootScope.cleanSessionData();
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
                    $rootScope.verifyApplicationRoute = function ()
                    {
                        //devConsoleLog("$rootScope.verifyApplicationRoute");
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
                        $rootScope.verifyApplicationRoute();
                    });

                    $rootScope.setAuthenticationData = function (dados)
                    {
                        $rootScope.user        = Object.assign(AUTH_MODEL_DATA, dados);
                        $rootScope.user.objeto = angular.copy(dados);
                        $rootScope.normalizeAuthenticationData();
                    };

                    $rootScope.normalizeAuthenticationData = function ()
                    {
                        //devConsoleLog("$rootScope.normalizeAuthenticationData");

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

                        $rootScope.verifyApplicationRoute();

                        if (!$rootScope.applicationRoute)
                        {
                            return;
                        }

                        $rootScope.redirectUnloggedUserV1();
                    };

                    $rootScope._init();
                }
            ])
        .config(['$httpProvider', '$routeProvider', "$locationProvider", "localStorageServiceProvider", "$mdThemingProvider",
            function ($httpProvider, $routeProvider, $locationProvider, localStorageServiceProvider, $mdThemingProvider)
            {
                devConsoleLog("rs.config");

                localStorageServiceProvider
                    .setPrefix('figured');

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
                        templateUrl: 'views/initial.html',
                        controller: 'InicialColaboradorController',
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
                    .when("/not-found", {
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
