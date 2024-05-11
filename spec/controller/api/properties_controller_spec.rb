require 'rails_helper'

RSpec.describe Api::PropertiesController, type: :controller do
  describe 'GET #index' do
    let!(:properties) { create_list(:property, 3, deleted: false, sold: false) }
    let!(:sold_property) { create(:property, sold: true) }
    let!(:deleted_property) { create(:property, deleted: true) }

    it 'returns a success response' do
      get :index
      expect(response).to be_successful
    end

    it 'returns only active properties' do
      get :index
      expect(JSON.parse(response.body).size).to eq(3)
    end

    it 'returns properties within the specified distance' do
      nearby_property = create(:property, location: 'POINT(-122.4194 37.7749)')
      distant_property = create(:property, location: 'POINT(-73.9857 40.7484)')

      get :index, params: { lat: 37.7749, lng: -122.4194, distance: 1 }
      expect(JSON.parse(response.body)).to include(nearby_property.as_json(root: false))
      expect(JSON.parse(response.body)).not_to include(distant_property)
    end

    it 'applies filters to the properties' do
      filtered_property = create(:property, rooms: 3, price: 1000)
      unfiltered_property = create(:property, rooms: 2, price: 2000)

      get :index, params: { rooms: 3, price: 1000 }
      expect(JSON.parse(response.body)).to include(filtered_property.as_json(root: false))
      expect(JSON.parse(response.body)).not_to include(unfiltered_property.as_json(root: false))
    end
  end

  describe 'POST #create' do
    let(:realtor) { create(:user, :realtor) }
    let(:valid_attributes) { attributes_for(:property, user_id: realtor.id) }
    let(:invalid_attributes) { attributes_for(:property, title: nil) }

    context 'with valid attributes' do
      it 'creates a new property' do
        expect {
          post :create, params: { property: valid_attributes }
        }.to change(Property, :count).by(1)
      end

      it 'returns the created property' do
        post :create, params: { property: valid_attributes }
        expect(JSON.parse(response.body)).to eq(Property.last.as_json(root: false))
      end
    end

    context 'with invalid attributes' do
      it 'does not create a new property' do
        expect {
          post :create, params: { property: invalid_attributes }
        }.not_to change(Property, :count)
      end

      it 'returns an unprocessable entity status' do
        post :create, params: { property: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns the error messages' do
        post :create, params: { property: invalid_attributes }
        expect(JSON.parse(response.body)['errors']).to be_present
      end
    end
  end

  describe 'GET #show' do
    let!(:property) { create(:property) }

    context 'with a valid property id' do
      it 'returns the requested property' do
        get :show, params: { id: property.id }
        expect(JSON.parse(response.body)).to eq(property.as_json(root: false))
      end
    end

    context 'with an invalid property id' do
      it 'returns a not found status' do
        get :show, params: { id: 'invalid_id' }
        expect(response).to have_http_status(:not_found)
      end

      it 'returns an error message' do
        get :show, params: { id: 'invalid_id' }
        expect(JSON.parse(response.body)['error']).to eq('Property not found')
      end
    end
  end

  describe 'PUT #update' do
    let!(:property) { create(:property) }
    let(:valid_attributes) { attributes_for(:property, title: 'Updated Property') }
    let(:invalid_attributes) { attributes_for(:property, title: 1234, sold: nil, deleted: 'maybe') }

    context 'with a valid property id' do
      context 'with valid attributes' do
        it 'updates the requested property' do
          put :update, params: { id: property.id, property: valid_attributes }
          property.reload
          expect(property.title).to eq('Updated Property')
        end

        it 'returns the updated property' do
          put :update, params: { id: property.id, property: valid_attributes }
          expect(JSON.parse(response.body)).to eq(property.reload.as_json)
        end
      end

      context 'with invalid attributes' do
        it 'does not update the requested property' do
          put :update, params: { id: property.id, property: invalid_attributes }
          property.reload
          expect(property.title).not_to be_nil
        end

        it 'returns an unprocessable entity status' do
          put :update, params: { id: property.id, property: invalid_attributes }
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it 'returns the error messages' do
          put :update, params: { id: property.id, property: invalid_attributes }
          expect(JSON.parse(response.body)['error']).to be_present
        end
      end
    end

    context 'with an invalid property id' do
      it 'returns a not found status' do
        put :update, params: { id: 'invalid_id', property: valid_attributes }
        expect(response).to have_http_status(:not_found)
      end

      it 'returns an error message' do
        put :update, params: { id: 'invalid_id', property: valid_attributes }
        expect(JSON.parse(response.body)['error']).to eq('Property not found')
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:property) { create(:property) }

    context 'with a valid property id' do
      it 'soft deletes the requested property' do
        expect {
          delete :destroy, params: { id: property.id }
        }.to change { property.reload.deleted }.from(false).to(true)
      end

      it 'returns a success status' do
        delete :destroy, params: { id: property.id }
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with an invalid property id' do
      it 'returns a not found status' do
        delete :destroy, params: { id: 'invalid_id' }
        expect(response).to have_http_status(:not_found)
      end

      it 'returns an error message' do
        delete :destroy, params: { id: 'invalid_id' }
        expect(JSON.parse(response.body)['error']).to eq('Property not found')
      end
    end
  end
end
