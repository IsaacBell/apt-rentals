# frozen_string_literal: true

module Api
  class PropertiesController < ApiController
    before_action :transform_params

    def realtor_stats
      render json: user.realtor_stats
    end

    def search
      render json: search_properties
    end

    def index
      render json: user ? user.properties : properties
    end

    def create
      property = Property.new(property_params.except(:coordinates, :phone_number, :images, :user, :uploaded_images))
      if coordinates.present? && coordinates.reject(&:zero?).any?
        property.location = "POINT(#{coordinates[0]} #{coordinates[1]})"
      elsif property_params[:location].present?
        result = Geocoder.search(property_params[:location]).first
        property.location = "POINT(#{result.longitude} #{result.latitude})" if result.present?
      end

      property.preview_images = property_params[:uploaded_images]

      property.user = if u = User.find_by_id(user_id)
                        u
                      else
                        # Assume we missed a sync with Firebase
                        User.insert_from_firebase(user_params)
                      end

      property.user_id = property.user.id
      if property.save
        render json: property
      else
        render json: { errors: property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      if property && !property.deleted
        render json: property
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    def update
      if property
        location = property.location
        if address.present? && address != property.address
          result = Geocoder.search(address).first
          location = "POINT(#{result.longitude} #{result.latitude})" if result.present?
        end

        if property.update(
          property_params.except(:coordinates, :phone_number, :images).merge({ location: location })
        )
          render json: property
        else
          render json: {
            error: 'Unable to update property data. Please check for data validity.'
          }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    def destroy
      if property.present? && property.user_id == user_id
        if property.destroy
          head :ok
        else
          render json: { error: 'Failed to delete property' }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    private

    def transform_params
      params.deep_transform_keys!(&:underscore)
    end

    def property
      @property ||= Property.find_by(id: params[:id])
    end

    def properties
      distance = 50
      distance = page_params[:distance].split(' ')[0].to_i if page_params[:distance].present?

      @properties ||= Property.with_attached_preview_image.active.within(
        page_params[:lat],
        page_params[:lng],
        distance
      ).with_filters(filters).page(page_params[:page] || 1).per(50)
    end

    def search_properties
      return @search_properties if @search_properties

      properties = Property.active
      if search_params[:location].present?
        result = Geocoder.search(search_params[:location]).first
        properties = if result.present?
                       properties.within(result.latitude, result.longitude, distance + 50)
                     else
                       properties.none
                     end
      end

      properties = properties.with_filters(search_filters.except(:user_id))

      @search_properties = properties.page(search_params[:page] || 1).per(50)
    end

    def search_params
      params.permit(:page, :lat, :lng, :distance, :area, :rooms, :price, :sold, :location, :property)
    end

    def search_filters
      price_range = search_params[:price].split('-') if search_params[:price].present?
      {
        area: search_params[:area]&.to_i,
        rooms: search_params[:rooms]&.to_i,
        price_gte: price_range&.first&.to_i,
        price_lte: price_range&.last&.to_i,
        sold: search_params[:sold],
        location: search_params[:location]
      }.compact
    end

    def content_type(file_extension)
      case file_extension
      when '.jpg', '.jpeg'
        'image/jpeg'
      when '.png'
        'image/png'
      else
        'application/octet-stream'
      end
    end

    def page_params
      params.permit(:page, :user_id, :lat, :lng, :distance, :area, :rooms, :price_gte, :price_lte, :sold,
                    :images, :format, :user, coordinates: [], property: {})
    end

    def property_params
      params.require(:property).permit(
        :user_id, :area, :description, :title, :preview_image, :rooms, :price, :sold, :location,
        :deleted, :created_at, :updated_at, :phone_number, :user, :address,
        coordinates: [], uploaded_images: [], images: %i[id img]
      )
    end

    def user
      @user ||= User.find_by_id(user_id)
    end

    def user_id
      @user_id ||= params.permit(:user_id)[:user_id] || property_params[:user_id] || page_params[:user_id]
    end

    def user_params
      params.require(:user).permit!
    end

    def coordinates
      @coordinates ||= property_params[:coordinates] || page_params[:coordinates]
    end

    def address
      @address ||= property_params[:address] || page_params[:address]
    end

    def distance
      return 50 unless search_params[:distance].present?

      search_params[:distance].split(' ')[0].to_i
    end

    def price_lte
      return @price_lte if @price_lte

      tmp = search_params[:price]&.split('-')
      @price_lte = tmp[0].to_i if tmp
    end

    def price_gte
      return @price_gte if @price_gte

      tmp = search_params[:price]&.split('-')
      @price_gte = tmp[1].to_i if tmp
    end

    def filters
      {
        user_id: user_id,
        area: page_params[:area],
        rooms: page_params[:rooms],
        price_lte: page_params[:price_lte],
        price_gte: params[:price_gte],
        sold: page_params[:sold]
      }.compact
    end
  end
end
