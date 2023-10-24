class Strength
  attr_reader :key
  attr_reader :name
  attr_reader :description

  def initialize(key, name, description)
    @key = key
    @name = name
    @description = description
  end
end

STRENGTHS = {
  :cool_under_pressure => Strength.new(:cool_under_pressure, 'Cool Under Pressure', 'May spend 1 Adversity Token to take half of your die’s value instead of rolling on a Snap Decision.'),
  :easygoing => Strength.new(:easygoing, 'Easygoing', 'Gain 2 Adversity Tokens when you fail, instead of 1.'),
  :gross => Strength.new(:gross, 'Gross', 'You have some kind of gross bodily trick (loud, quiet, smelly... up to you) that you can do on command.'),
  :heroic => Strength.new(:heroic, 'Heroic', 'You do not need the GM’s permission to spend Adversity Tokens to ignore fears.'),
  :intuitive => Strength.new(:intuitive, 'Intuitive', 'May spend 1 Adversity Token to ask the GM about your surroundings, an NPC, or the like. The GM must answer honestly.'),
  :loyal => Strength.new(:loyal, 'Loyal', 'Each of the Adversity Tokens you spend to help your friends gives them a +2 instead of a +1.'),
  :lucky => Strength.new(:lucky, 'Lucky', 'May spend 2 Adversity Tokens to reroll a stat check.'),
  :prepared => Strength.new( :prepared, 'Prepared', 'May spend 2 Adversity Tokens to just happen to have one commonplace item with you (GM’s discretion).'),
  :protective => Strength.new(:protective, 'Protective', 'Add +3 to rolls when defending one of your friends.'),
  :quick_healing => Strength.new(:quick_healing, 'Quick Healing', 'You recover from injuries more quickly, and don’t suffer lasting effects from most injuries.'),
  :rebellious => Strength.new(:rebellious, 'Rebellious', 'Add +3 to rolls when persuading or resisting persuasion from children. Add +3 to rolls when resisting persuasion from adults.'),
  :skilled_at => Strength.new(:skilled_at, 'Skilled at ___', 'Choose a skill (GM’s discretion). You are assumed to succeed when making even moderately difficult checks (9 or less) involving this skill. If the GM determines that you do need to roll for a more difficult check, add up to +3 to your roll.'),
  :tough => Strength.new(:tough, 'Tough', 'If you lose a combat roll, add +3 to the negative number. You still lose the roll no matter what, but could reduce your loss to -1.'),
  :treasure_hunter => Strength.new(:treasure_hunter, 'Treasure Hunter', 'May spend 1 Adversity Token to find a useful item in your surroundings.'),
  :unassuming => Strength.new(:unassuming, 'Unassuming', 'May spend 2 Adversity Tokens to not be seen, within reason (GM’s discretion).'),
  :wealthy => Strength.new(:wealthy, 'Wealthy', 'May spend money as though you were in a higher age bracket. For example, a wealthy child is considered to have the disposable income of a typical teen, and a wealthy teen is considered to have the disposable income of a typical adult. A wealthy adult is considered to not have to worry too much about money — they would certainly be able to buy anything they need, and likely able to spend their way out of a lot of situations.')
}

FREE_STRENGTHS = {
  :kid => STRENGTHS[:quick_healing],
  :teen => STRENGTHS[:rebellious],
  :adult => STRENGTHS[:skilled_at]
}

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

  def strength_free
    if age_group != nil
      FREE_STRENGTHS[age_group]
    end
  end

  def serializable_hash(*)
    d = super
    puts strength_1
    if strength_free
      d[:strength_free] = strength_free.key
      d[:strength_free_details] = strength_free
    end
    if strength_1 then d[:strength_1_details] = STRENGTHS[strength_1.to_sym] end
    if strength_2 then d[:strength_2_details] = STRENGTHS[strength_2.to_sym] end
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
