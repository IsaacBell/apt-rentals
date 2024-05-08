# frozen_string_literal: true

module Api
  class UsersController < ApiController
    include JsonRenderable

    before_action :set_user, only: %i[show edit update destroy]
    render_json_for index: 'users', show: 'user', edit: 'user'

    def index; end
    def edit; end
    def show; end

    def create
      if (u = User.create(user_params))
        render json: u.serialize
      else
        head :unprocessable_entity
      end
    end

    def update
      if user&.update_attributes(user_params)
        render json: user.serialize
      else
        head :conflict
      end
    end

    def destroy
      if user&.delete
        head :ok
      else
        head :bad_request
      end
    end

    private

    def user
      id = params[:id] || user_params[:id]
      @user ||= User.find_by_id(id)&.serialize
    end

    def users
      @users ||= User.all.page(params.permit(:page)[:page] || 1).per(50)
    end

    def user_params
      params
        .require(:user)
        .permit(
          :id, :email, :password, :password_conf, :phone, :newsletter_opt_in
        )
    end
  end
end
