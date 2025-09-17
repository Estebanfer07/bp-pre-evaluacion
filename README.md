# BP Pre-evaluación

Esta aplicación es la solución propuesta al test técnico. El sistema está compuesto por:

- **Frontend**: Aplicación en React estructurada con Atomic Design, lo que permite una organización clara y escalable de los componentes. Se utilizan las siguientes herramientas y librerías:

  - **Atomic Design**: Facilita la organización y reutilización de componentes, mejorando la escalabilidad y el mantenimiento del código.
  - **Sass y BEM**: Permiten escribir estilos más estructurados y mantenibles, asegurando consistencia en la nomenclatura de clases CSS.
  - **Zustand**: Gestión global del estado de manera sencilla y eficiente, con una API minimalista y sin boilerplate.
  - **TanStack Query + Axios**: Manejo avanzado de peticiones HTTP y caché de datos, optimizando la sincronización con el backend y mejorando la experiencia de usuario.
  - **TanStack Router**: Enrutamiento flexible y moderno, facilitando la navegación entre páginas y vistas.
  - **Zod**: Validación de esquemas y tipos, asegurando que los datos sean correctos antes de procesarlos.
  - **React Hook Form**: Gestión eficiente de formularios, simplificando la validación y el manejo de datos de entrada.

- **Backend API**: Servicio principal desarrollado en Java con Spring Boot, encargado de toda la lógica de negocio y operaciones centrales, como la gestión de cuentas, movimientos y clientes.
- **Servicio de Reportes**: Microservicio independiente en Java Spring Boot (no es parte de la solución solicitada, es un proyecto aparte que reutilicé para poder generar los reportes de una mejor manera), dedicado exclusivamente a la generación de reportes en PDF, permitiendo separar la lógica de generación de documentos del resto de la aplicación.
- **Base de datos**: PostgreSQL, utilizada para el almacenamiento seguro y persistente de toda la información relevante del sistema.

Todos los servicios están containerizados y se pueden iniciar fácilmente con Docker Compose, lo que simplifica el despliegue y la integración entre componentes.

## Documentación

Dentro de los archivos del backend encontrarás documentación de la API en formato Swagger (OpenAPI) y una colección de Postman para facilitar pruebas y exploración de los endpoints:

- Swagger (OpenAPI): `backend/src/main/resources/my-bank-contract.yml`
- Colección Postman: `backend/src/main/resources/postman-collection.json`

## Inicio rápido

Para levantar toda la aplicación, ejecuta el siguiente comando:

```bash
docker-compose up -d
```

**Accesos a los servicios:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8081
- Servicio de Reportes: http://localhost:8083
- Base de datos: localhost:5432
- 
