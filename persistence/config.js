function start(Sequelize, connection) {
	require('../persistence/Person').init(Sequelize, connection);
}

module.exports.start = start;
