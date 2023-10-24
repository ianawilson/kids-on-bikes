class CharactersController < ApplicationController
  before_action :set_campaign
  before_action :set_character, only: %i[ show update destroy ]

  # GET /characters
  def index
    @characters = @campaign.characters.all

    render json: @characters
  end

  # GET /characters/1
  def show
    render json: @character
  end

  # POST /characters
  def create
    @character = @campaign.characters.build(character_params)

    if @character.save
      render json: @character, status: :created, location: campaign_character_url(@campaign, @character)
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /characters/1
  def update
    if @character.update(character_params)
      render json: @character
    else
      render json: @character.errors, status: :unprocessable_entity
    end
  end

  # DELETE /characters/1
  def destroy
    @character.destroy!
  end

  private
    def set_campaign
      @campaign = Campaign.find(params[:campaign_id])
    end
    # Use callbacks to share common setup or constraints between actions.
    def set_character
      @character = @campaign.characters.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def character_params
      params.require(:character).permit(:name, :is_player, :headline, :age, :fear, :motivation, :flaws, :description, :stat_fight, :stat_brains, :stat_charm, :stat_flight, :stat_brawn, :stat_grit, :adversity_tokens)
    end
end
