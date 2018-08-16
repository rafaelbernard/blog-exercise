(function ()
{

    angular.module("app")
        .controller("ProgramaController", ProgramaController);

    ProgramaController.$inject = [
        "$rootScope",
    ];

    function ProgramaController($rootScope)
    {

        $rootScope.verificarAutenticacao();

        //var self = this;

    }

})();
