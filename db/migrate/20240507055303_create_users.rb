class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :agencies do |t|
      t.string :name
      t.boolean :deleted
    end
    
    add_index :agencies, :name

    create_table :users do |t|
      t.string :user_type
      t.string :email
      t.string :phone
      t.boolean :deleted
      t.references :agency, null: true, foreign_key: true

      t.timestamps
    end

    add_index :users, :email
  end
end
