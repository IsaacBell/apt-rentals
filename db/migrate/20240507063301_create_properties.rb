class CreateProperties < ActiveRecord::Migration[7.0]
  def change
    create_table :properties do |t|
      t.string :title, null: false
      t.string :description
      t.integer :area, null: true
      t.integer :rooms, null: false, default: 0
      t.integer :price, null: false, default: 0
      t.boolean :sold, null: false, default: false
      t.boolean :deleted, null: false, default: false
      t.st_point :location, null: false, geographic: true
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :properties, :title
    add_index :properties, :location, using: :gist
  end
end
