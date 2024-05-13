class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :agencies do |t|
      t.string :name
      t.boolean :deleted
    end

    add_index :agencies, :name

    create_table :users, id: :uuid do |t|
      t.string :email, unique: true
      t.string :phone_number
      t.string :password_hash
      t.string :confirmation_token
      t.timestamp :confirmed_at
      t.timestamp :confirmation_sent_at
      t.string :recovery_token
      t.timestamp :recovery_sent_at
      t.timestamp :last_sign_in_at
      t.jsonb :raw_app_meta_data
      t.jsonb :raw_user_meta_data
      t.boolean :is_super_admin, default: false
      t.string :user_type
      t.boolean :deleted
      t.references :agency, null: true, foreign_key: true

      t.timestamps
    end

    add_index :users, :email
  end
end
