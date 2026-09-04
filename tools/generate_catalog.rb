#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "fileutils"
require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)
DOCS = File.join(ROOT, "docs")
STANDARDS_DIR = File.join(DOCS, "_standards")
PACKS_FILE = File.join(DOCS, "_data", "standard_packs.yml")
CONFIG_FILE = File.join(DOCS, "_config.yml")
CATALOG_DIR = File.join(DOCS, "catalog")
PACK_CATALOG_DIR = File.join(CATALOG_DIR, "packs")
STANDARD_CATALOG_DIR = File.join(CATALOG_DIR, "standards")

STANDARD_SCHEMA_VERSION = "0.1.0"
PACK_SCHEMA_VERSION = "0.1.0"

def front_matter(path)
  text = File.read(path)
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  raise "Missing YAML front matter: #{path}" unless match

  [YAML.safe_load(match[1], permitted_classes: [Date], aliases: true), text[match[0].length..]]
end

def yaml_dump(value)
  anchor_free = JSON.parse(JSON.generate(value))
  YAML.dump(anchor_free).sub(/\A---\n/, "")
end

def normalize(value)
  case value
  when Date
    value.iso8601
  when Array
    value.map { |item| normalize(item) }
  when Hash
    value.each_with_object({}) { |(key, item), out| out[key] = normalize(item) }
  else
    value
  end
end

def error!(messages, message)
  messages << message
end

