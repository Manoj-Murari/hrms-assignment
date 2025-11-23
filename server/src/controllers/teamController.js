const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logAction = require('../utils/logger'); // Ensure path is correct

exports.getTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            where: { organizationId: req.user.organizationId }
        });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch teams" });
    }
};

exports.createTeam = async (req, res) => {
    const { name } = req.body;
    try {
        const team = await prisma.team.create({
            data: { name, organizationId: req.user.organizationId }
        });
        // Log the action
        await logAction(req.user.id, 'CREATE_TEAM', { id: team.id, name });

        res.status(201).json(team);
    } catch (err) {
        res.status(500).json({ error: "Failed to create team" });
    }
};