require "test_helper"

class CharacterTest < ActiveSupport::TestCase
  def get_base_character
    campaign = Campaign.new
    campaign.id = 1

    c = Character.new
    c.campaign = campaign
    c.name = "Alice"
    c.stat_brains = 4
    c.stat_brawn = 6
    c.stat_charm = 8
    c.stat_fight = 10
    c.stat_flight = 12
    c.stat_grit = 20

    return c
  end

  test "valid dice values for stats" do
    c = get_base_character
    assert c.valid?, c.errors.full_messages
  end

  test "bad brains stat" do
    c = get_base_character
    c.stat_brains = 3
    assert c.invalid?
  end

  test "bad brawn stat" do
    c = get_base_character
    c.stat_brawn = 3
    assert c.invalid?
  end

  test "bad charm stat" do
    c = get_base_character
    c.stat_charm = 3
    assert c.invalid?
  end

  test "bad fight stat" do
    c = get_base_character
    c.stat_fight = 3
    assert c.invalid?
  end

  test "bad flight stat" do
    c = get_base_character
    c.stat_flight = 3
    assert c.invalid?
  end

  test "bad grit stat" do
    c = get_base_character
    c.stat_grit = 3
    assert c.invalid?
  end

  test "no duplicate stats" do
    c = get_base_character
    c.stat_brains = 20
    c.stat_brawn = 20
    assert c.invalid?
  end

  test "all null stats allowed" do
    c = get_base_character
    c.stat_brains = nil
    c.stat_brawn = nil
    c.stat_charm = nil
    c.stat_fight = nil
    c.stat_flight = nil
    c.stat_grit = nil
    assert c.valid?, c.errors.full_messages
  end

  test "partial null stats not allowed" do
    c = get_base_character
    c.stat_brains = nil
    assert c.invalid?
  end
end
