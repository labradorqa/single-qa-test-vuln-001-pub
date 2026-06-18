# rubyapp/app.rb — Sinatra 진입점. params(원격 소스)를 취약 sink로 연결 → CodeQL taint flow 발동.
require 'sinatra'
require 'nokogiri' # nokogiri 1.10.4

SECRET_KEY = 'super-secret-rails-key'.freeze # CWE-798

# CWE-95: eval 인젝션
get '/eval' do
  eval(params[:expr])
end

# CWE-78: command injection
get '/backup' do
  system("tar czf /tmp/#{params[:name]}.tgz /data")
end

# CWE-502: 신뢰 불가 데이터 Marshal.load
post '/load' do
  Marshal.load(request.body.read)
end

# CWE-611: Nokogiri NOENT → XXE
post '/xml' do
  Nokogiri::XML(request.body.read) { |c| c.noblanks.noent.dtdload }.to_s
end
