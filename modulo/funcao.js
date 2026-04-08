/**********************************************************************************
 * Objetivo: Manipular Array e JSON
 * Data: 18/03/2026
 * Autor: Diego de Pádua
 * Versão: 1.0
 **********************************************************************************/


const { contatos } = require('./contatos.js');

// Função para listar todos os usuários
function listarTodosUsuarios() {

    const usuarios = contatos["whats-users"];

    // MOSTRA NO CONSOLE
    //console.log(usuarios);

    return usuarios;
}


// Função 2: lista somente os dados do profile
function listarDadosProfile() {

    // Guarda todos os usuários dentro da variável usuarios
    const usuarios = contatos["whats-users"]

    // O map percorre todos os usuários do array
    // e cria um NOVO array somente com os dados
    const profiles = usuarios.map(usuario => ({

        // id do usuário
        id: usuario.id,

        // nome da conta
        nome: usuario.account,

        // apelido da conta
        nick: usuario.nickname,

        // imagem de perfil
        foto: usuario["profile-image"],

        // número do usuário
        numero: usuario.number,

        // cor de fundo do profile
        corDeFundo: usuario.background,

        // data de criação da conta
        criacao: usuario["created-since"].start,

        // data de encerramento da conta
        encerramento: usuario["created-since"].end
    }))

    // Mostra no console o resultado completo e organizado
    //console.log(JSON.stringify(profiles, null, 2))

    // Retorna o novo array com os dados do profile
    return profiles
}


// Função para listar os contatos de um usuário pelo número
function listarContatosDosUsuarios(numero) {

    // Pega todos os usuários
    const usuarios = contatos["whats-users"]

    // Procura o usuário que tenha o número recebido por parâmetro
    const usuarioFiltrado = usuarios.find(usuario => usuario.number === numero)

    // Se não encontrar o usuário, mostra mensagem e retorna null
    if (!usuarioFiltrado) {
        //console.log("Usuário não encontrado.")
        return null
    }

    // Monta um novo objeto somente com os dados do usuário encontrado
    const resultado = {
        id: usuarioFiltrado.id,
        nomeUsuario: usuarioFiltrado.account,
        numero: usuarioFiltrado.number,

        // Percorre os contatos desse usuário
        contatos: usuarioFiltrado.contacts.map(contato => ({

            // Nome do contato
            nome: contato.name,

            // Foto do contato
            foto: contato.image,

            // Descrição do contato
            descricao: contato.description
        }))
    }

    // Mostra no console o resultado formatado
    console.log(JSON.stringify(resultado, null, 2))

    // Retorna o resultado
    return resultado
}


// Função para listar todas as mensagens de um usuário
function listarMensagensDoUsuario(numero) {

    // 1. Pega todos os usuários
    const usuarios = contatos["whats-users"]

    // 2. Procura o usuário pelo número (filtro principal)
    const usuarioFiltrado = usuarios.find(usuario => usuario.number === numero)

    // 3. Verifica se encontrou o usuário
    if (!usuarioFiltrado) {
        console.log("Usuário não encontrado.")
        return null
    }

    // 4. Percorre todos os contatos do usuário
    const mensagens = usuarioFiltrado.contacts.map(contato => ({

        // Nome do contato
        nomeContato: contato.name,

        // Lista de mensagens trocadas com esse contato
        mensagens: contato.messages.map(mensagem => ({

            // Quem enviou a mensagem (me ou contato)
            remetente: mensagem.sender,

            // Conteúdo da mensagem
            conteudo: mensagem.content,

            // Horário da mensagem
            horario: mensagem.time
        }))
    }))

    // 5. Monta o resultado final
    const resultado = {
        id: usuarioFiltrado.id,
        nomeUsuario: usuarioFiltrado.account,
        numero: usuarioFiltrado.number,
        conversas: mensagens
    }

    // 6. Mostra no console formatado
    //console.log(JSON.stringify(resultado, null, 2))

    // 7. Retorna o resultado
    return resultado
}



// ======================================================
// Listar uma conversa de um usuário com um contato
// A busca será feita pelos valores recebidos da query,
// mas quem pega a query é o app.js.
// Esta função só recebe os valores já prontos.
// ======================================================
function listarConversaUsuarioContato(numero, nomeContato) {

    const usuarios = contatos["whats-users"]

    const usuarioFiltrado = usuarios.find(usuario => usuario.number === numero)

    if (!usuarioFiltrado) {
        return null
    }

    const contatoFiltrado = usuarioFiltrado.contacts.find(contato =>
        contato.name.toLowerCase() === nomeContato.toLowerCase()
    )

    if (!contatoFiltrado) {
        return {
            erro: "Contato não encontrado para esse usuário."
        }
    }

    const resultado = {
        nomeUsuario: usuarioFiltrado.account,
        numeroUsuario: usuarioFiltrado.number,
        nomeContato: contatoFiltrado.name,
        conversas: contatoFiltrado.messages
    }

    return resultado
}


function pesquisarMensagem(numero, nomeContato, palavra) {

    // Pega todos os usuários
    const usuarios = contatos["whats-users"]

    // Procura o usuário pelo número
    const usuarioFiltrado = usuarios.find(usuario => usuario.number === numero)

    // Se não encontrar usuário
    if (!usuarioFiltrado) {
        return null
    }

    // Procura o contato dentro do usuário
    const contatoFiltrado = usuarioFiltrado.contacts.find(contato =>
        contato.name.toLowerCase() === nomeContato.toLowerCase()
    )

    // Se não encontrar contato
    if (!contatoFiltrado) {
        return { erro: "Contato não encontrado." }
    }

    // Filtra as mensagens pela palavra-chave
    const mensagensFiltradas = contatoFiltrado.messages.filter(mensagem =>
        mensagem.content.toLowerCase().includes(palavra.toLowerCase())
    )

    // Monta o resultado
    const resultado = {
        usuario: usuarioFiltrado.account,
        numero: usuarioFiltrado.number,
        contato: contatoFiltrado.name,
        palavraBuscada: palavra,
        mensagens: mensagensFiltradas
    }

    return resultado
}


// chama a função só pra testar
pesquisarMensagem();
listarConversaUsuarioContato();
listarMensagensDoUsuario();
listarContatosDosUsuarios();
listarTodosUsuarios();
listarDadosProfile();

// Exporta as duas funções
module.exports = {
    listarTodosUsuarios,
    listarDadosProfile,
    listarContatosDosUsuarios,
    listarMensagensDoUsuario,
    listarConversaUsuarioContato,
    pesquisarMensagem
}