const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logAction = require('../utils/logger');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { orgName, email, password } = req.body;
    try {
        // 1. Create Organization
        const org = await prisma.organization.create({ data: { name: orgName } });

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                organizationId: org.id
            }
        });

        res.status(201).json({ message: "Organization and Admin registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, organizationId: user.organizationId },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await logAction(user.id, 'LOGIN', 'User logged in');
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};