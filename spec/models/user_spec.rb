require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_many(:properties) }
  end

  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
    it { should validate_inclusion_of(:user_type).in_array(User.all_user_types) }

    context 'when user is not a realtor' do
      let(:user) { build(:user) }

      it 'validates that the user has no properties' do
        user.properties << build(:property)
        expect(user).not_to be_valid
        expect(user.errors).not_to be_empty
      end
    end
  end

  describe 'scopes' do
    let!(:active_user) { create(:user, deleted: false) }
    let!(:deleted_user) { create(:user, deleted: true) }

    describe '.active' do
      it 'returns active users' do
        expect(User.active).to eq([active_user])
      end
    end

    describe '.deleted' do
      it 'returns deleted users' do
        expect(User.deleted).to eq([deleted_user])
      end
    end

    User.all_user_types.each do |user_type|
      describe ".#{user_type.pluralize}" do
        it "returns users with type #{user_type}" do
          user = create(:user, user_type: user_type)
          expect(User.send(user_type.pluralize)).to include(user)
        end
      end

      describe ".active_#{user_type.pluralize}" do
        it "returns active users with type #{user_type}" do
          user = create(:user, user_type: user_type, deleted: false)
          expect(User.send("active_#{user_type.pluralize}")).to include(user)
        end
      end

      describe ".deleted_#{user_type.pluralize}" do
        it "returns deleted users with type #{user_type}" do
          user = create(:user, user_type: user_type, deleted: true)
          expect(User.send("deleted_#{user_type.pluralize}")).to include(user)
        end
      end
    end
  end

  describe '.find' do
    let!(:active_user) { create(:user) }
    let!(:deleted_user) { create(:user, deleted: true) }

    it 'returns the active user with the given ID' do
      expect(User.find(active_user.id)).to eq(active_user)
    end

    it 'does not return deleted users' do
      expect(User.find(deleted_user.id)).to be_nil
    end
  end

  describe '.find_by_email' do
    let!(:user) { create(:user) }
    let!(:deleted_user) { create(:user, deleted: true) }

    it 'returns the active user with the given email' do
      expect(User.find_by_email(user.email)).to eq(user)
    end

    it 'does not return deleted users' do
      expect(User.find_by_email(deleted_user.email)).to be_nil
    end
  end

  describe '#can_manage_property?' do
    let(:user) { create(:user) }
    let(:property) { create(:property) }

    it 'returns true if the property belongs to the user' do
      user.properties << property
      expect(user.can_manage_property?(property)).to be true
    end

    it 'returns false if the property does not belong to the user' do
      expect(user.can_manage_property?(property)).to be false
    end
  end

  describe '#has_properties?' do
    let(:user) { create(:user) }

    it 'returns true if the user has properties' do
      user.properties << create(:property)
      expect(user.has_properties?).to be true
    end

    it 'returns false if the user has no properties' do
      expect(user.has_properties?).to be false
    end
  end

  User.all_user_types.each do |user_type|
    describe "##{user_type}?" do
      it "returns true if the user type is #{user_type}" do
        user = build(:user, user_type: user_type)
        expect(user.send("#{user_type}?")).to be true
      end

      it "returns false if the user type is not #{user_type}" do
        user = build(:user, user_type: 'other')
        expect(user.send("#{user_type}?")).to be false
      end
    end
  end
end