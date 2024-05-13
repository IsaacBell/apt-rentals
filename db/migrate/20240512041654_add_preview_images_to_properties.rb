# frozen_string_literal: true

class AddPreviewImagesToProperties < ActiveRecord::Migration[7.0]
  def change
    add_column :properties, :preview_images, :string, array: true, default: []
  end
end
