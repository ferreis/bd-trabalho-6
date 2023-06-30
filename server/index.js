const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const Swal = require("sweetalert2");

const host = 'localhost';
const port = 3306;
const user = 'root';
const password = 'rooR@fael1103';
const dbname = 'banco_dados_m3';

const db = mysql.createPool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbname,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Could not connect to the database server:', err);
        process.exit(1);
    }

    console.log('Connected to the database server');
    connection.release();
});

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
    const { nome, renavam, placa, valor, ano, modelo } = req.body;
    let query =
        "SELECT * FROM carro WHERE nome = ? OR renavam = ? OR placa = ?";
    db.query(query, [nome, renavam, placa], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            res.status(500).json({ error: 'Error executing database query' });
        } else {
            if (results.length > 0) {
                const existingFields = results.map((item) => {
                    if (item.nome === nome) return 'nome';
                    if (item.renavam === renavam) return 'renavam';
                    if (item.placa === placa) return 'placa';
                });
                const errorMessage = `Os seguintes campos já existem no banco de dados: ${existingFields.join(', ')}`;
                Swal.fire({
                    title: "Erro!",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "OK",
                });
                res.status(400).json({ error: errorMessage });
            } else {
                let insertQuery =
                    "INSERT INTO carro (nome, renavam, placa, valor, ano, id_modelo) VALUES (?, ?, ?, ?, ?, 1)";
                db.query(
                    insertQuery,
                    [nome, renavam, placa, valor, ano, modelo],
                    (err, result) => {
                        if (err) {
                            console.error('Error executing database query:', err);
                            res.status(500).json({ error: 'Error executing database query' });
                        } else {
                            console.log(result);
                            Swal.fire("Sucesso!", "Cadastro realizado com sucesso!", "success");
                            res.send(result);
                        }
                    }
                );
            }
        }
    });
});

app.get("/getCards", (req, res) => {
    let query =
        "SELECT CAR.NOME AS NOME_CARRO, CAR.RENAVAM, CAR.PLACA, CAR.VALOR, CAR.ANO, MODELITO.NOME AS NOME_MODELO, BRAND.NOME AS MARCA_CARRO " +
        "FROM CARRO CAR " +
        "LEFT JOIN MODELO MODELITO ON MODELITO.ID = CAR.ID_MODELO " +
        "LEFT JOIN MARCA BRAND ON BRAND.ID = MODELITO.ID_MARCA";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            res.status(500).json({ error: 'Error executing database query' });
        } else {
            console.log(results);
            res.send(results);
        }
    });
});

app.put("/edit/:id", (req, res) => {
    const { id } = req.params;
    const { nome, renavam, placa, valor, ano, id_modelo } = req.body;

    let query =
        "UPDATE carro SET nome = ?, renavam = ?, placa = ?, valor = ?, ano = ?, id_modelo = ? WHERE id = ?";
    db.query(
        query,
        [nome, renavam, placa, valor, ano, id_modelo, id],
        (err, result) => {
            if (err) {
                console.error('Error executing database query:', err);
                res.status(500).json({ error: 'Error executing database query' });
            } else {
                console.log(result);
                res.send(result);
            }
        }
    );
});

const serverPort = 3001;
app.listen(serverPort, () => {
    console.log(`Servidor rodando na porta ${serverPort}`);
});
