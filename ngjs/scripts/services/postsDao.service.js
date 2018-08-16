(function ()
{
    //'use strict';

    angular.module('app')
        .service('postsDaoService', postsDaoService);

    postsDaoService.$inject = ["_CONFIG", '$http'];

    function postsDaoService(_CONFIG, $http)
    {
        var self = this;

        // self.HOST_API = configUso.HOST_API;

        // var HOST_CMS = configUso.HOST_CMS;

        // CARREGA TODOS OS POSTS
        self.carregaTodosPostsService = function (IdUnico)
        {
            var page = IdUnico || 1;
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_posts&type=posts&count=12&page=' + page, config);
        };

        // CARREGA TODOS OS POSTS
        self.carregaTodosPostsService2 = function (IdUnico)
        {
            var page = IdUnico || 1;
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_posts&type=posts&count=380&page=' + page, config);
        };

        // CARREGA POSTS POR CATEGORIA (SLUG)
        self.carregaTodosPostsCategoriaService = function (slugDaCategory, catPageId)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_category_posts&count=12&slug=' + slugDaCategory + '&page=' + catPageId, config);
        };

        // CARREGA POSTS PARA MENU (POR CATEGORIA)
        self.carregaPostsMenuService = function (slugCatMenu)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_category_posts&count=4&slug=' + slugCatMenu, config);
        };

        // CARREGA POSTS POR SUB-CATEGORIA (SLUG)
        self.carregaTodosPostsSubcategoriaService = function (slugDaSubCategory, subCatPageId)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_category_posts&count=15&slug=' + slugDaSubCategory + '&page=' + subCatPageId, config);
        };

        // CARREGA POSTS RELACIONADOS
        self.carregaPostsRelacionadosService = function (slugDaSubCategory)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_category_posts&slug=' + slugDaSubCategory + '&remove=135', config);
        };

        // CARREGA TODAS AS CATEGORIAS ATIVAS
        self.carregaTodasCategoriasService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_category_index&count=-1', config);
        };

        // CARREGA TODAS AS CATEGORIAS FILHAS DA CATEGORIA PRINCIPAL
        self.carregaTodasCategoriasFilhasService = function (parentSlug)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_category_index&parent=' + parentSlug, config);
        };

        // CARREGA UM POST/MATERIA
        self.carregaUmPostService = function (slugDoPost)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_slug=' + slugDoPost, config);
        };

        // CARREGA CATEGORIA PRINCIPAL DE UM POST
        self.carregaCategoriaDoPostService = function (idCategoriaPai)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '/wp-json/wp/v2/categories/' + idCategoriaPai, config);
        };


        // CARREGA TODAS AS TAGS ATIVAS
        self.carregaTodasTagsService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_tag_index&count=-1', config);
        };

        // CARREGA TAGS ATIVAS PARA NUVEM (WIDGET)
        self.carregaTagsNuvemService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_tag_index&count=-1', config);
        };

        // CARREGA POSTS POR TAG (SLUG)
        self.carregaTodosPostsTagService = function (catSlug, tagPageId)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_tag_posts&count=12&tag_slug=' + catSlug + '&page=' + tagPageId, config);
        };

        // BUSCA POR POSTS
        self.carregaBuscaPostsService = function (termoDaBusca, catBuscaId)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_search_results&post_type=post&count=12&search=' + termoDaBusca + '&page=' + catBuscaId, config);
        };

        // CARREGA TODOS OS PRODUTOS/MEDICAMENTOS POR CATEGORIA
        self.carregaTodosProdutosCategoriaService = function (prodSlugCat)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + 'grupo/' + prodSlugCat + '?json=get_posts&post_type=produto&count=100&orderby=title&order=ASC', config);
        };

        // CARREGA TODOS OS PRODUTOS/MEDICAMENTOS
        self.carregaTodosProdutosService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_posts&post_type=produto&count=100&orderby=title&order=ASC', config);
        };

        // BUSCA POR PRODUTOS/MEDICAMENTOS
        self.carregaBuscaProdutosService = function (termoDaBuscaProduto)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_search_results&post_type=produto&count=120&search=' + termoDaBuscaProduto, config);
        };


        // BUSCA POR PRODUTOS/MEDICAMENTOS
        self.carregaBuscaProdutosMinService = function (termoDaBusca, catBuscaId)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_search_results&post_type=produto&count=6&search=' + termoDaBusca + '&page=' + catBuscaId, config);
        };

        // CARREGA UM PRODUTO/MEDICAMENTO
        self.carregaProdutosService = function (slugProduto)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_type=produto&post_slug=' + slugProduto, config);
        };

        /**
         * CARREGAR TAXONOMIA GRUPO
         */
        self.carregarListaTaxonomiaGrupo = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '/api/v1.0/cms/taxonomia/grupo', config);
        };

        // CARREGA REVISTA EM DESTAQUE
        self.carregaRevistaDestaqueService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + "categoria_revista/destaque?json=get_posts&post_type=revista&count=1&orderby=title&order=ASC", config);
        };

        // CARREGA TODAS AS REVISTAS
        self.carregaTodasRevistasService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + "categoria_revista/edicoes-anteriores?json=get_posts&post_type=revista&orderby=date&order=DESC", config);
        };

        // CARREGA UMA REVISTA
        self.carregaRevistaAtualService = function (edicaoAtual)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_type=revista&post_slug=' + edicaoAtual, config);
        };

        // CARREGA TODOS OS ESPECIAIS V2
        self.carregaTodosEspeciaisService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_posts&post_type=especiais&orderby=date&order=DESC&count=20', config);
        };

        // CARREGA UM ESPECIAL V2
        self.carregaEspecialService = function (currentEspecial)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_type=especiais&post_slug=' + currentEspecial, config);
        };

        // CARREGA OUTROS ESPECIAIS ITEM
        self.carregaOutrosEspeciaisItem = function (currentEspecial)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_type=especiais&post_id=' + currentEspecial, config);
        };

        // CARREGA UMA MATÉRIA POR ID (PARA ESPECIAL)
        self.carregaMateriaEspecialService = function (idDoPost)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_id=' + idDoPost, config);
        };

        // CARREGA UM MIP RELACIONADO
        self.carregaMipRelacionadoService = function (idMip)
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_post&post_type=mips&post_id=' + idMip, config);
        };

        // CARREGA UMA MENSAGEM (CPV EM CAMPO)
        self.carregaMensagensService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_posts&post_type=mensagens_emcampo&orderby=date&order=DESC&count=20', config);
        };

        // CARREGA ITENS DO FAQ (APENAS CPV EM CAMPO)
        self.carregaFaqService = function ()
        {
            var config = {cache: true};
            return $http.get(_CONFIG.HOST_CMS + '?json=get_posts&post_type=faq&taxonomy_grupo=cpv-em-campo&orderby=date&order=DESC&count=100', config);
        };

    }

})();