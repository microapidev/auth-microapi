
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "As Dockerized User Authentication Micro-Service",
            description: "A Dockerized Microservice for Authentication",
            contact: {
                name: 'Team Justice League'
            },
            server: ["http:localhost:5000"]
        }
    },
    apis: ['./src/routes/*.js']
}

export default swaggerOptions;
