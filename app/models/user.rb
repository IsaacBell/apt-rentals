# frozen_string_literal: true

class User < ApplicationRecord
  include Cachable
  include Serializable

  USER_TYPES = { realtor: 'realtor', admin: 'admin', user: 'user' }.freeze

  def self.all_user_types
    USER_TYPES.map { |_key, val| val }
  end

  paginates_per 50

  set_cache_expiry 6.hours

  # devise :database_authenticatable, :registerable,
  #        :recoverable, :rememberable, :trackable, :validatable

  belongs_to :agency, optional: true
  has_many :properties

  scope :active, -> { where(deleted: false) }
  scope :deleted, -> { where(deleted: true) }

  validates :email, presence: true, uniqueness: true
  validates :user_type, inclusion: { in: all_user_types }
  validate :ensure_non_realtor_user_has_no_properties

  all_user_types.each do |user_type|
    user_type = user_type.to_s.demodulize.parameterize
    scope :"#{user_type.pluralize}", -> { where(user_type: user_type) }
    scope :"active_#{user_type.pluralize}", -> { active.where(user_type: user_type) }
    scope :"deleted_#{user_type.pluralize}", -> { deleted.where(user_type: user_type) }

    define_method("#{user_type}?") { self.user_type == user_type }
  end

  def self.find(id)
    active.where(id: id).first
  end

  def self.find_by_email(email)
    active.where(email: email).first
  end

  def self.insert_from_firebase(user_params)
    attrs = user_params.except(
      :aud, :role, :email_confirmed_at, :phone, :identities,
      :is_anonymous, :app_metadata, :user_metadata, :user_id
    )
    attrs[:phone_number] = user_params[:phone]
    # attrs[:first_name] = user_params[:first_name]
    # attrs[:last_name] = user_params[:last_name]

    create(attrs)
  end

  def can_manage_property?(property)
    property.in?(properties)
  end

  def has_properties?
    properties.any?
  end

  def realtor_stats
    stats = properties.active.select("
      COUNT(*) AS total_properties,
      AVG(price) AS average_price,
      SUM(price) AS total_price
    ").take

    {
      total_properties: stats.total_properties,
      average_price: stats.average_price,
      total_price: stats.total_price
    }
  end

  private

  def ensure_non_realtor_user_has_no_properties
    errors.add('Standard users cannot update property data') if !realtor? && has_properties?
  end
end
