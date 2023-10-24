class CreateRelationships < ActiveRecord::Migration[7.1]
  def change
    create_table :relationships do |t|
      t.references :character_1, null: false, foreign_key: { to_table: :characters }
      t.references :character_2, null: false, foreign_key: { to_table: :characters }
      t.text :description

      t.timestamps

      t.index [:character_1_id, :character_2_id], unique: true
    end
  end
end
