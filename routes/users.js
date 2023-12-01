import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import validation from '../data/validation.js';

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const user = await userData.getUserById(req.params.id);
      return res.json(user);
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    return res.send(
      `POST request to http://localhost:3000/users/${req.params.id}`
    );
  })
  .delete(async (req, res) => {
    return res.send(
      `DELETE request to http://localhost:3000/users/${req.params.id}`
    );
  });

router
  .route('/')
  .get(async (req, res) => {
    try {
      const userList = await userData.getAllUsers();
      return res.json(userList);
    } catch (e) {
      // Something went wrong with the server!
      return res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    // Not implemented
    return res.send('POST request to http://localhost:3000/users');
  })
  .delete(async (req, res) => {
    // Not implemented
    return res.send('DELETE request to http://localhost:3000/users');
  })
  .put(async (req, res) => {
    return res.send('PUT request to http://localhost:3000/users');
  });

export default router;