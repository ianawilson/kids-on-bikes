class Campaign < ApplicationRecord
  has_many :characters
  has_many :locations
end
