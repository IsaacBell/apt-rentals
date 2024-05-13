FactoryBot.define do
  sequence(:user_factory_email) { |n| "person#{n}@example.com" }

  factory :user do
    sequence(:email) { generate(:user_factory_email) }
    # password { 'password' }
    # password_confirmation { 'password' }
    user_type { User::USER_TYPES[:user] }
    deleted { false }

    trait :realtor do
      user_type { User::USER_TYPES[:realtor] }
    end

    trait :admin do
      user_type { User::USER_TYPES[:admin] }
    end

    trait :user do
      user_type { User::USER_TYPES[:user] }
    end

    trait :deleted do
      deleted { true }
    end

    trait :with_agency do
      association :agency
    end

    trait :with_properties do
      transient do
        properties_count { 3 }
      end

      after(:create) do |user, evaluator|
        create_list(:property, evaluator.properties_count, user: user)
      end
    end

    factory :realtor, traits: [:realtor]
    factory :admin, traits: [:admin]
    factory :standard_user, traits: [:user]
    factory :deleted_user, traits: [:deleted]
    factory :user_with_agency, traits: [:with_agency]
    factory :user_with_properties, traits: [:with_properties]

    factory :realtor_with_properties, traits: [:realtor, :with_properties]
    factory :admin_with_properties, traits: [:admin, :with_properties]
    factory :deleted_realtor, traits: [:realtor, :deleted]
    factory :deleted_admin, traits: [:admin, :deleted]
    factory :deleted_standard_user, traits: [:user, :deleted]
  end
end