// versions.json is ordered newest first. Only a recorded ratified pack that has
// reading pages can become the default; a draft snapshot must not be promoted.
export function selectDefaultVersion(versions, packs) {
  const ratified = new Set(
    packs.filter((p) => p.status === "Ratified").map((p) => p.id.replace(/^OSERA-SP-/, "")),
  );
  return versions.find((version) => ratified.has(version)) || "current";
}
