import express from 'express';
import { upload } from '../Utils/Utils.js';
import { deleteUserFile, handleFileUpload, updateFileInteraction } from '../controllers/FileController.js';


const filerouter=express.Router();

filerouter.post('/upload/:email', upload.single('file'), handleFileUpload);

filerouter.put('/files/:email/:fileId', updateFileInteraction);

filerouter.delete('/files/delete', deleteUserFile);


export default filerouter;

