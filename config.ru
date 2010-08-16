use Rack::Static, :urls => ["/stylesheets", "/images", "/javascripts", "/audio", "/"], :root => "public"

run lambda{|e| [200, {'Content-Type' => 'text/html'}, 'hello']}