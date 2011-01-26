class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|
      t.string :u_name
      t.string :l_name
      t.float :lat
      t.float :long

      t.timestamps
    end
  end

  def self.down
    drop_table :locations
  end
end
