const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');
        
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (!adminExists) {
            const admin = new User({
                name: 'Starter Admin',
                username: 'admin',
                email: 'admin@gmail.com',
                password: 'admin123',
                role: 'admin',
                active: true
            });
            
            await admin.save();
            console.log('Admin account successfully created');
        } else {
            console.log('Admin account already exists');
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Connection error:', err);
        mongoose.connection.close();
    });