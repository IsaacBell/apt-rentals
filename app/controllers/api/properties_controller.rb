# frozen_string_literal: true

module Api
  class PropertiesController < ApiController
    before_action :transform_params

    # def list_for_realtor
    #   render json: properties
    # end

    def realtor_stats
      render json: user.realtor_stats
    end

    def index
      render json: user ? user.properties : properties
    end

    def create
      property = Property.new(property_params.except(:coordinates, :phone_number, :images, :user))
      if coordinates.present? && coordinates.reject(&:zero?).any?
        property.location = "POINT(#{coordinates[0]} #{coordinates[1]})"
      elsif property_params[:location].present?
        result = Geocoder.search(property_params[:location]).first
        property.location = "POINT(#{result.longitude} #{result.latitude})" if result.present?
      end

      if page_params[:images].present?
        last_image = page_params[:images].last

        # Determine the file extension and content type
        file_extension = File.extname(last_image[:img]).downcase

        # Attach the last image to the preview_image attribute
        property.preview_image.attach(
          io: StringIO.new(last_image[:img].split(',').last),
          filename: "preview#{file_extension}",
          content_type: content_type(file_extension)
        )
      end

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
      if property
        render json: property
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    def update
      if property
        if property.update(property_params.except(:coordinates, :phone_number, :images))
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
      if property
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
        :deleted, :created_at, :updated_at, :phone_number, :user,
        coordinates: [], images: %i[id img]
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

    def filters
      {
        user_id: user_id,
        area: page_params[:area],
        rooms: page_params[:rooms],
        price: page_params[:price],
        price_gte: params[:price_gte],
        sold: page_params[:sold]
      }.compact
    end
  end
end
