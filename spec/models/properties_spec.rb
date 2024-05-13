require 'rails_helper'

RSpec.describe Property, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_one_attached(:preview_image) }
  end

  describe 'validations' do
    it { should validate_inclusion_of(:sold).in_array([true, false]) }
    it { should validate_inclusion_of(:deleted).in_array([true, false]) }

    context 'when preview_image is attached' do
      let(:property) { build(:property) }
      let(:acceptable_image) { fixture_file_upload('lorem-picsum-3264.jpeg', 'image/jpeg') }
      let(:unacceptable_image) { fixture_file_upload('greenland.bmp', 'image/bmp') }
      let(:large_image) { fixture_file_upload('SampleJPGImage_10mb.jpeg', 'image/jpeg') }

      it 'validates that the image size is within the limit' do
        property.preview_image.attach(large_image)
        expect(property).not_to be_valid
        expect(property.errors[:preview_image]).to include('is too big')
      end

      it 'validates that the image content type is acceptable' do
        property.preview_image.attach(unacceptable_image)
        expect(property).not_to be_valid
        expect(property.errors[:preview_image]).to include('must be a JPEG or PNG')
      end

      it 'is valid with an acceptable image' do
        property.preview_image.attach(acceptable_image)
        expect(property).to be_valid
      end
    end
  end

  describe 'scopes' do
    let!(:active_property) { create(:property, deleted: false, sold: false) }
    let!(:deleted_property) { create(:property, deleted: true) }
    let!(:sold_property) { create(:property, sold: true) }
    let!(:nearby_property) { create(:property, location: 'POINT(-122.4194 37.7749)') }
    let!(:distant_property) { create(:property, location: 'POINT(-73.9857 40.7484)') }

    describe '.active' do
      it 'returns active properties' do
        expect(Property.active).to match_array([active_property, nearby_property, distant_property])
      end
    end

    describe '.active_listings' do
      it 'returns active properties ordered by creation date' do
        expect(Property.active_listings.to_a).to eq([active_property, nearby_property, distant_property])
      end
    end

    describe '.within' do
      it 'returns properties within the specified distance' do
        expect(Property.within(37.7749, -122.4194, 1)).to include(nearby_property)
        expect(Property.within(37.7749, -122.4194, 1)).not_to include(distant_property)
      end
    end
  end

  describe '#delete' do
    let(:property) { create(:property) }

    it 'soft deletes the property' do
      expect { property.delete }.to change { property.reload.deleted }.from(false).to(true)
    end
  end
end
