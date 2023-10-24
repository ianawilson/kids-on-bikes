require "test_helper"

class CharactersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @character = characters(:one)
  end

  test "should get index" do
    get characters_url, as: :json
    assert_response :success
  end

  test "should create character" do
    assert_difference("Character.count") do
      post characters_url, params: { character: { adversity_tokens: @character.adversity_tokens, age: @character.age, campaign_id: @character.campaign_id, description: @character.description, fear: @character.fear, flaws: @character.flaws, is_player: @character.is_player, motivation: @character.motivation, name: @character.name, stat_brains: @character.stat_brains, stat_brawn: @character.stat_brawn, stat_charm: @character.stat_charm, stat_fight: @character.stat_fight, stat_flight: @character.stat_flight, stat_grit: @character.stat_grit } }, as: :json
    end

    assert_response :created
  end

  test "should show character" do
    get character_url(@character), as: :json
    assert_response :success
  end

  test "should update character" do
    patch character_url(@character), params: { character: { adversity_tokens: @character.adversity_tokens, age: @character.age, campaign_id: @character.campaign_id, description: @character.description, fear: @character.fear, flaws: @character.flaws, is_player: @character.is_player, motivation: @character.motivation, name: @character.name, stat_brains: @character.stat_brains, stat_brawn: @character.stat_brawn, stat_charm: @character.stat_charm, stat_fight: @character.stat_fight, stat_flight: @character.stat_flight, stat_grit: @character.stat_grit } }, as: :json
    assert_response :success
  end

  test "should destroy character" do
    assert_difference("Character.count", -1) do
      delete character_url(@character), as: :json
    end

    assert_response :no_content
  end
end
