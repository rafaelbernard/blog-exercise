(function ()
{
    angular
        .module('app')
        .filter('cnpjFormatado', function ()
        {
            return function (cnpj)
            {
                if (!cnpj)
                { return ''; }

                var value = cnpj.toString().trim().replace(/^\+/, '');

                value = value.replace(/[^0-9]+/g, "");
                if (value.length > 0 && value.length <= 2)
                {
                    value = value;
                }
                else if (value.length > 2 && value.length <= 5)
                {
                    value = value.substring(0, 2) + "." + value.substring(2, 5);
                }
                else if (value.length > 5 && value.length <= 8)
                {
                    value = value.substring(0, 2) + "." + value.substring(2, 5) + "." + value.substring(5, 8);
                }
                else if (value.length > 8 && value.length <= 12)
                {
                    value = value.substring(0, 2) + "." + value.substring(2, 5) + "." + value.substring(5, 8) + "/" + value.substring(8, 12);
                }
                else if (value.length > 12 && value.length <= 15)
                {
                    value = value.substring(0, 2) + "." + value.substring(2, 5) + "." + value.substring(5, 8) + "/" + value.substring(8, 12) + "-" + value.substring(12, 14);
                }
                return value;
            };
        });

    angular.module('app').filter('nl2br', function ($sce)
    {
        return function (msg, is_xhtml)
        {
            is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            return $sce.trustAsHtml(msg);
        };
    });

    angular.module('app').filter('timestampToDateObject', function timestampToDateObject()
    {
        return function (text)
        {
            if (!text || !isValidDate(new Date(text.replace(' ', 'T'))))
            {
                return '';
            }
            return new Date(text.replace(' ', 'T'));
        };
    });
})();
