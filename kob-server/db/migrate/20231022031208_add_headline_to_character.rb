class AddHeadlineToCharacter < ActiveRecord::Migration[7.1]
  def change
    add_column :characters, :headline, :string
  end
end
