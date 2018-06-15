Please find below step to operate this system

1. To get registered with the system kindly use this url  http://localhost:8081/registration with header {'Content-Type': 'application/json'} and body like {"name":"test","email":"test@test.com","password":"test","confirm_password":"test"}.
2. Once registration completed use url http://localhost:8081/login to get authorized token, header {'Content-Type': 'application/json'} and body like {"email":"test@test.com","password":"test"}.
3. After authorized token request will be able to perform CRUD operation, like  http://localhost:8081/user GET/PUT/DELETE, get by id, get by querystring params etc.

Before start above step need to execute few command
1. To get all depended module ==> npm install
2. To start server to perform operation ==> node server.js

Authorized token will be secure like if someone having database credential then he can see token value(uuid) but can't set manually value to get authorized because of some encrpted method are using

Note: Authorized token will expire in 15 minute, after expire use can create new token as well