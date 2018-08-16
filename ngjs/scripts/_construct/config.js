(function (window)
{
    //"use strict";

    /* jshint ignore:start */
    /* jshint ignore:end */

    /**
     * Dados do barramento para identificacao de origem
     * Para o Salesforce, sao Locais de Cadastro
     * Canal = Tipo Cadastro
     * Parceiro = Código
     *
     */
        //var WS_BARRAMENTO_ID_PARCEIRO_SITE = "1";
        //var WS_BARRAMENTO_ID_PARCEIRO_SITE_MOBILE = "2";
        //var WS_BARRAMENTO_ID_CANAL_SITE = "Site";
        //var WS_BARRAMENTO_ID_CANAL_SITE_MOBILE = "Site";

    var WS_BARRAMENTO_ID_PARCEIRO_SITE = "18";
    var WS_BARRAMENTO_ID_CANAL_SITE    = "Site";

    // Configuracao de Producao
    var configProducao = {
        _ENV: "prod",
        HOST_API: "https://api.cuidadospelavida.com.br",
        HOST_CMS: "https://content.cuidadospelavida.com.br/",
        HOST_PORTAL: 'https://colaborador.cuidadospelavida.com.br',
        SALESFORCE: {
            ORGID: '00D5B000000D8za',
            URL_WEBTOCASE: 'https://www.salesforce.com',
        },
        X_TOKEN_API: '262e4801adb5dfe5611a4a83c68365a591f14c48',
        DEBUG_MODE: 'debug',
        WS_BARRAMENTO: {
            BASIC_AUTHORIZATION: 'Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2',
            CLIENT_ID: '9qiG2T5pX2r9zZGteHBg8PBIxbSt0IPr',
            CLIENT_SECRET: '1kEzIMgbEOi47U30',
            HOST: 'https://api.ache.com.br',
            // plataforma de acesso centralizado
            APP_PCS: {
                APIKEY: "e864d567-8d87-7871-11a2-991c40241f58",
            },
            ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
            ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE,
        },
        WS_ACCREDITED_LEAD: {
            CLIENT_ID: 'rq4AmUzRlr8RN0MFw7teYlxTmGNrJnoJ',
            CLIENT_SECRET: "7E7C2KDhzehAeOGD"
        }
        // Configuracoes do barramento para aplicacoes de cadastro de paciente
        // WS_BARRAMENTO_PACIENTE: {
        //     basicAuthorization: "Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2",
        //     CLIENT_ID: "rq4AmUzRlr8RN0MFw7teYlxTmGNrJnoJ",
        //     CLIENT_SECRET: "7E7C2KDhzehAeOGD",
        //     HOST: "https://api.ache.com.br",
        //     ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
        //     ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE
        // }
        }
    ;

    var configHom = {
        _ENV: "hom",
        HOST_API: "https://api.hom.cuidadospelavida.com.br",
        HOST_CMS: 'https://content.hom.cuidadospelavida.com.br/',
        HOST_PORTAL: 'https://colaborador.hom.cuidadospelavida.com.br',
        SALESFORCE: {
            ORGID: '00D36000000uZzf',
            URL_WEBTOCASE: 'https://cs52.salesforce.com',
        },
        X_TOKEN_API: '262e4801adb5dfe5611a4a83c68365a591f14c48',
        DEBUG_MODE: 'debug',
        WS_BARRAMENTO: {
            BASIC_AUTHORIZATION: 'Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2',
            CLIENT_ID: 'XKqQ5cHpIVvwdfDZ1Y7HMbY71jNlUfxI',
            CLIENT_SECRET: "FA91ANx2199R22gH",
            HOST: "https://apiachehmg.apimanagement.us2.hana.ondemand.com",
            APP_PCS: {
                APIKEY: "e864d567-8d87-7871-11a2-991c40241f58",
            },
            ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
            ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE,
        },
        WS_ACCREDITED_LEAD: {
            CLIENT_ID: 'j21vKgAAZU88AhB9YnEnVkT1yAGR6J3m',
            CLIENT_SECRET: "mW2pM3IfAYH28UOv"
        }
        // Configuracoes do barramento para aplicacoes de cadastro de paciente
        // WS_BARRAMENTO_PACIENTE: {
        //     basicAuthorization: 'Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2',
        //     CLIENT_ID: 'lsSAOMJdQY4vyCEsMGF5hXbGGs4wCSym',
        //     CLIENT_SECRET: 'XpSqWwqg9Tm8XK5G',
        //     HOST: 'https://apiachehmg.apimanagement.us2.hana.ondemand.com',
        //     ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
        //     ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE,
        // }
    };

    var configDev = {
        _ENV: 'dev',
        HOST_API: 'https://api.dev.cuidadospelavida.com.br',
        HOST_CMS: 'https://content.dev.cuidadospelavida.com.br/',
        HOST_PORTAL: 'https://colaborador.dev.cuidadospelavida.com.br',
        SALESFORCE: {
            ORGID: '00D36000000uZzf',
            URL_WEBTOCASE: 'https://cs52.salesforce.com',
        },
        X_TOKEN_API: '262e4801adb5dfe5611a4a83c68365a591f14c48',
        DEBUG_MODE: 'debug',
        WS_BARRAMENTO: {
            BASIC_AUTHORIZATION: 'Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2',
            CLIENT_ID: 'XKqQ5cHpIVvwdfDZ1Y7HMbY71jNlUfxI',
            CLIENT_SECRET: 'FA91ANx2199R22gH',
            HOST: 'https://apiachehmg.apimanagement.us2.hana.ondemand.com',
            APP_PCS: {
                APIKEY: "e864d567-8d87-7871-11a2-991c40241f58",
            },
            ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
            ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE,
        },
        WS_ACCREDITED_LEAD: {
            CLIENT_ID: 'j21vKgAAZU88AhB9YnEnVkT1yAGR6J3m',
            CLIENT_SECRET: "mW2pM3IfAYH28UOv"
        }
        // Configuracoes do barramento para aplicacoes de cadastro de paciente
        // WS_BARRAMENTO_PACIENTE: {
        //     basicAuthorization: 'Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2',
        //     CLIENT_ID: 'lsSAOMJdQY4vyCEsMGF5hXbGGs4wCSym',
        //     CLIENT_SECRET: 'XpSqWwqg9Tm8XK5G',
        //     HOST: 'https://apiachehmg.apimanagement.us2.hana.ondemand.com',
        //     ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
        //     ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE,
        // }
    };

    var configDevLocal = {
        _ENV: "local",
        HOST_API: "https://api.hom.cuidadospelavida.com.br",
        //HOST_API: "http://localhost:3000",
        HOST_CMS: "https://content.hom.cuidadospelavida.com.br/",
        HOST_PORTAL: "http://localhost:8000",
        SALESFORCE: {
            ORGID: "00D36000000uZzf",
            URL_WEBTOCASE: "https://cs52.salesforce.com",
        },
        X_TOKEN_API: "262e4801adb5dfe5611a4a83c68365a591f14c48",
        DEBUG_MODE: "debug",
        WS_BARRAMENTO: {
            BASIC_AUTHORIZATION: "Basic YjViZDMzZjI1ZTM4NDI1ZTk0MzI3OGIwMWFmZDE5YzY6MTIzNDU2",
            CLIENT_ID: "XKqQ5cHpIVvwdfDZ1Y7HMbY71jNlUfxI",
            CLIENT_SECRET: "FA91ANx2199R22gH",
            HOST: "https://apiachehmg.apimanagement.us2.hana.ondemand.com",
            APP_PCS: {
                APIKEY: "e864d567-8d87-7871-11a2-991c40241f58",
            },
            ID_CANAL: WS_BARRAMENTO_ID_CANAL_SITE,
            ID_PARCEIRO: WS_BARRAMENTO_ID_PARCEIRO_SITE,
        },
        WS_ACCREDITED_LEAD: {
            CLIENT_ID: 'j21vKgAAZU88AhB9YnEnVkT1yAGR6J3m',
            CLIENT_SECRET: "mW2pM3IfAYH28UOv"
        }
    };

    var configUso = configProducao;

    var urlAcesso = window.location.href;

    if (urlAcesso.lastIndexOf("localhost") !== -1 || urlAcesso.lastIndexOf("local.dev") !== -1)
    { configUso = configDevLocal; }
    else if (urlAcesso.lastIndexOf("dev") !== -1)
    { configUso = configDev; }
    else if (urlAcesso.lastIndexOf("hom") !== -1)
    { configUso = configHom; }

    // DEBUG MODE
    // off - nao exibe nenhum log (ideal para producao)
    // info - exibe somente textos informativos
    // debug - loga tudo inclusive os dados recebidos

    var IS_MOBILE = false;

    // IS_MOBILE eh recuperado no arquivo de app
    if (IS_MOBILE !== undefined)
    {
        configUso.IS_MOBILE = IS_MOBILE;

        if (IS_MOBILE)
        {
            // configUso.WS_BARRAMENTO.ID_PARCEIRO = WS_BARRAMENTO_ID_PARCEIRO_SITE_MOBILE;
            // configUso.WS_BARRAMENTO.ID_CANAL = WS_BARRAMENTO_ID_CANAL_SITE_MOBILE;
        }
    }

    window._CONFIG = configUso;

    window._DEBUG_MODE = configUso.DEBUG_MODE;
    window._IS_MOBILE  = IS_MOBILE;
    window._URL_ACESSO = urlAcesso;

    angular.module("app").constant("_CONFIG", configUso);
})(window);
