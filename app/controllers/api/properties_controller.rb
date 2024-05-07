# frozen_string_literal: true

class PropertiesController < ApplicationController
  def index
    render json: properties
  end

  def post
    p = Property.new(property_params)
    if p.save
      render json: p.serialize
    else
      render head: :bad_request
    end
  end

  def get
    if property
      render json: property.serialize
    else
      render head: :not_found
    end
  end

  def put
    if property.update(property_params)
      render json: property.serialize
    else
      render head: :bad_request
    end
  end

  def delete
    if property.delete
      render head: :ok
    else
      render head: :not_found
    end
  end

  private

  def property
    id = params[:id] || params[:property]&.send(:[], :id)
    @property ||= Property.find_by(id: id)&.serialize
  end

  def properties
    @properties ||= Property.active.within(
      page_params[:lat],
      page_params[:lng],
      page_params[:radius]
    ).where(filters:).page(page_params[:page] || 1).per(50)
  end

  def page_params
    params.permit(:page, :lat, :lng, :radius, :area, :rooms, :price, :sold)
  end

  def property_params
    @property_params ||= params.require(:property).permit(
      :area, :description, :title, :preview_image, :rooms, :price, :sold, :location
    )
  end

  def filters
    {
      area: page_params[:area],
      rooms: page_params[:rooms],
      price: page_params[:price],
      sold: page_params[:sold],
    }.compact
  end
end