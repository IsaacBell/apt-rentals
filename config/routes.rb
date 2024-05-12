# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    # mount_devise_token_auth_for 'User', at: 'auth'
    resources :users

    resources :properties do
      collection do
        get 'search'
      end
    end

    get '/properties', to: 'properties#list_for_realtor'
    get '/realtor/stats', to: 'properties#realtor_stats'
    # get '/properties/search', to: 'properties#search'

    resources :users do
      resources :properties
    end
  end

  # devise_for :users

  # root 'home#index'
end

if Rails.env.production?
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username),
                                                ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_USERNAME'])) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password),
                                                  ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_PASSWORD']))
  end
end
