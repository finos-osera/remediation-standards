# frozen_string_literal: true

# Resolve requirements and checks independently by numeric suffix. Generated
# relationships describe the effective parent, including inherited ancestors.
module ProfileRelationships
  def self.items(standard, kind)
    requirements = Array(standard['requirements'])
    kind == 'requirements' ? requirements : requirements.flat_map { |req| Array(req['checks']) }
  end

  def self.resolve(standards)
    by_id = standards.to_h { |standard| [standard.fetch('standard_id'), standard] }
    resolved = {}
    visiting = []
    visit = lambda do |id|
      return resolved[id] if resolved.key?(id)
      raise "Profile inheritance cycle: #{(visiting + [id]).join(' -> ')}" if visiting.include?(id)
      standard = by_id[id]
      raise "Unknown parent standard #{id}" unless standard

      visiting << id
      parent_id = standard['extends']
      parent = parent_id ? visit.call(parent_id) : nil
      result = { 'relationships' => {}, 'effective' => {} }
      %w[requirements checks].each do |kind|
        local = {}
        items(standard, kind).each do |item|
          number = item.fetch('id').split('-').last
          raise "#{id}: duplicate #{kind} number #{number}" if local.key?(number)
          local[number] = item
        end
        inherited = parent ? parent['effective'][kind] : {}
        rows = []
        effective = {}
        (inherited.keys | local.keys).sort.each do |number|
          base = inherited[number]
          own = local[number]
          explanation = own && own['override-explanation']
          if base && own
            unless explanation.is_a?(String) && !explanation.strip.empty?
              raise "#{own['id']}: override-explanation is required for overriding #{base['id']}"
            end
          elsif own && own.key?('override-explanation')
            raise "#{own['id']}: override-explanation is only valid for a parent override"
          end
          selected = own || base
          effective[number] = selected
          next unless parent

          rows << {
            'parent_item' => base && base['id'],
            'treatment' => base ? (own ? 'Overrides' : 'Inherited') : 'Added',
            'effective_item' => selected['id'],
            'explanation' => if base && own
                               explanation
                             elsif base
                               'Applies unchanged from the parent.'
                             else
                               kind == 'requirements' ? own['text'] : own['title']
                             end
          }
        end
        result['relationships'][kind] = rows
        result['effective'][kind] = effective
      end
      visiting.pop
      resolved[id] = result
    end
    standards.each { |standard| visit.call(standard.fetch('standard_id')) }
    resolved
  end
end
