/***************************************************************************************************
 * Objetivo: Arquivo responsável pela criação da API Integrada com projeto  Front-End 
 * Data: 08/04/2026
 * Autor: Diego de Pádua
 * Versão: 1.0
 * 
 * Instalação do EXPRESS - npm install express --save
 *     Dependencia resposável pela utilização do protocolo HTTP para criar uma API
 * 
 * 
 * instalação do CORS    - npm install cors --save
 *     Dependência responsável pelas configurações a serem realizadas para a permissão de acesso da API
 ****************************************************************************************************/


//Import das dependências para criar a API
const express = require('express')
const cors = require('cors')

//Criando um objeto para manipular o express
const app = express()

const PORT = process.env.PORT || 8080

app.get('/', function(req, res){
    res.send('API funcionando!')
})

app.listen(PORT, function(){
    console.log(`Servidor rodando na porta ${PORT}`)
})

//Conjunto de permissões a serem aplicadas do CORS da API
const corsOptions = {
    origin:['*'], //A origem da requisição 'IP´s" ou *(todos)
    methods: 'GET',//São os verbos que serão liberados na API (GET, POST, PUT e DELETE) "protocolo HTTPS"
    allowedHeaders: ['Content-type', 'Autorization'], // São permissões de cabeçalho do CORS 
}

//Configura as permissões da API através do CORS
app.use(cors(corsOptions))

//Response -> Retornos da API
//Request  -> São chegadas de dados na API

const funcaoContatos = require('./modulo/funcao.js')


app.get('/v1/senai/usuarios', function (request, response) {

    // Chama a função que está no funcao.js
    const resultado = funcaoContatos.listarTodosUsuarios()

    // Retorna os dados em formato JSON
    return response.status(200).json({
        status: true,
        quantidade: resultado.length, // quantidade de usuários
        dados: resultado
    })
})


app.get('/v1/senai/usuarios/profile', function (request, response) {

    // Chama a função do funcao.js
    const resultado = funcaoContatos.listarDadosProfile()

    // Retorna os dados em JSON
    return response.status(200).json({
        status: true,
        quantidade: resultado.length, // quantidade de usuários
        dados: resultado
    })
})

app.get('/v1/senai/usuarios/contatos', function (request, response) {

    // Pega o número pela query
    const numero = request.query.numero

    // Valida se o número foi enviado
    if (!numero) {
        return response.status(400).json({
            status: false,
            message: "O número do usuário é obrigatório."
        })
    }

    // Chama a função do funcao.js
    const resultado = funcaoContatos.listarContatosDosUsuarios(numero)

    // Se não encontrar o usuário
    if (resultado === null) {
        return response.status(404).json({
            status: false,
            message: "Usuário não encontrado."
        })
    }

    // Retorna os dados
    return response.status(200).json({
        status: true,
        dados: resultado
    })
})

app.get('/v1/senai/usuarios/mensagens', function (request, response) {

    // Pega o número pela query
    const numero = request.query.numero

    // Valida se o número foi enviado
    if (!numero) {
        return response.status(400).json({
            status: false,
            message: "O número do usuário é obrigatório."
        })
    }

    // Chama a função do funcao.js
    const resultado = funcaoContatos.listarMensagensDoUsuario(numero)

    // Se não encontrar o usuário
    if (resultado === null) {
        return response.status(404).json({
            status: false,
            message: "Usuário não encontrado."
        })
    }

    // Retorna os dados
    return response.status(200).json({
        status: true,
        dados: resultado
    })
})

app.get('/v1/senai/usuario/conversa', function (request, response) {

    const numero = request.query.numero
    const contato = request.query.contato

    if (!numero) {
        return response.status(400).json({
            status: false,
            message: "O número é obrigatório."
        })
    }

    if (!contato) {
        return response.status(400).json({
            status: false,
            message: "O contato é obrigatório."
        })
    }

    // 👇 usando a função pelo objeto
    const resultado = funcaoContatos.listarConversaUsuarioContato(numero, contato)

    if (resultado === null) {
        return response.status(404).json({
            status: false,
            message: "Usuário não encontrado."
        })
    }

    if (resultado.erro) {
        return response.status(404).json({
            status: false,
            message: resultado.erro
        })
    }

    return response.status(200).json({
        status: true,
        dados: resultado
    })
})



app.get('/v1/senai/usuario/pesquisa', function (request, response) {

    const numero = request.query.numero
    const contato = request.query.contato
    const palavra = request.query.palavra

    // Validações
    if (!numero || !contato || !palavra) {
        return response.status(400).json({
            status: false,
            message: "Número, contato e palavra são obrigatórios."
        })
    }

    // Chama a função
    const resultado = funcaoContatos.pesquisarMensagem(numero, contato, palavra)

    if (resultado === null) {
        return response.status(404).json({
            status: false,
            message: "Usuário não encontrado."
        })
    }

    if (resultado.erro) {
        return response.status(404).json({
            status: false,
            message: resultado.erro
        })
    }

    return response.status(200).json({
        status: true,
        dados: resultado
    })
})

app.listen(8080, function () {
    console.log('API rodando...')
})