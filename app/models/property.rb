class Property < ApplicationRecord
  include Cachable
  include Serializable

  paginates_per 50

  has_one_attached :preview_image
  belongs_to :user

  validate :has_acceptable_image?

  scope :active, ->() {where(deleted: false, sold: false)}
  scope :active_listings, ->() {active.order(:created_at)}
  scope :within, -> (latitude, longitude, distance_in_mile = 50) do
    return where('1 = 1') if latitude.blank? || longitude.blank?

    distance_in_meter = distance_in_mile.to_f * 1609.34 # approx
    where(%{
      ST_Distance(location, 'POINT(%f %f)') < %f
    } % [longitude, latitude, distance_in_meter])
  end
  scope :with_filters, ->(filters) do
    out = active
    out = out.where('sold = ?', filters[:sold]) if filters[:sold]
    out = out.where('area >= ? AND area <= ?', filters[:area]) if filters[:area]
    out = out.where('rooms = ?', filters[:rooms]) if filters[:rooms]
    out = out.where('price >= ?', filters[:price]) if filters[:price] && filters[:price_gte]
    out = out.where('price <= ?', filters[:price]) if filters[:price] && filters[:price_gte]
    out
  end

  def delete
    update_column('deleted', true)
  end

  private

  def has_acceptable_image?
    return unless preview_image.attached?

    unless preview_image.blob.byte_size <= 5.megabyte
      errors.add(:preview_image, 'is too big')
    end

    acceptable_types = ['image/jpg', 'image/jpeg', 'image/png']
    unless acceptable_types.include?(preview_image.content_type)
      errors.add(:preview_image, 'must be a JPEG or PNG')
    end
  end
end
