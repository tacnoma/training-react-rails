class Api::V1::CommentsController < ApplicationController
  def index
    @data = Comment.order(id: :desc).all
  end

  def create
    @comment = Comment.create(comment_params)
    ActionCable.server.broadcast 'chat_channel', comment_params
    render :show, status: :created
  end

  private

  def comment_params
    params.permit(:author, :text)
  end
end
