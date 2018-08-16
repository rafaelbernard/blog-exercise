README
=======

## Dependências

A instalação de dependências é feita pelos programas na basta **build/**. Este diretório contém 
a instalação das dependências bower, npm e gulp.

Estamos usando o gulp para concatenar e minificar os arquivos JavaScript. Este programa é requerido 
para a implantação da aplicação em produção e também para uso local.

### bower

Instalação de dependências através de 

```sh
cd build
bower install  
```

Conheça mais sobre o bower [https://bower.io]

### npm

Instalação de dependências através de 

```sh
cd build
npm install
```

incluindo as dependências de desenvolvimento:

```sh
npm install -d
```

Conheça mais sobre o npm [https://www.npmjs.com/]

### gulp

Os arquivos gerados pelo gulp estarão dentro do diretório **dist/**. O gulp é instalado pelo 
npm quando se instalam as dependências de desenvolvimento com `npm install -d`.

A execução dos arquivos para utilização na aplicação é executado pelo comando `gulp`.

Em ambiente local, para que os arquivos sejam executados conforme forem alterados, utilize o
comando `gulp watch`.

Conheça mais sobre o gulp [http://gulpjs.com/]

## dev

Se quiser usar um bom navegador para desenvolvimento, use o lite-server.

```sh
npm install lite-server
lite-server
```
