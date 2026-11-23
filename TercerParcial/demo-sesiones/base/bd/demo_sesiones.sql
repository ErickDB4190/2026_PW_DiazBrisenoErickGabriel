
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS demo_sesiones;
CREATE DATABASE demo_sesiones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE demo_sesiones;

-- Usuarios: la contraseña se guarda pero solo su hash (bcrypt).
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  rol VARCHAR(10) NOT NULL, -- 'alumno' o 'admin'
  contrasena_hash CHAR(60) NOT NULL
);


CREATE TABLE sessions (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
);

CREATE TABLE tokens_revocados (
  jti VARCHAR(64) PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  expira DATETIME NOT NULL,
  revocado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contraseñas: ana12345, luis12345 y admin12345
INSERT INTO usuarios (usuario, nombre, rol, contrasena_hash) VALUES
  ('ana', 'Ana López', 'alumno', '$2a$10$zngOdAyKeY6JTTKdax4nwu9nq7YOkXlSCCfouJLolZF6JR0QIabSy'),
  ('luis', 'Luis Pérez', 'alumno', '$2a$10$ReAlY7F0jEMlErF7VHM2fe0LATf1FNFzyQ88R8GahAMC8vk1OF67i'),
  ('admin', 'Administración CECyT 9', 'admin', '$2a$10$PGRPlqtOY2XBKvdebx1H8eHgifILHaD8joCQIm5t9lbjoIHArBbvK');