import React from "react";

export default function StatusLabel({ status }) {
  const icon =
    status === "Recorded ratified" ? "✓" : /draft/i.test(status) ? "✎" : null;
  return (
    <>
      {icon && (
        <>
          <span aria-hidden="true">{icon}</span>{" "}
        </>
      )}
      {status}
    </>
  );
}
