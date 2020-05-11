class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.text :body
      t.string :sender
      t.datetime :posted_at
      t.timestamps
    end
  end
end
