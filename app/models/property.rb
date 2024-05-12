class Property < ApplicationRecord
  include Cachable
  include Serializable

  paginates_per 50

  belongs_to :user
  has_one_attached :preview_image, dependent: :destroy

  validates :title, presence: true
  validate :has_acceptable_image?

  scope :active, -> { where(deleted: false, sold: false) }
  scope :active_listings, -> { active.order(:created_at) }
  scope :within, lambda { |latitude, longitude, distance_in_mile = 50|
    return where('1 = 1') if latitude.blank? || longitude.blank?

    distance_in_meter = distance_in_mile.to_f * 1609.34 # approx
    where(format(%{
      ST_Distance(location, 'POINT(%f %f)') < %f
    }, longitude, latitude, distance_in_meter))
  }
  scope :with_filters, lambda { |filters|
    out = active
    out = out.where('user_id = ?', filters[:user_id]) if filters[:user_id]
    out = out.where('sold = ?', filters[:sold]) if filters[:sold]
    # out = out.where('area >= ? AND area <= ?', filters[:area]) if filters[:area]
    out = out.where('rooms = ?', filters[:rooms]) if filters[:rooms]
    out = out.where('price >= ?', filters[:price_gte]) if filters[:price_gte] && filters[:price_gte]
    out = out.where('price <= ?', filters[:price_lte]) if filters[:price_lte] && filters[:price_lte]
    out
  }

  def delete
    update_column('deleted', true)
  end

  private

  def has_acceptable_image?
    return unless preview_image.attached?

    errors.add(:preview_image, 'is too big') unless preview_image.blob.byte_size <= 5.megabyte

    acceptable_types = ['image/jpg', 'image/jpeg', 'image/png']
    return if acceptable_types.include?(preview_image.content_type)

    errors.add(:preview_image, 'must be a JPEG or PNG')
  end
end
