const { PrismaClient } = require('@prisma/client');
const logAction = require('../utils/logger');
const prisma = new PrismaClient();

// Create Employee
exports.createEmployee = async (req, res) => {
    const { name, role } = req.body;
    try {
        const employee = await prisma.employee.create({
            data: {
                name,
                role,
                organizationId: req.user.organizationId,
            },
        });

        // LOGGING REQUIREMENT
        await logAction(req.user.id, 'CREATE_EMPLOYEE', { id: employee.id, name });

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

// Assign Teams (Many-to-Many Update)
exports.assignTeams = async (req, res) => {
    const { id } = req.params; // Employee ID
    const { teamIds } = req.body; // Array of Team IDs

    try {
        // Connect logic for Prisma
        const teamsToConnect = teamIds.map((tid) => ({ id: tid }));

        const updated = await prisma.employee.update({
            where: { id },
            data: {
                teams: {
                    set: [], // Reset existing
                    connect: teamsToConnect, // Add new
                },
            },
        });

        // LOGGING REQUIREMENT
        await logAction(req.user.id, 'ASSIGN_TEAM', { employeeId: id, teams: teamIds });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign teams' });
    }
};

exports.getEmployees = async (req, res) => {
    // Optimization: Include teams in the fetch
    const employees = await prisma.employee.findMany({
        where: { organizationId: req.user.organizationId },
        include: { teams: true }
    });
    res.json(employees);
};