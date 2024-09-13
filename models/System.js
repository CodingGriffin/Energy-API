const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Systems', {
        status: DataTypes.INTEGER,
        state: DataTypes.TEXT,
        lat: DataTypes.TEXT,
        long: DataTypes.TEXT,
        address_id: DataTypes.INTEGER,
        formatted_address: DataTypes.TEXT,
        monthly_consumption_kwh: DataTypes.FLOAT,
        percentage_degredation: DataTypes.INTEGER,
        percentage_escalation: DataTypes.FLOAT,
        percentage_system_owner: DataTypes.FLOAT,
        percentage_roof_owner: DataTypes.FLOAT,
        percentage_service_center: DataTypes.FLOAT,
        percentage_maintenance: DataTypes.FLOAT,
        percentage_insurance: DataTypes.FLOAT,
        percentage_breakage: DataTypes.FLOAT,
        percentage_warranty: DataTypes.FLOAT,
        roi: DataTypes.FLOAT,
        irr: DataTypes.FLOAT,
        lcoe: DataTypes.FLOAT,
        dbr: DataTypes.FLOAT,
        unit_cost_new: DataTypes.FLOAT,
        unit_cost_current: DataTypes.FLOAT,
        npv: DataTypes.FLOAT,
        payback_period: DataTypes.FLOAT,
        total_panels: DataTypes.INTEGER,
        total_ems: DataTypes.FLOAT,
        ac_cable_quantity: DataTypes.INTEGER,
        ac_cable_cost: DataTypes.FLOAT,
        earth_cable_quantity: DataTypes.INTEGER,
        earth_cable_cost: DataTypes.FLOAT,
        earth_spike_quantity: DataTypes.INTEGER,
        earth_spike_cost: DataTypes.FLOAT,
        rails_clamps_cost: DataTypes.FLOAT,
        rails_clamps_quantity: DataTypes.INTEGER,
        panel_installation: DataTypes.FLOAT,
        ems_installation: DataTypes.FLOAT,
        coc: DataTypes.FLOAT,
        callout: DataTypes.FLOAT,
        consumables: DataTypes.FLOAT,
        license_fee: DataTypes.FLOAT,
        system_cost_excl: DataTypes.FLOAT,
        system_cost_incl: DataTypes.FLOAT,
        sign_off_site_inspection: DataTypes.FLOAT,
        sign_off_installation: DataTypes.FLOAT,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
};