# frozen_string_literal: true
# Parse source metadata with the same YAML rules as the working catalog.
require 'json'
require 'yaml'
require 'date'
require_relative '../lib/profile_relationships'
root, pack_id = ARGV
load_yaml = ->(text) { YAML.safe_load(text, permitted_classes: [Date], aliases: true) }
packs = load_yaml.call(File.read(File.join(root, 'docs/_data/standard_packs.yml')))
pack = packs.find { |p| p['id'] == pack_id } or abort "Unknown pack #{pack_id}"
standards = Dir[File.join(root, 'docs/_standards/*.md')].map do |path|
  text = File.read(path)
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n/m) or abort "Missing metadata: #{path}"
  data = load_yaml.call(match[1])
  data.merge('source_path' => path.delete_prefix(root + '/'), 'url' => "/standards/#{File.basename(path, '.md')}/")
end
ids = standards.map { |s| s.fetch('standard_id') }
abort 'Duplicate standard ID' unless ids.uniq == ids
puts JSON.generate({ 'pack' => pack, 'standards' => standards, 'profiles' => ProfileRelationships.resolve(standards) })
