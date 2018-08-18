(function ()
{
    //'use strict';

    angular
        .module('app', [
            "ngRoute",
            "LocalStorageModule",
            'ngSanitize',
            'ngMaterial',
            'ngResource',
            'ui.mask',
            'hc.marked',
            //'btford.markdown',
            //'Showdown'
        ])
        .run(
            ['$location',
                '$http',
                '$rootScope',
                '$route',
                "$sce",
                'Session',
                function ($location,
                          $http,
                          $rootScope,
                          $route,
                          $sce,
                          session
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
                    // SESSION OBJECT
                    // ==================
                    $rootScope.session = session;

                    $rootScope.getAuthenticationData = function ()
                    {
                        return $rootScope.session.getUser();
                    };

                    /**
                     *
                     * @returns {boolean|*}
                     */

                    $rootScope.getLogged = function ()
                    {
                        return $rootScope.session.getLogged();
                    };

                    $rootScope.setLogged = function (value)
                    {
                        return $rootScope.session.setLogged(value);
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

                    // $rootScope.setLastBreadcrumbLabel = function (newLabel)
                    // {
                    //     var bc                  = breadcrumbs.getAll();
                    //     bc[bc.length - 1].label = newLabel;
                    // };
                    //
                    // $rootScope.setLastButOneBreadcrumbLabel = function (newLabel)
                    // {
                    //     var bc                  = breadcrumbs.getAll();
                    //     bc[bc.length - 2].label = newLabel;
                    // };

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

                    $rootScope.messageSuccess = function (texto)
                    {
                        if (!texto)
                        {
                            texto = 'Sucesso';
                        }

                        $rootScope.classeAlert = 'success';
                        $rootScope.textoAlert  = texto;
                    };

                    $rootScope.messageError = function (data, dados, status)
                    {
                        if (!data)
                        {
                            data = 'Erro!';
                        }
                        if (dados)
                        {
                            data += ' | Dados: ' + dados;
                        }
                        if (status)
                        {
                            data += ' | Status: ' + status;
                        }

                        if (data.message && data.exception)
                        {
                            data = data.message;
                            if (data === "Token expired")
                            {
                                $location.path('/login');
                            }
                        }

                        if (data.message && !data.errors)
                        {
                            data = data.message;
                        }

                        $rootScope.classeAlert = 'danger';
                        $rootScope.textoAlert  = data;
                    };

                    $rootScope.cleanSessionData = function ()
                    {
                        //devConsoleLog("$rootScope.cleanSessionData");
                        $rootScope.setLogged(false);
                        $rootScope.session.cleanSessionData();
                    };

                    $rootScope.isUserLoggedV1 = function ()
                    {
                        //devConsoleLog("$rootScope.isUserLoggedV1");
                        return $rootScope.session.isUserLoggedOrLocalStorageV1();
                    };

                    // $rootScope.verifyLoggedData = function ()
                    // {
                    //
                    // };

                    $rootScope.verifyAuthentication = function ()
                    {
                        devConsoleLog("$rootScope.verifyAuthentication");
                        $rootScope.redirectUnloggedUserV1();
                    };

                    $rootScope.redirectUnloggedUserV1 = function ()
                    {
                        devConsoleLog("$rootScope.redirectUnloggedUserV1");

                        if (!$rootScope.isUserLoggedV1())
                        {
                            //devConsoleLog('self.redirectUnloggedUserV1: !self.usuarioEstaLogadoV1()');
                            //return;
                            $rootScope.logoff();
                            $location.path('/login');
                        }
                    };

                    $rootScope.logoff = function ()
                    {
                        //devConsoleLog("$rootScope.logoff");
                        $rootScope.cleanSessionData();
                        return $rootScope;
                    };

                    $rootScope.exit = function ()
                    {
                        //devConsoleLog("$rootScope.sair");
                        $rootScope.logoff();
                        $location.path('/');
                        return $rootScope;
                    };

                    $rootScope.removeMessage = function ()
                    {
                        //console.log("$rootScope.removerAlert");
                        $rootScope.textoAlert  = '';
                        $rootScope.classeAlert = '';
                    };

                    $rootScope.infoMessage = function (texto)
                    {
                        if (!texto)
                        {
                            texto = 'Processing...';
                        }

                        $rootScope.classeAlert = 'info';
                        $rootScope.textoAlert  = texto;
                    };

                    $rootScope.setAuthenticationData = function (dados)
                    {
                        $rootScope.user        = Object.assign(AUTH_MODEL_DATA, dados);
                        $rootScope.user.objeto = angular.copy(dados);
                    };

                    $rootScope.isActiveRoute = function (route)
                    {
                        // I added '/' instead of using a regex to remove it from path()
                        return '/' + route === $location.path();
                    };

                    $rootScope._init = function ()
                    {
                        //devConsoleLog("rs._init");
                        //$rootScope.redirectUnloggedUserV1();
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
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'PublicPostController',
                        controllerAs: 'publicPostController',
                        label: 'Home'
                    })
                    // landings
                    .when('/login', {
                        templateUrl: "views/login.html",
                        controller: "LoginController",
                        controllerAs: "loginController",
                        label: "Login"
                    })
                    .when('/admin', {
                        redirectTo: '/admin/post'
                    })
                    .when('/admin/user', {
                        templateUrl: 'views/private/tpl-users-list.html',
                        controller: 'UserController',
                        controllerAs: "userController",
                        label: "User"
                    })
                    .when('/admin/post', {
                        templateUrl: 'views/private/tpl-post-list.html',
                        controller: 'PostController',
                        controllerAs: 'postController',
                        label: "Post"
                    })
                    .when('/post/:id', {
                        templateUrl: 'views/public/post-single.html',
                        controller: 'PublicPostController',
                        controllerAs: 'publicPostController',
                        label: 'Post'
                    })
                    .when('/not-found', {
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
        .module('app')
        .directive('compareTo', function ()
        {
            return {
                require: "ngModel",
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function (scope, element, attributes, ngModel)
                {

                    ngModel.$validators.compareTo = function (modelValue)
                    {
                        return modelValue == scope.otherModelValue;
                    };

                    scope.$watch("otherModelValue", function ()
                    {
                        ngModel.$validate();
                    });
                }
            }
        });

    angular
        .module('app')
        .constant("_", window._);

})();
