class ChangeColumnNames < ActiveRecord::Migration
  def self.up
    change_table :locations do |t|
      t.rename :u_name, :usr_name
      t.rename :l_name, :loc_name
      t.rename :long, :lng
    end
  end

  def self.down
    change_table :locations do |t|
      t.rename :usr_name, :u_name
      t.rename :loc_name, :l_name
      t.rename :lng, :long 
    end
  end
end
