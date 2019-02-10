class Comment < ApplicationRecord
  after_create :broadcast

  def broadcast
    ActionCable.server.broadcast 'chat_channel', {id: id, author: author, text: text}
  end
end
