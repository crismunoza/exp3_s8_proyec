FROM node:20.14.0 AS build
WORKDIR /app

# Copiar los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias y eliminar archivos temporales
RUN npm install && npm cache clean --force

# Copiar el resto de los archivos y carpetas al contenedor y compilar
COPY . .
RUN npm run build -- --configuration production --project=proyecto

# Etapa 2: Configuración de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de construcción al directorio de Nginx
COPY --from=build /app/dist/proyecto/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
