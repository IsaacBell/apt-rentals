# frozen_string_literal: true

class User < ApplicationRecord
  include Cachable
  include Serializable
  
  USER_TYPES = {realtor: 'realtor', admin: 'admin', user: 'user'}.freeze

  def self.all_user_types
    USER_TYPES.map { |key, val| val }
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
  validates :user_type, inclusion: { in: self.all_user_types }
  validate :ensure_non_realtor_user_has_no_properties

  self.all_user_types.each do |user_type|
    user_type = user_type.to_s.demodulize.parameterize
    scope :"#{user_type.pluralize}", -> { where(user_type:) }
    scope :"active_#{user_type.pluralize}", -> { active.where(user_type:) }
    scope :"deleted_#{user_type.pluralize}", -> { deleted.where(user_type:) }

    define_method("#{user_type}?") do
      self.user_type == user_type
    end
  end

  def self.find(id)
    active.where(id:).first
  end

  def self.find_by_email(email)
    active.where(email:).first
  end

  def can_manage_property?(property)
    property.in?(properties)
  end

  def has_properties?
    properties.any?
  end

  private

  def ensure_non_realtor_user_has_no_properties
    errors.add('Standard users cannot update property data') if !realtor? && has_properties?
  end
end
