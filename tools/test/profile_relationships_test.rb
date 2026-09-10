# frozen_string_literal: true
require 'minitest/autorun'
require_relative '../lib/profile_relationships'

class ProfileRelationshipsTest < Minitest::Test
  def requirement(id, number, explanation = nil, check_number = number)
    req = { 'id' => "#{id}.REQ-#{number}", 'text' => 'An obligation', 'checks' => [] }
    req['override-explanation'] = explanation if explanation
    if check_number
      check = { 'id' => "#{id}.CHECK-#{check_number}", 'title' => 'Evidence check' }
      check['override-explanation'] = explanation if explanation
      req['checks'] << check
    end
    req
  end

  def fixture
    parent = { 'standard_id' => 'REL-003', 'requirements' => [requirement('REL-003', '001'), requirement('REL-003', '002')] }
    child = { 'standard_id' => 'REL-003-JAVA', 'extends' => 'REL-003', 'requirements' => [requirement('REL-003-JAVA', '001', 'Java-specific evidence; same outcome'), requirement('REL-003-JAVA', '003')] }
    [parent, child]
  end

  def test_inherited_overridden_and_added_items
    result = ProfileRelationships.resolve(fixture)['REL-003-JAVA']
    %w[requirements checks].each do |kind|
      rows = result['relationships'][kind]
      assert_equal %w[Overrides Inherited Added], rows.map { |row| row['treatment'] }
      assert_equal 'Java-specific evidence; same outcome', rows[0]['explanation']
      assert_match(/REL-003\./, rows[1]['effective_item'])
      assert_nil rows[2]['parent_item']
      assert_equal 3, result['effective'][kind].size
    end
  end

  def test_missing_and_blank_override_explanations_are_rejected
    [nil, '', '   ', 123].each do |value|
      data = fixture
      data.last['requirements'].first['override-explanation'] = value
      error = assert_raises(RuntimeError) { ProfileRelationships.resolve(data) }
      assert_match(/override-explanation is required/, error.message)
    end
  end

  def test_check_override_requires_its_own_explanation
    data = fixture
    data.last['requirements'].first['checks'].first.delete('override-explanation')
    error = assert_raises(RuntimeError) { ProfileRelationships.resolve(data) }
    assert_match(/CHECK-001: override-explanation is required/, error.message)
  end

  def test_explanations_are_not_allowed_on_base_or_added_items
    [0, 1].each do |index|
      data = fixture
      data[index]['requirements'].last['override-explanation'] = 'Not an override'
      assert_raises(RuntimeError) { ProfileRelationships.resolve(data) }
    end
  end

  def test_overriding_a_requirement_does_not_drop_its_parent_checks
    data = fixture
    data.last['requirements'].first['checks'] = []
    result = ProfileRelationships.resolve(data)['REL-003-JAVA']
    assert_equal 'Inherited', result['relationships']['checks'].first['treatment']
    assert_equal 'REL-003.CHECK-001', result['effective']['checks']['001']['id']
  end

  def test_transitive_inheritance_and_override
    data = fixture
    data << { 'standard_id' => 'REL-003-JVM', 'extends' => 'REL-003-JAVA', 'requirements' => [requirement('REL-003-JVM', '002', 'JVM specialization')] }
    rows = ProfileRelationships.resolve(data.reverse)['REL-003-JVM']['relationships']['requirements']
    assert_equal %w[Inherited Overrides Inherited], rows.map { |row| row['treatment'] }
    assert_equal 'REL-003-JAVA.REQ-001', rows[0]['effective_item']
    assert_equal 'REL-003.REQ-002', rows[1]['parent_item']
  end

  def test_unknown_parent_cycles_and_duplicate_numbers_are_rejected
    data = fixture
    data.last['extends'] = 'MISSING'
    assert_raises(RuntimeError) { ProfileRelationships.resolve(data) }
    data = fixture
    data.first['extends'] = 'REL-003-JAVA'
    assert_raises(RuntimeError) { ProfileRelationships.resolve(data) }
    data = fixture
    data.last['requirements'] << data.last['requirements'].first
    assert_raises(RuntimeError) { ProfileRelationships.resolve(data) }
  end
end
