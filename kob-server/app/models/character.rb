class CharacterValidator < ActiveModel::Validator
  def validate(record)
    stats = Set.new
    stats << record.stat_brains
    stats << record.stat_brawn
    stats << record.stat_charm
    stats << record.stat_fight
    stats << record.stat_flight
    stats << record.stat_grit

    if stats.size == 1 and stats.include? nil
      # this case is fine
    else
      if stats.include? nil
        record.errors.add :base, "Cannot mix set and unset dice"
      elsif stats.size != 6
        record.errors.add :base, "Stat dice must be unique"
      end
    end
  end
end

class Character < ApplicationRecord
  belongs_to :campaign
  has_many :character_locations
  has_many :locations, through: :character_locations
  has_many :relationships_1, class_name: 'Relationship', foreign_key: :character_1
  has_many :relationships_2, class_name: 'Relationship', foreign_key: :character_2

  validates :name, presence: true
  dice_values = [nil, 4, 6, 8, 10, 12, 20]
  validates :stat_brains, inclusion: { in: dice_values }
  validates :stat_brawn, inclusion: { in: dice_values }
  validates :stat_charm, inclusion: { in: dice_values }
  validates :stat_fight, inclusion: { in: dice_values }
  validates :stat_flight, inclusion: { in: dice_values }
  validates :stat_grit, inclusion: { in: dice_values }
  
  validates_with CharacterValidator

  def age_group
    if age == nil
      nil
    elsif age >= 0 and age < 14
      :kid
    elsif age >= 14 and age < 20
      :teen
    elsif age >= 20
      :adult
    else
      nil
    end
  end

  def stat_brains_modifier
    if age_group == :adult
      1
    else
      0
    end
  end

  def stat_brawn_modifer
    if age_group == :teen
      1
    else
      0
    end
  end

  def stat_charm_modifer
    if age_group == :kid
      1
    else
      0
    end
  end

  def stat_fight_modifer
    if age_group == :teen
      1
    else
      0
    end
  end

  def stat_flight_modifer
    if age_group == :kid
      1
    else
      0
    end
  end

  def stat_grit_modifer
    if age_group == :adult
      1
    else
      0
    end
  end

  def relationships
    relationships_1 + relationships_2
  end

  def serializable_hash(*)
    d = super
    d[:age_group] = age_group
    d[:stat_brains_modifier] = stat_brains_modifier
    d[:stat_brawn_modifier] = stat_brawn_modifer
    d[:stat_charm_modifier] = stat_charm_modifer
    d[:stat_fight_modifier] = stat_fight_modifer
    d[:stat_flight_modifier] = stat_flight_modifer
    d[:stat_grit_modifier] = stat_grit_modifer
    d[:relationships] = relationships
    return d
  end
end
