import createUser from 'services/users/create';
// import authorizeUser from 'services/users/authorize';

export default async (req,res)=>{
    switch (req.method) {
        case 'POST': {
            try {
                const payload =req.body;
                const user= await createUser(payload);

                res.status(200).json({status: 'created', user});
            } catch (error) {
                res.status(422).json({status: 'not created', error});
            }
            break;
        }
        default:
            res.status(400);
    }
}