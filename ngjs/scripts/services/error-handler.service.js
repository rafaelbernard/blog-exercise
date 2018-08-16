(function ()
{
    //"use strict";
    angular.module("app")
        .service("ErrorHandlerService", ErrorHandlerService);

    ErrorHandlerService.$inject = ['$q'];

    function ErrorHandlerService($q)
    {

        var self = this;

        self.errorFromDao = function (erro)
        {
            if (erro.data.detail)
            {
                sendFeedback(erro.data.detail, 'alert');
            }
            else if (erro.data.message)
            {
                sendFeedback(erro.data.message, "alert");
            }
            else
            {
                sendFeedback("Erro inesperado. Servidor indisponível ou erro na requisição.", "alert");
            }
            return $q.reject(erro);
        };

        self.sendFeedbackErro = function (response)
        {
            devConsoleLog("errorHandler.sendFeedbackErro");
            sendFeedbackMensagemErro(self.tratarMensagemErro(response));
        };

        self.tratarMensagemErro = function (data)
        {
            devConsoleLog("errorHandler.tratarMensagemErro");
            devConsoleLog(data);

            if (data.status && parseInt(data.status) >= 500 && data.statusText)
            {
                devConsoleLog("data.status && parseInt(data.status) >= 500 && data.statusText");
                return data.statusText;
            }

            var msg = "Erro inesperado. Servidor indisponível ou erro na requisição.";

            if ((typeof data) === "string")
            {
                return data;
            }

            if (data.message)
            {
                msg = data.message;
                return msg;
            }

            if (data.data)
            {
                var retorno = data.data;

                if (retorno.status !== undefined && retorno.status.erro !== undefined)
                {
                    var status = retorno.status;
                    devConsoleLog(status);

                    if (status.erro == true && status.mensagem !== undefined)
                    {
                        devConsoleLog(status.mensagem);
                        msg = status.mensagem;
                        return msg;
                    }
                }

                if (data.data.detail)
                {
                    msg = data.data.detail;
                }
                else if (data.data.message && data.data.message.detail)
                {
                    msg = data.data.message.detail;
                }
                else if (data.data.message && (typeof data.data.message) === 'string')
                {
                    msg = data.data.message;
                }
                else
                {
                    msg = 'Erro inesperado, Código F01';
                }
            }

            return msg;
        };
    }
})();