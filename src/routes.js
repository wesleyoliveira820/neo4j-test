import { Router } from 'express';
import { neoClient } from './database/index.js';

const routes = Router();

routes.post('/users', async (request, response) => {
  const {name,email} = request.body

  if(!email || !name) {
    return response.status(400).json({error: 'all fields are required'});
  };

  const userAlreadyExists = await neoClient.run(
    `MATCH
      (user:User {
        email: $email
      })
      RETURN user
      `,
      {email}
    );

  if(userAlreadyExists.records[0]) {
    return response.status(400).json({error: 'this email already exists'});
  }

  const user = await neoClient.run(
    `CREATE
      (user:User {
        name: $name,
        email: $email
      })
      RETURN user
      `,
    {
      name,
      email
    }
  );
  response.json(user.records[0].get(0));
});

routes.get('/users', async(request, response) => {
  const {email} = request.body;

  if(!email) return response.status(400).json({error: 'email is required'});

  const users = await neoClient.run(`MATCH users = (:User {email: $email})-[:INVITED_BY*]->(:User) RETURN users LIMIT 500`, {email});

  const a = users.records.map(user => {
    return user.get('users');
  });

  const aa = a.map(b => b.segments.map(c => c.end));

  const aaa = aa.slice(-1)[0];

  aaa.map((user, index) => {
    if(aa[index + 1]) {
      console.log(`${user.properties.name} foi convidado por ${aaa[index+1].properties.name}`)
    } else {
      console.log(`${user.properties.name} não foi convidado por ninguém`)
    }
  });

  return response.json(a)
});

export default routes;
