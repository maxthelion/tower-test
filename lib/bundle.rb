require 'fileutils'
require 'yaml'

require 'rubygems'
require 'closure-compiler'
require 'sprockets'

class Bundle
  DIST_DIR = 'dist'
  SRC_DIR = 'public/javascripts'

  attr_reader :path

  def initialize
    @path = "#{SRC_DIR}/game_complete.js"
  end

  def bundle!
    FileUtils.mkdir_p(DIST_DIR)

    secretary = Sprockets::Secretary.new(
      :load_path => SRC_DIR,
      :source_files => path
    )
    concatenation = secretary.concatenation
    concatenation.save_to(bundle_path)
  end

  def bundle_path
    "#{DIST_DIR}/game-combined-#{version}.js"
  end

  def minify!
    file = File.open(bundle_path, 'r')
    minified = Closure::Compiler.new.compile(file)

    File.open(minify_path, 'w') do |f|
      f.write(extract_head(file))
      f.write(minified)
    end
  end

  def minify_path
    "#{DIST_DIR}/game-combined-#{version}.min.js"
  end

  def version
    '0' # @version ||= YAML.load_file("#{SRC_DIR}/constants.yml")['VERSION']
  end

  private
    def extract_head(file)
      head = ''
      file.rewind
      while (line = file.gets)
        if line =~ /^[\/\s]/
          head << line
        else
          break
        end
      end
      head
    end
end
