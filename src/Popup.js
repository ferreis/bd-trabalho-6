import React from "react";
import "./Popup.css";
import "./App"

const Popup = ({
                   editedValues,
                   handleEditValues,
                   handleSaveEditedItem,
                   handleCancelEdit,
               }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <h2>Editar Item</h2>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    className="popup-input"
                    value={editedValues.nome || ""}
                    onChange={handleEditValues}
                />
                <input
                    type="text"
                    placeholder="Renavem"
                    name="renavam"
                    className="popup-input"
                    value={editedValues.renavam || ""}
                    onChange={handleEditValues}
                />
                <input
                    type="text"
                    placeholder="Placa"
                    name="placa"
                    className="popup-input"
                    value={editedValues.placa || ""}
                    onChange={handleEditValues}
                />
                <input
                    type="text"
                    placeholder="Valor"
                    name="valor"
                    className="popup-input"
                    value={editedValues.valor || ""}
                    onChange={handleEditValues}
                />
                <input
                    type="text"
                    placeholder="Ano"
                    name="ano"
                    className="popup-input"
                    value={editedValues.ano || ""}
                    onChange={handleEditValues}
                />
                <div className="popup-buttons">
                    <button className="popup-save-button" onClick={handleSaveEditedItem}>
                        Salvar
                    </button>
                    <button className="popup-cancel-button" onClick={handleCancelEdit}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
