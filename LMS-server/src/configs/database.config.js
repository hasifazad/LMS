const Organization = require('../models/organisation.model');



// Get the organization database connection string
async function getDbConfig(organizationCode) {
    // Get the organization from the DB
    // const organization = await Organization.findOne({ organizationCode });

    // if (!organization) {
    //     throw new Error('Organization not found');
    // }

    // Return the URI for the database based on the organization
    return `mongodb+srv://asifazad114:HHzs9blZd4gsNCqR@cluster0.ugptnol.mongodb.net/org1db`;
}

module.exports = getDbConfig



