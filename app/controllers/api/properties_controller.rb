# frozen_string_literal: true

module Api
  class PropertiesController < ApplicationController
    def index
      render json: properties
    end

    def create
      property = Property.new(property_params)
      property.user_id = page_params[:user_id] || property_params[:user_id]
      if property.save
        render json: property
      else
        render json: { errors: property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      if property
        render json: property
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    def update
      if property
        if property.update(property_params)
          render json: property
        else
          render json: {
            error: 'Unable to update user data. Please check for data validity.'
          }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    def destroy
      if property
        if property.delete
          head :ok
        else
          render json: { error: 'Failed to delete property' }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    private

    def property
      @property ||= Property.find_by(id: params[:id])
    end

    def properties
      @properties ||= Property.active.within(
        page_params[:lat],
        page_params[:lng],
        page_params[:radius]
      ).with_filters(filters).page(page_params[:page] || 1).per(50)
    end

    def uid
      @uid ||= page_params[:user_id] || property_params[:user_id]
    end

    def page_params
      params.permit(:user_id, :page, :lat, :lng, :radius, :area, :rooms, :price, :sold)
    end

    def property_params
      @property_params ||= params.require(:property).permit(
        :user_id, :area, :description, :title, :preview_image, :rooms, :price, :sold, :location
      )
    end

    def filters
      {
        area: page_params[:area],
        rooms: page_params[:rooms],
        price: page_params[:price],
        price_gte: params[:price_gte],
        sold: page_params[:sold],
      }.compact
    end
  end
end
