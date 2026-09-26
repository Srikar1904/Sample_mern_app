const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const employeeRoutes = require('./routes/emp_routes');
const hrRoutes = require('./routes/hr_routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrmanagment';

app.use(express.json());
app.use('/api', employeeRoutes);
app.use('/api/hr', hrRoutes);

// Routes
app.get('/', (req, res) => {
	res.json({ message: 'API is running' });
});

app.get('/api/users', async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.post('/api/users', async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword, role });
		const responseUser = user.toObject();
		delete responseUser.password;
		res.status(201).json(responseUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

app.get('/api/users/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (error) {
		res.status(400).json({ message: 'Invalid user ID' });
	}
});

app.delete('/api/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(400).json({ message: 'Invalid user ID' });
	}
});

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((error) => console.error('Database connection failed:', error.message));
