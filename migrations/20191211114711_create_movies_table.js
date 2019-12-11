
exports.up = function(knex) {
    return knex.schema.createTable('movies', (table) => {
        table.increments('id');
        table.string('name');
       	table.integer('director_id')
    })
};

exports.down = function(knex) {
  
};
