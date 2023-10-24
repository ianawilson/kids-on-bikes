class Location < ApplicationRecord
  belongs_to :campaign
  has_many :character_locations
  has_many :characters, through: :character_locations
end
