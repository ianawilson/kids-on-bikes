class CharacterLocationsController < ApplicationController
  before_action :set_character_location, only: %i[ show update destroy ]

  # GET /character_locations
  def index
    @character_locations = CharacterLocation.all

    render json: @character_locations
  end

  # GET /character_locations/1
  def show
    render json: @character_location
  end

  # POST /character_locations
  def create
    @character_location = CharacterLocation.new(character_location_params)

    if @character_location.save
      render json: @character_location, status: :created, location: @character_location
    else
      render json: @character_location.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /character_locations/1
  def update
    if @character_location.update(character_location_params)
      render json: @character_location
    else
      render json: @character_location.errors, status: :unprocessable_entity
    end
  end

  # DELETE /character_locations/1
  def destroy
    @character_location.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_character_location
      @character_location = CharacterLocation.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def character_location_params
      params.require(:character_location).permit(:character_id, :location_id, :description)
    end
end
