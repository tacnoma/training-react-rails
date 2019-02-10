class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'chat_channel'
    ActionCable.server.broadcast 'chat_channel', text: 'connected.'#
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    if data['text']
      ActionCable.server.broadcast 'chat_channel', text: data['text'], author: data['author']
    elsif data['ongoing']
      ActionCable.server.broadcast 'chat_channel', ongoing: true, author: data['author']
    elsif data['done']
      ActionCable.server.broadcast 'chat_channel', done: true, author: data['author']
    end
  end
end
