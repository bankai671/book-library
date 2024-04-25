curl -X POST -H "Content-Type: application/json" -d '{
    "email": "admin@gmail.com",
    "password": "qweqwe",
    "role": "admin"
}' http://localhost:3001/api/auth/register/
