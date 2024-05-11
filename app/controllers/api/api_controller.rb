# frozen_string_literal: true

module Api
  class ApiController < ApplicationController
    # protect_from_forgery with: :exception

    private

    def convert_params_to_snake_case
      request.parameters.deep_transform_keys!(&:underscore)
    end
  end
end
