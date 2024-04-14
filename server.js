const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const server = express();
const alunosFilePath = './alunos.json';

server.use(cors());
server.use(bodyParser.json());

// Função para salvar os dados dos alunos em um arquivo JSON
function salvarAlunos() {
    fs.writeFileSync(alunosFilePath, JSON.stringify(alunos, null, 4), 'utf-8');
}

// Carregar os dados dos alunos do arquivo JSON, se existir
function carregarAlunos() {
    try {
        const data = fs.readFileSync(alunosFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Inicialize a lista de alunos com os dados do arquivo JSON
let alunos = carregarAlunos();

server.listen(5001, () => {
    console.log("Servidor ativo.");
});

// Rota para obter todos os alunos
server.get('/alunos', (req, res) => {
    res.json(alunos);
});

// Rota para obter o aluno com o ID especificado
server.get('/alunos/:id', (req, res) => {
    const id = req.params.id;
    const aluno = alunos.find(aluno => aluno.id === parseInt(id));
    if (aluno) {
        res.json(aluno);
    } else {
        res.status(404).json({ mensagem: "Aluno não encontrado" });
    }
});

// Rota para adicionar um novo aluno
server.post("/alunos", (req, res) => {
    const novoAluno = req.body;
    novoAluno.id = alunos.length + 1;
    alunos.push(novoAluno);
    salvarAlunos(); // Salvar após adicionar um novo aluno
    res.status(201).json({ mensagem: "Aluno criado com sucesso", aluno: novoAluno });
});

// Rota para atualizar dados de um aluno existente
server.put("/alunos/:id", (req, res) => {
    const id = req.params.id;
    const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
    if (index !== -1) {
        const novosDados = req.body;
        alunos[index] = { ...alunos[index], ...novosDados };
        salvarAlunos(); // Salvar após atualizar um aluno
        res.status(200).json({ mensagem: "Aluno atualizado com sucesso", aluno: alunos[index] });
    } else {
        res.status(404).json({ mensagem: "Aluno não encontrado" });
    }
});

// Rota para excluir um aluno
server.delete("/alunos/:id", (req, res) => {
    const id = req.params.id;
    const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
    if (index !== -1) {
        alunos.splice(index, 1);
        salvarAlunos(); // Salvar após excluir um aluno
        res.status(200).json({ mensagem: "Aluno excluído com sucesso" });
    } else {
        res.status(404).json({ mensagem: "Aluno não encontrado" });
    }
});
