# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_10_24_193848) do
  create_table "campaigns", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "character_locations", force: :cascade do |t|
    t.integer "character_id", null: false
    t.integer "location_id", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_locations_on_character_id"
    t.index ["location_id"], name: "index_character_locations_on_location_id"
  end

  create_table "characters", force: :cascade do |t|
    t.integer "campaign_id", null: false
    t.string "name"
    t.boolean "is_player"
    t.integer "age"
    t.string "fear"
    t.text "motivation"
    t.string "flaws"
    t.text "description"
    t.integer "stat_fight"
    t.integer "stat_brains"
    t.integer "stat_charm"
    t.integer "stat_flight"
    t.integer "stat_brawn"
    t.integer "stat_grit"
    t.integer "adversity_tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "headline"
    t.string "strength_1"
    t.string "strength_2"
    t.index ["campaign_id"], name: "index_characters_on_campaign_id"
  end

  create_table "locations", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "campaign_id", null: false
    t.index ["campaign_id"], name: "index_locations_on_campaign_id"
  end

  create_table "relationships", force: :cascade do |t|
    t.integer "character_1_id", null: false
    t.integer "character_2_id", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_1_id", "character_2_id"], name: "index_relationships_on_character_1_id_and_character_2_id", unique: true
    t.index ["character_1_id"], name: "index_relationships_on_character_1_id"
    t.index ["character_2_id"], name: "index_relationships_on_character_2_id"
  end

  add_foreign_key "character_locations", "characters"
  add_foreign_key "character_locations", "locations"
  add_foreign_key "characters", "campaigns"
  add_foreign_key "locations", "campaigns"
  add_foreign_key "relationships", "characters", column: "character_1_id"
  add_foreign_key "relationships", "characters", column: "character_2_id"
end
