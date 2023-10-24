class AddCampaignToLocation < ActiveRecord::Migration[7.1]
  def change
    add_reference :locations, :campaign, null: false, foreign_key: true
  end
end
