import {MongoClient, ObjectId} from 'mongodb'

const client = new MongoClient ('mongodb+srv://nhabiba173_db_user:gFmT3e8f2mf3giWa@cluster0.dcgqlwl.mongodb.net/')
const Db = client.db('social-app'); 
const users = Db.collection('users'); 


export const handler = async(event) =>{
    const key = event.Records[0].s3.object.key;
    const userId = key.split('/')[1];
    users.updateOne({_id: ObjectId(userId)}, {$set:{profilePicturePath}})
};


        