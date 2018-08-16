(function ()
{

    angular.module("app")
        .controller("MainController", MainController);

    MainController.$inject = [
        "$location",
        "$rootScope",
    ];

    function MainController($location,
                            $rootScope)
    {
        $rootScope.verifyAuthentication();
        
        var self = this;

        self._initInicial = function ()
        {
            devConsoleLog("_initInicial");
            $location.path("/inicial/colaborador");
        };
        
        
    }

})();
