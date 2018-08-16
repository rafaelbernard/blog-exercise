angular.module('app')
    .controller('erro404Controller', ['$location', '$http', '$scope', function ($location, $http, $scope)
    {
        var self = this;

        $scope.$parent.seo = {
            pageTitle: 'Página não Encontrada - Cuidados Pela Vida',
            pageDescription: '',
            pageKeywords: '',
            urlFacebook: 'http://cuidadospelavida.com.br/pagina-nao-encontrada'
        };

        self.slugPageUnique = "erro404";
        devConsoleLog("ID UNICO " + self.slugPageUnique);

    }]);