def validate_standard!(messages, standard, valid_statuses, valid_types)
  id = standard["standard_id"]
  required = %w[
    schema-version sequence standard_id title summary doc-status standard-version
    candidate-pack ratified-in ratified-date fitness-role type category applies-to requirements
  ]
  required.each { |key| error!(messages, "#{id || standard["source_path"]}: missing #{key}") unless standard.key?(key) }

  error!(messages, "#{id}: schema-version must be #{STANDARD_SCHEMA_VERSION}") unless standard["schema-version"] == STANDARD_SCHEMA_VERSION
  error!(messages, "#{id}: invalid standard_id") unless id&.match?(/\A[A-Z]+-\d{3}(?:-[A-Z][A-Z0-9]*)?\z/)
  error!(messages, "#{id}: invalid standard-version") unless standard["standard-version"].to_s.match?(/\A\d+\.\d+\.\d+\z/)
  error!(messages, "#{id}: unknown doc-status #{standard["doc-status"]}") unless valid_statuses.include?(standard["doc-status"])
  error!(messages, "#{id}: unknown type #{standard["type"]}") unless valid_types.include?(standard["type"])
  error!(messages, "#{id}: category must not be empty") if standard["category"].to_s.strip.empty?
  error!(messages, "#{id}: applies-to must not be empty") unless standard["applies-to"].is_a?(Array) && standard["applies-to"].any?

  requirements = standard["requirements"]
  error!(messages, "#{id}: requirements must not be empty") unless requirements.is_a?(Array) && requirements.any?
  return unless requirements.is_a?(Array)

  requirements.each do |requirement|
    req_id = requirement["id"]
    error!(messages, "#{id}: requirement id #{req_id.inspect} must start with #{id}.REQ-") unless req_id.to_s.match?(/\A#{Regexp.escape(id)}\.REQ-\d{3}\z/)
    error!(messages, "#{req_id}: invalid level") unless %w[MUST SHOULD MAY].include?(requirement["level"])
    error!(messages, "#{req_id}: missing text") if requirement["text"].to_s.strip.empty?
    error!(messages, "#{req_id}: invalid checkability") unless %w[automated partially-automated manual].include?(requirement["checkability"])
    checks = requirement["checks"]
    error!(messages, "#{req_id}: checks must be an array") unless checks.is_a?(Array)
    next unless checks.is_a?(Array)

    checks.each do |check|
      check_id = check["id"]
      error!(messages, "#{req_id}: check id #{check_id.inspect} must start with #{id}.CHECK-") unless check_id.to_s.match?(/\A#{Regexp.escape(id)}\.CHECK-\d{3}\z/)
      error!(messages, "#{check_id}: missing title") if check["title"].to_s.strip.empty?
      error!(messages, "#{check_id}: invalid severity") unless %w[blocking advisory observe].include?(check["severity"])
      error!(messages, "#{check_id}: evidence must not be empty") unless check["evidence"].is_a?(Array) && check["evidence"].any?
    end
  end
end

def validate_pack!(messages, pack, standards_by_id, all_checks)
  id = pack["id"]
  error!(messages, "#{id}: schema-version must be #{PACK_SCHEMA_VERSION}") unless pack["schema-version"] == PACK_SCHEMA_VERSION
  error!(messages, "#{id}: pack id must use OSERA-SP-x.y.z") unless id.to_s.match?(/\AOSERA-SP-\d+\.\d+\.\d+\z/)

  %w[included_standards advisory_standards observe_standards deferred_standards].each do |section|
    next unless pack[section]

    pack[section].each do |entry|
      standard = standards_by_id[entry["id"]]
      error!(messages, "#{id}: #{section} references unknown standard #{entry["id"]}") unless standard
      if standard && standard["standard-version"].to_s != entry["version"].to_s
        error!(messages, "#{id}: #{entry["id"]} version #{entry["version"]} does not match standard #{standard["standard-version"]}")
      end
      Array(entry["checks"]).each do |check_id|
        error!(messages, "#{id}: #{entry["id"]} references unknown check #{check_id}") unless all_checks.include?(check_id)
      end
    end
  end
end

config = YAML.safe_load(File.read(CONFIG_FILE), permitted_classes: [Date], aliases: true)
valid_statuses = Array(config["document_status"]).map { |item| item["name"] }
valid_types = config.fetch("standard_classification").keys
messages = []

standards = Dir[File.join(STANDARDS_DIR, "*.md")].map do |path|
  data, = front_matter(path)
  id = data["standard_id"]
  data = normalize(data)
  data["source_path"] = path.delete_prefix("#{ROOT}/")
  data["url"] = "/standards/#{File.basename(path, ".md")}/"
  validate_standard!(messages, data, valid_statuses, valid_types)
  data
end.sort_by { |standard| standard["sequence"] }

standards_by_id = standards.to_h { |standard| [standard["standard_id"], standard] }
all_checks = standards.flat_map do |standard|
  Array(standard["requirements"]).flat_map do |requirement|
    Array(requirement["checks"]).map { |check| check["id"] }
  end
end

duplicate_standards = standards.group_by { |standard| standard["standard_id"] }.select { |_id, values| values.length > 1 }
duplicate_standards.each_key { |id| error!(messages, "duplicate standard_id #{id}") }

duplicate_checks = all_checks.group_by(&:itself).select { |_id, values| values.length > 1 }
duplicate_checks.each_key { |id| error!(messages, "duplicate check id #{id}") }

packs = normalize(YAML.safe_load(File.read(PACKS_FILE), permitted_classes: [Date], aliases: true))
packs.each { |pack| validate_pack!(messages, pack, standards_by_id, all_checks) }

abort(messages.join("\n")) if messages.any?

catalog = {
  "schema-version" => STANDARD_SCHEMA_VERSION,
  "source" => "docs/_standards",
  "standards" => standards
}

pack_catalogs = packs.to_h do |pack|
  pack_id = pack["id"]
  [
    pack_id,
    {
      "schema-version" => PACK_SCHEMA_VERSION,
      "pack" => pack,
      "standards" => %w[included_standards advisory_standards observe_standards deferred_standards].each_with_object({}) do |section, out|
        out[section] = Array(pack[section]).map do |entry|
          standard = standards_by_id.fetch(entry["id"])
          {
            "id" => entry["id"],
            "version" => entry["version"],
            "role" => entry["role"],
            "rationale" => entry["rationale"],
            "url" => standard["url"],
            "checks" => entry["checks"] || Array(standard["requirements"]).flat_map { |req| Array(req["checks"]).map { |check| check["id"] } }
          }
        end
      end
    }
  ]
end

outputs = {
  File.join(CATALOG_DIR, "osera-standards.yaml") => yaml_dump(catalog),
  File.join(CATALOG_DIR, "osera-standards.json") => JSON.pretty_generate(catalog) + "\n"
}

standards.each do |standard|
  value = {
    "schema-version" => STANDARD_SCHEMA_VERSION,
    "standard" => standard
  }
  id = standard.fetch("standard_id")
  outputs[File.join(STANDARD_CATALOG_DIR, "#{id}.yaml")] = yaml_dump(value)
  outputs[File.join(STANDARD_CATALOG_DIR, "#{id}.json")] = JSON.pretty_generate(value) + "\n"
end

pack_catalogs.each do |pack_id, value|
  outputs[File.join(PACK_CATALOG_DIR, "#{pack_id}.yaml")] = yaml_dump(value)
  outputs[File.join(PACK_CATALOG_DIR, "#{pack_id}.json")] = JSON.pretty_generate(value) + "\n"
end

if ARGV.include?("--check")
  missing = outputs.keys.reject { |path| File.exist?(path) }
  changed = outputs.select { |path, content| File.exist?(path) && File.read(path) != content }.keys
  if missing.any? || changed.any?
    warn "Generated catalog artifacts are stale."
    warn "Missing:\n#{missing.join("\n")}" if missing.any?
    warn "Changed:\n#{changed.join("\n")}" if changed.any?
    exit 1
  end
  puts "Catalog artifacts are current."
else
  FileUtils.mkdir_p(CATALOG_DIR)
  FileUtils.mkdir_p(STANDARD_CATALOG_DIR)
  FileUtils.mkdir_p(PACK_CATALOG_DIR)
  outputs.each { |path, content| File.write(path, content) }
  puts "Generated #{outputs.length} catalog artifacts."
end
