class Property < ApplicationRecord
  include Cachable
  include Serializable

  paginates_per 50

  has_one_attached :preview_image
  belongs_to :user

  validate :has_image?

  scope :active, ->() {where(deleted: false, sold: false)}
  scope :active_listings, ->() {active.order(:created_at)}
  scope :within, -> (latitude, longitude, distance_in_mile = 50) {
    where(%{
     ST_Distance(location, 'POINT(%f %f)') < %d
    } % [longitude, latitude, distance_in_mile * 1609.34]) # approx
  }

  def delete
    update_column('deleted', true)
  end

  private

  def has_image?
    return unless preview_image.attached?

    unless preview_image.blob.byte_size <= 1.megabyte
      errors.add(:preview_image, 'is too big')
    end
  
    acceptable_types = ['image/jpg', 'image/jpeg', 'image/png']
    unless acceptable_types.include?(preview_image.content_type)
      errors.add(:preview_image, 'must be a JPEG or PNG')
    end
  end
end
