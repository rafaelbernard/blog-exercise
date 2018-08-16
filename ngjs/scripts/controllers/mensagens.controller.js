(function ()
{

    angular.module("app")
        .controller("MensagensController", MensagensController);

    MensagensController.$inject = [
        "$rootScope",
        "postsDaoService",
    ];

    function MensagensController($rootScope,
                                 postsDaoService)
    {
        $rootScope.verificarAutenticacao();
        var self = this;
        self.conteudoMensagem = "";

        self.verificaMensagens = function ()
        {
            devConsoleLog("verificaMensagens");
            postsDaoService.carregaMensagensService()
                .then(
                    function (response)
                    {
                        self.itemsMensagens = response.data.posts;
                        self.pagesProdutos = response.data.pages;
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

    }

})();
