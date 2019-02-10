Rails.application.routes.draw do
  get 'chat/show'

  root 'comments#index'
  namespace :api, format: 'json' do
    namespace :v1 do
      resources :comments
    end
  end
end
