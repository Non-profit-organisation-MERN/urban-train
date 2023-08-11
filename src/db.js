const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Shravanth_J:Jaga1979@cluster0.gtnryvj.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Connection to MongoDB failed:', error);
    });

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('people', UserSchema);

module.exports = {
    addUser: async (userData) => {
        try {
            const newUser = new User(userData);
            await newUser.save();
            console.log('User added:', newUser);
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },
};
