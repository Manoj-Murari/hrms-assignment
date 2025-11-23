const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const logAction = async (userId, action, details) => {
    try {
        // If details is an object, stringify it
        const detailsString = typeof details === 'string' ? details : JSON.stringify(details);

        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details: detailsString,
            },
        });
        console.log(`[AUDIT] User ${userId} -> ${action}`);
    } catch (error) {
        console.error("Audit Log Error:", error);
    }
};

module.exports = logAction;