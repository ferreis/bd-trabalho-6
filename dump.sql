use banco_dados_m3;

CREATE TABLE marca (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE modelo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_marca INT,
  nome VARCHAR(255),
  FOREIGN KEY (id_marca) REFERENCES marca(id)
);

CREATE TABLE carro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_modelo INT,
  nome VARCHAR(255),
  renavam VrenavamARCHAR(255),
  placa VARCHAR(255),
  valor DECIMAL(10, 2),
  ano INT,
  FOREIGN KEY (id_modelo) REFERENCES modelo(id)
);