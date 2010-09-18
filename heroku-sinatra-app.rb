# You'll need to require these if you
# want to develop while running with ruby.
# The config/rackup.ru requires these as well
# for it's own reasons.
#
# $ ruby heroku-sinatra-app.rb
#
require 'rubygems'
require 'sinatra'

configure :production do
  # Configure stuff here you'll want to
  # only be run at Heroku at boot

  # TIP:  You can get you database information
  #       from ENV['DATABASE_URI'] (see /env route below)
end

get '/' do
  return File.open("public/index.html")
end

post '/levels' do
  
end

post '/level/:id' do
  f = File.new("levels/level_"+ params[:id], 'w')
  f.puts(params[:code])
  f.close
  redirect '/customise.html'
end

get '/javascripts/levels2.js' do  
  levels = []
  d = Dir.new('levels')
  d.each do |f|
    unless ['.', '..'].include?(f)
      levels << File.open('levels/'+ f).read
    end
  end
  return 'var levels = ['+levels.join(",\n")+']'
end

# Test at <appname>.heroku.com

# You can see all your app specific information this way.
# IMPORTANT! This is a very bad thing to do for a production
# application with sensitive information

# get '/env' do
#   ENV.inspect
# end
