# Setup Instrunctions

- Repo has two folders client (frontend) and server (backend)

### Used Versions

- Node v20
- MongoDB v7.0.12

### Frontend

- Used Vite React Javascript for frontend with tailwind css and shadcn as css component library
- Move to client folder and run `npm install` to download all dependency packages
- Run command `npm run dev` to run the frontend in dev mode

### Backend

- Used Express for devloping API's required
- Move to server folder and run `npm install` to download all dependency packages
- Run command `npm run dev` to run the backend in dev mode

### MongoDB

- create `.env` folder in server root folder and paste below env variables
  `MONGO_URL=mongodb://localhost:27017/student_management`
  `JWT_SECRET_TOKEN=hfjiel9ufj`
- JWT_SECRET_TOKEN can be of your choice but dont change it once app get started
