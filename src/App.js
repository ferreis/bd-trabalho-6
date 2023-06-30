import React, { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import Popup from "./Popup";
import Swal from "sweetalert2";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./messages";

function App() {
    const [values, setValues] = useState({});
    const [listCard, setListCard] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedValues, setEditedValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const handleRegister = () => {
        Axios.post("http://localhost:3001/register", values)
            .then(() => {
                return Axios.post("http://localhost:3001/search", values);
            })
            .then((response) => {
                setListCard((prevList) => [
                    ...prevList,
                    {
                        id: response.data[0].id,
                        ...values,
                    },
                ]);
                Swal.fire({
                    title: "Sucesso!",
                    text: SUCCESS_MESSAGES.register,
                    icon: "success",
                    confirmButtonText: "OK",
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleEditItem = (item) => {
        setEditedValues(item);
        setEditModalVisible(true);
    };

    const handleSaveEditedItem = () => {
        Axios.post("http://localhost:3001/update", editedValues)
            .then(() => {
                return Axios.get("http://localhost:3001/getCards");
            })
            .then((response) => {
                setListCard(response.data);
                setEditedValues({});
                setEditModalVisible(false);
                Swal.fire({
                    title: "Sucesso!",
                    text: SUCCESS_MESSAGES.updateItem,
                    icon: "success",
                    confirmButtonText: "OK",
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleCancelEdit = () => {
        setEditedValues({});
        setEditModalVisible(false);
    };

    const handleAddValues = (event) => {
        let { name, value } = event.target;
        // Limitar o campo de entrada a 4 caracteres
        if (name === "ano" && value.length > 4) {
            value = value.slice(0, 4); // Manter apenas os primeiros 4 caracteres
        }
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleUpdateList = () => {
        Axios.get("http://localhost:3001/getCards")
            .then((response) => {
                const cards = response.data;
                setTotalPages(Math.ceil(cards.length / ITEMS_PER_PAGE));
                setListCard(cards.slice(0, ITEMS_PER_PAGE));
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);

        Axios.get("http://localhost:3001/getCards")
            .then((response) => {
                const cards = response.data;
                setTotalPages(Math.ceil(cards.length / ITEMS_PER_PAGE));
                const startIndex = (page - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                setListCard(cards.slice(startIndex, endIndex));
            })
            .catch((error) => {
                console.error("Error:", error);
                Swal.fire({
                    title: "Erro!",
                    text: ERROR_MESSAGES.changePage,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
    };

    useEffect(() => {
        handleUpdateList();
    }, []);

    return (
        <div className="app-container">
            <div className="register-container">
                <h1 className="register-title">Scrim Shop</h1>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    className="register-input"
                    onChange={handleAddValues}
                />
                <input
                    type="text"
                    placeholder="Renavem"
                    name="renavam"
                    className="register-input"
                    onChange={handleAddValues}
                />
                <input
                    type="text"
                    placeholder="Placa"
                    name="placa"
                    className="register-input"
                    onChange={handleAddValues}
                />
                <input
                    type="text"
                    placeholder="Valor"
                    name="valor"
                    className="register-input"
                    onChange={handleAddValues}
                />
                <input
                    type="text"
                    placeholder="Ano"
                    name="ano"
                    className="register-input"
                    maxLength={4}
                    value={values.ano || ""}
                    onChange={handleAddValues}
                />
                <input
                    type="text"
                    placeholder="Modelo"
                    name="modelo"
                    className="register-input"
                    onChange={handleAddValues}
                />
                <input
                    type="text"
                    placeholder="Marca"
                    name="marca"
                    className="register-input"
                    onChange={handleAddValues}
                />
                <button onClick={handleRegister} className="button">
                    Cadastrar
                </button>
            </div>

            <div className="table-container">
                <table className="item-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Renavam</th>
                        <th>Placa</th>
                        <th>Valor</th>
                        <th>Ano</th>
                        <th>Modelo</th>
                        <th>Marca</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listCard.map((item) => (
                        <tr key={item.id}>
                            <td>{item.NOME_CARRO}</td>
                            <td>{item.RENAVAM}</td>
                            <td>{item.PLACA}</td>
                            <td>{item.VALOR}</td>
                            <td>{item.ANO}</td>
                            <td>{item.NOME_MODELO}</td>
                            <td>{item.MARCA_CARRO}</td>
                            <td>
                                <button
                                    onClick={() => handleEditItem(item)}
                                    className="button"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    className={`page-button ${
                                        currentPage === page ? "active" : ""
                                    }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>
                )}
                <button onClick={handleUpdateList} className="update-button">
                    Atualizar
                </button>
            </div>

            {editModalVisible && (
                <Popup
                    editedValues={editedValues}
                    handleEditValues={handleAddValues}
                    handleSaveEditedItem={handleSaveEditedItem}
                    handleCancelEdit={handleCancelEdit}
                />
            )}
        </div>
    );
}

export default App;
