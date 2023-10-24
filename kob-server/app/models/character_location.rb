class CharacterLocation < ApplicationRecord
  belongs_to :character
  belongs_to :location
end
