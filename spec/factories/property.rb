FactoryBot.define do
  factory :property do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    area { Faker::Number.between(from: 500, to: 5000) }
    rooms { Faker::Number.between(from: 1, to: 10) }
    price { Faker::Number.between(from: 100000, to: 1000000) }
    sold { false }
    deleted { false }
    location { "POINT(#{Faker::Address.longitude} #{Faker::Address.latitude})" }
    association :user

    trait :sold do
      sold { true }
    end

    trait :deleted do
      deleted { true }
    end

    trait :with_image do
      after(:build) do |property|
        file_path = Rails.root.join('spec', 'fixtures', 'images', 'lorem-picsum-3264.jpeg')
        property.preview_image.attach(io: File.open(file_path), filename: 'lorem-picsum-3264.jpeg', content_type: 'image/jpeg')
      end
    end

    factory :sold_property, traits: [:sold]
    factory :deleted_property, traits: [:deleted]
    factory :property_with_image, traits: [:with_image]
  end
end