class LocationsController < ApplicationController
  before_action :set_campaign
  before_action :set_location, only: %i[ show update destroy ]

  # GET /locations
  def index
    render json: @campaign.locations.all, include: { :character_locations => { :include => :character } }
  end

  # GET /locations/1
  def show
    render json: @location, include: { :character_locations => { :include => :character } }
  end

  # POST /locations
  def create
    @location = @campaign.locations.build(location_params)

    if @location.save
      render json: @location, status: :created, location: campaign_location_url(@campaign, @location)
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /locations/1
  def update
    if @location.update(location_params)
      render json: @location
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end

  # DELETE /locations/1
  def destroy
    @location.destroy!
  end

  private
    def set_campaign
      @campaign = Campaign.find(params[:campaign_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_location
      @location = Location.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def location_params
      params.require(:location).permit(:name, :description)
    end
end
