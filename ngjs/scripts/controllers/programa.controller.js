(function ()
{

    angular.module("app")
        .controller("ProgramaController", ProgramaController);

    ProgramaController.$inject = [
        "$rootScope",
    ];

    function ProgramaController($rootScope)
    {

        $rootScope.verifyAuthentication();

        //var self = this;

    }

})();
