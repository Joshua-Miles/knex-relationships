
exports.up = function(knex) {
    return knex.schema.createTable('directors', (table) => {
        table.increments('id');
        table.string('firstName');
       	table.string('lastName');
    })
};

exports.down = function(knex) {
  
};
