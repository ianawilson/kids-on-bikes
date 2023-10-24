class CreateCharacters < ActiveRecord::Migration[7.1]
  def change
    create_table :characters do |t|
      t.references :campaign, null: false, foreign_key: true
      t.string :name
      t.boolean :is_player
      t.integer :age, null: true
      t.string :fear
      t.text :motivation
      t.string :flaws
      t.text :description
      t.integer :stat_fight
      t.integer :stat_brains
      t.integer :stat_charm
      t.integer :stat_flight
      t.integer :stat_brawn
      t.integer :stat_grit
      t.integer :adversity_tokens

      t.timestamps
    end
  end
end
