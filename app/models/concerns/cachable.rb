# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength

module Cachable
  extend ActiveSupport::Concern

  included do
    include Serializable

    cattr_accessor :cache_expiry do
      2.hours
    end

    def cache_key
      "#{self.class.to_s.demodulize.underscore}:#{id}"
    end

    def update(attrs)
      super(attrs)
      cache_if_id_present(self)
      true
    rescue ActiveRecord::NotNullViolation => e
      false
    end

    def delete
      update_column('deleted', true)
      succeeded = save
      clear_from_cache if succeeded
      succeeded
    end

    def cache_if_id_present(object)
      return unless object.id.present?

      Rails.cache.redis.set(object.cache_key, object.serialize)
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
    end

    alias_method :destroy, :delete

    private

    def clear_from_cache
      Rails.cache.redis.del(cache_key)
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
    end
  end

  class_methods do
    def set_cache_expiry(time)
      self.cache_expiry = time
    end

    def cache_key(id)
      "#{name.underscore}:#{id}"
    end

    def find(id)
      with_cache_retrieval(id) { super(id) }
    end

    def create(attrs)
      out = super(attrs)
      cache_if_id_present(out)
      out
    end

    def with_cache_retrieval(id)
      key = cache_key(id)
      cached = Rails.cache.redis.get(key&.to_s)
      return cached if cached.present?

      yield
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
      yield
    end

    def cache_if_id_present(object)
      return unless object.id.present?

      Rails.cache.redis.set(object.cache_key, object.serialize)
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
    end
  end
end

# rubocop:enable Metrics/BlockLength
