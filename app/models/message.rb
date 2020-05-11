class Message < ApplicationRecord
  include ActionView::Helpers::DateHelper

  validates :body, :sender, :posted_at, presence: true

  default_scope { order("posted_at DESC") }

  def created_at_in_words
    time_ago_in_words(posted_at)
  end
end
