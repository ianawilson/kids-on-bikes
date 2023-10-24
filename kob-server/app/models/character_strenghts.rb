class Strength
  def initialize key, name, description, free_for_age_group = nil
    @key = key
    @name = name
    @description = description
    @free_for_age_group = free_for_age_group
  end
end

STRENGTHS = {
  :cool_under_pressure => new Strength :cool_under_pressure, 'Cool Under Pressure', 'May spend 1 Adversity Token to take half of your die’s value instead of rolling on a Snap Decision.',
  :easygoing => new Strength :easygoing, 'Easygoing', 'Gain 2 Adversity Tokens when you fail, instead of 1.',
  :gross => new Strength :gross, 'Gross', 'You have some kind of gross bodily trick (loud, quiet, smelly... up to you) that you can do on command.',
  :heroic => new Strength :heroic, 'Heroic', 'You do not need the GM’s permission to spend Adversity Tokens to ignore fears.',
  :intuitive => new Strength :intuitive, 'Intuitive', 'May spend 1 Adversity Token to ask the GM about your surroundings, an NPC, or the like. The GM must answer honestly.',
  :loyal => new Strength :loyal, 'Loyal', 'Each of the Adversity Tokens you spend to help your friends gives them a +2 instead of a +1.',
  :lucky => new Strength :lucky, 'Lucky', 'May spend 2 Adversity Tokens to reroll a stat check.',
  :prepared => new Strength :prepared, 'Prepared', 'May spend 2 Adversity Tokens to just happen to have one commonplace item with you (GM’s discretion).',
  :protective => new Strength :protective, 'Protective', 'Add +3 to rolls when defending one of your friends.',
  :quick_healing => new Strength :quick_healing, 'Quick Healing', 'You recover from injuries more quickly, and don’t suffer lasting effects from most injuries.', :kid,
  :rebellious => new Strength :rebellious, 'Rebellious', 'Add +3 to rolls when persuading or resisting persuasion from children. Add +3 to rolls when resisting persuasion from adults.', :teen,
  :skilled_at => new Strength :skilled_at, 'Skilled at ___', 'Choose a skill (GM’s discretion). You are assumed to succeed when making even moderately difficult checks (9 or less) involving this skill. If the GM determines that you do need to roll for a more difficult check, add up to +3 to your roll.', :adult,
  :tough => new Strength :tough, 'Tough', 'If you lose a combat roll, add +3 to the negative number. You still lose the roll no matter what, but could reduce your loss to -1.',
  :treasure_hunter => new Strength :treasure_hunter, 'Treasure Hunter', 'May spend 1 Adversity Token to find a useful item in your surroundings.',
  :unassuming => new Strength :unassuming, 'Unassuming', 'May spend 2 Adversity Tokens to not be seen, within reason (GM’s discretion).',
  :wealthy => new Strength :wealthy, 'Wealthy', 'May spend money as though you were in a higher age bracket. For example, a wealthy child is considered to have the disposable income of a typical teen, and a wealthy teen is considered to have the disposable income of a typical adult. A wealthy adult is considered to not have to worry too much about money — they would certainly be able to buy anything they need, and likely able to spend their way out of a lot of situations.'
}
