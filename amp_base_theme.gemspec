# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "amp_base_theme"
  spec.version       = "0.0.14"
  spec.authors       = ["Lukas Himsel"]
  spec.email         = ["lukas@himsel.me"]

  spec.summary       = "A starter pack for AMP-based (amp.dev) Jekyll sites"
  spec.homepage      = "https://github.com/lukas-h/amp_base_theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^((?!Gemfile|_test_config|.gitignore|amp_base_theme|run_test.sh|test).*)}i)
  end

  spec.add_runtime_dependency "jekyll", "~> 4.1"
  spec.add_runtime_dependency "jekyll-data", "~> 1.1"
  spec.add_development_dependency "bundler"

end
