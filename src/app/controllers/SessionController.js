import * as Yup from 'yup';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

class SessionController {
    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().required().email(),
            password: Yup.string().min(6).required(),
        });


        const isValid = await schema.isValid(request.body, { strict: true, abortEarly: false });


        if (!isValid) {
            return response.status(400).json({ error: 'email ou password incorrect' });
        }

        const { email, password } = request.body;


        const existingUser = await User.findOne({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return response.status(400).json({ error: 'email ou password incorrect' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password_hash,);


        if (!isPasswordCorrect) {
            return response.status(400).json({ error: 'email ou password incorrect' });
        }



        return response.status(200).json({ 
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            admin: existingUser.admin,

        });
    }

}

export default new SessionController();