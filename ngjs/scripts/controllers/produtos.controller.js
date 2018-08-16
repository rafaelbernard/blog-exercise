(function ()
{

    angular.module("app")
        .controller("ProdutosController", ProdutosController);

    ProdutosController.$inject = [
        "$rootScope",
        "postsDaoService"
    ];

    function ProdutosController($rootScope, postsDaoService)
    {
        $rootScope.verifyAuthentication();

        var self = this;
        
        self.verificaProdutosPrecritos = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosPrecritos = response.data.posts;   
                        console.log("RESPOSTA:");
                        console.log(self.itemsProdutosPrecritos);
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };
        self.verificaProdutosProtecao = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosProtecao = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };
        self.verificaProdutosPele = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosPele = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };
        self.verificaProdutosAguas = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosAguas = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

        self.verificaProdutosSensivel = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosSensivel = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

        self.verificaProdutosAntirrugas = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosAntirrugas = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

        self.verificaProdutosClareador = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosClareador = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

        self.verificaProdutosDensificador = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosDensificador = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

        self.verificaProdutosHidratacao = function (categoria)
        {
            postsDaoService.carregaTodosProdutosCategoriaService(categoria)
                .then(
                    function (response)
                    {
                        self.itemsProdutosHidratacao = response.data.posts;   
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

    }

})();
