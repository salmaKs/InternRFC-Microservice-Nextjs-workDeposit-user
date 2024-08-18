import AWS from 'aws-sdk';
import {getToken} from 'next-auth/jwt';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const JWt_SECRET = process.env.JWT_SECRET;

function generateUniqueId() {
    const now = Date.now();
    return now;
  }
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const token = await getToken({req, secret: JWt_SECRET.toString()});
        // Logique pour ajouter un rapport
        const { Thème, Date, Avancement, Tâche } = req.body;
       
        const params = {
            TableName: 'WorkRapport',
            Item: {
                id: generateUniqueId(), 
                Theme: Thème,
                Date: Date,
                Avancement: Avancement.toString(),
                Tâche: Tâche,
                personId: token.email,
            },
        };

        try {
            await dynamodb.put(params).promise();
            res.status(200).json({ message: 'Rapport added successfully' });
        } catch (error) {
            console.error('Error adding rapport:', error);
            res.status(500).json({ error: 'Failed to add rapport' });
        }
    } else if (req.method === 'GET') {
        const token = await getToken({req, secret: JWt_SECRET.toString()});
        const personId = token.email;
        console.log(token.email);
        const params = {
            TableName: 'WorkRapport',
            FilterExpression: 'personId = :personId',
            ExpressionAttributeValues: {
                ':personId': personId,
            },
        };

        try {
            const data = await dynamodb.scan(params).promise();
            res.status(200).json(data.Items);
        } catch (error) {
            console.error('Error fetching rapports:', error);
            res.status(500).json({ error: 'Failed to fetch rapports' });
        }
    }  else if (req.method === 'PUT') {
        //Vérification de l'existence d'un rapport avec la même date ou non
        const {Date} = req.body;

        const params = {
            TableName: 'WorkRapport',
            FilterExpression: '#date = :date',
            ExpressionAttributeNames: {
                '#date': 'Date',
            },
            ExpressionAttributeValues: {
                ':date': Date,
            },
        };
        try {
            const data= await dynamodb.scan(params).promise();
            if (data.Items.length > 0) {
                res.status(200).json({ exists: true});
            } else {
                res.status(200).json({ exists: false});
            }
        } catch (error) {
            console.error('Error checking date:', error);
            res.status(500).json({error: 'Failed to check date'});
        }
    }else {
        // Gestion des méthodes non autorisées
        res.setHeader('Allow', ['POST', 'GET', 'PUT']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
