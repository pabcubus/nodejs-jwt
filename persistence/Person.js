function init(Sequelize, connection) {
	Person = connection.define('person', {
		username: Sequelize.STRING,
		password: Sequelize.STRING,
		creation: Sequelize.DATE,
		active: Sequelize.BOOLEAN
	}, {
		freezeTableName: true,
	});
}

module.exports.init = init;
