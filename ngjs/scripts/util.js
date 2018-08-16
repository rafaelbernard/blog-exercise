var IS_MOBILE = (function ()
{
    var check = false;
    (function (a)
    {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        {
            check = true
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
})();

// Inicializando o contador de mensagens
var loadingMessageCount = 0;

function sendFeedback(message, type)
{
    // debug mode, opcoes:
    // off - nao exibe nenhum log (ideal para producao)
    // info - exibe somente textos informativos
    // debug - loga tudo inclusive os dados recebidos

    // type, opcoes:
    // info - loga textos informativos
    // loading - mostra o texto na barra de loading
    // data - loga os dados recebidos da chamada da API
    // alert - exibe um alerta de erro

    var DEBUG_MODE = window._DEBUG_MODE;

    if (DEBUG_MODE !== "off")
    {
        if (!type)
        {
            type = "alert";
        }

        if (type === 'info')
        {
            devConsoleLog('\n>>>>>>>>>>>>>>>>>>> ' + message);
        }

        // if ((type == 'data' || type == 'alert') && DEBUG_MODE == 'debug')
        // {
        //     devConsoleLog('\n>>>>>>>>>>>>>>>>>>> ' + message);
        // }

        if (type == 'alert')
        {
            alert(message);
        }
    }

    if (type == 'loading')
    {
        if (message != '')
        {
            loadingMessageCount++;
            $('#loading').html(message + '...').show();
        }
        else
        {
            loadingMessageCount--;
            if (loadingMessageCount < 0)
            {
                loadingMessageCount = 0;
            }
            if (loadingMessageCount == 0)
            {
                $('#loading').html('').hide();
            }
        }
    }
}


function isValidDate(date)
{
    if (Object.prototype.toString.call(date) !== "[object Date]")
    {
        return false;
    }
    return !isNaN(date.getTime());
}

function formatDate(date)
{
    var dia;
    var mes;
    var ano;

    if (isValidDate(date))
    {
        return date.toISOString().substr(0, 10) + 'T00:00:00';
    }
    else if (date.length === 8)
    {
        dia = parseInt(date.toString().substr(0, 2));
        mes = parseInt(date.toString().substr(2, 2));
        ano = parseInt(date.toString().substr(4, 4));

        return newDateCPV(ano, mes, dia);
    }
    else if (date.toString().substr(2, 1) == '/' && date.toString().substr(5, 1) == '/')
    {
        dia = parseInt(date.toString().substr(0, 2));
        mes = parseInt(date.toString().substr(3, 2));
        ano = parseInt(date.toString().substr(6, 4));

        var brDate = newDateCPV(ano, mes, dia);

        return brDate.toISOString().substr(0, 10) + 'T00:00:00';
    }
    else
    {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
        {
            month = '0' + month;
        }
        if (day.length < 2)
        {
            day = '0' + day;
        }

        return [year, month, day].join('-') + 'T00:00:00';
    }
}

function formatDateToApi(date)
{
    //devConsoleLog("formatDateToApi");
    //devConsoleLog(date);

    var dia;
    var mes;
    var ano;

    if (isValidDate(date))
    {
        //devConsoleLog("isValidDate(date)");
        return date.toISOString().substr(0, 10);
    }
    else if (date.length === 8)
    {
        //devConsoleLog("date.length === 8");
        dia = parseInt(date.toString().substr(0, 2));
        mes = parseInt(date.toString().substr(2, 2));
        ano = parseInt(date.toString().substr(4, 4));

        //return newDateCPV(ano, mes, dia).substr(0, 10);

        var brDate = newDateCPV(ano, mes, dia);

        return brDate.toISOString().substr(0, 10);
    }
    else if (date.toString().substr(2, 1) === '/' && date.toString().substr(5, 1) === '/')
    {
        //devConsoleLog("date.toString().substr(2, 1) === '/' && date.toString().substr(5, 1) === '/'");
        dia = parseInt(date.toString().substr(0, 2));
        mes = parseInt(date.toString().substr(3, 2));
        ano = parseInt(date.toString().substr(6, 4));

        var brDate = newDateCPV(ano, mes, dia);

        return brDate.toISOString().substr(0, 10);
    }
    else if (date.toString().substr(4, 1) === "-" && date.toString().substr(7, 1) === "-")
    {
        //devConsoleLog('if (date.toString().substr(4, 1) === "-" && date.toString().substr(7, 1) === "-")');
        return date;
    }
    else
    {
        //devConsoleLog("else");

        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
        {
            month = '0' + month;
        }
        if (day.length < 2)
        {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }
}

function exibirMensagemErro(erro)
{
    sendFeedback(tratarMensagemErro(erro), 'alert');
}

function tratarMensagemErro(data)
{
    devConsoleLog("tratarMensagemErro");
    devConsoleLog(data);

    //var msg = 'Erro inesperado, Código F01';
    var msg = 'Erro de comunicação com o serviço. Por favor, tente novamente mais tarde ou entre em contato com a nossa central de atendimento através do telefone 0800 777 8432 (Cód. F01)';

    if ((typeof data) === 'string')
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
        devConsoleLog(retorno);
        if (retorno.status !== undefined && retorno.status.erro !== undefined)
        {
            var status = retorno.status;
            devConsoleLog(status);

            if (status.erro === true && status.mensagem !== undefined)
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
            //msg = 'Erro inesperado, Código F01';
            msg = 'Erro de comunicação com o serviço. Por favor, tente novamente mais tarde ou entre em contato com a nossa central de atendimento através do telefone 0800 777 8432 (Cód. F01)';
        }
    }

    return msg;
}

function formatDateToStrView(date)
{
    var dia = date.toString().substr(8, 2);
    var mes = date.toString().substr(5, 2);
    var ano = date.toString().substr(0, 4);
    return dia + '/' + mes + '/' + ano;
}

function tratarRetornoQuestionarios(dados)
{
    if (!angular.isArray)
    {
        return null;
    }
    var arrayQuestionario = [];
    var arrayCODKey = [];
    var codQuestao;
    var i;
    angular.forEach(dados, function (value, key)
    {
        //devConsoleLog(key);
        //devConsoleLog(value);
        //devConsoleLog(value.COD.substr(3, 2));
        if (value.COD.substr(3, 2) == '00')
        {
            codQuestao = parseInt(value.COD);
            value.questoes = [];
            //arrayQuestionario[codQuestao] = value;
            arrayCODKey[codQuestao] = arrayQuestionario.length;
            arrayQuestionario.push(value);
        }
        else
        {
            codQuestao = parseInt(value.COD.substr(0, 3) + '' + '00');
            i = arrayCODKey[codQuestao];
            //devConsoleLog(codQuestao);
            arrayQuestionario[i].questoes.push(value);
        }
    });
    return arrayQuestionario;
}

String.prototype.capitalize = function ()
{
    return this.toLowerCase().replace(/(?:^|\s)\S/g, function (a)
    {
        return a.toUpperCase();
    });
};

// String.prototype.capitalize = function() {
//     return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
// };

function capitalize(a)
{
    return a.replace(/(?:^|\s)\S/g, function (b)
    {
        return b.toUpperCase();
    });
}

function isValidCPF(value)
{
    value = value.replace('.', '');
    value = value.replace('.', '');
    var cpf = value.replace('-', '');

    while (cpf.length < 11)
    {
        cpf = "0" + cpf
    }

    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;

    for (i = 0; i < 11; i++)
    {
        a[i] = cpf.charAt(i);
        if (i < 9)
        {
            b += (a[i] * --c);
        }
    }
    if ((x = b % 11) < 2)
    {
        a[9] = 0;
    }
    else
    {
        a[9] = 11 - x;
    }
    b = 0;
    c = 11;
    for (y = 0; y < 10; y++) b += (a[y] * c--);
    if ((x = b % 11) < 2)
    {
        a[10] = 0;
    }
    else
    {
        a[10] = 11 - x;
    }

    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg))
    {
        return false;
    }
    return true;
}

function sendFeedbackMensagemErro(erro)
{
    sendFeedback(tratarMensagemErro(erro), 'alert');
}

function tratarMensagemErro(data)
{
    devConsoleLog(data);

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
        devConsoleLog(retorno);
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
}

/**
 * Verifica se existe
 * @param mixed
 */
function isset(mixed)
{
    if (mixed === undefined)
    { return 0; }

    if (mixed === null)
    { return 0; }

    if ((typeof mixed) === 'string' && mixed === '')
    { return 0; }

    if (mixed === 0)
    { return 0; }

    if (mixed === '0')
    { return 0; }

    return 1;
}

/**
 * Nova data com validacao de data
 * @param ano
 * @param mes
 * @param dia
 * @returns Date|null
 */
function newDateCPV(ano, mes, dia)
{
    // na criacao, eh usado um indice do mes
    var indiceMes = mes - 1;

    var data = new Date(ano, indiceMes, dia);

    var dataY = data.getFullYear();
    var dataM = data.getMonth() + 1;
    var dataD = data.getDate();

    if (dataY != ano || dataM != mes || dataD != dia)
    {
        return null;
    }

    return data;
}

function devConsoleLog(mixed)
{
    //devConsoleLog('_devConsoleLog');

    if (window._CONFIG)
    {
        if (window._CONFIG._ENV === "local" || window._CONFIG._ENV === "dev")
        {
            console.log(mixed);

            //devConsoleLog('cfg dev');
        }

        if (window._CONFIG === "prod")
        {
            //devConsoleLog('cfg prod');
        }
    }
}