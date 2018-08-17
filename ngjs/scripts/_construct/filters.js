(function ()
{
    angular
        .module('app')
        .filter('nl2br', function ($sce)
        {
            return function (msg, is_xhtml)
            {
                is_xhtml     = is_xhtml || true;
                var breakTag = (is_xhtml) ? '<br />' : '<br>';
                msg          = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
                return $sce.trustAsHtml(msg);
            };
        });

    angular
        .module('app')
        .filter('timestampToDateObject', function timestampToDateObject()
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
