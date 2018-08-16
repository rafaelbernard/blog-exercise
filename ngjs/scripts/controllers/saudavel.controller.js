(function ()
{

    angular.module("app")
        .controller("SaudavelController", SaudavelController);

    SaudavelController.$inject = [
        "$rootScope"
    ];

    function SaudavelController($rootScope)
    {
        $rootScope.verificarAutenticacao();

        //var self = this;

    }

})();
