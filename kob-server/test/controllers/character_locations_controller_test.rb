require "test_helper"

class CharacterLocationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @character_location = character_locations(:one)
  end

  test "should get index" do
    get character_locations_url, as: :json
    assert_response :success
  end

  test "should create character_location" do
    assert_difference("CharacterLocation.count") do
      post character_locations_url, params: { character_location: { character_id: @character_location.character_id, description: @character_location.description, location_id: @character_location.location_id } }, as: :json
    end

    assert_response :created
  end

  test "should show character_location" do
    get character_location_url(@character_location), as: :json
    assert_response :success
  end

  test "should update character_location" do
    patch character_location_url(@character_location), params: { character_location: { character_id: @character_location.character_id, description: @character_location.description, location_id: @character_location.location_id } }, as: :json
    assert_response :success
  end

  test "should destroy character_location" do
    assert_difference("CharacterLocation.count", -1) do
      delete character_location_url(@character_location), as: :json
    end

    assert_response :no_content
  end
end
