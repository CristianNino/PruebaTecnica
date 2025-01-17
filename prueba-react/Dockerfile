# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY ./src /app

# Instalar dependencias
RUN npm install

# Construir la aplicación React
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]