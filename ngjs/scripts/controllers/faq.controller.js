(function ()
{

    angular.module("app")
        .controller("FaqController", FaqController);

    FaqController.$inject = [
        "$rootScope",
        "postsDaoService",
        "ErrorHandlerService",
        "PublicService"
    ];

    function FaqController($rootScope, postsDaoService, errorHandler, PublicService)
    {
        $rootScope.verifyAuthentication();

        var self = this;

        self.formularioContato = {};

        self.verificaFaq = function ()
        {
            postsDaoService.carregaFaqService()
                .then(
                    function (response)
                    {
                        //console.log("MENSAGEM" + JSON.stringify(response));
                        self.itemsFaq = response.data.posts;
                        // console.log("RESPOSTAS");
                        // console.log(response.data.posts);
                    },
                    function (erro)
                    {
                        console.log(erro);
                    }
                );
        };

        self.enviarFormularioFaq = function ()
        {
            //console.log(self.formularioContato);
            self.formularioContato.assunto = "duvida-faq-cpvemcampo";
            self.formularioContato.fonte = "cpvemcampo";
            self.formularioContato.codTipoFormulario = "faq";
            self.formularioContato.nome = angular.copy($rootScope.sessao.getUser().nome);
            self.formularioContato.email = angular.copy($rootScope.sessao.getUser().Email);

            PublicService.enviarFormularioContatoV2(self.formularioContato)
                .then(function ()
                      {
                          sendFeedback("Dúvida enviada!");
                          self.formularioContato = {};
                      })
                .catch(function (error)
                       {
                           errorHandler.sendFeedbackErro(error);
                       });
        };

        self.verificaFaq();


    }

})();
