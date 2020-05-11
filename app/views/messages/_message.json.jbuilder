json.extract! message, :id, :body, :sender, :posted_at, :created_at_in_words, :posted_at
#json.posted_at I18n.l(message.posted_at, format: :short)
json.url message_url(message, format: :json)
