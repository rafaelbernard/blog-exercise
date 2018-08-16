(function ()
{

    angular.module("app")
        .controller("InicialColaboradorController", InicialColaboradorController);

    InicialColaboradorController.$inject = [
        "$rootScope",
    ];

    function InicialColaboradorController($rootScope)
    {

        $rootScope.verificarAutenticacao();

        //var self = this;
        $rootScope.namePage = "pagina_home";

    }

})();
