(function ()
{

    angular.module("app")
        .controller("ProdutoDetalheController", ProdutoDetalheController);

    ProdutoDetalheController.$inject = [
        "$location",
        "$rootScope",
        "$routeParams",
        "postsDaoService"
    ];

    function ProdutoDetalheController($location, $rootScope, $routeParams, postsDaoService)
    {
        $rootScope.verifyAuthentication();

        var self = this;


        $rootScope.verificaPaginaSelecionada = "produtos";
        self.currentProdSlug = $routeParams.prodSlug;


        // INFORMAÇÕES DO PRDUTO - PÁGINA DO PRODUTO
        self.carregarDadosProduto = function (currentProdSlug)
        {
            // devConsoleLog("carregarDadosProduto");

            return postsDaoService.carregaProdutosService(currentProdSlug)
                .then(
                    function (response)
                    {

                        console.log("PRODUTO");
                        self.produtoSingle = response.data.post;

                        self.prodTitle = response.data.post.title;
                        self.customFields = response.data.post.custom_fields;
                        self.imagens = response.data.post.thumbnail_images;
                        self.pdfFile = response.data.post.custom_fields.url_da_bula[0];
                        self.prodSlug = response.data.post.slug;
                        self.prodPdfLink = response.data.post.attachments;


                        //devConsoleLog("QTD" + response.data.post.attachments.length);
                        for (var i = 0; i < response.data.post.attachments.length; i++)
                        {

                            var urlModelo = response.data.post.attachments[i].url;

                            if (urlModelo.indexOf('pdf') != -1)
                            {
                                self.prodPdfLink = response.data.post.attachments[i].url;
                            }

                        }

                        if (response.data.post.custom_fields.url_netfarma !== undefined && response.data.post.custom_fields.url_netfarma[0] !== undefined)
                        {
                            self.urlnetfarma = response.data.post.custom_fields.url_netfarma[0];
                        }

                        self.tipourl = "";

                        if (response.data.post.custom_fields.selecione_tipo_url)
                        {
                            self.tipourl = response.data.post.custom_fields.selecione_tipo_url[0];
                        }

                        self.urlteleorientacao = "";
                        self.telteleorientacao = "";

                        if (response.data.post.custom_fields.url_teleorientacao)
                        {
                            self.urlteleorientacao = response.data.post.custom_fields.url_teleorientacao[0];
                            self.telteleorientacao = response.data.post.custom_fields.tel_teleorientacao[0];
                        }

                        self.prodNumeroAnvisa = response.data.post.custom_fields.numero_anvisa;
                        self.prodTipo = response.data.post.taxonomy_grupo[0];
                        self.prodMetaDescription = response.data.post.custom_fields.meta_description[0];

                        self.prodIndicacao = response.data.post.custom_fields.indicacao_e_aplicacao;
                        self.prodContraIndicacao = response.data.post.custom_fields.contraindicacao;
                        self.prodComposicao = response.data.post.custom_fields.composicao;
                        self.prodPosologia = response.data.post.custom_fields.posologia;
                        self.prodInformacoes = response.data.post.custom_fields.informacoes;
                        self.prodBulaCompleta = response.data.post.custom_fields.bula_completa;
                        self.prodModoDeUsar = response.data.post.custom_fields.modo_de_usar;
                        self.campoTeste = response.data.post.custom_fields.campoteste;
                        self.prodKeywords = response.data.post.keywords;
                        self.nuvemTags = response.data.post.tags;

                        var nuvemTagsLength = self.nuvemTags.length;
                        self.slugsTagsProdutos = [];

                        for (i = 0; i < nuvemTagsLength; i++)
                        {
                            self.slugsTagsProdutos[i] = self.nuvemTags[i].slug;

                            self.counterNuvem = self.nuvemTags[i].post_count;
                            if (self.counterNuvem < 2)
                            {
                                self.nuvemTags[i].countClass = "class1";
                                //devConsoleLog(self.todasTags[i].countClass);
                            }
                            else if (self.counterNuvem > 1 && self.counterNuvem < 4)
                            {
                                self.nuvemTags[i].countClass = "class2";
                            }
                            else if (self.counterNuvem > 3)
                            {
                                self.nuvemTags[i].countClass = "class3";
                            }
                            else
                            {
                                self.nuvemTags[i].countClass = "class0";
                            }

                        }


                    })
                .catch(
                    function (response)
                    {
                        devConsoleLog(response);
                        devConsoleLog(response.data);
                        if (response.status === 404)
                        {
                            sendFeedback("Produto não encontrado.", "alert");
                            $location.path("/produtos-participantes");
                            return;
                        }

                        sendFeedbackMensagemErro(response);
                    }
                );
        };
        self.carregarDadosProduto(self.currentProdSlug);

        self.abreConteudoAba1 = function ()
        {
            self.conteudoAba1 = true;
            self.conteudoAba2 = false;
            self.conteudoAba3 = false;
            self.conteudoAba4 = false;
            self.conteudoAba5 = false;
        };
        self.abreConteudoAba2 = function ()
        {
            self.conteudoAba1 = false;
            self.conteudoAba2 = true;
            self.conteudoAba3 = false;
            self.conteudoAba4 = false;
            self.conteudoAba5 = false;
        };
        self.abreConteudoAba3 = function ()
        {
            self.conteudoAba1 = false;
            self.conteudoAba2 = false;
            self.conteudoAba3 = true;
            self.conteudoAba4 = false;
            self.conteudoAba5 = false;
        };
        self.abreConteudoAba4 = function ()
        {
            self.conteudoAba1 = false;
            self.conteudoAba2 = false;
            self.conteudoAba3 = false;
            self.conteudoAba4 = true;
            self.conteudoAba5 = false;
        };
        self.abreConteudoAba5 = function ()
        {
            self.conteudoAba1 = false;
            self.conteudoAba2 = false;
            self.conteudoAba3 = false;
            self.conteudoAba4 = false;
            self.conteudoAba5 = true;
        };


    }

})();
