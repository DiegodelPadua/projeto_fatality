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

    const numero = request.query.numero

    //  valida se foi enviado
    if (!numero) {
        return response.status(400).json({
            status: false,
            message: "O número é obrigatório."
        })
    }

    // valida se é número (somente dígitos)
    if (!/^\d+$/.test(numero)) {
        return response.status(400).json({
            status: false,
            message: "O número deve conter apenas dígitos."
        })
    }

    //  chama a função
    const resultado = funcaoContatos.listarDadosProfile(numero)

    // valida se encontrou o usuário
    if (resultado === null) {
        return response.status(404).json({
            status: false,
            message: "Usuário não encontrado."
        })
    }

    // retorna sucesso
    return response.status(200).json({
        status: true,
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

app.get('/v1/senai/usuarios/conversa', function (request, response) {

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

    // usando a função pelo objeto
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



app.get('/v1/senai/usuarios/pesquisa', function (request, response) {

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

app.get('/v1/senai/help', function(request, response){

    let docAPI = {

        "API-description": "API para manipular dados do Whatsapp", 
        "date": "2026-04-02",
        "Development": "Diego de Pádua", "email": "diego.lemos@docente.senai.br",
        "Version": "1.0",
        "Endpoints":[
            {
                "id": 1,
                "Rota 1": "/v1/senai/usuarios",
                "obs": "Retorna a lista de todos os estados"
            },
            {
                "id": 2,
                "Rota 2": "/v1/senai/usuarios/profile?numero=",
                "obs": "Retorna os dados do estado filtrando pela sigla do estado"
            },
            {
                "id": 3,
                "Rota 3": "/v1/senai/usuarios/contatos?numero=",
                "obs": "Retorna os dados da capital filtrando pela sigla do estado"
            },
            {
                "id": 4,
                "Rota 4": "/v1/senai/usuarios/mensagens?numero=",
                "obs": "Retorna todos os estados que formaram capital do Brasil"
            },
            {
                "id": 5,
                "Rota 5": "/v1/senai/usuarios/conversa?numero=(11987876567)&contato=Ana Maria",
                "obs": "Retorna todos os estados que se referem a uma região"
            },
            {
                "id": 6,
                "Rota 6": "/v1/senai/usuarios/pesquisa?numero=(11987876567)&contato=Ana Maria&palavra= beach ",
                "obs": "Retorna todas as cidades filtrando pela sigla do estado"
            }
        ]

    }

    response.status(200)
    response.json(docAPI)

})

app.listen(8080, function () {
    console.log('API rodando...')
})

// ==========================================
// TRATAMENTO DE ROTAS INVÁLIDAS
// ==========================================
app.use((request, response) => {
    return response.status(404).json({
        status: false,
        message: "Endpoint não encontrado. Verifique a URL ou utilize query (?numero=...)."
    })
})